# 🆓 Free Deployment Guide - Hospital Management System

This guide covers **100% FREE** deployment options for your Hospital Management System.

## 🎯 Best Free Deployment Strategy

### Option 1: Split Deployment (Recommended - Always Free)
- **Frontend**: Vercel (Free, always on)
- **Backend**: Render Free Tier (spins down after 15 min inactivity)
- **Database**: Neon PostgreSQL (Free tier available)

**Pros:**
- Frontend always accessible
- Backend wakes up on first request (~30 seconds)
- Completely free forever

**Cons:**
- Backend has cold start delay after inactivity

### Option 2: Full Render Free Tier
- **Frontend**: Render Free Tier
- **Backend**: Render Free Tier
- **Database**: Neon PostgreSQL

**Pros:**
- Single platform
- Simple management

**Cons:**
- Both services spin down after 15 min inactivity
- Cold start delays

### Option 3: Railway (Free $5 Credit Monthly)
- **Frontend + Backend**: Railway
- **Database**: Neon PostgreSQL

**Pros:**
- $5 free credit monthly
- Better performance than Render free tier
- No spin-down issues

**Cons:**
- Limited to $5/month usage

---

## 🚀 Option 1: Vercel (Frontend) + Render (Backend) - RECOMMENDED

### Step 1: Deploy Frontend to Vercel (FREE)

1. **Push code to GitHub** (if not already done)
   ```bash
   git remote add origin https://github.com/your-username/hospital-management-system.git
   git push -u origin main
   ```

2. **Go to Vercel**: https://vercel.com
   - Sign up/login with GitHub
   - Click **"New Project"**
   - Import your repository
   - Configure:
     - **Root Directory**: `web-client`
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Environment Variables** in Vercel:
   ```
   VITE_API_URL=https://hms-backend-xxxx.onrender.com
   VITE_APP_NAME=Hospital Management System
   ```

4. **Deploy** - Vercel will build and deploy automatically

### Step 2: Deploy Backend to Render (FREE)

1. **Go to Render**: https://dashboard.render.com
   - Sign up/login (FREE account)
   - Click **"New +"** → **"Blueprint"**
   - Connect GitHub repository
   - Render will detect `render.yaml`
   - **Important**: Change plan to **"Free"** for both services
   - Click **"Apply"**

2. **Configure Backend Environment Variables**:
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

3. **Update Frontend Vercel Environment**:
   - Go back to Vercel → Your Project → Settings → Environment Variables
   - Update `VITE_API_URL` to your Render backend URL

### Step 3: Done! 🎉
- Frontend: `https://your-app.vercel.app` (always on)
- Backend: `https://hms-backend-xxxx.onrender.com` (free tier)

---

## 🚀 Option 2: Railway (Free $5 Credit Monthly)

### Step 1: Deploy to Railway

1. **Go to Railway**: https://railway.app
   - Sign up/login with GitHub
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your repository

2. **Deploy Backend**:
   - Click **"New"** → **"GitHub Repo"**
   - Select repository
   - Railway will detect Dockerfile
   - Set **Root Directory**: `backend`
   - Add environment variables (same as Render)

3. **Deploy Frontend**:
   - Click **"New"** → **"GitHub Repo"**
   - Select same repository
   - Set **Root Directory**: `web-client`
   - Add environment variables

4. **Configure**:
   - Both services will deploy automatically
   - Railway provides URLs automatically
   - Update environment variables with Railway URLs

**Note**: Railway gives $5 free credit monthly. For low-traffic apps, this is usually enough.

---

## 🚀 Option 3: Render Free Tier (Both Services)

### Configuration

The `render.yaml` is already configured for free tier. Just:

1. **Deploy on Render**:
   - Go to https://dashboard.render.com
   - New → Blueprint
   - Connect GitHub
   - **Make sure both services are set to "Free" plan**
   - Deploy

2. **Important Notes**:
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down takes ~30 seconds (cold start)
   - Use a free uptime monitor (like UptimeRobot) to keep services awake

### Keep Services Awake (Free)

Use **UptimeRobot** (free): https://uptimerobot.com

1. Sign up (free)
2. Add monitors:
   - Backend: `https://hms-backend-xxxx.onrender.com/actuator/health`
   - Frontend: `https://hms-frontend-xxxx.onrender.com/health`
3. Set interval: 5 minutes
4. This keeps services awake (free)

---

## 🆓 Other Free Alternatives

### Cyclic.sh
- **Free tier**: Full-stack apps
- **Pros**: Always on, no spin-down
- **Cons**: Limited resources
- **URL**: https://cyclic.sh

### Fly.io
- **Free tier**: 3 shared VMs
- **Pros**: Good performance
- **Cons**: Limited to 3 apps
- **URL**: https://fly.io

### Back4App
- **Free tier**: Backend hosting
- **Pros**: Good for APIs
- **Cons**: Limited features
- **URL**: https://back4app.com

---

## 📊 Comparison Table

| Platform | Free Tier | Always On | Cold Start | Best For |
|----------|-----------|-----------|------------|----------|
| **Vercel** | ✅ Yes | ✅ Yes | ❌ No | Frontend |
| **Render** | ✅ Yes | ❌ No* | ⚠️ Yes | Backend |
| **Railway** | ✅ $5/mo | ✅ Yes | ❌ No | Full-stack |
| **Netlify** | ✅ Yes | ✅ Yes | ❌ No | Frontend |
| **Cyclic** | ✅ Yes | ✅ Yes | ❌ No | Full-stack |
| **Fly.io** | ✅ Yes | ✅ Yes | ❌ No | Full-stack |

*Render free tier spins down after 15 min, but can be kept awake with UptimeRobot

---

## 🎯 Recommended Setup (100% Free Forever)

**Frontend**: Vercel (always free, always on)
**Backend**: Render Free Tier + UptimeRobot (free monitoring)
**Database**: Neon PostgreSQL (free tier)

**Total Cost**: $0/month forever ✅

---

## 📝 Quick Start Commands

### Deploy Frontend to Vercel
```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
cd web-client
vercel
```

### Deploy Backend to Render
1. Use Render dashboard (no CLI needed)
2. Connect GitHub repository
3. Select `render.yaml`
4. Set to Free plan
5. Add environment variables
6. Deploy

---

## 🔧 Troubleshooting

### Render Free Tier Issues

**Problem**: Service spins down
**Solution**: Use UptimeRobot to ping every 5 minutes

**Problem**: Cold start delay
**Solution**: Acceptable for free tier, or upgrade to paid

**Problem**: Build timeout
**Solution**: Optimize Dockerfile, use multi-stage builds

### Vercel Issues

**Problem**: Build fails
**Solution**: Check build logs, ensure Node.js version is correct

**Problem**: Environment variables not working
**Solution**: Redeploy after adding variables

---

## 💡 Tips for Free Deployment

1. **Optimize Docker images** - Smaller images = faster builds
2. **Use caching** - Cache dependencies in Dockerfile
3. **Monitor usage** - Keep track of free tier limits
4. **Use CDN** - Vercel/Netlify provide free CDN
5. **Database**: Neon PostgreSQL free tier is generous

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **UptimeRobot**: https://uptimerobot.com

---

## ✅ Summary

**Best Free Setup**:
1. Frontend → Vercel (free, always on)
2. Backend → Render Free Tier + UptimeRobot (free monitoring)
3. Database → Neon PostgreSQL (free tier)

**Total Cost**: $0/month ✅

This setup will work perfectly for development, testing, and low-traffic production use!
