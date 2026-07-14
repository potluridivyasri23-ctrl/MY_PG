from sqlalchemy import create_engine, text

POSTGRES_CONNECTION = 'postgresql://postgres.toewxbvhhfnuhxrwawxm:Koteswar%40111@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres'
engine = create_engine(POSTGRES_CONNECTION, future=True, pool_pre_ping=True)

# Find which roles are which IDs
print('=== ROLES TABLE ===')
with engine.connect() as conn:
    result = conn.execute(text('SELECT role_id, role_name FROM roles'))
    rows = result.fetchall()
    for row in rows:
        print(f'Role ID: {row[0]}, Role Name: {row[1]}')

# Get all staff with their roles
print('\n=== ALL STAFF WITH ROLES ===')
with engine.connect() as conn:
    result = conn.execute(text('''
        SELECT s.email, s.role_id, r.role_name 
        FROM staff s 
        LEFT JOIN roles r ON s.role_id = r.role_id
    '''))
    rows = result.fetchall()
    for row in rows:
        print(f'Email: {row[0]}, Role ID: {row[1]}, Role Name: {row[2]}')

# Get all tenants
print('\n=== ALL TENANTS ===')
with engine.connect() as conn:
    result = conn.execute(text('SELECT email FROM tenants'))
    rows = result.fetchall()
    for row in rows:
        print(f'Email: {row[0]}')
