# 🆓 Render Free Tier Setup - Step by Step

## ⚠️ Important: How to Select FREE Tier in Render

Render sometimes tries to default to paid plans. Here's how to ensure you select FREE:

### Method 1: Using Blueprint (render.yaml)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +" → "Blueprint"**
3. **Connect GitHub** and select your repository
4. **After connecting, BEFORE clicking "Apply":**
   - Look for **"Plan"** or **"Pricing"** section
   - You'll see options like:
     - ⚠️ **Starter** ($7/month) - DON'T SELECT THIS
     - ✅ **Free** ($0/month) - SELECT THIS
   - **Change both services to "Free" plan**
5. **Then click "Apply"**

### Method 2: Manual Setup (More Control)

If Blueprint doesn't work, create services manually:

#### Backend Service (Manual)

1. **Go to Dashboard** → **"New +"** → **"Web Service"**
2. **Connect GitHub** → Select your repository
3. **Configure Settings:**
   ```
   Name: hms-backend
   Region: Singapore (or closest to you)
   Branch: main
   Root Directory: (leave empty)
   Runtime: Docker
   Dockerfile Path: ./backend/Dockerfile
   Docker Context: ./backend
   Build Command: (leave empty)
   Start Command: (leave empty)
   ```
4. **IMPORTANT - Plan Selection:**
   - Scroll down to **"Plan"** section
   - You'll see: **Free** | Starter | Standard | Pro
   - **SELECT "Free"** (it should show $0/month)
   - If you don't see Free option, try refreshing or check if you've hit free tier limits
5. **Click "Create Web Service"**

#### Frontend Service (Manual)

1. **Go to Dashboard** → **"New +"** → **"Web Service"**
2. **Connect GitHub** → Select your repository
3. **Configure Settings:**
   ```
   Name: hms-frontend
   Region: Singapore (or closest to you)
   Branch: main
   Root Directory: (leave empty)
   Runtime: Docker
   Dockerfile Path: ./web-client/Dockerfile
   Docker Context: ./web-client
   Build Command: (leave empty)
   Start Command: (leave empty)
   ```
4. **IMPORTANT - Plan Selection:**
   - Scroll down to **"Plan"** section
   - **SELECT "Free"** ($0/month)
5. **Click "Create Web Service"**

---

## 🚨 If Render Still Asks for Payment

### Check These:

1. **Free Tier Limits:**
   - Render free tier allows **1 free web service**
   - If you already have a free service, you might need to delete it first
   - Or use alternative: Deploy frontend to Vercel (free) + backend to Render (free)

2. **Account Type:**
   - Make sure you're signed up with a **free account**
   - Not a team/organization account (those might require payment)

3. **Region:**
   - Some regions might not support free tier
   - Try: Singapore, Oregon, Frankfurt

---

## ✅ Alternative: Use Vercel + Render (Recommended)

Since Render free tier only allows **1 free web service**, best approach:

### Frontend → Vercel (FREE, Always On)
### Backend → Render (FREE)

This way you get:
- ✅ Frontend always on (Vercel)
- ✅ Backend free tier (Render)
- ✅ Both completely free
- ✅ Better performance

**See `FREE_DEPLOYMENT_GUIDE.md` for Vercel setup instructions.**

---

## 🆓 Other Free Alternatives

If Render doesn't work, try these:

### 1. Railway (Free $5 Credit Monthly)
- Go to: https://railway.app
- Sign up with GitHub
- $5 free credit monthly
- Usually enough for low-traffic apps
- **No payment required**

### 2. Fly.io (Free Tier)
- Go to: https://fly.io
- Sign up (free)
- 3 shared VMs free
- **No payment required**

### 3. Cyclic.sh (Free Tier)
- Go to: https://cyclic.sh
- Sign up with GitHub
- Full-stack apps free
- **No payment required**

### 4. Back4App (Free Tier)
- Go to: https://back4app.com
- Sign up (free)
- Backend hosting free
- **No payment required**

---

## 📝 Quick Fix: Update render.yaml

Make sure your `render.yaml` has `plan: free`:

```yaml
services:
  - type: web
    name: hms-backend
    plan: free  # ← Make sure this says "free"
    ...
  
  - type: web
    name: hms-frontend
    plan: free  # ← Make sure this says "free"
    ...
```

---

## 🎯 Recommended Solution

**Best Free Setup:**
1. **Frontend**: Deploy to Vercel (free, always on)
2. **Backend**: Deploy to Render Free Tier (1 free service allowed)

This gives you:
- ✅ Both services free
- ✅ Frontend always accessible
- ✅ Backend wakes up on request (~30 sec delay acceptable)

**Total Cost: $0/month** ✅

---

## 📞 Need Help?

If Render keeps asking for payment:
1. Check if you already have a free service (delete it)
2. Try Vercel for frontend instead
3. Use Railway or Fly.io as alternatives
4. Check Render's free tier documentation: https://render.com/docs/free
