# Database Diagnosis & Troubleshooting Guide

## 🔍 Check What Tables Exist

### Step 1: List All Tables

```sql
-- List all tables in the database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

This will show:
- CMS tables (if any)
- HMS tables (if created)
- Both (if sharing database)

### Step 2: Check HMS Tables Specifically

```sql
-- Check if HMS tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND (
    table_name LIKE '%patient%' OR
    table_name LIKE '%doctor%' OR
    table_name LIKE '%appointment%' OR
    table_name LIKE '%invoice%' OR
    table_name LIKE '%prescription%' OR
    table_name LIKE '%hospital%' OR
    table_name LIKE '%user%' OR
    table_name LIKE '%department%'
  )
ORDER BY table_name;
```

### Step 3: Check Column Names in Doctors Table

```sql
-- Check actual column names in doctors table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'doctors'
ORDER BY ordinal_position;
```

---

## ⚠️ Common Issues

### Issue 1: Tables Don't Exist Yet

**Symptom:** No data returned, table might not exist

**Check:**
```sql
-- Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'doctors'
);
```

**Solution:**
- Backend needs to start with `SPRING_PROFILES_ACTIVE=prod`
- JPA will auto-create tables with `ddl-auto: update`
- Check backend logs on Render to see if tables are being created

### Issue 2: Column Name Mismatch

**Symptom:** Column doesn't exist error

**Check actual columns:**
```sql
-- See all columns in doctors table
\d doctors

-- Or using SQL
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'doctors';
```

**Common mismatches:**
- `specialization` might be `specialization_id` or `specialization_name`
- Column names might be snake_case vs camelCase

### Issue 3: CMS vs HMS Table Conflict

**Symptom:** Tables exist but structure is different

**Check:**
```sql
-- Compare table structures
SELECT 
    'doctors' as table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'doctors'
ORDER BY ordinal_position;
```

---

## 🔧 Diagnostic Queries

### Check Database Connection

```sql
-- Test connection
SELECT version();
SELECT current_database();
SELECT current_user;
```

### Check All Tables

```sql
-- Complete list of all tables
SELECT 
    table_name,
    (SELECT COUNT(*) 
     FROM information_schema.columns 
     WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Check Table Row Counts

```sql
-- Count rows in each table
SELECT 
    'patients' as table_name, COUNT(*) as row_count FROM patients
UNION ALL
SELECT 'doctors', COUNT(*) FROM doctors
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'hospitals', COUNT(*) FROM hospitals
UNION ALL
SELECT 'departments', COUNT(*) FROM departments
UNION ALL
SELECT 'users', COUNT(*) FROM users;
```

### Check if Backend Created Tables

```sql
-- Check for HMS-specific tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'patients', 'doctors', 'appointments', 'invoices',
    'prescriptions', 'hospitals', 'departments', 'users',
    'queue_entries', 'lab_tests', 'lab_orders', 'medicines',
    'medicine_stock', 'beds', 'admissions', 'notifications',
    'audit_logs', 'refresh_tokens'
  )
ORDER BY table_name;
```

---

## 🚨 If Tables Don't Exist

### Backend Needs to Create Tables

1. **Check Backend Logs on Render:**
   - Go to Render → Backend Service → Logs
   - Look for: "Hibernate: create table"
   - Look for: "Schema update complete"

2. **Verify Environment Variables:**
   - `SPRING_PROFILES_ACTIVE=prod` ✅
   - `DATABASE_URL` is set correctly ✅
   - `DB_USERNAME` and `DB_PASSWORD` are set ✅

3. **Check application.yml:**
   - `ddl-auto: update` (should create tables automatically)

4. **Restart Backend:**
   - Go to Render → Backend Service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait for deployment
   - Check logs for table creation

---

## 🔍 Check Actual Column Names

Run this to see exact column names:

```sql
-- For doctors table
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'doctors'
ORDER BY ordinal_position;
```

Then use the actual column names in your queries.

---

## 📝 Corrected Queries (Based on Entity Structure)

### Doctors Table - Correct Column Names

Based on the entity, columns should be:
- `id` (from BaseEntity)
- `employee_id`
- `first_name`
- `last_name`
- `display_name`
- `specialization` (enum as VARCHAR)
- `registration_number`
- `mobile_number`
- `email`
- `primary_hospital_id`
- `primary_department_id`
- `created_at`, `updated_at` (from BaseEntity)

### If Specialization Column Doesn't Exist

Check what the actual column is:

```sql
-- Check all columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'doctors' 
  AND column_name LIKE '%special%';
```

It might be:
- `specialization_id` (if foreign key)
- `specialization_name`
- Or stored differently

---

## 🔧 Quick Fix Queries

### Query Without Specialization (If Column Missing)

```sql
-- List doctors without specialization column
SELECT 
    id, employee_id, first_name, last_name, display_name,
    registration_number, mobile_number, email,
    primary_hospital_id, primary_department_id,
    created_at, updated_at
FROM doctors
ORDER BY display_name;
```

### Check What Data Exists

```sql
-- Check if table has any rows
SELECT COUNT(*) as total_doctors FROM doctors;

-- See sample data (if exists)
SELECT * FROM doctors LIMIT 5;
```

---

## 🆘 Troubleshooting Steps

1. **Run diagnostic queries** (see above)
2. **Check table exists**: `SELECT * FROM doctors LIMIT 1;`
3. **Check columns**: `\d doctors` or use information_schema
4. **Check backend logs** on Render
5. **Verify** `SPRING_PROFILES_ACTIVE=prod` is set
6. **Restart backend** if tables don't exist

---

## 📋 Next Steps

1. **Run diagnostic queries** to see what exists
2. **Check backend logs** to see if tables are being created
3. **Verify** environment variables are set correctly
4. **Update queries** based on actual column names

Share the results of diagnostic queries and I'll help fix the specific issues!
