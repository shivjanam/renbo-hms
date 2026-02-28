-- ============================================================
-- DROP CMS TABLES FROM HMS DATABASE BRANCH
-- ============================================================
-- ⚠️ Run this AFTER creating hms_db branch with "Schema only"
-- ⚠️ This removes CMS tables, leaving HMS-required shared tables
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

-- Drop CMS-specific shared tables (HMS doesn't use these)
DROP TABLE IF EXISTS otp_verifications CASCADE;
DROP TABLE IF EXISTS system_config CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS attendance_summary CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS circulars CASCADE;
DROP TABLE IF EXISTS examinations CASCADE;

-- ============================================================
-- KEEP these shared tables (HMS REQUIRES them):
-- ============================================================
-- users - HMS User entity for authentication
-- user_roles - HMS User.roles collection table
-- user_hospital_access - HMS User.accessibleHospitalIds collection table
-- refresh_tokens - HMS RefreshToken entity
-- notifications - HMS Notification entity
-- audit_logs - HMS AuditLog entity
-- ============================================================

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

-- Verify CMS-specific shared tables are dropped
SELECT 
    'CMS Shared Tables Remaining' as status,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'otp_verifications', 'system_config', 'attendance',
    'attendance_summary', 'branches', 'certificates',
    'circulars', 'examinations'
  );
-- Should show: 0 CMS shared tables remaining

-- Show remaining tables (should show HMS-required shared tables)
SELECT 
    'Remaining Tables (HMS-Required Shared Tables)' as info,
    table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected remaining tables:
-- users, user_roles, user_hospital_access, refresh_tokens, notifications, audit_logs
-- (These are required by HMS and will be kept)

-- After this, database has HMS-required shared tables
-- Backend will create HMS-specific tables automatically via Hibernate
