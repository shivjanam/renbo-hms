# 🚀 Quick Free Deployment (No Payment Required)

## ⚠️ Render Free Tier Limitation

**Render free tier only allows 1 free web service.**

So if you want both frontend and backend free, use this setup:

---

## ✅ Recommended: Vercel (Frontend) + Render (Backend)

### Step 1: Deploy Frontend to Vercel (100% FREE)

1. **Go to**: https://vercel.com
2. **Sign up** with GitHub (free)
3. **Click "New Project"**
4. **Import** your GitHub repository
5. **Configure**:
   - **Root Directory**: `web-client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
6. **Environment Variables**:
   ```
   VITE_API_URL=https://hms-backend-xxxx.onrender.com
   ```
   (We'll update this after backend deploys)
7. **Click "Deploy"**
8. ✅ **Frontend is now live!** (Always free, always on)

### Step 2: Deploy Backend to Render (100% FREE)

1. **Go to**: https://dashboard.render.com
2. **Sign up** with GitHub (free account)
3. **Click "New +" → "Web Service"** (NOT Blueprint)
4. **Connect GitHub** → Select your repository
5. **Configure**:
   ```
   Name: hms-backend
   Region: Singapore (or closest)
   Branch: main
   Root Directory: (empty)
   Runtime: Docker
   Dockerfile Path: ./backend/Dockerfile
   Docker Context: ./backend
   ```
6. **IMPORTANT - Scroll down to "Plan" section:**
   - You'll see: Free | Starter ($7) | Standard | Pro
   - **SELECT "Free"** ($0/month)
   - If you don't see Free, check if you already have a free service
7. **Click "Create Web Service"**
8. **Wait for deployment** (~5-10 minutes)

### Step 3: Add Environment Variables (Backend)

After backend deploys:

1. **Go to Backend Service** → **Environment** tab
2. **Add these variables**:

```
DATABASE_URL=jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr
JWT_SECRET=YTJiM2M0ZDVlNmY3ZzhoOWkwajFrMmwzbTRuNW82cDdxOHI5czB0MXUydjN3NHg1eTZ6N2E4YjljMGQxZTJmM2c0aDVpNmo3
ENCRYPTION_KEY=HTC2024EncryptionKey32CharLong!
FRONTEND_URL=https://your-app.vercel.app
APP_BASE_URL=https://your-app.vercel.app
VITE_API_URL=https://hms-backend-xxxx.onrender.com
FAST2SMS_API_KEY=Rbf0s6OzhmgkDySZeKUL4NJ2rYAa9tF53ouI8PEqndlT7xjCHBSX4QcFw2HCyDtsmYpa8elUAhuiIdKJ
MAIL_PASSWORD=erxyeihfswrasgnw
SPRING_PROFILES_ACTIVE=prod
HOSPITAL_NAME=Hi-Tech Computer Hospital
HOSPITAL_CODE=A287
HOSPITAL_SHORT_NAME=HTC
SMS_PROVIDER=fast2sms
```

3. **Save** - Render will auto-redeploy

### Step 4: Update URLs

1. **Copy Backend URL** from Render (e.g., `https://hms-backend-abc123.onrender.com`)
2. **Copy Frontend URL** from Vercel (e.g., `https://your-app.vercel.app`)
3. **Update Vercel**:
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Update `VITE_API_URL` to backend URL
   - Redeploy
4. **Update Render Backend**:
   - Go to Render → Backend Service → Environment
   - Update `FRONTEND_URL` and `APP_BASE_URL` to frontend URL
   - Update `VITE_API_URL` to backend URL
   - Save (auto-redeploys)

### Step 5: Keep Backend Awake (Optional, Free)

Render free tier spins down after 15 min. Keep it awake:

1. **Go to**: https://uptimerobot.com
2. **Sign up** (free)
3. **Add Monitor**:
   - URL: `https://hms-backend-xxxx.onrender.com/actuator/health`
   - Type: HTTP(s)
   - Interval: 5 minutes
4. ✅ Backend stays awake!

---

## 🎉 Done!

**Your app is now live:**
- Frontend: `https://your-app.vercel.app` (always on)
- Backend: `https://hms-backend-xxxx.onrender.com` (free tier)

**Total Cost: $0/month** ✅

---

## 🆓 Alternative: Railway (If Render Doesn't Work)

Railway gives $5 free credit monthly (usually enough):

1. **Go to**: https://railway.app
2. **Sign up** with GitHub
3. **New Project** → **Deploy from GitHub**
4. **Select repository**
5. **Deploy Backend**:
   - Root: `backend`
   - Environment variables: Same as above
6. **Deploy Frontend**:
   - Root: `web-client`
   - Environment variables: `VITE_API_URL` = backend URL

**No payment required** - Uses free $5 credit monthly.

---

## 📝 Notes

- **Vercel**: Always free, always on, perfect for frontend
- **Render Free**: 1 free service, spins down after 15 min
- **Railway**: $5 free credit monthly, better performance
- **All options**: No credit card required for free tiers

---

## 🆘 Troubleshooting

**Render asks for payment?**
- You might already have a free service (delete it)
- Or use Vercel for frontend + Render for backend (recommended)

**Backend slow to start?**
- Normal for Render free tier (~30 sec cold start)
- Use UptimeRobot to keep it awake (free)

**Need help?**
- Check `FREE_DEPLOYMENT_GUIDE.md` for detailed instructions
- Check `RENDER_FREE_TIER_SETUP.md` for Render-specific help
