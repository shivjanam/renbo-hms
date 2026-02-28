# Create Separate HMS Database - Step by Step

## 🎯 Goal

Create a new Neon PostgreSQL database specifically for HMS, separate from CMS database.

---

## 📋 Step-by-Step Instructions

### Step 1: Create New Database Branch in Neon

1. **Go to**: https://console.neon.tech
2. **Sign in** to your account
3. **Select your project** (the one with your CMS database)
4. **Click "Branches"** in left sidebar
5. **Click "Create Branch"** button
6. **In the "Create new branch" dialog:**
   
   **Parent branch:**
   - Select your main branch (usually `production` or `main`)
   
   **Branch name:**
   - Enter: `hms_db` (or `hospital_management_db`)
   - This will be your new HMS database name
   
   **Automatically delete branch after:**
   - ⚠️ **Leave unchecked** (for permanent database)
   - Only check if you want a temporary branch
   
   **Data Inclusion Options:**
   - ⭐ **Select "Schema only (Beta)"** 
   - This creates a clean database with table structures but **no data**
   - Perfect for initializing with HMS sample data
   - Shows remaining space: "536.87 MB remaining space"
   
   **Other options (DO NOT SELECT):**
   - ❌ "Current data" - Would copy all CMS + HMS data
   - ❌ "Past data" - Would copy historical data
   - ❌ "Anonymized data" - For testing with masked data
   
7. **Click "Create"** button (black button at bottom)

### Step 2: Get Connection Details

After creating, Neon will show:
- **Connection String**: Copy this
- **Host**: `ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech`
- **Database**: `hms_db`
- **Username**: Usually `neondb_owner`
- **Password**: Same as CMS or new one

**Example Connection String:**
```
postgresql://neondb_owner:password@ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
```

**JDBC Format:**
```
jdbc:postgresql://ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
```

### Step 3: Update Backend Environment Variables

Go to **Render Dashboard** → **Backend Service** → **Environment**:

**Update these variables:**

```env
DATABASE_URL=jdbc:postgresql://ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=your_password_here
```

**Replace:**
- `ep-xxxxx-pooler...` with your new database host
- `hms_db` with your database name
- `your_password_here` with actual password

### Step 4: Save and Redeploy

1. **Click "Save Changes"** in Render
2. **Backend will auto-redeploy**
3. **Wait** ~5-10 minutes for deployment
4. **Check logs** - should see table creation messages

### Step 5: Verify HMS Tables Created

Go to **Neon Dashboard** → **SQL Editor** → Select `hms_db`:

```sql
-- List all tables in HMS database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Should see ONLY HMS tables:**
- ✅ patients, doctors, appointments, invoices
- ✅ prescriptions, hospitals, departments
- ✅ lab_tests, medicines, beds, admissions
- ❌ NO students, courses, faculty (CMS tables)

---

## ✅ Expected Result

After setup, HMS database will have:

**HMS Tables Only:**
- patients
- doctors
- appointments
- invoices
- prescriptions
- hospitals
- departments
- lab_tests
- lab_orders
- medicines
- medicine_stock
- beds
- admissions
- queue_entries
- users (HMS users)
- audit_logs
- notifications
- refresh_tokens

**No CMS Tables:**
- ❌ students
- ❌ courses
- ❌ faculty
- ❌ examinations
- ❌ fee_payments
- etc.

---

## 🔄 Migration (If Needed)

If you already have HMS data in the shared database:

### Option A: Fresh Start (Recommended)

Just use new database - backend will create empty tables.

### Option B: Migrate Data

```sql
-- Export HMS data from old database
pg_dump -t patients -t doctors -t appointments ... old_db > hms_data.sql

-- Import to new database
psql new_db < hms_data.sql
```

---

## 📝 Updated backend.env

After creating new database, update `backend.env`:

```env
# Database Configuration (New HMS Database)
DATABASE_URL=jdbc:postgresql://ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=your_new_password
```

Then update Render with these values.

---

## ✅ Verification Checklist

- [ ] New Neon database created (`hms_db`)
- [ ] Connection string copied
- [ ] Render environment variables updated
- [ ] Backend redeployed
- [ ] Tables created (check Neon SQL Editor)
- [ ] Only HMS tables exist (no CMS tables)
- [ ] Backend health check passes

---

## 🆘 Troubleshooting

### Database Creation Failed

- Check Neon account limits
- Try creating branch instead of database
- Contact Neon support

### Connection Failed

- Verify connection string format
- Check username/password
- Verify SSL mode (`sslmode=require`)
- Check Neon dashboard for connection details

### Tables Not Created

- Check backend logs on Render
- Verify `SPRING_PROFILES_ACTIVE=prod`
- Check `DATABASE_URL` is correct
- Restart backend service

---

## 📚 Resources

- **Neon Dashboard**: https://console.neon.tech
- **Neon Docs**: https://neon.tech/docs
- **Create Database**: https://neon.tech/docs/manage/databases

---

## 🎉 After Setup

Once new database is created and backend redeployed:

1. ✅ Clean HMS database (no CMS tables)
2. ✅ All queries work correctly
3. ✅ No table name conflicts
4. ✅ Easier maintenance
5. ✅ Better organization

Your HMS will have its own dedicated database! 🚀
