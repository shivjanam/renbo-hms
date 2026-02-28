# Get Connection String for hms_db Branch

## ✅ Confirmed: hms_db Branch Exists

Your Neon dashboard shows:
- ✅ **Branch**: `hms_db`
- ✅ **Status**: Active (green dot)
- ✅ **Type**: Schema-only
- ✅ **Storage**: 32.26 MB

---

## 🔗 Get Connection String for hms_db

### Step 1: Open hms_db Branch

1. **Go to Neon Dashboard**: https://console.neon.tech
2. **Select** your project (`htc-cms`)
3. **Click** on the **`hms_db`** branch name in the branches list

### Step 2: Get Connection String

After clicking `hms_db`, you'll see:
- **Connection Details** section
- **Connection String** (PostgreSQL format)
- **JDBC Connection String** (if available)

**Look for:**
```
postgresql://neondb_owner:password@ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
```

**Or JDBC format:**
```
jdbc:postgresql://ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
```

### Step 3: Copy Connection Details

**You need:**
- **Host**: `ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech`
- **Database**: `hms_db`
- **Username**: Usually `neondb_owner`
- **Password**: (from connection string)

---

## 📝 Update Render Environment Variables

Once you have the `hms_db` connection string:

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select** your backend service (`renbo-hms`)
3. **Click** "Environment" tab
4. **Update** `DATABASE_URL`:

```env
DATABASE_URL=jdbc:postgresql://ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=your_password_from_connection_string
SPRING_PROFILES_ACTIVE=prod
```

**Replace:**
- `ep-xxxxx-pooler...` with actual host from `hms_db` connection string
- `your_password_from_connection_string` with actual password

---

## 🔍 Where to Find Connection String in Neon

**Option 1: Branch Details Page**
1. Click on `hms_db` branch name
2. Look for "Connection Details" or "Connection String" section
3. Copy the connection string

**Option 2: Connection String Button**
1. Click on `hms_db` branch
2. Look for "Connection String" button or link
3. Click to reveal connection details
4. Copy the JDBC format if available

**Option 3: Settings/Connection**
1. Click on `hms_db` branch
2. Go to "Settings" or "Connection" tab
3. Find connection string there

---

## ⚠️ Important Notes

### Different Host for hms_db

The `hms_db` branch might have a **different host** than `production`:
- `production`: `ep-wild-morning-a1n1jvf0-pooler.ap-southeast-1.aws.neon.tech`
- `hms_db`: `ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech` (might be different!)

**Always use the connection string from the specific branch you want to connect to.**

### Database Name

Make sure the connection string shows:
- Database: `hms_db` (not `neondb`)

---

## ✅ Expected Connection String Format

**PostgreSQL format:**
```
postgresql://neondb_owner:password@ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
```

**JDBC format (for Render):**
```
jdbc:postgresql://ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
```

---

## 🎯 Quick Steps Summary

1. ✅ **Neon Dashboard** → Click `hms_db` branch
2. ✅ **Copy connection string** for `hms_db`
3. ✅ **Extract** host, database name, username, password
4. ✅ **Update Render** `DATABASE_URL` with `hms_db` connection
5. ✅ **Save** and wait for redeploy

---

## 🆘 If You Can't Find Connection String

**Alternative: Use Neon SQL Editor**

1. **Click** on `hms_db` branch
2. **Open** "SQL Editor"
3. **Check** the connection details shown in SQL Editor
4. **Or** look at the URL - it might show connection info

**Or check Neon documentation:**
- Each branch has its own connection string
- Usually shown in branch details page
- Format: `postgresql://user:pass@host/database?sslmode=require`

---

**Once you have the `hms_db` connection string, update Render and the error will be fixed!** ✅
