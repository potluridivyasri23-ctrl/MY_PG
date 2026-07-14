# MY-PG Deployment Guide to Render

## 🚀 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Account**: Your code must be pushed to GitHub
3. **Git**: Ensure your code is committed and pushed

## 📋 Deployment Steps

### Step 1: Push Code to GitHub

```bash
cd "C:\Users\Kotes\Desktop\MY PG"
git add .
git commit -m "Prepare for Render deployment"
git push -u origin main
```

### Step 2: Deploy Backend to Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Fill in the configuration:
   - **Name**: `my-pg-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3.11` (or latest)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free (or paid for better performance)

5. **Add Environment Variables**:
   ```
   SUPABASE_URL = https://toewxbvhhfnuhxrwawxm.supabase.co
   SUPABASE_ANON_KEY = your_actual_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY = sb_publishable_X3ZUAoSOnm-SiEieU4q0LQ_Dczx2vm0
   POSTGRES_CONNECTION = postgresql://postgres.toewxbvhhfnuhxrwawxm:Koteswar%40111@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
   JWT_SECRET = your-secure-jwt-secret-key
   JWT_ALGORITHM = HS256
   JWT_EXPIRE_HOURS = 8
   CLIENT_ORIGIN = https://my-pg-frontend.onrender.com
   ```

6. Click **"Create Web Service"**
7. Wait for deployment to complete (5-10 minutes)
8. Note your backend URL: `https://my-pg-backend.onrender.com`

### Step 3: Deploy Frontend to Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Static Site"** (or **"Web Service"** for dynamic)
3. Connect your GitHub repository
4. Fill in the configuration:
   - **Name**: `my-pg-frontend`
   - **Root Directory**: `frontend-react`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. **Add Environment Variables**:
   ```
   VITE_API_BASE = https://my-pg-backend.onrender.com
   ```

6. Click **"Create Static Site"**
7. Wait for deployment to complete
8. Your frontend URL: `https://my-pg-frontend.onrender.com`

## 🔐 Environment Variables Reference

### Backend Environment Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `SUPABASE_URL` | `https://toewxbvhhfnuhxrwawxm.supabase.co` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | From Supabase dashboard | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase dashboard | Service role key (keep secret!) |
| `POSTGRES_CONNECTION` | Your DB connection string | Direct PostgreSQL connection |
| `JWT_SECRET` | Strong random string | Use a secure passphrase |
| `JWT_ALGORITHM` | `HS256` | HMAC SHA-256 |
| `JWT_EXPIRE_HOURS` | `8` | JWT token expiration in hours |
| `CLIENT_ORIGIN` | `https://my-pg-frontend.onrender.com` | Frontend URL for CORS |
| `PORT` | `10000` | Render provides this automatically |

### Frontend Environment Variables

| Variable | Value |
|----------|-------|
| `VITE_API_BASE` | `https://my-pg-backend.onrender.com` |

## ⚙️ Build & Start Commands

### Backend
```bash
# Build
pip install -r requirements.txt

# Start
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend
```bash
# Build
npm install && npm run build

# Start (for static site)
npm run preview
```

## ✅ Post-Deployment Checklist

- [ ] Backend is running on Render
- [ ] Frontend is running on Render
- [ ] Environment variables are set correctly
- [ ] CORS is configured (frontend URL in `CLIENT_ORIGIN`)
- [ ] Login works with `ramesh1@mypg.in`
- [ ] Owner portal appears (not tenant portal)
- [ ] Database queries work
- [ ] Frontend can communicate with backend

## 🐛 Troubleshooting

### Backend won't start
- Check `requirements.txt` has all dependencies
- Verify Python version compatibility
- Check environment variables are set
- View logs in Render dashboard

### Frontend build fails
- Run `npm install` locally to verify
- Check `package.json` scripts
- Verify `VITE_*` environment variables

### Frontend can't connect to backend
- Verify `VITE_API_BASE` matches backend URL
- Check CORS settings in backend
- Ensure `CLIENT_ORIGIN` includes frontend URL

### Login fails
- Verify Supabase credentials in environment
- Check JWT_SECRET is set
- Verify PostgreSQL connection string

## 📱 Test Your Deployment

1. **Login**: `ramesh1@mypg.in` (Owner account)
2. **Verify Portal**: Should show Owner Portal (not Tenant)
3. **Test Features**: Dashboard, navigation, data loading

## 🔄 Redeployment

After making code changes:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render automatically redeploys on push to main branch!

## 💡 Additional Resources

- [Render Documentation](https://render.com/docs)
- [FastAPI on Render](https://render.com/docs/deploy-fastapi)
- [Static Sites on Render](https://render.com/docs/static-sites)
- [Environment Variables](https://render.com/docs/environment-variables)
