# ✅ Final Configuration - HMS Deployment

## 🎉 Deployment Complete!

Both services are now deployed and running:

### ✅ Frontend (Vercel)
- **URL**: https://renbo-hms.vercel.app/
- **Status**: Live ✅

### ✅ Backend (Render)
- **URL**: https://renbo-hms.onrender.com
- **Status**: Live ✅
- **Health Check**: https://renbo-hms.onrender.com/actuator/health
- **API Docs**: https://renbo-hms.onrender.com/swagger-ui.html

---

## 🔧 Final Configuration Steps

### 1. Update Backend Environment Variables (Render)

Go to **Render Dashboard** → **Backend Service** → **Environment** tab:

**Set these URLs:**
```env
FRONTEND_URL=https://renbo-hms.vercel.app
APP_BASE_URL=https://renbo-hms.vercel.app
VITE_API_URL=https://renbo-hms.onrender.com
```

**Complete Backend Environment Variables:**
```env
# Database
DATABASE_URL=jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr

# Security
JWT_SECRET=YTJiM2M0ZDVlNmY3ZzhoOWkwajFrMmwzbTRuNW82cDdxOHI5czB0MXUydjN3NHg1eTZ6N2E4YjljMGQxZTJmM2c0aDVpNmo3
ENCRYPTION_KEY=HTC2024EncryptionKey32CharLong!

# URLs
FRONTEND_URL=https://renbo-hms.vercel.app
APP_BASE_URL=https://renbo-hms.vercel.app
VITE_API_URL=https://renbo-hms.onrender.com

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

### 2. Update Frontend Environment Variables (Vercel)

Go to **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

```env
VITE_API_URL=https://renbo-hms.onrender.com
VITE_APP_NAME=Hospital Management System
```

**Then Redeploy:**
- Go to **Deployments** tab
- Click **"Redeploy"** → **"Redeploy"** (to rebuild with new env vars)

---

## ✅ Verification Checklist

After updating environment variables:

- [ ] Backend environment variables updated in Render
- [ ] Frontend environment variables updated in Vercel
- [ ] Frontend redeployed on Vercel
- [ ] Backend health check: https://renbo-hms.onrender.com/actuator/health
- [ ] API docs accessible: https://renbo-hms.onrender.com/swagger-ui.html
- [ ] Frontend can connect to backend (test login/registration)
- [ ] CORS working (no CORS errors in browser console)

---

## 🔗 Quick Links

- **Frontend**: https://renbo-hms.vercel.app/
- **Backend API**: https://renbo-hms.onrender.com
- **Backend Health**: https://renbo-hms.onrender.com/actuator/health
- **API Documentation**: https://renbo-hms.onrender.com/swagger-ui.html
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Neon Database**: https://console.neon.tech

---

## 🧪 Test Your Deployment

1. **Frontend**: Visit https://renbo-hms.vercel.app/
2. **Backend Health**: Visit https://renbo-hms.onrender.com/actuator/health
   - Should return: `{"status":"UP"}`
3. **API Docs**: Visit https://renbo-hms.onrender.com/swagger-ui.html
4. **Test Registration**: Try registering a new patient
5. **Test Login**: Try logging in with credentials

---

## 🆘 Troubleshooting

### Backend Health Check Fails

1. Check Render logs for errors
2. Verify database connection
3. Check all environment variables are set
4. Verify `SPRING_PROFILES_ACTIVE=prod`

### Frontend Can't Connect to Backend

1. Check `VITE_API_URL` in Vercel matches backend URL
2. Verify backend is running (check Render logs)
3. Check browser console for CORS errors
4. Redeploy frontend after updating env vars

### CORS Errors

1. Update `FRONTEND_URL` in backend env vars
2. Redeploy backend
3. Clear browser cache
4. Check backend logs for CORS configuration

---

## 📊 Database Access

**Neon Database:**
- **Host**: ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech
- **Database**: neondb
- **Username**: neondb_owner
- **Password**: npg_hwjWHm01xMlr

**Access Methods:**
1. **Neon Dashboard**: https://console.neon.tech
2. **SQL Editor**: Run queries directly
3. **Check Tables**: See `NEON_DATABASE_GUIDE.md`

---

## 🎯 Summary

✅ **Frontend**: https://renbo-hms.vercel.app/ (Vercel - Free Tier)  
✅ **Backend**: https://renbo-hms.onrender.com (Render - Free Tier)  
✅ **Database**: Neon PostgreSQL (Free Tier)  
✅ **Total Cost**: $0/month 🎉

**Next Steps:**
1. Update environment variables (see above)
2. Redeploy frontend on Vercel
3. Test the application
4. Check database tables in Neon

Your Hospital Management System is now live! 🚀
