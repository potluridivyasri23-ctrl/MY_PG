# Render Deployment Environment Variables Template
# Copy these to your Render dashboard under "Environment" settings
# Replace placeholder values with actual credentials

# ============ BACKEND ENVIRONMENT VARIABLES ============

# Supabase Configuration
SUPABASE_URL=https://toewxbvhhfnuhxrwawxm.supabase.co
SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_X3ZUAoSOnm-SiEieU4q0LQ_Dczx2vm0

# Database Connection
POSTGRES_CONNECTION=postgresql://postgres.toewxbvhhfnuhxrwawxm:Koteswar%40111@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres

# JWT Configuration
JWT_SECRET=generate-a-strong-random-secret-key-here-min-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=8

# CORS Configuration (set to your frontend URL after deployment)
CLIENT_ORIGIN=https://my-pg-frontend.onrender.com

# Server Port (Render provides this, usually 10000)
PORT=10000

# API Keys (optional, for API key authentication)
SUPABASE_JWT_KEY_OWNER=your_owner_jwt_key
SUPABASE_JWT_KEY_TAENANT=your_tenant_jwt_key

# ============ FRONTEND ENVIRONMENT VARIABLES ============

# API Base URL (Backend URL after deployment)
VITE_API_BASE=https://my-pg-backend.onrender.com
