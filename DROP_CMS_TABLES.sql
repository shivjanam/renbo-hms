-- ============================================================
-- DROP CMS TABLES FROM HMS DATABASE BRANCH
-- ============================================================
-- ⚠️ Run this AFTER creating hms_db branch with "Schema only"
-- ⚠️ This removes CMS tables, leaving empty database for HMS
-- ⚠️ Backend will then create HMS tables automatically
-- ============================================================

-- Drop CMS-specific tables (College Management System)
-- CASCADE automatically handles foreign key dependencies

DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS faculty_subject_allocations CASCADE;
DROP TABLE IF EXISTS fee_payments CASCADE;
DROP TABLE IF EXISTS fee_structures CASCADE;
DROP TABLE IF EXISTS parents CASCADE;
DROP TABLE IF EXISTS payment_fee_mappings CASCADE;
DROP TABLE IF EXISTS previous_educations CASCADE;
DROP TABLE IF EXISTS scholarships CASCADE;
DROP TABLE IF EXISTS semester_results CASCADE;
DROP TABLE IF EXISTS semesters CASCADE;
DROP TABLE IF EXISTS student_documents CASCADE;
DROP TABLE IF EXISTS student_fees CASCADE;
DROP TABLE IF EXISTS student_results CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS timetable CASCADE;

-- Verify CMS tables are dropped
SELECT 
    'CMS Tables Remaining' as status,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'courses', 'faculty', 'faculty_subject_allocations',
    'fee_payments', 'fee_structures', 'parents',
    'payment_fee_mappings', 'previous_educations',
    'scholarships', 'semester_results', 'semesters',
    'student_documents', 'student_fees', 'student_results',
    'students', 'subjects', 'timetable'
  );

-- Should show: 0 CMS tables remaining

-- Show remaining tables (should be empty or only shared tables)
SELECT 
    'Remaining Tables' as info,
    table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- After this, database is empty and ready for HMS tables
-- Backend will create HMS tables automatically via Hibernate
