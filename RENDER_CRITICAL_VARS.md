# ⚠️ CRITICAL: These Environment Variables MUST Be Set in Render

## 🚨 Most Important Variable

**`SPRING_PROFILES_ACTIVE=prod`**

**Without this, backend uses H2 in-memory database (data lost on restart)!**

---

## ✅ Minimum Required Variables for Neon PostgreSQL

Copy these EXACTLY into Render → Backend Service → Environment:

```env
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr
```

---

## 📋 Quick Copy-Paste for Render

### Step 1: Go to Render Dashboard
https://dashboard.render.com → Your Backend Service → Environment

### Step 2: Add These 4 Variables (Minimum)

**Variable 1:**
- Key: `SPRING_PROFILES_ACTIVE`
- Value: `prod`

**Variable 2:**
- Key: `DATABASE_URL`
- Value: `jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`

**Variable 3:**
- Key: `DB_USERNAME`
- Value: `neondb_owner`

**Variable 4:**
- Key: `DB_PASSWORD`
- Value: `npg_hwjWHm01xMlr`

### Step 3: Save and Redeploy

1. Click **"Save Changes"**
2. Service will auto-redeploy
3. Wait ~5-10 minutes
4. Check logs - should show PostgreSQL connection

---

## ✅ Verification

After redeploy, check logs for:

**✅ CORRECT (PostgreSQL):**
```
HMS-HikariPool - Added connection conn0: url=jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler...
```

**❌ WRONG (H2 - data will be lost):**
```
HMS-HikariPool - Added connection conn0: url=jdbc:h2:mem:hms_dev
```

---

## 🔗 Complete Variables

For all variables, see `backend.env` file.

---

## ⚠️ Why This Matters

- **Without `SPRING_PROFILES_ACTIVE=prod`**: Uses H2, data lost on restart
- **With `SPRING_PROFILES_ACTIVE=prod`**: Uses Neon PostgreSQL, data persists ✅
