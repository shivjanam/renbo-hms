# Environment Variables Guide - HMS

Complete list of all environment variables needed for HMS deployment.

---

## 🔐 Required Environment Variables

### Database Configuration

```env
DATABASE_URL=jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr
```

### Security & Authentication

```env
JWT_SECRET=YTJiM2M0ZDVlNmY3ZzhoOWkwajFrMmwzbTRuNW82cDdxOHI5czB0MXUydjN3NHg1eTZ6N2E4YjljMGQxZTJmM2c0aDVpNmo3
ENCRYPTION_KEY=HTC2024EncryptionKey32CharLong!
```

### Application URLs

```env
FRONTEND_URL=https://renbo-hms.vercel.app
APP_BASE_URL=https://renbo-hms.vercel.app
VITE_API_URL=https://renbo-hms.onrender.com
VITE_APP_NAME=Hospital Management System
```

**✅ Deployed URLs:**
- `FRONTEND_URL` → https://renbo-hms.vercel.app ✅
- `APP_BASE_URL` → https://renbo-hms.vercel.app ✅
- `VITE_API_URL` → https://renbo-hms.onrender.com ✅

### Hospital Configuration

```env
HOSPITAL_NAME=Hi-Tech Computer Hospital
HOSPITAL_CODE=A287
HOSPITAL_SHORT_NAME=HTC
HOSPITAL_TAGLINE=Excellence in Healthcare
HOSPITAL_ADDRESS=
HOSPITAL_PHONE=
HOSPITAL_EMAIL=
HOSPITAL_GSTIN=
```

### Spring Profile

```env
SPRING_PROFILES_ACTIVE=prod
```

---

## 📧 Email Configuration

### Option 1: Resend API (Recommended)

```env
RESEND_API_KEY=your-resend-api-key-here
RESEND_FROM_EMAIL=noreply@hospital.com
RESEND_FROM_NAME=Hospital Management System
EMAIL_PREFER_RESEND=true
```

**Get Resend API Key:**
1. Go to https://resend.com
2. Sign up/login
3. Go to API Keys
4. Create new API key
5. Copy and use in `RESEND_API_KEY`

### Option 2: SMTP (Gmail)

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=erxyeihfswrasgnw
EMAIL_PREFER_RESEND=false
```

**Gmail Setup:**
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password in `MAIL_PASSWORD`

---

## 📱 SMS Configuration

```env
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=Rbf0s6OzhmgkDySZeKUL4NJ2rYAa9tF53ouI8PEqndlT7xjCHBSX4QcFw2HCyDtsmYpa8elUAhuiIdKJ
```

**Fast2SMS Setup:**
1. Go to https://www.fast2sms.com
2. Sign up/login
3. Get API key from dashboard
4. Use in `FAST2SMS_API_KEY`

---

## 💳 Payment Configuration (Optional)

### Razorpay

```env
RAZORPAY_ENABLED=false
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
```

**Enable Razorpay:**
1. Set `RAZORPAY_ENABLED=true`
2. Get keys from https://dashboard.razorpay.com
3. Configure webhook URL in Razorpay dashboard

### UPI/Bank Details

```env
HOSPITAL_UPI_ID=
HOSPITAL_UPI_NAME=
HOSPITAL_BANK_NAME=
HOSPITAL_BANK_ACCOUNT=
HOSPITAL_BANK_IFSC=
```

---

## ⚙️ OTP Settings

```env
OTP_EXPIRY_MINUTES=10
OTP_COOLDOWN_SECONDS=60
OTP_MAX_DAILY_LIMIT=10
```

---

## 🖥️ JVM Options (Backend)

```env
JAVA_OPTS=-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC
```

---

## 📋 Complete Environment Variables List

### For Backend (Render)

```env
# Database
DATABASE_URL=jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr

# Security
JWT_SECRET=YTJiM2M0ZDVlNmY3ZzhoOWkwajFrMmwzbTRuNW82cDdxOHI5czB0MXUydjN3NHg1eTZ6N2E4YjljMGQxZTJmM2c0aDVpNmo3
ENCRYPTION_KEY=HTC2024EncryptionKey32CharLong!

# URLs (Update after deployment)
FRONTEND_URL=https://your-app.vercel.app
APP_BASE_URL=https://your-app.vercel.app
VITE_API_URL=https://hms-backend-xxxx.onrender.com

# Hospital
HOSPITAL_NAME=Hi-Tech Computer Hospital
HOSPITAL_CODE=A287
HOSPITAL_SHORT_NAME=HTC

# Spring
SPRING_PROFILES_ACTIVE=prod

# Email (Choose one)
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@hospital.com
EMAIL_PREFER_RESEND=true
# OR
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=erxyeihfswrasgnw

# SMS
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=Rbf0s6OzhmgkDySZeKUL4NJ2rYAa9tF53ouI8PEqndlT7xjCHBSX4QcFw2HCyDtsmYpa8elUAhuiIdKJ

# JVM
JAVA_OPTS=-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC
```

### For Frontend (Vercel)

```env
VITE_API_URL=https://renbo-hms.onrender.com
VITE_APP_NAME=Hospital Management System
```

---

## 🔧 How to Set in Render

1. **Go to Render Dashboard**
2. **Select your backend service**
3. **Click "Environment"** tab
4. **Click "Add Environment Variable"**
5. **Enter Key and Value**
6. **Click "Save Changes"**
7. **Service will auto-redeploy**

---

## 🔧 How to Set in Vercel

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add variables:**
   - Key: `VITE_API_URL`
   - Value: Your backend URL
5. **Redeploy** (or it auto-redeploys)

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Database connection works
- [ ] Backend health check passes (`/actuator/health`)
- [ ] Frontend can connect to backend
- [ ] Environment variables are set correctly
- [ ] URLs are updated (frontend ↔ backend)
- [ ] Email/SMS services configured (if using)

---

## 🆘 Troubleshooting

### Backend Can't Connect to Database

1. **Check** `DATABASE_URL` format
2. **Verify** SSL mode (`sslmode=require`)
3. **Check** Neon dashboard - database is active
4. **Verify** credentials are correct

### Frontend Can't Connect to Backend

1. **Check** `VITE_API_URL` in Vercel
2. **Verify** backend URL is correct
3. **Check** CORS settings in backend
4. **Verify** backend is running

### Environment Variables Not Working

1. **Redeploy** service after adding variables
2. **Check** variable names (case-sensitive)
3. **Verify** no extra spaces in values
4. **Check** logs for errors

---

## 📝 Notes

- **Never commit** `.env` file to git (already in `.gitignore`)
- **Use secrets** in production platforms
- **Update URLs** after first deployment
- **Test** each service after configuration
- **Monitor logs** for any errors

---

## 🔗 Quick Links

- **Neon Dashboard**: https://console.neon.tech
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Resend**: https://resend.com
- **Fast2SMS**: https://www.fast2sms.com
