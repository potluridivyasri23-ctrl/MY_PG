import pytest
from fastapi.testclient import TestClient
import main

client = TestClient(main.app)


def fake_supabase_token_success(method, path, use_service_key=True, token=None, params=None, json_body=None, extra_headers=None):
    # simulate supabase auth token response
    return {'access_token': 'dummy', 'refresh_token': None, 'user': {'email': json_body.get('email') if json_body else 'user@example.com', 'user_metadata': {'role': 'tenant', 'fullName': 'Test User'}}}


def fake_get_user_profile(auth_user):
    # simulate tenant profile from DB
    return {
        'id': 1,
        'fullName': 'DB Tenant',
        'email': auth_user.get('email'),
        'role': 'tenant',
        'portal': 'tenant',
        'phone': '',
        'status': 'ACTIVE'
    }


def fake_get_user_profile_owner(auth_user):
    return {
        'id': 2,
        'fullName': 'DB Owner',
        'email': auth_user.get('email'),
        'role': 'owner',
        'portal': 'owner',
        'phone': '',
        'status': 'ACTIVE'
    }


def test_login_testmode_bypasses_supabase(monkeypatch):
    payload = {'email': 'test@example.com', 'password': 'x', 'portal': 'tenant', 'testMode': True}
    r = client.post('/api/auth/login', json=payload)
    assert r.status_code == 200
    body = r.json()
    assert body['success'] is True
    assert body['data']['user']['portal'] == 'tenant'


def test_login_respects_requested_portal(monkeypatch):
    # Patch Supabase auth and DB auth to avoid external connections
    monkeypatch.setattr(main, 'supabase_request', fake_supabase_token_success)
    monkeypatch.setattr(main, 'authenticate_db_user', lambda email, password: None)
    # Patch get_user_profile to return owner profile
    monkeypatch.setattr(main, 'get_user_profile', fake_get_user_profile_owner)

    payload = {'email': 'owner@example.com', 'password': 'x', 'portal': 'tenant'}
    r = client.post('/api/auth/login', json=payload)
    # Since resolved portal is owner but requested tenant, expect 403
    assert r.status_code == 403


def test_login_success_with_matching_portal(monkeypatch):
    monkeypatch.setattr(main, 'supabase_request', fake_supabase_token_success)
    monkeypatch.setattr(main, 'authenticate_db_user', lambda email, password: None)
    monkeypatch.setattr(main, 'get_user_profile', fake_get_user_profile)

    payload = {'email': 'tenant@example.com', 'password': 'x', 'portal': 'tenant'}
    r = client.post('/api/auth/login', json=payload)
    assert r.status_code == 200
    body = r.json()
    assert body['data']['user']['portal'] == 'tenant'


def test_get_staff_profile_uses_role_name_from_join(monkeypatch):
    monkeypatch.setattr(main, 'execute_query', lambda sql, params=None: [{
        'staff_id': 5,
        'employee_code': 'EMP005',
        'first_name': 'Jane',
        'last_name': 'Doe',
        'email': 'jane.doe@example.com',
        'phone': '1234567890',
        'role_id': 2,
        'branch_id': 1,
        'status': 'ACTIVE',
        'profile_photo': 'photo.png',
        'role_name': 'Super Admin'
    }])
    monkeypatch.setattr(main, 'get_branch_name', lambda branch_id: 'Main Branch')

    profile = main.get_staff_profile_by_email('jane.doe@example.com')
    assert profile is not None
    assert profile['role'] == 'super admin'
    assert profile['portal'] == 'admin'
    assert profile['branchName'] == 'Main Branch'
