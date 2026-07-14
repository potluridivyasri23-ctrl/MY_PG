from main import normalize_role, get_portal_for_role, PORTAL_ROLE_MAP

# Test the normalization functions
test_role = "Owner"  # This is what the database returns for ramesh1@mypg.in

print("=" * 70)
print("TESTING ROLE NORMALIZATION")
print("=" * 70)

print(f"\n1. Database returns role_name: '{test_role}'")

normalized_role = normalize_role(test_role)
print(f"2. After normalize_role(): '{normalized_role}'")

portal = get_portal_for_role(test_role)
print(f"3. After get_portal_for_role(): '{portal}'")

print(f"\n4. PORTAL_ROLE_MAP = {PORTAL_ROLE_MAP}")

print(f"\n✅ Expected result:")
print(f"   role: 'owner'")
print(f"   portal: 'owner'")

print(f"\n📊 Actual result:")
print(f"   role: '{normalized_role}'")
print(f"   portal: '{portal}'")

if normalized_role == 'owner' and portal == 'owner':
    print("\n✅ PASS: Normalization works correctly!")
else:
    print(f"\n❌ FAIL: Something is wrong with normalization!")
