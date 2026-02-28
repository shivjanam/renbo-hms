# Quick Migration Steps - Delete HMS Tables & Create New DB

## ⚡ Quick Reference

### Step 1: Drop HMS Tables (2 minutes)

1. **Neon Dashboard** → Current Database → SQL Editor
2. **Copy/paste** `DROP_HMS_TABLES.sql`
3. **Execute**
4. **Verify**: Only CMS tables remain

---

### Step 2: Create New Database (1 minute)

1. **Neon Dashboard** → Create Branch/Database
2. **Name**: `hms_db`
3. **Copy connection string**

---

### Step 3: Update Render (2 minutes)

1. **Render Dashboard** → Backend → Environment
2. **Update**:
   - `DATABASE_URL` → new connection string
   - `DB_USERNAME` → new username
   - `DB_PASSWORD` → new password
3. **Save** → Auto-redeploys

---

### Step 4: Wait & Verify (5-10 minutes)

1. **Wait** for backend deployment
2. **Check logs** for "Initializing sample data..."
3. **Verify** in Neon SQL Editor:
   ```sql
   SELECT COUNT(*) FROM hospitals;  -- Should be 5
   SELECT COUNT(*) FROM doctors;     -- Should be 50
   SELECT COUNT(*) FROM patients;    -- Should be 60
   ```

---

## ✅ Done!

**Default Login:**
- Email: `admin@hms.com`
- Password: `Admin@123`

---

**See `CLEAN_MIGRATION_GUIDE.md` for detailed steps.**
