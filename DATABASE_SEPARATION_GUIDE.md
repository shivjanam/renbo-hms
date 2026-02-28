# Database Separation Guide - CMS vs HMS

## ⚠️ Current Issue

Both CMS (College Management System) and HMS (Hospital Management System) tables exist in the same Neon PostgreSQL database, causing:
- Table name conflicts
- Query confusion
- Data mixing
- Maintenance issues

---

## 📊 Current Table Analysis

### CMS Tables (College Management System)
- `students`, `courses`, `faculty`, `examinations`
- `fee_payments`, `fee_structures`, `semesters`, `subjects`
- `timetable`, `attendance`, `certificates`, `circulars`
- `scholarships`, `student_results`, `student_documents`
- `parents`, `previous_educations`, `branches`

### HMS Tables (Hospital Management System)
- `patients`, `doctors`, `appointments`, `invoices`
- `prescriptions`, `hospitals`, `departments`, `lab_tests`
- `lab_orders`, `medicines`, `medicine_stock`, `beds`
- `admissions`, `queue_entries`, `payments`

### Shared Tables (Used by Both)
- `users`, `audit_logs`, `notifications`, `refresh_tokens`
- `system_config`, `otp_verifications`

---

## ✅ Solution Options

### Option 1: Separate Database (RECOMMENDED) ⭐

Create a new Neon database specifically for HMS.

**Advantages:**
- ✅ Complete isolation
- ✅ No conflicts
- ✅ Easier maintenance
- ✅ Better security
- ✅ Independent backups

**Steps:**
1. Go to Neon Dashboard: https://console.neon.tech
2. Create new database: `hms_db` or `hospital_management`
3. Update `DATABASE_URL` in Render backend environment
4. Redeploy backend (will create HMS tables in new DB)

---

### Option 2: Use Schema Separation

Use PostgreSQL schemas to separate CMS and HMS.

**Advantages:**
- ✅ Same database connection
- ✅ Logical separation
- ✅ No data migration needed

**Disadvantages:**
- ⚠️ Requires schema changes in code
- ⚠️ More complex queries

**Implementation:**
- CMS tables: `public` schema (default)
- HMS tables: `hms` schema

---

### Option 3: Add Table Prefixes

Add `hms_` prefix to HMS tables.

**Advantages:**
- ✅ Simple to implement
- ✅ Clear separation

**Disadvantages:**
- ⚠️ Requires code changes
- ⚠️ Migration needed

---

## 🎯 Recommended: Option 1 - Separate Database

### Step-by-Step Guide

#### Step 1: Create New Neon Database

1. **Go to Neon Dashboard**: https://console.neon.tech
2. **Select your project**
3. **Click "Create Database"** or "Branches" → "Create Branch"
4. **Name**: `hms_db` or `hospital_management_db`
5. **Copy connection string**

#### Step 2: Get New Database Credentials

After creating, you'll get:
- **Host**: `ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech`
- **Database**: `hms_db` (or your chosen name)
- **Username**: `neondb_owner` (or new user)
- **Password**: (new password or same)

**New Connection String:**
```
jdbc:postgresql://ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
```

#### Step 3: Update Render Environment Variables

Go to **Render** → **Backend Service** → **Environment**:

**Update:**
```env
DATABASE_URL=jdbc:postgresql://ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=your_new_password
```

#### Step 4: Redeploy Backend

1. **Save** environment variables
2. **Backend will auto-redeploy**
3. **Wait** for deployment (~5-10 minutes)
4. **Backend will create** all HMS tables in new database

#### Step 5: Verify

Run in new database:
```sql
-- List HMS tables only
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Should see only HMS tables (no CMS tables).

---

## 🔧 Option 2: Schema Separation (Alternative)

If you want to keep same database, use schemas:

### Step 1: Create HMS Schema

```sql
-- Create HMS schema
CREATE SCHEMA IF NOT EXISTS hms;

-- Set default schema for HMS tables
SET search_path TO hms, public;
```

### Step 2: Update Backend Configuration

Update `application.yml` to use `hms` schema:

```yaml
spring:
  jpa:
    properties:
      hibernate:
        default_schema: hms
```

### Step 3: Migrate Existing Tables (If Any)

```sql
-- Move HMS tables to hms schema
ALTER TABLE patients SET SCHEMA hms;
ALTER TABLE doctors SET SCHEMA hms;
ALTER TABLE appointments SET SCHEMA hms;
-- ... etc for all HMS tables
```

---

## 📋 Updated Queries for Schema Separation

If using schemas, prefix queries:

```sql
-- Query HMS tables
SELECT * FROM hms.doctors;
SELECT * FROM hms.patients;
SELECT * FROM hms.appointments;

-- Query CMS tables (if needed)
SELECT * FROM public.students;
SELECT * FROM public.courses;
```

---

## 🆚 Comparison

| Option | Pros | Cons | Effort |
|--------|------|------|--------|
| **Separate DB** | Complete isolation, clean | Need new DB, update config | Low ⭐ |
| **Schema Separation** | Same connection, logical separation | Code changes needed | Medium |
| **Table Prefixes** | Simple, clear naming | Migration needed | High |

---

## ✅ Recommended Action

**Use Option 1: Separate Database**

1. **Create new Neon database** for HMS
2. **Update `DATABASE_URL`** in Render
3. **Redeploy backend**
4. **HMS tables created** in clean database

This gives you:
- ✅ Clean database (only HMS tables)
- ✅ No conflicts with CMS
- ✅ Easier queries (no prefixes needed)
- ✅ Better organization

---

## 📝 Updated Connection Details

After creating new database, update:

**Render Backend Environment:**
```env
DATABASE_URL=jdbc:postgresql://ep-xxxxx-pooler.ap-southeast-1.aws.neon.tech/hms_db?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=your_password
```

**Neon Dashboard:**
- New database: `hms_db`
- Connection string: Copy from Neon dashboard

---

## 🔍 Verify Separation

After setup, run:

```sql
-- In HMS database - should see only HMS tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should NOT see: students, courses, faculty, etc.
-- Should see: patients, doctors, appointments, etc.
```

---

## 🆘 Need Help?

1. **Creating Neon database**: See Neon docs
2. **Updating connection**: See `ENVIRONMENT_VARIABLES.md`
3. **Troubleshooting**: See `DATABASE_DIAGNOSIS.md`

---

## 📚 Next Steps

1. **Create new Neon database** for HMS
2. **Update backend.env** with new connection
3. **Update Render** environment variables
4. **Redeploy backend**
5. **Verify** tables created correctly

This will give you a clean HMS database separate from CMS! ✅
