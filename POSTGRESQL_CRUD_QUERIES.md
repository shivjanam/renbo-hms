# PostgreSQL CRUD Queries Guide - HMS

Complete SQL queries for CRUD operations on Hospital Management System database.

## 🔗 Database Connection

**Neon PostgreSQL:**
- Host: `ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech`
- Database: `neondb`
- Username: `neondb_owner`
- Password: `npg_hwjWHm01xMlr`

**Connect:**
```sql
-- Using psql
psql "postgresql://neondb_owner:npg_hwjWHm01xMlr@ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

-- Or via Neon Dashboard SQL Editor
-- Go to: https://console.neon.tech → SQL Editor
```

---

## 📊 Table Structure Overview

Main HMS tables:
- `users` - System users (doctors, staff, admins)
- `patients` - Patient records
- `doctors` - Doctor information
- `hospitals` - Hospital/branch information
- `departments` - Hospital departments
- `appointments` - Patient appointments
- `queue_entries` - Appointment queue
- `prescriptions` - Doctor prescriptions
- `prescription_medicines` - Prescription medicines
- `invoices` - Billing invoices
- `invoice_items` - Invoice line items
- `payments` - Payment records
- `lab_tests` - Lab test catalog
- `lab_orders` - Lab test orders
- `lab_order_items` - Lab order items
- `medicines` - Medicine catalog
- `medicine_stock` - Medicine inventory
- `beds` - Hospital beds
- `admissions` - Patient admissions
- `notifications` - System notifications
- `audit_logs` - Audit trail
- `refresh_tokens` - JWT refresh tokens

---

## 🔍 READ Operations (SELECT)

### 1. Patients

```sql
-- List all patients
SELECT 
    id, uhid, first_name, last_name, mobile_number, 
    email, date_of_birth, gender, blood_group, city, state,
    created_at, updated_at
FROM patients
ORDER BY created_at DESC;

-- Get patient by ID
SELECT * FROM patients WHERE id = 1;

-- Get patient by mobile number
SELECT * FROM patients WHERE mobile_number = '9876543210';

-- Get patient by UHID
SELECT * FROM patients WHERE uhid = 'UHID001';

-- Search patients by name
SELECT * FROM patients 
WHERE first_name ILIKE '%john%' OR last_name ILIKE '%john%';

-- Count patients
SELECT COUNT(*) as total_patients FROM patients;

-- Patients by city
SELECT city, COUNT(*) as count 
FROM patients 
GROUP BY city 
ORDER BY count DESC;
```

### 2. Doctors

```sql
-- List all doctors
SELECT 
    id, employee_id, first_name, last_name, display_name,
    specialization, registration_number, mobile_number, email,
    primary_hospital_id, primary_department_id,
    created_at, updated_at
FROM doctors
ORDER BY display_name;

-- Get doctor by ID
SELECT * FROM doctors WHERE id = 1;

-- Get doctors by specialization
SELECT * FROM doctors WHERE specialization = 'CARDIOLOGY';

-- Get doctors by hospital
SELECT d.*, h.name as hospital_name
FROM doctors d
LEFT JOIN hospitals h ON d.primary_hospital_id = h.id
WHERE d.primary_hospital_id = 1;

-- Count doctors by specialization
SELECT specialization, COUNT(*) as count
FROM doctors
GROUP BY specialization
ORDER BY count DESC;
```

### 3. Appointments

```sql
-- List all appointments
SELECT 
    a.id, a.appointment_number, a.appointment_date, a.appointment_time,
    a.status, a.token_number,
    p.first_name || ' ' || p.last_name as patient_name,
    d.display_name as doctor_name,
    h.name as hospital_name
FROM appointments a
LEFT JOIN patients p ON a.patient_id = p.id
LEFT JOIN doctors d ON a.doctor_id = d.id
LEFT JOIN hospitals h ON a.hospital_id = h.id
ORDER BY a.appointment_date DESC, a.appointment_time DESC;

-- Get appointments by patient
SELECT a.*, d.display_name as doctor_name
FROM appointments a
LEFT JOIN doctors d ON a.doctor_id = d.id
WHERE a.patient_id = 1
ORDER BY a.appointment_date DESC;

-- Get appointments by doctor
SELECT a.*, p.first_name || ' ' || p.last_name as patient_name
FROM appointments a
LEFT JOIN patients p ON a.patient_id = p.id
WHERE a.doctor_id = 1
ORDER BY a.appointment_date DESC;

-- Get appointments by date
SELECT * FROM appointments 
WHERE appointment_date = CURRENT_DATE
ORDER BY appointment_time;

-- Get appointments by status
SELECT * FROM appointments 
WHERE status = 'CONFIRMED'
ORDER BY appointment_date;

-- Count appointments by status
SELECT status, COUNT(*) as count
FROM appointments
GROUP BY status;
```

### 4. Invoices

```sql
-- List all invoices
SELECT 
    i.id, i.invoice_number, i.invoice_date, i.total_amount,
    i.amount_paid, i.balance_amount, i.payment_status,
    p.first_name || ' ' || p.last_name as patient_name,
    i.created_at
FROM invoices i
LEFT JOIN patients p ON i.patient_id = p.id
ORDER BY i.invoice_date DESC;

-- Get invoice by ID
SELECT * FROM invoices WHERE id = 1;

-- Get invoice items
SELECT 
    ii.*, 
    ii.item_name, ii.quantity, ii.unit_price, ii.total_price
FROM invoice_items ii
WHERE ii.invoice_id = 1;

-- Get invoices by patient
SELECT * FROM invoices 
WHERE patient_id = 1
ORDER BY invoice_date DESC;

-- Get invoices by payment status
SELECT * FROM invoices 
WHERE payment_status = 'PENDING'
ORDER BY invoice_date;

-- Total revenue
SELECT 
    SUM(total_amount) as total_revenue,
    SUM(amount_paid) as total_collected,
    SUM(balance_amount) as total_pending
FROM invoices;
```

### 5. Prescriptions

```sql
-- List all prescriptions
SELECT 
    pr.id, pr.prescription_number, pr.prescription_date,
    p.first_name || ' ' || p.last_name as patient_name,
    d.display_name as doctor_name,
    pr.status, pr.created_at
FROM prescriptions pr
LEFT JOIN patients p ON pr.patient_id = p.id
LEFT JOIN doctors d ON pr.doctor_id = d.id
ORDER BY pr.prescription_date DESC;

-- Get prescription medicines
SELECT 
    pm.*,
    m.name as medicine_name, m.manufacturer
FROM prescription_medicines pm
LEFT JOIN medicines m ON pm.medicine_id = m.id
WHERE pm.prescription_id = 1;
```

### 6. Hospitals & Departments

```sql
-- List all hospitals
SELECT * FROM hospitals ORDER BY name;

-- Get hospital by ID
SELECT * FROM hospitals WHERE id = 1;

-- List all departments
SELECT 
    d.*, h.name as hospital_name
FROM departments d
LEFT JOIN hospitals h ON d.hospital_id = h.id
ORDER BY d.name;

-- Get departments by hospital
SELECT * FROM departments WHERE hospital_id = 1;
```

### 7. Users

```sql
-- List all users
SELECT 
    id, username, email, role, enabled, created_at
FROM users
ORDER BY created_at DESC;

-- Get user by username
SELECT * FROM users WHERE username = 'admin.cgh';

-- Get users by role
SELECT * FROM users WHERE role = 'DOCTOR';
```

### 8. Lab Tests & Orders

```sql
-- List all lab tests
SELECT * FROM lab_tests ORDER BY name;

-- List lab orders
SELECT 
    lo.*,
    p.first_name || ' ' || p.last_name as patient_name,
    d.display_name as doctor_name
FROM lab_orders lo
LEFT JOIN patients p ON lo.patient_id = p.id
LEFT JOIN doctors d ON lo.doctor_id = d.id
ORDER BY lo.order_date DESC;

-- Get lab order items
SELECT 
    loi.*, lt.name as test_name
FROM lab_order_items loi
LEFT JOIN lab_tests lt ON loi.lab_test_id = lt.id
WHERE loi.lab_order_id = 1;
```

### 9. Medicines & Stock

```sql
-- List all medicines
SELECT * FROM medicines ORDER BY name;

-- Get medicine stock
SELECT 
    ms.*, m.name as medicine_name, m.manufacturer
FROM medicine_stock ms
LEFT JOIN medicines m ON ms.medicine_id = m.id
WHERE ms.hospital_id = 1
ORDER BY m.name;

-- Low stock medicines
SELECT 
    m.name, ms.current_stock, ms.minimum_stock_level
FROM medicine_stock ms
LEFT JOIN medicines m ON ms.medicine_id = m.id
WHERE ms.current_stock <= ms.minimum_stock_level;
```

---

## ➕ CREATE Operations (INSERT)

### 1. Create Patient

```sql
INSERT INTO patients (
    uhid, registered_hospital_id, first_name, last_name,
    mobile_number, email, date_of_birth, gender, blood_group,
    address_line1, city, state, pincode, country
) VALUES (
    'UHID' || nextval('patients_uhid_seq'),
    1,
    'John',
    'Doe',
    '9876543210',
    'john.doe@email.com',
    '1990-01-15',
    'MALE',
    'O_POSITIVE',
    '123 Main Street',
    'Mumbai',
    'Maharashtra',
    '400001',
    'India'
) RETURNING *;
```

### 2. Create Doctor

```sql
INSERT INTO doctors (
    employee_id, first_name, last_name, display_name,
    specialization, registration_number, mobile_number, email,
    primary_hospital_id, primary_department_id
) VALUES (
    'EMP001',
    'Dr. Jane',
    'Smith',
    'Dr. Jane Smith',
    'CARDIOLOGY',
    'REG123456',
    '9876543211',
    'jane.smith@hospital.com',
    1,
    1
) RETURNING *;
```

### 3. Create Appointment

```sql
INSERT INTO appointments (
    appointment_number, hospital_id, department_id,
    patient_id, patient_name, patient_mobile,
    doctor_id, doctor_name,
    appointment_date, appointment_time,
    appointment_type, status, token_number
) VALUES (
    'APT' || nextval('appointments_seq'),
    1,
    1,
    1,
    'John Doe',
    '9876543210',
    1,
    'Dr. Jane Smith',
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    'OPD',
    'CONFIRMED',
    1
) RETURNING *;
```

### 4. Create Invoice

```sql
INSERT INTO invoices (
    invoice_number, hospital_id, patient_id,
    invoice_date, total_amount, amount_paid,
    balance_amount, payment_status, billing_type
) VALUES (
    'INV' || nextval('invoices_seq'),
    1,
    1,
    CURRENT_DATE,
    5000.00,
    0.00,
    5000.00,
    'PENDING',
    'CONSULTATION'
) RETURNING *;

-- Add invoice items
INSERT INTO invoice_items (
    invoice_id, item_name, item_type, quantity,
    unit_price, total_price, gst_rate, cgst_amount, sgst_amount
) VALUES (
    1,
    'Consultation Fee',
    'SERVICE',
    1,
    500.00,
    500.00,
    18.0,
    45.00,
    45.00
) RETURNING *;
```

### 5. Create Prescription

```sql
INSERT INTO prescriptions (
    prescription_number, patient_id, doctor_id,
    prescription_date, status, notes
) VALUES (
    'PRES' || nextval('prescriptions_seq'),
    1,
    1,
    CURRENT_DATE,
    'ACTIVE',
    'Take medicine after meals'
) RETURNING *;

-- Add prescription medicine
INSERT INTO prescription_medicines (
    prescription_id, medicine_id, medicine_name,
    dosage, frequency, duration_days, instructions
) VALUES (
    1,
    1,
    'Paracetamol 500mg',
    '1 tablet',
    'Twice daily',
    5,
    'After meals'
) RETURNING *;
```

### 6. Create Hospital

```sql
INSERT INTO hospitals (
    hospital_code, name, short_name,
    address_line1, city, state, pincode,
    phone, email, gstin
) VALUES (
    'HMS001',
    'Renbow Hospital',
    'RENBOW',
    '200m North of Saidpur Kotwali',
    'Saidpur',
    'Uttar Pradesh',
    '233001',
    '8528695991',
    'info@rainbowhealthclinic.com',
    '27AABCU3361R1Z5'
) RETURNING *;
```

### 7. Create Department

```sql
INSERT INTO departments (
    hospital_id, name, code, description
) VALUES (
    1,
    'Cardiology',
    'CARD',
    'Heart and cardiovascular diseases'
) RETURNING *;
```

---

## ✏️ UPDATE Operations

### 1. Update Patient

```sql
-- Update patient information
UPDATE patients
SET 
    first_name = 'John',
    last_name = 'Doe Updated',
    email = 'john.updated@email.com',
    city = 'Delhi',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Update patient mobile
UPDATE patients
SET mobile_number = '9876543210'
WHERE id = 1;
```

### 2. Update Appointment Status

```sql
-- Mark appointment as completed
UPDATE appointments
SET 
    status = 'COMPLETED',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Cancel appointment
UPDATE appointments
SET 
    status = 'CANCELLED',
    cancellation_reason = 'Patient request',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

### 3. Update Invoice Payment

```sql
-- Record payment
UPDATE invoices
SET 
    amount_paid = amount_paid + 1000.00,
    balance_amount = total_amount - (amount_paid + 1000.00),
    payment_status = CASE 
        WHEN (amount_paid + 1000.00) >= total_amount THEN 'SUCCESS'
        WHEN (amount_paid + 1000.00) > 0 THEN 'PARTIALLY_PAID'
        ELSE 'PENDING'
    END,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Mark invoice as paid
UPDATE invoices
SET 
    amount_paid = total_amount,
    balance_amount = 0.00,
    payment_status = 'SUCCESS',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

### 4. Update Medicine Stock

```sql
-- Update stock quantity
UPDATE medicine_stock
SET 
    current_stock = current_stock + 100,
    updated_at = CURRENT_TIMESTAMP
WHERE medicine_id = 1 AND hospital_id = 1;

-- Reduce stock (after dispensing)
UPDATE medicine_stock
SET 
    current_stock = current_stock - 10,
    updated_at = CURRENT_TIMESTAMP
WHERE medicine_id = 1 AND hospital_id = 1;
```

### 5. Update Doctor Schedule

```sql
UPDATE doctor_schedules
SET 
    start_time = '09:00:00',
    end_time = '17:00:00',
    updated_at = CURRENT_TIMESTAMP
WHERE doctor_id = 1 AND day_of_week = 'MONDAY';
```

---

## 🗑️ DELETE Operations

### 1. Delete Patient (Soft Delete - Set deleted flag)

```sql
-- Soft delete (recommended - preserves data)
UPDATE patients
SET deleted = true, updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Hard delete (use with caution!)
DELETE FROM patients WHERE id = 1;
```

### 2. Cancel Appointment

```sql
-- Cancel appointment (soft delete)
UPDATE appointments
SET 
    status = 'CANCELLED',
    cancellation_reason = 'Cancelled by admin',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Hard delete (not recommended)
DELETE FROM appointments WHERE id = 1;
```

### 3. Delete Invoice Item

```sql
DELETE FROM invoice_items WHERE id = 1;
```

### 4. Delete Prescription Medicine

```sql
DELETE FROM prescription_medicines WHERE id = 1;
```

---

## 📈 Advanced Queries

### 1. Dashboard Statistics

```sql
-- Today's appointments count
SELECT COUNT(*) as today_appointments
FROM appointments
WHERE appointment_date = CURRENT_DATE;

-- Today's revenue
SELECT COALESCE(SUM(amount_paid), 0) as today_revenue
FROM invoices
WHERE invoice_date = CURRENT_DATE;

-- Total patients
SELECT COUNT(*) as total_patients FROM patients;

-- Active doctors
SELECT COUNT(*) as active_doctors
FROM doctors
WHERE enabled = true;

-- Pending appointments
SELECT COUNT(*) as pending_appointments
FROM appointments
WHERE status IN ('CONFIRMED', 'PENDING');
```

### 2. Patient Statistics

```sql
-- Patients by age group
SELECT 
    CASE 
        WHEN age_years < 18 THEN 'Child'
        WHEN age_years < 60 THEN 'Adult'
        ELSE 'Senior'
    END as age_group,
    COUNT(*) as count
FROM patients
GROUP BY age_group;

-- Patients by gender
SELECT gender, COUNT(*) as count
FROM patients
GROUP BY gender;

-- Patients by blood group
SELECT blood_group, COUNT(*) as count
FROM patients
WHERE blood_group IS NOT NULL
GROUP BY blood_group;
```

### 3. Revenue Reports

```sql
-- Revenue by month
SELECT 
    DATE_TRUNC('month', invoice_date) as month,
    SUM(total_amount) as total_revenue,
    SUM(amount_paid) as collected,
    SUM(balance_amount) as pending
FROM invoices
GROUP BY DATE_TRUNC('month', invoice_date)
ORDER BY month DESC;

-- Revenue by payment status
SELECT 
    payment_status,
    COUNT(*) as count,
    SUM(total_amount) as total_amount,
    SUM(amount_paid) as collected
FROM invoices
GROUP BY payment_status;
```

### 4. Doctor Performance

```sql
-- Appointments per doctor
SELECT 
    d.display_name,
    COUNT(a.id) as total_appointments,
    COUNT(CASE WHEN a.status = 'COMPLETED' THEN 1 END) as completed
FROM doctors d
LEFT JOIN appointments a ON d.id = a.doctor_id
GROUP BY d.id, d.display_name
ORDER BY total_appointments DESC;
```

### 5. Medicine Inventory

```sql
-- Low stock alert
SELECT 
    m.name,
    ms.current_stock,
    ms.minimum_stock_level,
    (ms.minimum_stock_level - ms.current_stock) as shortage
FROM medicine_stock ms
JOIN medicines m ON ms.medicine_id = m.id
WHERE ms.current_stock <= ms.minimum_stock_level
ORDER BY shortage DESC;
```

---

## 🔧 Utility Queries

### 1. Check Table Sizes

```sql
-- Table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 2. Check Indexes

```sql
-- List all indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### 3. Recent Activity

```sql
-- Recent appointments
SELECT * FROM appointments
ORDER BY created_at DESC
LIMIT 10;

-- Recent invoices
SELECT * FROM invoices
ORDER BY created_at DESC
LIMIT 10;

-- Recent patients
SELECT * FROM patients
ORDER BY created_at DESC
LIMIT 10;
```

### 4. Data Validation

```sql
-- Check for duplicate UHIDs
SELECT uhid, COUNT(*) as count
FROM patients
GROUP BY uhid
HAVING COUNT(*) > 1;

-- Check for duplicate mobile numbers
SELECT mobile_number, COUNT(*) as count
FROM patients
GROUP BY mobile_number
HAVING COUNT(*) > 1;

-- Check appointments without patients
SELECT * FROM appointments
WHERE patient_id NOT IN (SELECT id FROM patients);
```

---

## 📝 Notes

1. **Always use transactions** for multiple related operations
2. **Use RETURNING *** to see inserted/updated data
3. **Soft delete** is recommended (set deleted flag) instead of hard delete
4. **Check foreign keys** before deleting referenced records
5. **Use indexes** for better performance on large tables

---

## 🔐 Security Notes

- **Never expose** database credentials publicly
- **Use parameterized queries** in application code
- **Limit access** to production database
- **Backup regularly** before major operations
- **Test queries** on development/staging first

---

## 📚 Quick Reference

**Main Tables:**
- `patients` - Patient records
- `doctors` - Doctor information  
- `appointments` - Appointments
- `invoices` - Billing
- `prescriptions` - Prescriptions
- `hospitals` - Hospitals
- `departments` - Departments
- `users` - System users

**Common Operations:**
- `SELECT` - Read data
- `INSERT` - Create records
- `UPDATE` - Modify records
- `DELETE` - Remove records (use soft delete)

---

## 🆘 Troubleshooting

### Connection Issues
```sql
-- Test connection
SELECT version();
SELECT current_database();
SELECT current_user;
```

### Check Table Exists
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'patients';
```

### Check Column Names
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'patients'
ORDER BY ordinal_position;
```

---

## 🔗 Access Methods

1. **Neon Dashboard**: https://console.neon.tech → SQL Editor
2. **psql**: Command line tool
3. **DBeaver/pgAdmin**: GUI tools
4. **Backend API**: Use REST endpoints (recommended)

For more details, see `NEON_DATABASE_GUIDE.md`
