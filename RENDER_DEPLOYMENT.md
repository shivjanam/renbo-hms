# Render Deployment Guide

## Prerequisites

1. **Render Account**: Sign up at https://render.com
2. **GitHub Repository**: Push your code to GitHub
3. **Neon Database**: Already configured (using existing CMS database)

## Deployment Steps

### Step 1: Push Code to GitHub

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit: Hospital Management System with Render deployment config"

# Add your GitHub remote
git remote add origin https://github.com/your-username/hospital-management-system.git
git branch -M main
git push -u origin main
```

### Step 2: Create Services on Render

#### Option A: Using render.yaml (Recommended)

1. Go to Render Dashboard: https://dashboard.render.com
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Review the configuration and click **"Apply"**

#### Option B: Manual Setup

1. **Backend Service:**
   - Go to Dashboard → **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Settings:
     - **Name**: `hms-backend`
     - **Root Directory**: Leave empty
     - **Environment**: `Docker`
     - **Dockerfile Path**: `./backend/Dockerfile`
     - **Docker Context**: `./backend`
     - **Build Command**: (leave empty)
     - **Start Command**: (leave empty)
     - **Plan**: Starter ($7/month) or Free (with limitations)

2. **Frontend Service:**
   - Go to Dashboard → **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Settings:
     - **Name**: `hms-frontend`
     - **Root Directory**: Leave empty
     - **Environment**: `Docker`
     - **Dockerfile Path**: `./web-client/Dockerfile`
     - **Docker Context**: `./web-client`
     - **Build Command**: (leave empty)
     - **Start Command**: (leave empty)
     - **Plan**: Starter ($7/month) or Free (with limitations)

### Step 3: Configure Environment Variables

#### Backend Service Environment Variables

Go to your backend service → **Environment** tab → Add these variables:

**Required:**
```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr
JWT_SECRET=YTJiM2M0ZDVlNmY3ZzhoOWkwajFrMmwzbTRuNW82cDdxOHI5czB0MXUydjN3NHg1eTZ6N2E4YjljMGQxZTJmM2c0aDVpNmo3
ENCRYPTION_KEY=HTC2024EncryptionKey32CharLong!
FRONTEND_URL=https://hms-frontend.onrender.com
APP_BASE_URL=https://hms-frontend.onrender.com
VITE_API_URL=https://hms-backend.onrender.com
```

**Hospital Config:**
```
HOSPITAL_NAME=Hi-Tech Computer Hospital
HOSPITAL_CODE=A287
HOSPITAL_SHORT_NAME=HTC
```

**Email (choose one):**
```
# Option 1: Resend (Recommended)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@hospital.com
EMAIL_PREFER_RESEND=true

# Option 2: SMTP
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=erxyeihfswrasgnw
```

**SMS:**
```
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=Rbf0s6OzhmgkDySZeKUL4NJ2rYAa9tF53ouI8PEqndlT7xjCHBSX4QcFw2HCyDtsmYpa8elUAhuiIdKJ
```

**JVM Options:**
```
JAVA_OPTS=-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC
```

#### Frontend Service Environment Variables

Go to your frontend service → **Environment** tab → Add:

```
VITE_API_URL=https://hms-backend.onrender.com
VITE_APP_NAME=Hospital Management System
```

**Important:** Replace `hms-backend.onrender.com` and `hms-frontend.onrender.com` with your actual Render service URLs after deployment.

### Step 4: Update URLs After Deployment

After both services are deployed, Render will provide URLs like:
- Backend: `https://hms-backend-xxxx.onrender.com`
- Frontend: `https://hms-frontend-xxxx.onrender.com`

Update environment variables:

1. **Backend Service:**
   - `FRONTEND_URL` → Your frontend URL
   - `APP_BASE_URL` → Your frontend URL
   - `VITE_API_URL` → Your backend URL

2. **Frontend Service:**
   - `VITE_API_URL` → Your backend URL

Then **Redeploy** both services.

### Step 5: Custom Domain (Optional)

1. Go to your service → **Settings** → **Custom Domain**
2. Add your domain
3. Update DNS records as instructed
4. Update environment variables with new domain

## Health Checks

Render automatically checks:
- **Backend**: `/actuator/health`
- **Frontend**: `/health`

## Monitoring

- **Logs**: View in Render dashboard → Service → **Logs** tab
- **Metrics**: View in Render dashboard → Service → **Metrics** tab
- **Events**: View deployment history in **Events** tab

## Troubleshooting

### Build Fails

1. Check **Logs** tab for build errors
2. Verify Dockerfile paths are correct
3. Ensure all dependencies are in package.json/pom.xml

### Service Won't Start

1. Check **Logs** for runtime errors
2. Verify environment variables are set correctly
3. Check database connectivity

### Database Connection Issues

1. Verify `DATABASE_URL` format is correct
2. Check Neon database is accessible
3. Verify SSL mode is set (`?sslmode=require`)

### Frontend Can't Connect to Backend

1. Verify `VITE_API_URL` points to backend service URL
2. Check CORS settings in backend
3. Ensure backend is running and healthy

## Cost Estimation

**Free Tier:**
- Services spin down after 15 minutes of inactivity
- Limited resources
- Good for testing

**Starter Plan ($7/month per service):**
- Always on
- Better performance
- Recommended for production

**Total:** ~$14/month for both services (backend + frontend)

## Auto-Deploy

Render automatically deploys when you push to:
- `main` branch (production)
- Other branches (preview deployments)

To disable auto-deploy:
- Go to service → **Settings** → **Auto-Deploy** → Toggle off

## Manual Deploy

1. Go to service → **Manual Deploy**
2. Select branch/commit
3. Click **Deploy**

## Rollback

1. Go to service → **Events** tab
2. Find previous successful deployment
3. Click **Redeploy**

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Status Page: https://status.render.com
