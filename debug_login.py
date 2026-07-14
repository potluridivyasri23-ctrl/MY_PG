import json
from sqlalchemy import create_engine, text

POSTGRES_CONNECTION = 'postgresql://postgres.toewxbvhhfnuhxrwawxm:Koteswar%40111@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres'
engine = create_engine(POSTGRES_CONNECTION, future=True, pool_pre_ping=True)

# Simulate what the backend does when you login with ramesh1@mypg.in

email = "ramesh1@mypg.in"

print("=" * 60)
print(f"DEBUGGING LOGIN FOR: {email}")
print("=" * 60)

# Step 1: Check if user is in staff table
print("\n1️⃣ CHECKING STAFF TABLE...")
with engine.connect() as conn:
    sql = text('''
        SELECT s.staff_id, s.email, s.role_id, s.first_name, s.last_name, r.role_name 
        FROM staff s 
        LEFT JOIN roles r ON s.role_id = r.role_id 
        WHERE s.email = :email 
        LIMIT 1
    ''')
    result = conn.execute(sql, {'email': email})
    rows = result.fetchall()
    
    if rows:
        row = rows[0]
        print(f"✅ FOUND IN STAFF TABLE!")
        print(f"   Email: {row[1]}")
        print(f"   Role ID: {row[2]}")
        print(f"   Role Name: {row[5]}")
        print(f"   Full Name: {row[3]} {row[4]}")
        
        # This is what the backend should return
        staff_profile = {
            'id': row[0],
            'email': row[1],
            'role': row[5],  # role_name from database
            'fullName': f"{row[3]} {row[4]}",
        }
        print(f"\n   Backend should return role: {staff_profile['role']}")
    else:
        print("❌ NOT FOUND IN STAFF TABLE")

# Step 2: Check if user is in tenants table
print("\n2️⃣ CHECKING TENANTS TABLE...")
with engine.connect() as conn:
    sql = text('SELECT email FROM tenants WHERE email = :email LIMIT 1')
    result = conn.execute(sql, {'email': email})
    rows = result.fetchall()
    
    if rows:
        print(f"⚠️ FOUND IN TENANTS TABLE!")
        print(f"   This would cause role='tenant' if staff lookup failed")
    else:
        print("✅ NOT IN TENANTS TABLE (Good!)")

# Step 3: Check password in staff table
print("\n3️⃣ CHECKING PASSWORD IN DATABASE...")
with engine.connect() as conn:
    sql = text('''
        SELECT staff_id, email, password 
        FROM staff 
        WHERE email = :email 
        LIMIT 1
    ''')
    result = conn.execute(sql, {'email': email})
    rows = result.fetchall()
    
    if rows:
        row = rows[0]
        print(f"✅ Staff record found")
        print(f"   Email: {row[1]}")
        print(f"   Has password column: {'Yes' if row[2] is not None else 'No'}")
        print(f"   Password value: [HIDDEN]")
        if row[2]:
            print(f"   Note: If you provide the wrong password, it might fall back to tenants table!")
    else:
        print("❌ No staff record found")

print("\n" + "=" * 60)
print("EXPECTED RESULT: role='owner', portal='owner'")
print("=" * 60)
