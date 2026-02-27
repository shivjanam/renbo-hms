# 🔧 Fix: Backend Using H2 Instead of Neon PostgreSQL

## ⚠️ Problem

Your backend logs show it's using H2 in-memory database:
```
HMS-HikariPool - Added connection conn0: url=jdbc:h2:mem:hms_dev user=SA
H2 console available at '/h2-console'
```

**This means:** Backend is NOT using Neon PostgreSQL database.

---

## ✅ Solution: Set Environment Variables in Render

The backend needs `SPRING_PROFILES_ACTIVE=prod` to use Neon PostgreSQL.

### Step 1: Verify Environment Variables in Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your backend service** (`renbo-hms` or `hms-backend`)
3. **Click "Environment"** tab
4. **Check these REQUIRED variables:**

```env
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr
```

### Step 2: Add Missing Variables

If any are missing, add them:

1. **Click "Add Environment Variable"**
2. **Key**: `SPRING_PROFILES_ACTIVE`
3. **Value**: `prod`
4. **Click "Save Changes"**

**Repeat for:**
- `DATABASE_URL` (if missing)
- `DB_USERNAME` (if missing)
- `DB_PASSWORD` (if missing)

### Step 3: Redeploy

After adding variables:
1. **Render will auto-redeploy** (or manually trigger redeploy)
2. **Wait for deployment** (~5-10 minutes)
3. **Check logs** - should now show PostgreSQL connection

---

## ✅ Expected Logs (After Fix)

After setting `SPRING_PROFILES_ACTIVE=prod`, you should see:

```
HMS-HikariPool - Starting...
HMS-HikariPool - Added connection conn0: url=jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb
HMS-HikariPool - Start completed.
```

**NOT** `jdbc:h2:mem:hms_dev` ❌

---

## 🔍 How to Verify

### Check 1: Render Environment Variables

1. Go to Render → Backend Service → Environment
2. **Search for**: `SPRING_PROFILES_ACTIVE`
3. **Should be**: `prod`
4. **If missing or different**: Update it

### Check 2: Backend Logs

After redeploy, check logs for:
- ✅ `jdbc:postgresql://` (PostgreSQL)
- ❌ `jdbc:h2:mem:` (H2 - wrong!)

### Check 3: Database Connection

Visit backend health endpoint:
```
https://renbo-hms.onrender.com/actuator/health
```

Should return:
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP"
    }
  }
}
```

---

## 📋 Complete Required Variables Checklist

Make sure ALL these are set in Render:

- [ ] `SPRING_PROFILES_ACTIVE` = `prod` ⚠️ **CRITICAL**
- [ ] `DATABASE_URL` = `jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
- [ ] `DB_USERNAME` = `neondb_owner`
- [ ] `DB_PASSWORD` = `npg_hwjWHm01xMlr`
- [ ] `JWT_SECRET` = (your secret)
- [ ] `ENCRYPTION_KEY` = (your key)
- [ ] `FRONTEND_URL` = `https://renbo-hms.vercel.app`
- [ ] `APP_BASE_URL` = `https://renbo-hms.vercel.app`
- [ ] `VITE_API_URL` = `https://renbo-hms.onrender.com`

---

## 🚨 Common Issues

### Issue 1: SPRING_PROFILES_ACTIVE Not Set

**Symptom:** Using H2 database  
**Fix:** Add `SPRING_PROFILES_ACTIVE=prod` in Render

### Issue 2: Wrong Profile Value

**Symptom:** Using H2 database  
**Fix:** Check value is exactly `prod` (not `production`, `dev`, etc.)

### Issue 3: DATABASE_URL Not Set

**Symptom:** Connection errors  
**Fix:** Add `DATABASE_URL` with Neon connection string

### Issue 4: Variables Not Applied

**Symptom:** Still using H2 after adding variables  
**Fix:** 
1. Save environment variables
2. Manually trigger redeploy
3. Wait for deployment to complete

---

## 📝 Quick Fix Steps

1. **Open Render Dashboard**
2. **Go to Backend Service → Environment**
3. **Add/Update:**
   ```
   SPRING_PROFILES_ACTIVE=prod
   ```
4. **Verify:**
   ```
   DATABASE_URL=jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   DB_USERNAME=neondb_owner
   DB_PASSWORD=npg_hjWHm01xMlr
   ```
5. **Save Changes**
6. **Wait for redeploy** (~5-10 min)
7. **Check logs** - should show PostgreSQL connection

---

## 🔗 Reference Files

- **Complete variables**: See `backend.env` file
- **Upload guide**: See `RENDER_ENV_UPLOAD.md`
- **Environment guide**: See `ENVIRONMENT_VARIABLES.md`

---

## ✅ After Fix

Once `SPRING_PROFILES_ACTIVE=prod` is set:

1. ✅ Backend will use Neon PostgreSQL
2. ✅ Tables will be created automatically (if not exist)
3. ✅ Data will persist (not lost on restart)
4. ✅ H2 console will be disabled
5. ✅ Production-ready configuration

---

## 🆘 Still Not Working?

1. **Check Render logs** for errors
2. **Verify** all environment variables are saved
3. **Check** variable names are exact (case-sensitive)
4. **Verify** no extra spaces in values
5. **Redeploy** manually after adding variables
6. **Check** Neon database is accessible

---

## 📊 Database Profile Comparison

| Profile | Database | Use Case |
|---------|----------|----------|
| **Default** | H2 (in-memory) | Development only |
| **dev** | H2 (in-memory) | Development only |
| **prod** | PostgreSQL (Neon) | Production ✅ |
| **mysql** | MySQL | Alternative production |

**You need:** `SPRING_PROFILES_ACTIVE=prod` ✅
