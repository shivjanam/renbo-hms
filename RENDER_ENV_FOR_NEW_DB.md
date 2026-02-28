# Render Environment Variables for New HMS Database

## 🔗 Connection String Parsed

**Your Neon Connection String:**
```
postgresql://neondb_owner:npg_hwjWHm01xMlr@ep-wild-morning-a1n1jvf0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Parsed Components:**
- **Host**: `ep-wild-morning-a1n1jvf0-pooler.ap-southeast-1.aws.neon.tech`
- **Database**: `neondb` (or `hms_db` if you created new branch)
- **Username**: `neondb_owner`
- **Password**: `npg_hwjWHm01xMlr`
- **SSL Mode**: `require`

---

## ✅ Render Environment Variables

Go to **Render Dashboard** → **Your Backend Service** → **Environment** tab

### Update These Variables:

```env
DATABASE_URL=jdbc:postgresql://ep-wild-morning-a1n1jvf0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr
SPRING_PROFILES_ACTIVE=prod
```

---

## 📝 Step-by-Step in Render

1. **Go to**: https://dashboard.render.com
2. **Select** your backend service (`renbo-hms`)
3. **Click** "Environment" tab
4. **Find** these variables:
   - `DATABASE_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
5. **Update** each one with the values above
6. **Click** "Save Changes"
7. **Backend will auto-redeploy** (~5-10 minutes)

---

## ⚠️ Important Notes

### If You Created New Branch `hms_db`:

If you created a new branch named `hms_db`, update the database name:

```env
DATABASE_URL=jdbc:postgresql://ep-wild-morning-a1n1jvf0-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr
SPRING_PROFILES_ACTIVE=prod
```

**Change**: `neondb` → `hms_db` in the DATABASE_URL

---

## 🔍 How to Get Correct Database Name

1. **Go to Neon Dashboard**: https://console.neon.tech
2. **Select** your project
3. **Click** on the branch/database you created
4. **Check** the connection string shown
5. **Extract** the database name (after the `/` and before `?`)

**Example:**
- Connection string: `.../hms_db?sslmode=require`
- Database name: `hms_db`

---

## ✅ Complete Environment Variables List

Here are **all** the environment variables you should have in Render:

```env
# Database Configuration (New HMS Database)
DATABASE_URL=jdbc:postgresql://ep-wild-morning-a1n1jvf0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr

# Spring Profile (CRITICAL - must be prod)
SPRING_PROFILES_ACTIVE=prod

# JWT & Security
JWT_SECRET=YTJiM2M0ZDVlNmY3ZzhoOWkwajFrMmwzbTRuNW82cDdxOHI5czB0MXUydjN3NHg1eTZ6N2E4YjljMGQxZTJmM2c0aDVpNmo3
ENCRYPTION_KEY=HTC2024EncryptionKey32CharLong!

# Application URLs
FRONTEND_URL=https://renbo-hms.vercel.app
APP_BASE_URL=https://renbo-hms.vercel.app
VITE_API_URL=https://renbo-hms.onrender.com
VITE_APP_NAME=Hospital Management System

# Hospital Configuration
HOSPITAL_NAME=Renbow Hospital
HOSPITAL_CODE=A287
HOSPITAL_SHORT_NAME=RENBOW
HOSPITAL_TAGLINE=Excellence in Healthcare
HOSPITAL_ADDRESS=200m North of Saidpur Kotwali, Near HR Restaurant, Saidpur - Ghazipur
HOSPITAL_PHONE=8528695991, 8090945179
HOSPITAL_EMAIL=info@rainbowhealthclinic.com
HOSPITAL_GSTIN=27AABCU3361R1Z5

# Hospital Branding
HOSPITAL_LOGO_URL=https://cdn-icons-gif.flaticon.com/19011/19011419.gif
HOSPITAL_FAVICON_URL=https://cdn-icons-gif.flaticon.com/19011/19011419.gif

# Payment Configuration
HOSPITAL_UPI_ID=
HOSPITAL_UPI_NAME=Rainbow Health Clinic
HOSPITAL_BANK_NAME=Axis Bank
HOSPITAL_BANK_ACCOUNT=0123456789012345
HOSPITAL_BANK_IFSC=AXIS0123456789

# Razorpay (Optional)
RAZORPAY_ENABLED=false
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Email Configuration (Resend - Preferred)
RESEND_API_KEY=resend-api-key
RESEND_FROM_EMAIL=noreply@hospital.com
RESEND_FROM_NAME=Hospital Management System
EMAIL_PREFER_RESEND=true

# SMTP Fallback (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=erxyeihfswrasgnw

# SMS Configuration (Fast2SMS)
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=Rbf0s6OzhmgkDySZeKUL4NJ2rYAa9tF53ouI8PEqndlT7xjCHBSX4QcFw2HCyDtsmYpa8elUAhuiIdKJ

# OTP Settings
OTP_EXPIRY_MINUTES=10
OTP_COOLDOWN_SECONDS=60
OTP_MAX_DAILY_LIMIT=10

# JVM Options (Optimized for Render Free Tier)
JAVA_OPTS=-XX:+UseContainerSupport -XX:MaxRAMPercentage=50.0 -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+UseStringDeduplication -Xmx256m -Xms128m -Djava.security.egd=file:/dev/./urandom
```

---

## 🎯 Quick Copy-Paste (Just Database Variables)

If you only want to update the database connection:

```env
DATABASE_URL=jdbc:postgresql://ep-wild-morning-a1n1jvf0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr
SPRING_PROFILES_ACTIVE=prod
```

---

## ✅ Verification

After updating and redeploying, check Render logs for:

**Success indicators:**
```
HMS-HikariPool - Starting...
HMS-HikariPool - Start completed.
HHH000412: Hibernate ORM core version 6.4.1.Final
Initializing sample data...
Created 5 hospitals
Created 60 departments
Created admin users
Created 50 doctors
Created 60 patients
```

**Error indicators:**
```
Connection refused
Authentication failed
Database does not exist
```

---

## 🆘 Troubleshooting

### Connection Failed

**Check:**
- ✅ Database name is correct (`neondb` or `hms_db`)
- ✅ Username/password are correct
- ✅ SSL mode is `require`
- ✅ Host address is correct

### Wrong Database

**If you see CMS tables instead of HMS tables:**
- Check database name in `DATABASE_URL`
- Verify you're connected to the correct Neon branch
- Ensure `SPRING_PROFILES_ACTIVE=prod` is set

### Tables Not Created

**Check:**
- ✅ `SPRING_PROFILES_ACTIVE=prod` is set
- ✅ Backend logs show Hibernate creating tables
- ✅ No connection errors in logs

---

## 📚 Related Files

- `backend.env` - Complete environment variables template
- `RENDER_ENV_UPLOAD.md` - How to upload env vars to Render
- `CLEAN_MIGRATION_GUIDE.md` - Complete migration guide

---

**After updating these variables, your backend will connect to the new HMS database!** ✅
