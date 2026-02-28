# Shared Tables Strategy: CMS vs HMS

## 🎯 The Problem

Both CMS and HMS use some **same table names**:
- `users` - Authentication for both systems
- `user_roles` - Role management
- `user_hospital_access` - Multi-hospital access
- `refresh_tokens` - JWT refresh tokens
- `notifications` - System notifications
- `audit_logs` - Audit trail
- `attendance`, `attendance_summary` - Attendance tracking
- `branches` - Branch/location info
- `certificates`, `circulars`, `examinations` - CMS-specific

**Question**: Should we drop these in the new HMS database, or use HMS prefix?

---

## ✅ Recommended Solution: Keep HMS-Required Tables

### Analysis

**HMS Actually Uses:**
- ✅ `users` - **REQUIRED** (User entity for authentication)
- ✅ `user_roles` - **REQUIRED** (Collection table for User.roles)
- ✅ `user_hospital_access` - **REQUIRED** (Collection table for User.accessibleHospitalIds)
- ✅ `refresh_tokens` - **REQUIRED** (RefreshToken entity)
- ✅ `notifications` - **REQUIRED** (Notification entity)
- ✅ `audit_logs` - **REQUIRED** (AuditLog entity)

**HMS Does NOT Use (CMS-specific):**
- ❌ `otp_verifications` - HMS uses OTP fields in `users` table
- ❌ `system_config` - Not found in HMS codebase
- ❌ `attendance` - CMS uses for students, HMS doesn't use
- ❌ `attendance_summary` - CMS uses for students, HMS doesn't use
- ❌ `branches` - CMS uses, HMS doesn't have Branch entity
- ❌ `certificates` - CMS uses for student certificates
- ❌ `circulars` - CMS uses for announcements
- ❌ `examinations` - CMS uses for student exams

---

## 📋 Strategy: Selective Table Management

### Option 1: Keep Required, Drop CMS-Specific (RECOMMENDED) ⭐

**Keep these tables** (HMS needs them):
- `users`
- `user_roles`
- `user_hospital_access`
- `refresh_tokens`
- `notifications`
- `audit_logs`

**Drop these tables** (CMS-specific, HMS doesn't use):
- `otp_verifications`
- `system_config`
- `attendance`
- `attendance_summary`
- `branches`
- `certificates`
- `circulars`
- `examinations`

**Result:**
- ✅ HMS has its required shared tables
- ✅ No CMS-specific clutter
- ✅ Clean separation
- ✅ No code changes needed

---

### Option 2: Drop All Shared Tables (Alternative)

**Drop ALL shared tables**, let HMS create its own:
- ✅ Complete separation
- ✅ No conflicts
- ⚠️ Requires ensuring HMS creates all needed tables

**Risk:**
- If HMS doesn't create a table it needs, errors will occur
- Need to verify all HMS entities are properly mapped

---

### Option 3: Use HMS Prefix (NOT RECOMMENDED)

**Add `hms_` prefix to HMS tables:**
- ⚠️ Requires code changes (all `@Table` annotations)
- ⚠️ Requires migration scripts
- ⚠️ More complex maintenance
- ✅ Complete separation

**Not recommended** because:
- Too much work for minimal benefit
- HMS tables are already distinct (patients, doctors, hospitals, etc.)
- Only shared tables are truly shared

---

## 🎯 Recommended Approach: Option 1

### Updated DROP_CMS_TABLES.sql

```sql
-- Drop CMS-specific tables (HMS doesn't use these)
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

-- KEEP these shared tables (HMS REQUIRES them):
-- users - HMS User entity
-- user_roles - HMS User.roles collection table
-- user_hospital_access - HMS User.accessibleHospitalIds collection table
-- refresh_tokens - HMS RefreshToken entity
-- notifications - HMS Notification entity
-- audit_logs - HMS AuditLog entity

-- Verify CMS tables are dropped
SELECT 
    'CMS Tables Remaining' as status,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'courses', 'faculty', 'students', 'subjects',
    'otp_verifications', 'system_config', 'attendance',
    'branches', 'certificates', 'circulars', 'examinations'
  );
-- Should show: 0 CMS tables remaining

-- Show remaining tables (should show HMS-required shared tables + HMS tables after backend creates them)
SELECT 
    'Remaining Tables' as info,
    table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

---

## ✅ After Backend Deployment

**Expected tables in `hms_db`:**

**Shared Tables (Kept):**
- `users` ✅
- `user_roles` ✅
- `user_hospital_access` ✅
- `refresh_tokens` ✅
- `notifications` ✅
- `audit_logs` ✅

**HMS Tables (Created by Backend):**
- `hospitals`
- `departments`
- `doctors`
- `patients`
- `appointments`
- `invoices`
- `prescriptions`
- `lab_tests`
- `medicines`
- ... (all other HMS tables)

**CMS Tables (Dropped):**
- ❌ All CMS tables removed

---

## 🔍 Verification Queries

After backend deployment, run:

```sql
-- Check HMS-required shared tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'users', 'user_roles', 'user_hospital_access',
    'refresh_tokens', 'notifications', 'audit_logs'
  )
ORDER BY table_name;
-- Should show: 6 tables

-- Check CMS-specific tables are gone
SELECT COUNT(*) as cms_tables_count
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'students', 'courses', 'faculty', 'attendance',
    'branches', 'certificates', 'circulars', 'examinations'
  );
-- Should show: 0

-- Check HMS tables created
SELECT COUNT(*) as hms_tables_count
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'hospitals', 'doctors', 'patients', 'appointments',
    'invoices', 'prescriptions', 'departments'
  );
-- Should show: 7+ tables
```

---

## 📊 Summary

| Table | Action | Reason |
|-------|--------|--------|
| `users` | **KEEP** | HMS User entity required |
| `user_roles` | **KEEP** | HMS User.roles collection |
| `user_hospital_access` | **KEEP** | HMS User.accessibleHospitalIds |
| `refresh_tokens` | **KEEP** | HMS RefreshToken entity |
| `notifications` | **KEEP** | HMS Notification entity |
| `audit_logs` | **KEEP** | HMS AuditLog entity |
| `otp_verifications` | **DROP** | CMS-specific, HMS uses users.otp |
| `system_config` | **DROP** | CMS-specific |
| `attendance` | **DROP** | CMS-specific (students) |
| `attendance_summary` | **DROP** | CMS-specific |
| `branches` | **DROP** | CMS-specific |
| `certificates` | **DROP** | CMS-specific |
| `circulars` | **DROP** | CMS-specific |
| `examinations` | **DROP** | CMS-specific |

---

## 🎯 Final Recommendation

**Use Option 1: Keep Required, Drop CMS-Specific**

1. ✅ **Keep** HMS-required shared tables (`users`, `user_roles`, etc.)
2. ✅ **Drop** CMS-specific tables (students, courses, etc.)
3. ✅ **Drop** CMS-specific shared tables (attendance, branches, etc.)
4. ✅ **Backend creates** HMS tables automatically
5. ✅ **No code changes** needed
6. ✅ **Clean separation** achieved

**Why this works:**
- HMS needs those 6 shared tables for authentication and core functionality
- CMS-specific tables are not needed by HMS
- Backend will create HMS-specific tables automatically
- No conflicts, clean database structure

---

## 📝 Updated Script

See `DROP_CMS_TABLES.sql` (updated version) for the complete script that:
- Drops CMS-specific tables
- Drops CMS-specific shared tables
- Keeps HMS-required shared tables
- Verifies the result

---

**This approach gives you the best of both worlds: clean separation with HMS having what it needs!** ✅
