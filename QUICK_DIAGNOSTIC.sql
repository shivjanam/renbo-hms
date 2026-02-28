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

-- 7. List all HMS-related tables (Hospital Management System)
SELECT table_name as hms_table
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'admissions', 'appointments', 'attendance', 'attendance_summary',
    'audit_logs', 'beds', 'branches', 'certificates', 'circulars',
    'departments', 'doctor_hospitals', 'doctor_schedules', 
    'doctor_specializations', 'doctors', 'examinations',
    'hospitals', 'invoice_items', 'invoices', 'lab_order_items',
    'lab_orders', 'lab_tests', 'medicine_stock', 'medicines',
    'notifications', 'otp_verifications', 'patients', 
    'payment_transactions', 'payments', 'prescription_medicines',
    'prescriptions', 'queue_entries', 'refresh_tokens',
    'system_config', 'user_hospital_access', 'user_roles', 'users'
  )
ORDER BY table_name;

-- 8. List all CMS tables (College Management System)
SELECT table_name as cms_table
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'courses', 'faculty', 'faculty_subject_allocations',
    'fee_payments', 'fee_structures', 'parents',
    'payment_fee_mappings', 'previous_educations',
    'scholarships', 'semester_results', 'semesters',
    'student_documents', 'student_fees', 'student_results',
    'students', 'subjects', 'timetable'
  )
ORDER BY table_name;

-- 9. Count tables by system
SELECT 
    'HMS Tables' as system,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'admissions', 'appointments', 'beds', 'departments', 
    'doctor_hospitals', 'doctor_schedules', 'doctor_specializations',
    'doctors', 'hospitals', 'invoice_items', 'invoices',
    'lab_order_items', 'lab_orders', 'lab_tests', 'medicine_stock',
    'medicines', 'patients', 'payment_transactions', 'payments',
    'prescription_medicines', 'prescriptions', 'queue_entries'
  )
UNION ALL
SELECT 
    'CMS Tables' as system,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'courses', 'faculty', 'faculty_subject_allocations',
    'fee_payments', 'fee_structures', 'parents',
    'payment_fee_mappings', 'previous_educations',
    'scholarships', 'semester_results', 'semesters',
    'student_documents', 'student_fees', 'student_results',
    'students', 'subjects', 'timetable'
  )
UNION ALL
SELECT 
    'Shared Tables' as system,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'users', 'audit_logs', 'notifications', 'refresh_tokens',
    'system_config', 'otp_verifications', 'attendance',
    'attendance_summary', 'branches', 'certificates', 'circulars',
    'examinations', 'user_hospital_access', 'user_roles'
  );
