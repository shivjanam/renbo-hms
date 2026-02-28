-- ===========================================
-- Quick Diagnostic Queries for HMS Database
-- Run these in Neon SQL Editor
-- ===========================================

-- 1. Check if doctors table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'doctors'
) as doctors_table_exists;

-- 2. List all tables (to see CMS vs HMS)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 3. Check doctors table columns
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'doctors'
ORDER BY ordinal_position;

-- 4. Check if doctors table has data
SELECT COUNT(*) as total_doctors FROM doctors;

-- 5. See sample data (if exists)
SELECT * FROM doctors LIMIT 5;

-- 6. Check for specialization column variations
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'doctors' 
  AND (
    column_name LIKE '%special%' OR
    column_name LIKE '%spec%'
  );

-- 7. List all HMS-related tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND (
    table_name IN ('patients', 'doctors', 'appointments', 'invoices',
                   'prescriptions', 'hospitals', 'departments', 'users',
                   'queue_entries', 'lab_tests', 'lab_orders', 'medicines',
                   'medicine_stock', 'beds', 'admissions', 'notifications',
                   'audit_logs', 'refresh_tokens')
    OR table_name LIKE '%patient%'
    OR table_name LIKE '%doctor%'
    OR table_name LIKE '%appointment%'
  )
ORDER BY table_name;

-- 8. Check CMS tables (if any)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND (
    table_name LIKE '%student%'
    OR table_name LIKE '%course%'
    OR table_name LIKE '%college%'
    OR table_name LIKE '%faculty%'
  )
ORDER BY table_name;
