# How to Upload Environment Variables to Vercel

## Method 1: Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project** (`renbo-hms` or your project name)
3. **Go to Settings** → **Environment Variables**
4. **Open `frontend.env` file** from this repository
5. **Add each variable:**
   - Click **"Add New"**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://renbo-hms.onrender.com`
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**
6. **Repeat** for `VITE_APP_NAME`
7. **Redeploy** your project:
   - Go to **Deployments** tab
   - Click **"Redeploy"** → **"Redeploy"**

## Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add VITE_API_URL
# Enter: https://renbo-hms.onrender.com
# Select: Production, Preview, Development

vercel env add VITE_APP_NAME
# Enter: Hospital Management System
# Select: Production, Preview, Development

# Redeploy
vercel --prod
```

## Method 3: Using .env.local (Local Development Only)

For local development, create `web-client/.env.local`:

```env
VITE_API_URL=https://renbo-hms.onrender.com
VITE_APP_NAME=Hospital Management System
```

**Note:** This file is gitignored and won't be deployed to Vercel.

---

## ⚠️ Important Notes

- **Vercel requires** environment variables to be set in dashboard for production
- **Redeploy** after adding/updating environment variables
- **VITE_ prefix** is required for Vite to expose variables to frontend
- **Case-sensitive** - variable names must match exactly

---

## ✅ Quick Checklist

After adding variables:

- [ ] `VITE_API_URL` = https://renbo-hms.onrender.com
- [ ] `VITE_APP_NAME` = Hospital Management System
- [ ] Variables set for Production, Preview, and Development
- [ ] Project redeployed
- [ ] Frontend can connect to backend (test in browser)

---

## 🔄 After Adding Variables

**Important:** Vercel needs to rebuild to include new environment variables:

1. **Go to Deployments** tab
2. **Click "Redeploy"** on latest deployment
3. **Or** push a new commit to trigger auto-deploy
4. **Wait** for build to complete (~2-3 minutes)
5. **Test** your frontend - it should now connect to backend

---

## 📝 Variables in frontend.env

Only 2 variables needed:
- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name

---

## 🆘 Troubleshooting

### Variables Not Working?

1. **Redeploy** - Vercel needs to rebuild with new env vars
2. **Check** variable names start with `VITE_`
3. **Verify** values don't have extra spaces
4. **Check** browser console for API connection errors

### Still Can't Connect to Backend?

1. **Verify** `VITE_API_URL` matches backend URL exactly
2. **Check** backend is running (visit backend health URL)
3. **Check** CORS settings in backend
4. **Clear** browser cache and hard refresh
