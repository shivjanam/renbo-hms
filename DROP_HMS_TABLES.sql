-- ============================================================
-- DROP ALL HMS TABLES FROM EXISTING DATABASE
-- ============================================================
-- ⚠️ WARNING: This will permanently delete all HMS tables and data!
-- ⚠️ Only run this if you're sure you want to delete HMS tables
-- ⚠️ CMS tables will remain untouched
-- ============================================================
-- Note: CASCADE automatically handles foreign key dependencies
-- ============================================================

-- Drop HMS-specific tables (in dependency order)
-- CASCADE will automatically drop dependent objects (foreign keys, etc.)
DROP TABLE IF EXISTS prescription_medicines CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS lab_order_items CASCADE;
DROP TABLE IF EXISTS lab_orders CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS queue_entries CASCADE;
DROP TABLE IF EXISTS admissions CASCADE;
DROP TABLE IF EXISTS beds CASCADE;
DROP TABLE IF EXISTS doctor_schedules CASCADE;
DROP TABLE IF EXISTS doctor_specializations CASCADE;
DROP TABLE IF EXISTS doctor_hospitals CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;
DROP TABLE IF EXISTS lab_tests CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS medicine_stock CASCADE;

-- Drop shared tables (only if you want to remove them too)
-- ⚠️ CAUTION: These might be used by CMS too!
-- Uncomment only if you're sure CMS doesn't use them:

-- DROP TABLE IF EXISTS user_hospital_access CASCADE;
-- DROP TABLE IF EXISTS user_roles CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS audit_logs CASCADE;
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS refresh_tokens CASCADE;
-- DROP TABLE IF EXISTS otp_verifications CASCADE;
-- DROP TABLE IF EXISTS system_config CASCADE;
-- DROP TABLE IF EXISTS attendance CASCADE;
-- DROP TABLE IF EXISTS attendance_summary CASCADE;
-- DROP TABLE IF EXISTS branches CASCADE;
-- DROP TABLE IF EXISTS certificates CASCADE;
-- DROP TABLE IF EXISTS circulars CASCADE;
-- DROP TABLE IF EXISTS examinations CASCADE;

-- Verify HMS tables are dropped
SELECT 
    'HMS Tables Remaining' as status,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'admissions', 'appointments', 'beds', 'departments', 
    'doctor_hospitals', 'doctor_schedules', 'doctor_specializations',
    'doctors', 'hospitals', 'invoice_items', 'invoices',
    'lab_order_items', 'lab_orders', 'lab_tests', 'medicine_stock',
    'medicines', 'patients', 'payment_transactions', 'payments',
    'prescription_medicines', 'prescriptions', 'queue_entries'
  );

-- Show remaining tables (should only show CMS tables)
SELECT 
    'Remaining Tables' as info,
    table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
