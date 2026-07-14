import sys
sys.path.insert(0, '/Users/Kotes/Desktop/MY PG/backend')

from sqlalchemy import create_engine, text
import os

POSTGRES_CONNECTION = 'postgresql://postgres.toewxbvhhfnuhxrwawxm:Koteswar%40111@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres'
engine = create_engine(POSTGRES_CONNECTION, future=True, pool_pre_ping=True)

def execute_query(sql, params=None):
    """Execute a raw SQL query"""
    with engine.connect() as conn:
        result = conn.execute(text(sql), params or {})
        return result.fetchall()

def normalize_role(role: str = '') -> str:
    """From main.py"""
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

def get_portal_for_role(role: str) -> str:
    """From main.py"""
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
    normalized = normalize_role(role)
    return PORTAL_ROLE_MAP.get(normalized, 'tenant')

def simulate_get_staff_profile_by_email(email: str):
    """Simulates get_staff_profile_by_email from main.py"""
    sql = text('''
        SELECT s.staff_id, s.employee_code, s.first_name, s.last_name, s.email, s.phone, 
               s.role_id, s.branch_id, s.status, s.profile_photo, r.role_name 
        FROM staff s 
        LEFT JOIN roles r ON s.role_id = r.role_id 
        WHERE s.email = :email 
        LIMIT 1
    ''')
    with engine.connect() as conn:
        rows = conn.execute(sql, {'email': email}).fetchall()
    
    if not rows:
        return None

    data = rows[0]
    role_name = data[10] or 'Tenant'
    
    profile = {
        'id': data[0],
        'employeeCode': data[1],
        'fullName': f"{data[2]} {data[3]}".strip(),
        'email': data[4] or email,
        'role': normalize_role(role_name),
        'portal': get_portal_for_role(role_name),
        'phone': data[5] or '',
        'branchId': data[7],
        'profilePhoto': data[9] or '',
        'status': data[8] or 'ACTIVE'
    }
    return profile

def simulate_get_tenant_profile_by_email(email: str):
    """Simulates get_tenant_profile_by_email from main.py"""
    sql = text('''
        SELECT tenant_id, tenant_code, first_name, last_name, email, phone, status 
        FROM tenants 
        WHERE email = :email 
        LIMIT 1
    ''')
    with engine.connect() as conn:
        rows = conn.execute(sql, {'email': email}).fetchall()
    
    if not rows:
        return None
    
    data = rows[0]
    profile = {
        'id': data[0],
        'tenantCode': data[1],
        'fullName': f"{data[2]} {data[3]}".strip(),
        'email': data[4] or email,
        'role': 'tenant',
        'portal': 'tenant',
        'phone': data[5] or '',
        'status': data[6] or 'ACTIVE'
    }
    return profile

def simulate_login_flow(email: str):
    """Simulates what happens when user logs in"""
    print("\n" + "=" * 70)
    print(f"SIMULATING LOGIN FLOW FOR: {email}")
    print("=" * 70)
    
    print("\n1️⃣ CHECKING STAFF TABLE (first priority)...")
    staff_profile = simulate_get_staff_profile_by_email(email)
    
    if staff_profile:
        print(f"✅ FOUND IN STAFF TABLE!")
        print(f"   Email: {staff_profile['email']}")
        print(f"   Full Name: {staff_profile['fullName']}")
        print(f"   Role: {staff_profile['role']}")
        print(f"   Portal: {staff_profile['portal']}")
        print(f"\n✅ BACKEND WILL RETURN: {staff_profile}")
        return staff_profile
    else:
        print(f"❌ NOT FOUND IN STAFF TABLE")
    
    print("\n2️⃣ CHECKING TENANTS TABLE (second priority)...")
    tenant_profile = simulate_get_tenant_profile_by_email(email)
    
    if tenant_profile:
        print(f"⚠️ FOUND IN TENANTS TABLE!")
        print(f"   Email: {tenant_profile['email']}")
        print(f"   Role: {tenant_profile['role']}")
        print(f"   Portal: {tenant_profile['portal']}")
        print(f"\n⚠️ BACKEND WILL RETURN: {tenant_profile}")
        print(f"\n🚨 THIS IS WHY YOU'RE SEEING TENANT PORTAL!")
        return tenant_profile
    else:
        print(f"❌ NOT FOUND IN TENANTS TABLE EITHER")
        print(f"\n❌ BACKEND WILL RETURN: None (would use Supabase metadata)")
        return None

# Run the simulation
result = simulate_login_flow("ramesh1@mypg.in")

print("\n" + "=" * 70)
if result and result.get('role') == 'owner':
    print("✅ EXPECTED: You should see OWNER PORTAL")
else:
    print("❌ ISSUE DETECTED: Wrong role is being returned!")
print("=" * 70)
