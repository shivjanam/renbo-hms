# CMS vs HMS Tables Reference

## 📊 Table Classification

Based on your database, here's the breakdown:

---

## 🏥 HMS Tables (Hospital Management System)

These belong to the Hospital Management System:

| Table Name | Purpose |
|------------|---------|
| `admissions` | Patient admissions to hospital |
| `appointments` | Doctor-patient appointments |
| `beds` | Hospital bed management |
| `departments` | Hospital departments |
| `doctor_hospitals` | Doctor-hospital associations |
| `doctor_schedules` | Doctor availability schedules |
| `doctor_specializations` | Doctor specializations |
| `doctors` | Doctor information |
| `hospitals` | Hospital details |
| `invoice_items` | Invoice line items |
| `invoices` | Patient invoices |
| `lab_order_items` | Lab test order items |
| `lab_orders` | Lab test orders |
| `lab_tests` | Available lab tests |
| `medicine_stock` | Medicine inventory |
| `medicines` | Medicine catalog |
| `patients` | Patient information |
| `payment_transactions` | Payment transaction records |
| `payments` | Payment records |
| `prescription_medicines` | Prescribed medicines |
| `prescriptions` | Patient prescriptions |
| `queue_entries` | Patient queue management |

**Total: 22 HMS-specific tables**

---

## 🎓 CMS Tables (College Management System)

These belong to the College Management System:

| Table Name | Purpose |
|------------|---------|
| `courses` | Course catalog |
| `faculty` | Faculty/staff information |
| `faculty_subject_allocations` | Faculty-course assignments |
| `fee_payments` | Student fee payments |
| `fee_structures` | Fee structure definitions |
| `parents` | Parent/guardian information |
| `payment_fee_mappings` | Payment-fee associations |
| `previous_educations` | Student education history |
| `scholarships` | Scholarship information |
| `semester_results` | Semester exam results |
| `semesters` | Semester definitions |
| `student_documents` | Student document storage |
| `student_fees` | Student fee records |
| `student_results` | Student academic results |
| `students` | Student information |
| `subjects` | Subject/course catalog |
| `timetable` | Class timetable |

**Total: 17 CMS-specific tables**

---

## 🔄 Shared Tables (Used by Both Systems)

These tables are shared between CMS and HMS:

| Table Name | Purpose |
|------------|---------|
| `users` | User accounts (students, doctors, staff) |
| `audit_logs` | System audit trail |
| `notifications` | System notifications |
| `refresh_tokens` | JWT refresh tokens |
| `system_config` | System configuration |
| `otp_verifications` | OTP verification records |
| `attendance` | Attendance records (students/doctors) |
| `attendance_summary` | Attendance summaries |
| `branches` | Branch/location information |
| `certificates` | Certificate records |
| `circulars` | Circular/announcements |
| `examinations` | Examination records |
| `user_hospital_access` | User-hospital access control |
| `user_roles` | User role definitions |

**Total: 14 shared tables**

---

## ⚠️ Problem

**Current Situation:**
- Both CMS and HMS tables exist in the **same database**
- Total: **53 tables** (22 HMS + 17 CMS + 14 shared)
- This causes:
  - ❌ Table name confusion
  - ❌ Query conflicts
  - ❌ Data mixing
  - ❌ Maintenance issues

---

## ✅ Solution

**Recommended: Separate Database**

1. **Create new Neon database** for HMS
2. **Move only HMS tables** to new database
3. **Keep CMS tables** in original database
4. **Shared tables** can be duplicated or kept in both

**Result:**
- ✅ Clean HMS database (only HMS tables)
- ✅ No CMS table conflicts
- ✅ Easier queries
- ✅ Better organization

---

## 📋 Quick Query to Check Current State

Run this in Neon SQL Editor:

```sql
-- Count tables by system
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
  );
```

---

## 🚀 Next Steps

1. **Read**: `CREATE_HMS_DATABASE.md` - Step-by-step guide
2. **Read**: `DATABASE_SEPARATION_GUIDE.md` - All options explained
3. **Create**: New Neon database for HMS
4. **Update**: Render backend environment variables
5. **Redeploy**: Backend will create HMS tables in new database

---

## 📚 Related Files

- `CREATE_HMS_DATABASE.md` - Step-by-step database creation
- `DATABASE_SEPARATION_GUIDE.md` - Complete separation guide
- `QUICK_DIAGNOSTIC.sql` - Diagnostic queries
- `backend.env.new-db` - Template for new database config

---

**After separation, HMS will have its own clean database!** ✅
