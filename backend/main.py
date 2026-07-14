import datetime
import os
from typing import Any, Dict, List, Optional

import jwt
from jwt import PyJWTError
import requests
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, text

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL', '').rstrip('/')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_SERVICE_KEY')
POSTGRES_CONNECTION = os.getenv('POSTGRES_CONNECTION', '').strip()
JWT_SECRET = os.getenv('JWT_SECRET', 'my-pg-secret').strip()
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256').strip()
JWT_EXPIRE_HOURS = int(os.getenv('JWT_EXPIRE_HOURS', '8').strip() or 8)
SUPABASE_JWT_KEY_OWNER = os.getenv('SUPABASE_JWT_KEY_OWNER')
SUPABASE_JWT_KEY_TAENANT = os.getenv('SUPABASE_JWT_KEY_TAENANT')

API_KEY_ROLE_MAP: Dict[str, str] = {}
if SUPABASE_JWT_KEY_OWNER:
    API_KEY_ROLE_MAP[SUPABASE_JWT_KEY_OWNER] = 'owner'
if SUPABASE_JWT_KEY_TAENANT:
    API_KEY_ROLE_MAP[SUPABASE_JWT_KEY_TAENANT] = 'tenant'

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY or not POSTGRES_CONNECTION:
    raise RuntimeError('SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and POSTGRES_CONNECTION must be configured in .env')

if not JWT_SECRET:
    raise RuntimeError('JWT_SECRET must be configured in .env')

engine = create_engine(POSTGRES_CONNECTION, future=True, pool_pre_ping=True)
session = requests.Session()
app = FastAPI(title='MY-PG Python Backend')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


def supabase_headers(use_service_key: bool = True, token: Optional[str] = None) -> Dict[str, str]:
    key = SUPABASE_SERVICE_ROLE_KEY if use_service_key else (SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY)
    headers = {
        'apikey': key,
        'Authorization': f'Bearer {token or key}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    return headers


def build_url(path: str) -> str:
    return f'{SUPABASE_URL}{path}'


def supabase_request(
    method: str,
    path: str,
    use_service_key: bool = True,
    token: Optional[str] = None,
    params: Optional[Dict[str, Any]] = None,
    json_body: Any = None,
    extra_headers: Optional[Dict[str, str]] = None
) -> Any:
    url = build_url(path)
    headers = supabase_headers(use_service_key=use_service_key, token=token)
    if extra_headers:
        headers.update(extra_headers)

    response = session.request(method, url, headers=headers, params=params or {}, json=json_body, timeout=20)
    if response.status_code >= 400:
        detail = response.text
        if response.headers.get('content-type', '').startswith('application/json'):
            try:
                detail_json = response.json()
                detail = detail_json.get('error') or detail_json.get('message') or detail
            except Exception:
                pass
        raise HTTPException(status_code=401 if response.status_code in (401, 403) else 500, detail=f'Supabase error: {detail}')

    if response.status_code == 204:
        return {}

    return response.json()


def parse_filter_value(value: str) -> tuple[str, Any]:
    if value.startswith('eq.'):
        return '=', value[3:]
    if value.startswith('neq.'):
        return '!=', value[4:]
    if value.startswith('gte.'):
        return '>=', value[4:]
    if value.startswith('lte.'):
        return '<=', value[4:]
    if value.startswith('gt.'):
        return '>', value[3:]
    if value.startswith('lt.'):
        return '<', value[3:]
    return '=', value


def build_where_clause(filters: Optional[Dict[str, str]], params: Dict[str, Any]) -> str:
    if not filters:
        return ''
    clauses: List[str] = []
    for field, raw_value in filters.items():
        op, value = parse_filter_value(raw_value)
        key = field.replace('.', '_')
        clauses.append(f"{field} {op} :{key}")
        params[key] = value
    return ' WHERE ' + ' AND '.join(clauses)


def execute_query(sql: Any, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    with engine.connect() as conn:
        result = conn.execute(sql, params or {})
        if result.returns_rows:
            return [dict(row._mapping) for row in result.fetchall()]
        return []


def query_table(
    table: str,
    select: str = '*',
    filters: Optional[Dict[str, str]] = None,
    order: Optional[str] = None,
    limit: Optional[int] = None
) -> List[Dict[str, Any]]:
    params: Dict[str, Any] = {}
    where_clause = build_where_clause(filters, params)
    order_clause = ''
    if order:
        if '.' in order:
            field, direction = order.split('.', 1)
        else:
            field, direction = order, 'asc'
        direction = 'DESC' if direction.lower() == 'desc' else 'ASC'
        order_clause = f' ORDER BY {field} {direction}'
    limit_clause = f' LIMIT {limit}' if limit is not None else ''
    sql = text(f"SELECT {select} FROM {table}{where_clause}{order_clause}{limit_clause}")
    return execute_query(sql, params)


def count_table(table: str, filters: Optional[Dict[str, str]] = None) -> int:
    params: Dict[str, Any] = {}
    where_clause = build_where_clause(filters, params)
    sql = text(f"SELECT COUNT(*) AS count FROM {table}{where_clause}")
    rows = execute_query(sql, params)
    return int(rows[0]['count']) if rows else 0


def insert_table(table: str, payload: List[Dict[str, Any]], select: str = '*') -> List[Dict[str, Any]]:
    if not payload:
        return []
    columns = list(payload[0].keys())
    column_list = ', '.join(columns)

    values_sql = []
    params: Dict[str, Any] = {}
    for idx, row in enumerate(payload):
        placeholders = []
        for col in columns:
            param_name = f"{col}_{idx}"
            placeholders.append(f":{param_name}")
            params[param_name] = row.get(col)
        values_sql.append(f"({', '.join(placeholders)})")

    sql = text(f"INSERT INTO {table} ({column_list}) VALUES {', '.join(values_sql)} RETURNING {select}")
    with engine.begin() as conn:
        result = conn.execute(sql, params)
        return [dict(row._mapping) for row in result.fetchall()]


def create_jwt_token(user_profile: Dict[str, Any]) -> str:
    now = datetime.datetime.now(datetime.timezone.utc)
    payload = {
        'sub': str(user_profile.get('id') or user_profile.get('email') or ''),
        'email': user_profile.get('email'),
        'role': user_profile.get('role'),
        'portal': user_profile.get('portal'),
        'name': user_profile.get('fullName'),
        'iat': int(now.timestamp()),
        'exp': int((now + datetime.timedelta(hours=JWT_EXPIRE_HOURS)).timestamp())
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_jwt_token(token: str) -> Dict[str, Any]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except PyJWTError as exc:
        raise HTTPException(status_code=401, detail='Invalid authorization token.') from exc


def get_auth_user(token: str) -> Dict[str, Any]:
    if not token:
        raise HTTPException(status_code=401, detail='Authorization token is required.')

    try:
        payload = decode_jwt_token(token)
        email = payload.get('email')
        if not email:
            raise HTTPException(status_code=401, detail='Invalid authorization token.')
        # If the JWT contains role/portal information, prefer it and avoid DB lookups.
        role_from_token = payload.get('role')
        portal_from_token = payload.get('portal')
        if role_from_token or portal_from_token:
            resolved_role = normalize_role(role_from_token or '')
            resolved_portal = (portal_from_token or get_portal_for_role(resolved_role)).strip().lower()
            return {
                'id': None,
                'fullName': payload.get('fullName') or email,
                'email': email,
                'role': resolved_role,
                'portal': resolved_portal,
                'phone': payload.get('phone') or '',
                'status': 'ACTIVE'
            }
        auth_user = {'email': email, 'user_metadata': {'role': payload.get('role')}}
        return get_user_profile(auth_user)
    except HTTPException:
        try:
            auth_user = supabase_request('GET', '/auth/v1/user', token=token, use_service_key=True)
            return get_user_profile(auth_user)
        except HTTPException as exc:
            raise HTTPException(status_code=401, detail='Invalid authorization token.') from exc


def require_api_key(x_api_key: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not x_api_key or x_api_key not in API_KEY_ROLE_MAP:
        raise HTTPException(status_code=401, detail='Invalid API key.')
    return {'apiKey': x_api_key, 'role': API_KEY_ROLE_MAP[x_api_key]}


def require_role(allowed_roles: List[str]):
    def dependency(api_data: Dict[str, Any] = Depends(require_api_key)) -> Dict[str, Any]:
        if api_data['role'] not in allowed_roles:
            raise HTTPException(status_code=403, detail='Forbidden for this role.')
        return api_data
    return dependency


def normalize_role(role: str = '') -> str:
    value = (role or '').strip().lower()
    if 'tenant' in value:
        return 'tenant'
    if 'super' in value:
        return 'super admin'
    if 'branch' in value:
        return 'branch manager'
    if 'reception' in value:
        return 'receptionist'
    if 'account' in value:
        return 'accountant'
    if 'warden' in value:
        return 'warden'
    if 'maintenance' in value:
        return 'maintenance staff'
    if 'housekeeping' in value:
        return 'housekeeping staff'
    if 'security' in value:
        return 'security guard'
    if 'cook' in value or 'kitchen' in value or 'inventory' in value:
        return 'cook / kitchen staff / inventory manager'
    if 'owner' in value:
        return 'owner'
    return 'tenant'


PORTAL_ROLE_MAP = {
    'owner': 'owner',
    'super admin': 'admin',
    'branch manager': 'manager',
    'receptionist': 'reception',
    'accountant': 'accountant',
    'warden': 'warden',
    'maintenance staff': 'maintenance',
    'housekeeping staff': 'housekeeping',
    'security guard': 'security',
    'cook / kitchen staff / inventory manager': 'kitchen'
}

PORTAL_TO_ROLE_MAP = {portal: role for role, portal in PORTAL_ROLE_MAP.items()}
PORTAL_TO_ROLE_MAP['tenant'] = 'tenant'

VALID_PORTALS = sorted(set(list(PORTAL_ROLE_MAP.values()) + ['tenant']))
VALID_ROLES = sorted(set(list(PORTAL_ROLE_MAP.keys()) + ['tenant']))


def get_portal_for_role(role: str) -> str:
    normalized = normalize_role(role)
    return PORTAL_ROLE_MAP.get(normalized, 'tenant')


def get_role_for_portal(portal: Optional[str]) -> str:
    if not portal:
        return 'tenant'
    return PORTAL_TO_ROLE_MAP.get(portal.strip().lower(), 'tenant')


def get_role_name(role_id: Optional[int]) -> Optional[str]:
    if role_id is None:
        return None
    data = query_table('roles', select='role_name', filters={'role_id': f'eq.{role_id}'})
    return data[0]['role_name'] if data else None


def get_branch_name(branch_id: Optional[int]) -> Optional[str]:
    if branch_id is None:
        return None
    data = query_table('branches', select='branch_name', filters={'branch_id': f'eq.{branch_id}'})
    return data[0]['branch_name'] if data else None


def get_staff_profile_by_email(email: str) -> Optional[Dict[str, Any]]:
    sql = text(
        'SELECT s.staff_id, s.employee_code, s.first_name, s.last_name, s.email, s.phone, '
        's.role_id, s.branch_id, s.status, s.profile_photo, r.role_name '
        'FROM staff s '
        'LEFT JOIN roles r ON s.role_id = r.role_id '
        'WHERE s.email = :email '
        'LIMIT 1'
    )
    rows = execute_query(sql, {'email': email})
    if not rows:
        return None

    data = rows[0]
    role = data.get('role_name') or get_role_name(data.get('role_id')) or 'Tenant'
    branch_name = get_branch_name(data.get('branch_id'))
    return {
        'id': data['staff_id'],
        'employeeCode': data.get('employee_code'),
        'fullName': ' '.join([part for part in [data.get('first_name'), data.get('last_name')] if part]).strip() or email,
        'email': data.get('email') or email,
        'role': normalize_role(role),
        'portal': get_portal_for_role(role),
        'phone': data.get('phone') or '',
        'branchId': data.get('branch_id'),
        'branchName': branch_name,
        'profilePhoto': data.get('profile_photo') or '',
        'status': data.get('status') or 'ACTIVE'
    }


def get_staff_profile_by_credentials(email: str, password: str) -> Optional[Dict[str, Any]]:
    # Skip database password check since passwords are stored in Supabase
    # Just check if staff exists with this email
    rows = query_table(
        'staff',
        select='staff_id,email',
        filters={
            'email': f'eq.{email}'
        },
        limit=1
    )
    if not rows:
        return None
    return get_staff_profile_by_email(email)


def authenticate_db_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    profile = get_staff_profile_by_credentials(email, password)
    if profile:
        return profile

    # Skip database password check for tenants as well - passwords are in Supabase
    rows = query_table(
        'tenants',
        select='tenant_id,tenant_code,first_name,last_name,email,phone,status',
        filters={
            'email': f'eq.{email}'
        },
        limit=1
    )
    if not rows:
        return None

    data = rows[0]
    return {
        'id': data['tenant_id'],
        'tenantCode': data.get('tenant_code'),
        'fullName': ' '.join([part for part in [data.get('first_name'), data.get('last_name')] if part]).strip() or email,
        'email': data.get('email') or email,
        'role': 'tenant',
        'portal': 'tenant',
        'phone': data.get('phone') or '',
        'status': data.get('status') or 'ACTIVE'
    }


def get_tenant_profile_by_email(email: str) -> Optional[Dict[str, Any]]:
    rows = query_table('tenants', select='tenant_id,tenant_code,first_name,last_name,email,phone,status', filters={'email': f'eq.{email}'})
    if not rows:
        return None
    data = rows[0]
    return {
        'id': data['tenant_id'],
        'tenantCode': data.get('tenant_code'),
        'fullName': ' '.join([part for part in [data.get('first_name'), data.get('last_name')] if part]).strip() or email,
        'email': data.get('email') or email,
        'role': 'tenant',
        'portal': 'tenant',
        'phone': data.get('phone') or '',
        'status': data.get('status') or 'ACTIVE'
    }


def get_user_profile(auth_user: Dict[str, Any]) -> Dict[str, Any]:
    if not auth_user.get('email'):
        raise HTTPException(status_code=400, detail='Authenticated user has no email.')

    staff_profile = get_staff_profile_by_email(auth_user['email'])
    if staff_profile:
        return staff_profile

    tenant_profile = get_tenant_profile_by_email(auth_user['email'])
    if tenant_profile:
        return tenant_profile

    metadata = auth_user.get('user_metadata') or {}
    role = normalize_role(metadata.get('role', 'tenant'))
    return {
        'id': auth_user.get('id'),
        'fullName': metadata.get('full_name') or auth_user.get('email'),
        'email': auth_user.get('email'),
        'role': role,
        'portal': get_portal_for_role(role),
        'phone': metadata.get('phone') or ''
    }


def normalize_tenant_row(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'id': item.get('tenant_id'),
        'tenantCode': item.get('tenant_code'),
        'fullName': ' '.join([part for part in [item.get('first_name'), item.get('last_name')] if part]).strip() or None,
        'email': item.get('email'),
        'phone': item.get('phone'),
        'status': item.get('status') or 'ACTIVE',
        'room': item.get('room_number') or item.get('room'),
        'gender': item.get('gender'),
        'joiningDate': item.get('joining_date'),
        'expectedCheckout': item.get('expected_checkout')
    }


def normalize_room_row(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'id': item.get('room_id'),
        'branchId': item.get('branch_id'),
        'number': item.get('room_number'),
        'name': f"Room {item.get('room_number')}" if item.get('room_number') else None,
        'type': item.get('room_type') or item.get('room_category'),
        'category': item.get('room_category'),
        'status': item.get('status'),
        'rent': item.get('rent'),
        'bedCount': item.get('bed_count'),
        'facilities': item.get('facilities'),
        'createdAt': item.get('created_at'),
        'updatedAt': item.get('updated_at')
    }


def normalize_complaint_row(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'id': item.get('complaint_id'),
        'tenantId': item.get('tenant_id'),
        'staffId': item.get('staff_id'),
        'title': item.get('title') or item.get('subject'),
        'description': item.get('description'),
        'priority': item.get('priority') or 'Medium',
        'status': item.get('status') or 'Open',
        'reportedBy': item.get('reported_by') or item.get('reportedBy') or 'Unknown',
        'createdAt': item.get('created_at'),
        'resolvedAt': item.get('resolved_at')
    }


def normalize_payment_row(item: Dict[str, Any]) -> Dict[str, Any]:
    tenant_label = item.get('tenant_name') or item.get('tenant')
    if not tenant_label and item.get('tenant_id') is not None:
        tenant_label = f'Tenant {item.get("tenant_id")}'
    return {
        'id': item.get('payment_id'),
        'tenantId': item.get('tenant_id'),
        'allocationId': item.get('allocation_id'),
        'amount': item.get('amount') or 0,
        'paymentDate': item.get('payment_date') or item.get('due_date'),
        'dueDate': item.get('due_date') or item.get('payment_date'),
        'status': item.get('status') or 'Pending',
        'paymentMethod': item.get('payment_method'),
        'tenant': tenant_label
    }


def normalize_branch_row(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'id': item.get('branch_id'),
        'name': item.get('branch_name'),
        'code': item.get('branch_code'),
        'address': item.get('address'),
        'city': item.get('city'),
        'state': item.get('state'),
        'pincode': item.get('pincode'),
        'contactNumber': item.get('contact_number'),
        'managerId': item.get('manager_id'),
        'status': item.get('status') or 'ACTIVE',
        'createdAt': item.get('created_at')
    }


def normalize_staff_row(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'id': item.get('staff_id'),
        'employeeCode': item.get('employee_code'),
        'firstName': item.get('first_name'),
        'lastName': item.get('last_name'),
        'fullName': ' '.join([part for part in [item.get('first_name'), item.get('last_name')] if part]).strip() or None,
        'email': item.get('email'),
        'phone': item.get('phone'),
        'roleId': item.get('role_id'),
        'branchId': item.get('branch_id'),
        'status': item.get('status') or 'ACTIVE',
        'profilePhoto': item.get('profile_photo'),
        'joinedDate': item.get('joined_date'),
        'createdAt': item.get('created_at')
    }


def normalize_allocation_row(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'id': item.get('allocation_id'),
        'tenantId': item.get('tenant_id'),
        'roomId': item.get('room_id'),
        'bedId': item.get('bed_id'),
        'allocationStart': item.get('allocation_start'),
        'allocationEnd': item.get('allocation_end'),
        'allocationStatus': item.get('allocation_status'),
        'rent': item.get('rent'),
        'deposit': item.get('deposit'),
        'dueDate': item.get('due_date'),
        'createdAt': item.get('created_at')
    }


def normalize_visitor_row(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'id': item.get('visitor_id'),
        'tenantId': item.get('tenant_id'),
        'name': item.get('visitor_name') or item.get('name'),
        'checkIn': item.get('check_in'),
        'checkOut': item.get('check_out'),
        'hostName': item.get('host_name'),
        'relationship': item.get('relationship'),
        'purpose': item.get('purpose'),
        'status': item.get('status'),
        'createdAt': item.get('created_at')
    }


def normalize_expense_row(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'id': item.get('expense_id'),
        'branchId': item.get('branch_id'),
        'amount': item.get('amount') or 0,
        'category': item.get('category'),
        'description': item.get('description'),
        'expenseDate': item.get('expense_date'),
        'status': item.get('status') or 'Pending',
        'createdAt': item.get('created_at')
    }


def normalize_maintenance_request_row(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'id': item.get('request_id'),
        'tenantId': item.get('tenant_id'),
        'staffId': item.get('staff_id'),
        'title': item.get('title'),
        'description': item.get('description'),
        'status': item.get('status'),
        'priority': item.get('priority'),
        'requestedBy': item.get('requested_by'),
        'assignedTo': item.get('assigned_to'),
        'createdAt': item.get('created_at'),
        'resolvedAt': item.get('resolved_at')
    }


def normalize_role_row(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'id': item.get('role_id'),
        'name': item.get('role_name'),
        'description': item.get('description'),
        'permissions': item.get('permissions'),
        'status': item.get('status') or 'ACTIVE',
        'createdAt': item.get('created_at')
    }


def normalize_bed_row(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'id': item.get('bed_id'),
        'roomId': item.get('room_id'),
        'bedNumber': item.get('bed_number'),
        'status': item.get('status'),
        'rent': item.get('rent'),
        'features': item.get('features'),
        'createdAt': item.get('created_at')
    }


class LoginPayload(BaseModel):
    email: EmailStr
    password: str
    portal: Optional[str] = None
    role: Optional[str] = None
    apiKey: Optional[str] = None
    testMode: Optional[bool] = False


class TenantPayload(BaseModel):
    tenantCode: str
    firstName: str
    lastName: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    phone: str
    email: EmailStr
    aadhaar: Optional[str] = None
    occupation: Optional[str] = None
    companyCollege: Optional[str] = None
    joiningDate: Optional[str] = None
    expectedCheckout: Optional[str] = None
    status: Optional[str] = 'ACTIVE'


class ComplaintPayload(BaseModel):
    tenantId: Optional[int] = None
    staffId: Optional[int] = None
    title: str
    description: str
    priority: Optional[str] = 'Medium'
    reportedBy: Optional[str] = 'System'
    status: Optional[str] = 'Open'


class LoginLogPayload(BaseModel):
    email: EmailStr
    timestamp: Optional[str] = None
    ipAddress: Optional[str] = None
    deviceInfo: Optional[str] = None
    userAgent: Optional[str] = None
    loginStatus: Optional[str] = 'SUCCESS'


def require_auth(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.lower().startswith('bearer '):
        raise HTTPException(status_code=401, detail='Authorization token is required.')
    token = authorization.split(' ', 1)[1].strip()
    return get_auth_user(token)


@app.get('/')
async def root():
    return {'success': True, 'message': 'MY-PG Python backend is running'}


@app.post('/api/auth/login')
async def auth_login(payload: LoginPayload):
    if not SUPABASE_ANON_KEY:
        raise HTTPException(status_code=500, detail='SUPABASE_ANON_KEY is required for login.')

    profile: Optional[Dict[str, Any]] = None
    requested_role = normalize_role(payload.role) if payload.role else ''
    requested_portal = (payload.portal or '').strip().lower()
    if payload.apiKey:
        requested_portal = API_KEY_ROLE_MAP.get(payload.apiKey, requested_portal)

    if requested_role:
        if requested_role not in VALID_ROLES:
            raise HTTPException(
                status_code=400,
                detail=f'Invalid role requested. Valid roles are: {", ".join(VALID_ROLES)}'
            )
        if requested_portal and requested_portal != get_portal_for_role(requested_role):
            raise HTTPException(
                status_code=400,
                detail=f'Portal {requested_portal!r} does not match requested role {requested_role!r}. Use portal {get_portal_for_role(requested_role)}.'
            )
        requested_portal = get_portal_for_role(requested_role)

    # Support testMode: allow bypassing Supabase auth for local tests
    if getattr(payload, 'testMode', False):
        # synthesize a minimal supabase-like user object
        response = {}
        access_token = None
        refresh_token = None
        user = {
            'email': payload.email,
            'user_metadata': {'role': payload.role or payload.portal or 'tenant', 'fullName': payload.email}
        }
    else:
        # Always authenticate through Supabase (passwords are stored there)
        try:
            response = supabase_request(
                'POST',
                '/auth/v1/token?grant_type=password',
                use_service_key=False,
                json_body={'email': payload.email, 'password': payload.password}
            )
        except HTTPException as exc:
            raise HTTPException(status_code=401, detail='Invalid login credentials.') from exc

        access_token = response.get('access_token')
        refresh_token = response.get('refresh_token')
        user = response.get('user')
        profile = None

    # In testMode, build a minimal profile from the Supabase user payload and avoid DB lookups.
    if user and getattr(payload, 'testMode', False):
        user_meta = user.get('user_metadata') or {}
        role_from_user = user_meta.get('role') or user_meta.get('role_name') or 'tenant'
        resolved_role = normalize_role(role_from_user)
        resolved_portal = (payload.portal or get_portal_for_role(resolved_role)).strip().lower()
        profile = {
            'id': None,
            'fullName': user_meta.get('fullName') or user.get('email'),
            'email': user.get('email'),
            'role': resolved_role,
            'portal': resolved_portal,
            'phone': user_meta.get('phone') or '',
            'status': 'ACTIVE'
        }
    elif profile is None:
        profile = get_user_profile(user) if user else None

    # If the frontend requested a portal or role, validate that the resolved profile matches it
    if requested_role and profile:
        profile_role = normalize_role(str(profile.get('role') or ''))
        if profile_role != requested_role:
            raise HTTPException(
                status_code=403,
                detail=f'Role mismatch: account belongs to {profile_role}. Requested role was {requested_role}.'
            )

    if requested_portal and profile:
        if requested_portal not in VALID_PORTALS:
            raise HTTPException(
                status_code=400,
                detail=f'Invalid portal requested. Valid portals are: {", ".join(VALID_PORTALS)}'
            )

        resolved_portal = (str(profile.get('portal') or get_portal_for_role(str(profile.get('role') or '')))).strip().lower()
        if resolved_portal != requested_portal:
            valid_target = resolved_portal
            raise HTTPException(
                status_code=403,
                detail=f'Portal mismatch: account belongs to {valid_target}. Choose one of: {", ".join(VALID_PORTALS)}'
            )

    jwt_token = create_jwt_token(profile) if profile else None

    return {
        'success': True,
        'data': {
            'user': profile,
            'token': jwt_token,
            'refreshToken': refresh_token,
            'accessToken': access_token
        }
    }


@app.get('/api/dashboard')
async def api_dashboard(auth_user: Dict[str, Any] = Depends(require_auth)):
    today = datetime.date.today().isoformat()
    try:
        branches_stats = query_table('branches', select='branch_id', order='branch_id', limit=1)
        staff_stats = query_table('staff', select='staff_id', order='staff_id', limit=1)
        tenants_stats = query_table('tenants', select='tenant_id', order='tenant_id', limit=1)
        rooms_stats = query_table('rooms', select='room_id', order='room_id', limit=1)
        allocations_stats = query_table('room_allocations', select='allocation_id', filters={'allocation_status': 'eq.ACTIVE'})
        complaints_stats = query_table('complaints', select='complaint_id', filters={'status': 'neq.RESOLVED'})
        visitors_stats = query_table('visitors', select='visitor_id', filters={'check_in': f'gte.{today}'})
        maintenance_stats = query_table('maintenance_requests', select='request_id', filters={'status': 'neq.COMPLETED'})
        recent_complaints = query_table(
            'complaints',
            select='complaint_id,title,priority,status,created_at',
            order='created_at.desc',
            limit=5
        )
    except HTTPException as exc:
        raise exc

    return {
        'success': True,
        'message': 'Dashboard data',
        'data': {
            'stats': {
                'totalBranches': len(branches_stats),
                'totalStaff': len(staff_stats),
                'totalTenants': len(tenants_stats),
                'totalRooms': len(rooms_stats),
                'activeAllocations': len(allocations_stats),
                'openComplaints': len(complaints_stats),
                'todaysVisitors': len(visitors_stats),
                'pendingMaintenance': len(maintenance_stats)
            },
            'recentComplaints': [normalize_complaint_row(item) for item in recent_complaints]
        }
    }


@app.get('/api/tenants')
async def get_tenants(auth_user: Dict[str, Any] = Depends(require_auth)):
    rows = query_table(
        'tenants',
        select='tenant_id,tenant_code,first_name,last_name,email,phone,status,room_number,gender,joining_date,expected_checkout',
        order='first_name'
    )
    return {'success': True, 'data': [normalize_tenant_row(item) for item in rows]}


@app.post('/api/tenants')
async def create_tenant(payload: TenantPayload, auth_user: Dict[str, Any] = Depends(require_auth)):
    record = [{
        'tenant_code': payload.tenantCode,
        'first_name': payload.firstName,
        'last_name': payload.lastName,
        'gender': payload.gender,
        'dob': payload.dob,
        'phone': payload.phone,
        'email': payload.email,
        'aadhaar': payload.aadhaar,
        'occupation': payload.occupation,
        'company_college': payload.companyCollege,
        'joining_date': payload.joiningDate,
        'expected_checkout': payload.expectedCheckout,
        'status': payload.status
    }]
    rows = insert_table('tenants', record)
    return {'success': True, 'data': normalize_tenant_row(rows[0]) if rows else None}


@app.get('/api/complaints')
async def get_complaints(auth_user: Dict[str, Any] = Depends(require_auth)):
    rows = query_table(
        'complaints',
        select='complaint_id,tenant_id,staff_id,title,description,priority,status,reported_by,created_at,resolved_at',
        order='created_at.desc'
    )
    return {'success': True, 'data': [normalize_complaint_row(item) for item in rows]}


@app.post('/api/complaints')
async def create_complaint(payload: ComplaintPayload, auth_user: Dict[str, Any] = Depends(require_auth)):
    record = [{
        'tenant_id': payload.tenantId,
        'staff_id': payload.staffId,
        'title': payload.title,
        'description': payload.description,
        'priority': payload.priority,
        'reported_by': payload.reportedBy,
        'status': payload.status
    }]
    rows = insert_table('complaints', record)
    return {'success': True, 'data': normalize_complaint_row(rows[0]) if rows else None}


@app.get('/api/rooms')
async def get_rooms(auth_user: Dict[str, Any] = Depends(require_auth)):
    rows = query_table(
        'rooms',
        select='room_id,branch_id,room_number,room_type,room_category,bed_count,status,rent,facilities,created_at,updated_at',
        order='room_number'
    )
    return {'success': True, 'data': [normalize_room_row(item) for item in rows]}


@app.get('/api/payments')
async def get_payments(auth_user: Dict[str, Any] = Depends(require_auth)):
    rows = query_table(
        'rent_payments',
        select='payment_id,tenant_id,allocation_id,amount,payment_date,due_date,status,payment_method,tenant_name',
        order='payment_date.desc'
    )
    return {'success': True, 'data': [normalize_payment_row(item) for item in rows]}


@app.get('/api/branches')
async def get_branches(auth_user: Dict[str, Any] = Depends(require_auth)):
    rows = query_table(
        'branches',
        select='branch_id,branch_name,branch_code,address,city,state,pincode,contact_number,manager_id,status,created_at',
        order='branch_name'
    )
    return {'success': True, 'data': [normalize_branch_row(item) for item in rows]}


@app.get('/api/staff')
async def get_staff(auth_user: Dict[str, Any] = Depends(require_auth)):
    rows = query_table(
        'staff',
        select='staff_id,employee_code,first_name,last_name,email,phone,role_id,branch_id,status,profile_photo,joined_date,created_at',
        order='first_name'
    )
    return {'success': True, 'data': [normalize_staff_row(item) for item in rows]}


@app.get('/api/roles')
async def get_roles(auth_user: Dict[str, Any] = Depends(require_auth)):
    rows = query_table('roles', select='role_id,role_name,description,permissions,status,created_at', order='role_name')
    return {'success': True, 'data': [normalize_role_row(item) for item in rows]}


@app.get('/api/beds')
async def get_beds(auth_user: Dict[str, Any] = Depends(require_auth)):
    rows = query_table('beds', select='bed_id,room_id,bed_number,status,rent,features,created_at', order='bed_number')
    return {'success': True, 'data': [normalize_bed_row(item) for item in rows]}


@app.get('/api/room-allocations')
async def get_room_allocations(auth_user: Dict[str, Any] = Depends(require_auth)):
    rows = query_table(
        'room_allocations',
        select='allocation_id,tenant_id,room_id,bed_id,allocation_start,allocation_end,allocation_status,rent,deposit,due_date,created_at',
        order='created_at.desc'
    )
    return {'success': True, 'data': [normalize_allocation_row(item) for item in rows]}


@app.get('/api/visitors')
async def get_visitors(auth_user: Dict[str, Any] = Depends(require_auth)):
    rows = query_table(
        'visitors',
        select='visitor_id,tenant_id,visitor_name,check_in,check_out,host_name,relationship,purpose,status,created_at',
        order='check_in.desc'
    )
    return {'success': True, 'data': [normalize_visitor_row(item) for item in rows]}


@app.get('/api/expenses')
async def get_expenses(auth_user: Dict[str, Any] = Depends(require_auth)):
    rows = query_table(
        'expenses',
        select='expense_id,branch_id,amount,category,description,expense_date,status,created_at',
        order='expense_date.desc'
    )
    return {'success': True, 'data': [normalize_expense_row(item) for item in rows]}


@app.get('/api/maintenance-requests')
async def get_maintenance_requests(auth_user: Dict[str, Any] = Depends(require_auth)):
    rows = query_table(
        'maintenance_requests',
        select='request_id,tenant_id,staff_id,title,description,status,priority,requested_by,assigned_to,created_at,resolved_at',
        order='created_at.desc'
    )
    return {'success': True, 'data': [normalize_maintenance_request_row(item) for item in rows]}


@app.post('/api/logins')
async def create_login_log(payload: LoginLogPayload):
    staff_rows = query_table('staff', select='staff_id', filters={'email': f'eq.{payload.email}'})
    if not staff_rows:
        return {'success': True, 'message': 'Login profile not found. Record skipped.', 'data': []}

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    payload_record = [{
        'staff_id': staff_rows[0]['staff_id'],
        'login_time': payload.timestamp or now,
        'logout_time': None,
        'ip_address': payload.ipAddress,
        'device_info': payload.deviceInfo,
        'user_agent': payload.userAgent,
        'login_status': payload.loginStatus,
        'created_at': now
    }]
    rows = insert_table('login_logs', payload_record)
    return {'success': True, 'data': rows}


@app.get('/api/role-check')
async def api_role_check(api_data: Dict[str, Any] = Depends(require_api_key)):
    return {
        'success': True,
        'data': {
            'apiKeyRole': api_data['role'],
            'message': f'API key is valid for role {api_data["role"]}'
        }
    }


@app.get('/api/debug/me')
async def api_debug_me(auth_user: Dict[str, Any] = Depends(require_auth)):
    """Temporary debug endpoint: return the authenticated profile without additional DB queries."""
    return {'success': True, 'data': auth_user}


@app.get('/api/owner-only')
async def api_owner_only(api_data: Dict[str, Any] = Depends(require_role(['owner']))):
    return {
        'success': True,
        'data': {
            'role': api_data['role'],
            'message': 'Owner access granted.'
        }
    }


def require_portal_access(portal: str, authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Validate the incoming JWT and ensure the user's portal matches the requested portal path.

    This enforces that a user with a `tenant` role cannot access the `owner` portal endpoints
    and vice-versa. The `portal` param should match the portal path used in the frontend (e.g. 'tenant', 'owner', 'manager').
    """
    if not authorization or not authorization.lower().startswith('bearer '):
        raise HTTPException(status_code=401, detail='Authorization token is required.')
    token = authorization.split(' ', 1)[1].strip()
    profile = get_auth_user(token)
    # `profile` is the app-level profile returned by `get_user_profile`
    user_portal = (profile.get('portal') or get_portal_for_role(profile.get('role'))).strip().lower()
    if user_portal != (portal or '').strip().lower():
        raise HTTPException(status_code=403, detail='Forbidden: portal access mismatch.')
    return profile


@app.get('/api/portal/{portal}/dashboard')
async def portal_dashboard(portal: str, profile: Dict[str, Any] = Depends(require_portal_access)):
    """Return dashboard data scoped to the authenticated user's portal.

    Uses the same internal queries as `/api/dashboard` but enforces portal ownership.
    """
    today = datetime.date.today().isoformat()
    try:
        branches_stats = query_table('branches', select='branch_id', order='branch_id', limit=1)
        staff_stats = query_table('staff', select='staff_id', order='staff_id', limit=1)
        tenants_stats = query_table('tenants', select='tenant_id', order='tenant_id', limit=1)
        rooms_stats = query_table('rooms', select='room_id', order='room_id', limit=1)
        allocations_stats = query_table('room_allocations', select='allocation_id', filters={'allocation_status': 'eq.ACTIVE'})
        complaints_stats = query_table('complaints', select='complaint_id', filters={'status': 'neq.RESOLVED'})
        visitors_stats = query_table('visitors', select='visitor_id', filters={'check_in': f'gte.{today}'})
        maintenance_stats = query_table('maintenance_requests', select='request_id', filters={'status': 'neq.COMPLETED'})
        recent_complaints = query_table(
            'complaints',
            select='complaint_id,title,priority,status,created_at',
            order='created_at.desc',
            limit=5
        )
    except HTTPException as exc:
        raise exc

    return {
        'success': True,
        'message': 'Portal dashboard data',
        'data': {
            'profile': profile,
            'stats': {
                'totalBranches': len(branches_stats),
                'totalStaff': len(staff_stats),
                'totalTenants': len(tenants_stats),
                'totalRooms': len(rooms_stats),
                'activeAllocations': len(allocations_stats),
                'openComplaints': len(complaints_stats),
                'todaysVisitors': len(visitors_stats),
                'pendingMaintenance': len(maintenance_stats)
            },
            'recentComplaints': [normalize_complaint_row(item) for item in recent_complaints]
        }
    }


if __name__ == '__main__':
    import uvicorn

    uvicorn.run('main:app', host='0.0.0.0', port=5000, reload=False)
