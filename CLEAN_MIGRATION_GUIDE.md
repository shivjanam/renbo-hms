# Clean Migration Guide: Delete HMS Tables → Create New DB → Initialize Sample Data

## 🎯 Goal

1. **Delete all HMS tables** from existing database (they have no data)
2. **Create new Neon database** specifically for HMS
3. **Initialize with sample data** automatically via `DataInitializer`

---

## ✅ Prerequisites

- Access to Neon Dashboard: https://console.neon.tech
- Access to Render Dashboard: https://dashboard.render.com
- SQL Editor access (Neon SQL Editor or psql)

---

## 📋 Step-by-Step Process

### Step 1: Drop HMS Tables from Existing Database

**⚠️ WARNING:** This permanently deletes HMS tables. Since they have no data, this is safe.

1. **Go to Neon Dashboard** → Select your **current database** (the one with CMS + HMS tables)
2. **Open SQL Editor**
3. **Copy and paste** the contents of `DROP_HMS_TABLES.sql`
4. **Review** the script - it drops only HMS tables, keeps CMS tables
5. **Execute** the script
6. **Verify** - Should see only CMS tables remaining

**Expected Result:**
- ✅ HMS tables deleted (patients, doctors, hospitals, etc.)
- ✅ CMS tables remain (students, courses, faculty, etc.)
- ✅ Shared tables remain (users, audit_logs, etc.)

---

### Step 2: Create New Neon Database Branch for HMS

1. **Go to Neon Dashboard**: https://console.neon.tech
2. **Select your project**
3. **Click "Branches"** in left sidebar
4. **Click "Create Branch"** button
5. **In the "Create new branch" dialog:**

   **Parent branch:**
   - Select your main branch (usually `production` or `main`)
   
   **Branch name:**
   - Enter: `hms_db` (or `hospital_management_db`)
   - This will be your new HMS database name
   
   **Automatically delete branch after:**
   - ⚠️ **Leave unchecked** (for permanent database)
   - Only check if you want a temporary branch
   
   **Data Inclusion Options:**
   - ⭐ **IMPORTANT: Select "Schema only (Beta)"** 
   - ✅ This creates a clean database with table structures but **no data**
   - ✅ Perfect for initializing with HMS sample data via `DataInitializer`
   - ✅ Shows remaining space (e.g., "536.87 MB remaining space")
   
   **DO NOT SELECT:**
   - ❌ "Current data" - Would copy all CMS + HMS data (not what we want!)
   - ❌ "Past data" - Would copy historical data
   - ❌ "Anonymized data" - For testing with masked data
   
6. **Click "Create"** button (black button at bottom)
7. **Copy connection string** - Neon will show it after creation

**Example Connection String:**
```
postgresql://neondb_owner:password@ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
```

**JDBC Format:**
```
jdbc:postgresql://ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
```

---

### Step 3: Update Render Backend Environment Variables

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your backend service** (`renbo-hms`)
3. **Go to "Environment"** tab
4. **Update these variables:**

```env
DATABASE_URL=jdbc:postgresql://ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=your_new_password_here
SPRING_PROFILES_ACTIVE=prod
```

5. **Click "Save Changes"**
6. **Backend will auto-redeploy** (~5-10 minutes)

---

### Step 4: Verify Sample Data Initialization

The `DataInitializer.java` will **automatically** create sample data when:
- Database is empty (checks `userRepository.count() > 0`)
- Backend starts successfully
- Database connection works

**What gets created automatically:**
- ✅ **5 Hospitals** (City General, Apollo, Fortis, Max, Medanta)
- ✅ **60 Departments** (12 per hospital)
- ✅ **6 Admin Users** (1 super admin + 5 hospital admins)
- ✅ **50 Doctors** (10 per hospital)
- ✅ **Doctor Schedules** (for all doctors)
- ✅ **60 Patients** (12 per hospital)

**Total: 180+ records created automatically!**

---

### Step 5: Check Backend Logs

After deployment, check Render logs:

**Look for:**
```
Initializing sample data...
Created 5 hospitals
Created 60 departments
Created admin users
Created 50 doctors
Created doctor schedules
Created 60 patients
Sample data initialization completed successfully!
```

**If you see:**
```
Database already initialized, skipping data initialization
```
This means data already exists. If you want fresh data, drop tables first.

---

### Step 6: Verify in Neon Database

1. **Go to Neon Dashboard** → Select `hms_db`
2. **Open SQL Editor**
3. **Run verification queries:**

```sql
-- Count tables
SELECT COUNT(*) as hms_tables_count
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check hospitals
SELECT COUNT(*) as hospitals_count FROM hospitals;

-- Check doctors
SELECT COUNT(*) as doctors_count FROM doctors;

-- Check patients
SELECT COUNT(*) as patients_count FROM patients;

-- Check departments
SELECT COUNT(*) as departments_count FROM departments;

-- Sample data
SELECT id, name, hospital_code FROM hospitals LIMIT 5;
SELECT id, first_name, last_name, primary_specialization FROM doctors LIMIT 5;
SELECT id, first_name, last_name, uhid FROM patients LIMIT 5;
```

**Expected Results:**
- ✅ ~30+ HMS tables created
- ✅ 5 hospitals
- ✅ 50 doctors
- ✅ 60 patients
- ✅ 60 departments

---

## 🔐 Default Login Credentials

After initialization, you can login with:

**Super Admin:**
- **Email**: `admin@hms.com`
- **Password**: `Admin@123`
- **Role**: SUPER_ADMIN

**Hospital Admins:**
- **Email**: `admin@cgh001.com` (or `admin@apollo.com`, etc.)
- **Password**: `Admin@123`
- **Role**: HOSPITAL_ADMIN

**Doctors:**
- **Email**: `dr.rajesh.kumar@cgh001.com` (or similar)
- **Password**: `Doctor@123`
- **Role**: DOCTOR

---

## 🎯 Summary

| Step | Action | Result |
|------|--------|--------|
| 1 | Drop HMS tables | ✅ Only CMS tables remain in old DB |
| 2 | Create new Neon DB | ✅ Clean `hms_db` database created |
| 3 | Update Render env vars | ✅ Backend connects to new DB |
| 4 | Backend redeploys | ✅ Tables created automatically |
| 5 | DataInitializer runs | ✅ 180+ sample records created |
| 6 | Verify data | ✅ All tables populated |

---

## 🆘 Troubleshooting

### Tables Not Dropped

**Error**: Foreign key constraint violations

**Solution**: The script uses `CASCADE` to handle dependencies. If issues persist:
```sql
-- Drop with CASCADE explicitly
DROP TABLE IF EXISTS table_name CASCADE;
```

### Backend Not Connecting to New DB

**Check:**
- ✅ Connection string format is correct
- ✅ Username/password are correct
- ✅ Database name matches
- ✅ SSL mode is `require`
- ✅ Network allows connections

### Sample Data Not Created

**Possible reasons:**
1. Database already has data (check `users` table)
2. `DataInitializer` failed (check logs)
3. Database connection failed

**Solution:**
```sql
-- Check if users exist
SELECT COUNT(*) FROM users;

-- If > 0, drop and recreate
TRUNCATE TABLE users CASCADE;
-- Then restart backend
```

### DataInitializer Not Running

**Check backend logs for:**
- `Initializing sample data...` (should appear)
- `Database already initialized...` (means data exists)
- Error messages

**Force re-initialization:**
```sql
-- Drop all HMS tables
-- Then restart backend
```

---

## 📚 Related Files

- `DROP_HMS_TABLES.sql` - SQL script to drop HMS tables
- `CREATE_HMS_DATABASE.md` - Detailed database creation guide
- `DATABASE_SEPARATION_GUIDE.md` - Complete separation guide
- `backend.env.new-db` - Template for new database config

---

## ✅ Final Checklist

- [ ] HMS tables dropped from old database
- [ ] New Neon database created (`hms_db`)
- [ ] Render environment variables updated
- [ ] Backend redeployed successfully
- [ ] Backend logs show "Initializing sample data..."
- [ ] Sample data created (5 hospitals, 50 doctors, 60 patients)
- [ ] Verified in Neon SQL Editor
- [ ] Can login with default credentials

---

**After completing these steps, you'll have:**
- ✅ Clean HMS database (no CMS tables)
- ✅ Sample data initialized automatically
- ✅ Ready to use with default credentials
- ✅ No conflicts with CMS system

🎉 **Migration Complete!**
