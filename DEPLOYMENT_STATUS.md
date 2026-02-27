# 🚀 Deployment Status & Configuration

## ✅ Current Deployment

### Frontend (Vercel) - DEPLOYED ✅
- **URL**: https://renbo-hms.vercel.app/
- **Status**: Live and running
- **Platform**: Vercel (Free Tier)

### Backend (Render) - CONFIGURE NOW ⚠️
- **URL**: `https://hms-backend-xxxx.onrender.com` (Update with your actual URL)
- **Status**: Needs environment variables update
- **Platform**: Render (Free Tier)

---

## 🔧 Required Configuration Updates

### Step 1: Update Backend Environment Variables (Render)

Go to **Render Dashboard** → **Backend Service** → **Environment** tab:

**Update these URLs:**
```env
FRONTEND_URL=https://renbo-hms.vercel.app
APP_BASE_URL=https://renbo-hms.vercel.app
VITE_API_URL=https://hms-backend-xxxx.onrender.com
```

**Replace `xxxx` with your actual Render backend service ID.**

### Step 2: Update Frontend Environment Variables (Vercel)

Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**:

**Update:**
```env
VITE_API_URL=https://hms-backend-xxxx.onrender.com
```

**Replace `xxxx` with your actual Render backend service ID.**

---

## 📋 Complete Backend Environment Variables (Render)

Copy and paste these into Render → Backend Service → Environment:

```env
# Database
DATABASE_URL=jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr

# Security
JWT_SECRET=YTJiM2M0ZDVlNmY3ZzhoOWkwajFrMmwzbTRuNW82cDdxOHI5czB0MXUydjN3NHg1eTZ6N2E4YjljMGQxZTJmM2c0aDVpNmo3
ENCRYPTION_KEY=HTC2024EncryptionKey32CharLong!

# URLs (UPDATED WITH YOUR FRONTEND URL)
FRONTEND_URL=https://renbo-hms.vercel.app
APP_BASE_URL=https://renbo-hms.vercel.app
VITE_API_URL=https://hms-backend-xxxx.onrender.com

# Hospital
HOSPITAL_NAME=Renbow Hospital
HOSPITAL_CODE=A287
HOSPITAL_SHORT_NAME=RENBOW
HOSPITAL_TAGLINE=Excellence in Healthcare
HOSPITAL_ADDRESS=200m North of Saidpur Kotwali, Near HR Restaurant, Saidpur - Ghazipur
HOSPITAL_PHONE=8528695991, 8090945179
HOSPITAL_EMAIL=info@rainbowhealthclinic.com
HOSPITAL_GSTIN=27AABCU3361R1Z5

# Payment
HOSPITAL_UPI_NAME=Rainbow Health Clinic
HOSPITAL_BANK_NAME=Axis Bank
HOSPITAL_BANK_ACCOUNT=0123456789012345
HOSPITAL_BANK_IFSC=AXIS0123456789

# Spring
SPRING_PROFILES_ACTIVE=prod

# Email
RESEND_API_KEY=resend-api-key
RESEND_FROM_EMAIL=noreply@hospital.com
RESEND_FROM_NAME=Hospital Management System
EMAIL_PREFER_RESEND=true

# SMTP Fallback
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=erxyeihfswrasgnw

# SMS
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=Rbf0s6OzhmgkDySZeKUL4NJ2rYAa9tF53ouI8PEqndlT7xjCHBSX4QcFw2HCyDtsmYpa8elUAhuiIdKJ

# JVM
JAVA_OPTS=-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC

# OTP
OTP_EXPIRY_MINUTES=10
OTP_COOLDOWN_SECONDS=60
OTP_MAX_DAILY_LIMIT=10
```

---

## 📋 Frontend Environment Variables (Vercel)

Go to **Vercel** → **Project Settings** → **Environment Variables**:

```env
VITE_API_URL=https://hms-backend-xxxx.onrender.com
VITE_APP_NAME=Hospital Management System
```

**⚠️ Important:** Replace `xxxx` with your actual Render backend URL.

---

## 🔄 After Updating Environment Variables

1. **Render Backend:**
   - Save environment variables
   - Service will auto-redeploy
   - Wait for deployment to complete (~5-10 minutes)

2. **Vercel Frontend:**
   - Save environment variables
   - Go to **Deployments** tab
   - Click **"Redeploy"** → **"Redeploy"** (to rebuild with new env vars)

3. **Verify:**
   - Frontend: https://renbo-hms.vercel.app/
   - Backend Health: `https://hms-backend-xxxx.onrender.com/actuator/health`
   - API Docs: `https://hms-backend-xxxx.onrender.com/swagger-ui.html`

---

## ✅ Verification Checklist

- [ ] Backend deployed on Render
- [ ] Backend environment variables set (especially URLs)
- [ ] Frontend environment variables updated in Vercel
- [ ] Frontend redeployed with new `VITE_API_URL`
- [ ] Backend health check passes
- [ ] Frontend can connect to backend API
- [ ] Test login/registration works

---

## 🆘 Troubleshooting

### Frontend Can't Connect to Backend

1. **Check** `VITE_API_URL` in Vercel matches backend URL
2. **Verify** backend is running (check Render logs)
3. **Check** CORS settings in backend
4. **Redeploy** frontend after updating env vars

### Backend Health Check Fails

1. **Check** Render logs for errors
2. **Verify** database connection (check `DATABASE_URL`)
3. **Check** all required environment variables are set
4. **Verify** backend service is running

### CORS Errors

1. **Update** `FRONTEND_URL` in backend env vars
2. **Redeploy** backend
3. **Check** backend logs for CORS configuration

---

## 📝 Notes

- **Frontend URL**: https://renbo-hms.vercel.app/ ✅
- **Backend URL**: Update once Render deployment completes
- **Database**: Neon PostgreSQL (shared with CMS)
- **Both services**: Free tier, no payment required

---

## 🔗 Quick Links

- **Frontend**: https://renbo-hms.vercel.app/
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Neon Database**: https://console.neon.tech
