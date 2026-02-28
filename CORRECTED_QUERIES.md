# ✅ Corrected PostgreSQL Queries - HMS

## 🔧 Fixed Column Names

### Issue Found:
- ❌ Wrong: `specialization` column
- ✅ Correct: `primary_specialization` column

The `doctors` table uses `primary_specialization`, not `specialization`.

---

## ✅ Corrected Doctors Queries

### List All Doctors (Corrected)

```sql
-- List all doctors with correct column names
SELECT 
    id, 
    employee_id, 
    first_name, 
    last_name, 
    display_name,
    primary_specialization,  -- ✅ Correct column name
    registration_number, 
    mobile_number, 
    email,
    primary_hospital_id, 
    primary_department_id,
    created_at, 
    updated_at
FROM doctors
WHERE is_deleted = false  -- ✅ Filter deleted records
ORDER BY display_name;
```

### Get Doctors by Specialization (Corrected)

```sql
-- Get doctors by specialization
SELECT * FROM doctors 
WHERE primary_specialization = 'CARDIOLOGY'  -- ✅ Correct column
  AND is_deleted = false
ORDER BY display_name;
```

### Get Doctors with Additional Specializations

```sql
-- Get doctors with their additional specializations
SELECT 
    d.id,
    d.display_name,
    d.primary_specialization,
    ds.specialization as additional_specialization
FROM doctors d
LEFT JOIN doctor_specializations ds ON d.id = ds.doctor_id
WHERE d.is_deleted = false
ORDER BY d.display_name;
```

---

## 🔍 Diagnostic Queries (Run These First)

### 1. Check if Doctors Table Exists

```sql
-- Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'doctors'
) as table_exists;
```

### 2. Check Actual Column Names

```sql
-- See all columns in doctors table
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'doctors'
ORDER BY ordinal_position;
```

### 3. Check if Table Has Data

```sql
-- Count doctors
SELECT COUNT(*) as total_doctors FROM doctors;

-- Check if any data exists
SELECT * FROM doctors LIMIT 5;
```

### 4. Check for CMS vs HMS Tables

```sql
-- List all tables to see CMS vs HMS
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Table Doesn't Exist

**Symptom:** `relation "doctors" does not exist`

**Solution:**
1. Check backend is running on Render
2. Verify `SPRING_PROFILES_ACTIVE=prod` is set
3. Check backend logs for table creation
4. Backend should auto-create tables on first start

### Issue 2: Column Doesn't Exist

**Symptom:** `column "specialization" does not exist`

**Solution:**
- Use `primary_specialization` instead of `specialization`
- Run diagnostic query to see actual column names

### Issue 3: No Data Returned

**Possible Reasons:**
1. **Table is empty** - Backend hasn't created any records yet
2. **All records deleted** - Check `is_deleted = true`
3. **Wrong table** - Might be CMS table with different structure

**Check:**
```sql
-- Check total count
SELECT COUNT(*) FROM doctors;

-- Check deleted records
SELECT COUNT(*) FROM doctors WHERE is_deleted = true;

-- Check active records
SELECT COUNT(*) FROM doctors WHERE is_deleted = false;
```

### Issue 4: CMS Table Conflict

**If sharing database with CMS:**

CMS might have a `doctors` table with different structure. Check:

```sql
-- Check column differences
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'doctors'
ORDER BY column_name;
```

**Solution:**
- Use schema prefix if needed: `hms.doctors` vs `cms.doctors`
- Or use table alias: `SELECT * FROM doctors d WHERE ...`

---

## ✅ Complete Corrected Queries

### Doctors - All Operations

```sql
-- CREATE: Insert doctor
INSERT INTO doctors (
    employee_id, first_name, last_name, display_name,
    primary_specialization, registration_number, 
    mobile_number, email, primary_hospital_id, primary_department_id
) VALUES (
    'EMP001', 'Dr. Jane', 'Smith', 'Dr. Jane Smith',
    'CARDIOLOGY', 'REG123456',
    '9876543211', 'jane.smith@hospital.com', 1, 1
) RETURNING *;

-- READ: List all doctors
SELECT 
    id, employee_id, first_name, last_name, display_name,
    primary_specialization, registration_number, mobile_number, email,
    primary_hospital_id, primary_department_id,
    created_at, updated_at
FROM doctors
WHERE is_deleted = false
ORDER BY display_name;

-- READ: Get doctor by ID
SELECT * FROM doctors 
WHERE id = 1 AND is_deleted = false;

-- READ: Get doctors by specialization
SELECT * FROM doctors 
WHERE primary_specialization = 'CARDIOLOGY' 
  AND is_deleted = false;

-- UPDATE: Update doctor
UPDATE doctors
SET 
    display_name = 'Dr. Jane Smith Updated',
    email = 'jane.updated@hospital.com',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1 AND is_deleted = false;

-- DELETE: Soft delete doctor
UPDATE doctors
SET 
    is_deleted = true,
    is_active = false,
    deleted_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

---

## 📋 Column Name Reference

### Doctors Table Columns

**BaseEntity columns:**
- `id`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`
- `is_active`
- `is_deleted`
- `deleted_at`
- `deleted_by`
- `version`

**Doctor-specific columns:**
- `employee_id`
- `first_name`
- `last_name`
- `display_name`
- `title`
- `gender`
- `date_of_birth`
- `mobile_number`
- `alternate_mobile`
- `email`
- `registration_number`
- `registration_council`
- `registration_valid_until`
- `primary_specialization` ✅ (NOT `specialization`)
- `qualifications`
- `experience_years`
- `bio`
- `primary_hospital_id`
- `primary_department_id`
- `opd_consultation_fee`
- `follow_up_fee`
- `emergency_fee`
- `teleconsultation_fee`
- `user_id`
- And more...

**Related Tables:**
- `doctor_specializations` - Additional specializations (many-to-many)
- `doctor_hospitals` - Hospital access (many-to-many)
- `doctor_schedules` - Doctor schedules

---

## 🔍 Quick Diagnostic Script

Run this to diagnose issues:

```sql
-- 1. Check table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'doctors'
) as doctors_table_exists;

-- 2. List all columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'doctors'
ORDER BY ordinal_position;

-- 3. Check for specialization columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'doctors' 
  AND column_name LIKE '%special%';

-- 4. Count records
SELECT COUNT(*) as total FROM doctors;
SELECT COUNT(*) as active FROM doctors WHERE is_deleted = false;
SELECT COUNT(*) as deleted FROM doctors WHERE is_deleted = true;

-- 5. Sample data
SELECT * FROM doctors LIMIT 5;
```

---

## 🆘 Still Having Issues?

1. **Run diagnostic queries** from `QUICK_DIAGNOSTIC.sql`
2. **Check backend logs** on Render for table creation
3. **Verify** `SPRING_PROFILES_ACTIVE=prod` is set
4. **Check** if CMS tables are interfering
5. **Share results** and I'll help fix specific issues

---

## 📝 Notes

- **Column name**: `primary_specialization` (not `specialization`)
- **Soft delete**: Always check `is_deleted = false` in queries
- **CMS conflict**: If sharing database, tables might have different structure
- **Table creation**: Backend auto-creates tables on first start with `ddl-auto: update`
