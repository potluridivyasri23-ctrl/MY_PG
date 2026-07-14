import requests

API = 'http://127.0.0.1:5000'

payload = {
    'email': 'tenant@example.com',
    'password': 'dummy-password',
    'portal': 'tenant',
    'testMode': True
}

print('Posting to /api/auth/login with testMode...')
try:
    r = requests.post(f'{API}/api/auth/login', json=payload, timeout=10)
    print('Status:', r.status_code)
    print('Body:', r.json())
    if r.status_code == 200 and r.json().get('data', {}).get('token'):
        token = r.json()['data']['token']
        headers = {'Authorization': f'Bearer {token}'}
        print('\nCalling /api/debug/me with returned token...')
        r2 = requests.get(f'{API}/api/debug/me', headers=headers, timeout=10)
        print('Debug me status:', r2.status_code)
        print('Debug me body:', r2.json())
except Exception as e:
    print('Request failed:', e)
