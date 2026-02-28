# Fix: Database "hms_db" Does Not Exist

## ❌ Error

```
ERROR: database "hms_db" does not exist
```

## 🔍 Problem

Your `DATABASE_URL` in Render is pointing to `hms_db`, but that database doesn't exist in Neon.

**Your connection string shows:**
```
postgresql://...@ep-wild-morning-a1n1jvf0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

**Database name in connection string:** `neondb` (not `hms_db`)

---

## ✅ Solution Options

### Option 1: Use Existing Database `neondb` (Quick Fix)

Update Render environment variable to use `neondb`:

```env
DATABASE_URL=jdbc:postgresql://ep-wild-morning-a1n1jvf0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr
SPRING_PROFILES_ACTIVE=prod
```

**Note:** This will use the existing `neondb` database. If it has CMS tables, you'll need to drop them first using `DROP_CMS_TABLES.sql`.

---

### Option 2: Create New Database `hms_db` (Recommended)

If you want a separate `hms_db` database:

1. **Go to Neon Dashboard**: https://console.neon.tech
2. **Select your project**
3. **Click "Branches"** → **"Create Branch"**
4. **Configure:**
   - **Parent branch**: Select `production` (or your main branch)
   - **Branch name**: `hms_db`
   - **Data option**: Select **"Schema only (Beta)"**
5. **Click "Create"**
6. **After creation**, Neon will show a new connection string
7. **Copy the new connection string** and update Render

**New connection string will look like:**
```
postgresql://neondb_owner:password@ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
```

**Then update Render:**
```env
DATABASE_URL=jdbc:postgresql://ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=your_password
SPRING_PROFILES_ACTIVE=prod
```

---

## 🎯 Quick Fix (Use Existing Database)

**Immediate fix** - Update Render environment variable:

1. **Go to**: https://dashboard.render.com
2. **Select** your backend service (`renbo-hms`)
3. **Click** "Environment" tab
4. **Find** `DATABASE_URL`
5. **Change** from:
   ```
   jdbc:postgresql://.../hms_db?sslmode=require
   ```
   **To:**
   ```
   jdbc:postgresql://ep-wild-morning-a1n1jvf0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
6. **Click** "Save Changes"
7. **Backend will redeploy** automatically

---

## 📋 Complete Environment Variables (Quick Fix)

```env
DATABASE_URL=jdbc:postgresql://ep-wild-morning-a1n1jvf0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr
SPRING_PROFILES_ACTIVE=prod
```

---

## ⚠️ Important: Clean Database First

If using `neondb` and it has CMS tables:

1. **Go to Neon Dashboard** → Select `neondb` database
2. **Open SQL Editor**
3. **Run** `DROP_CMS_TABLES.sql` to remove CMS tables
4. **Then** update Render with `neondb` connection
5. **Backend will create** HMS tables automatically

---

## 🔍 How to Verify Database Name

1. **Go to Neon Dashboard**: https://console.neon.tech
2. **Select your project**
3. **Click on a branch/database**
4. **Check connection string** - database name is after `/` and before `?`
   - Example: `.../neondb?sslmode=require` → database name is `neondb`
   - Example: `.../hms_db?sslmode=require` → database name is `hms_db`

---

## ✅ After Fix

Once you update the `DATABASE_URL` with the correct database name, you should see:

**Success logs:**
```
HMS-HikariPool - Starting...
HMS-HikariPool - Start completed.
HHH000412: Hibernate ORM core version 6.4.1.Final
Initializing sample data...
Created 5 hospitals
```

**No more errors!** ✅

---

## 📚 Related Files

- `RENDER_ENV_FOR_NEW_DB.md` - Environment variables guide
- `DROP_CMS_TABLES.sql` - Script to clean CMS tables
- `CREATE_FRESH_HMS_DATABASE.md` - Guide to create new database

---

**Quick Action:** Update `DATABASE_URL` in Render to use `neondb` instead of `hms_db` ✅
