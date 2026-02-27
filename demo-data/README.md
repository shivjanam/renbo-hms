# Hospital Management System - Demo Data

This folder contains SQL scripts to seed the database with realistic Indian sample data for testing and demonstration purposes.

## Data Summary

### Hospitals & Infrastructure
- **2 Hospital Groups** with **3 branches each** (8 total locations)
- **5 Departments per major hospital** (General Medicine, Cardiology, Orthopedics, Pediatrics, Gynecology, Emergency)

### Staff
- **2 Super/Hospital Admins**
- **10 Doctors** (various specializations)
- **5 Nurses**
- **3 Lab Technicians**
- **2 Pharmacists**
- **2 Receptionists**

### Patients
- **50 Patients** with Indian names
- **Family-based records** (3 families with multiple members on same mobile)
- Medical histories, allergies, insurance information

### Inventory
- **70+ Medicines** (Indian brands: Cipla, Sun Pharma, Dr Reddy's, etc.)
- **50+ Lab Tests** (CBC, LFT, KFT, Thyroid, Cardiac markers, etc.)

### Sample Transactions
- Doctor schedules for weekdays
- Today's appointments in various states (Completed, In Progress, Waiting, Scheduled)
- Sample prescriptions with medicines
- Lab orders with test items

## Execution Order

Run the scripts in order:

```bash
# 1. Hospitals and Departments
mysql -u root -p hms_db < 01_hospitals_and_departments.sql

# 2. Staff and Doctors
mysql -u root -p hms_db < 02_staff_and_doctors.sql

# 3. Patients
mysql -u root -p hms_db < 03_patients.sql

# 4. Medicines and Lab Tests
mysql -u root -p hms_db < 04_medicines_and_lab_tests.sql

# 5. Sample Appointments, Prescriptions, Lab Orders
mysql -u root -p hms_db < 05_sample_appointments.sql
```

Or run all at once:

```bash
cat 0*.sql | mysql -u root -p hms_db
```

## Test Credentials

### Admin Users
| Role | Username | Password | Mobile |
|------|----------|----------|--------|
| Super Admin | superadmin | password123 | 9999999999 |
| Hospital Admin (CGH) | admin.cgh | password123 | 9876543210 |
| Hospital Admin (ACH) | admin.ach | password123 | 9876543211 |

### Doctors
| Name | Specialization | Mobile | Hospital |
|------|---------------|--------|----------|
| Dr. Amit Kumar | General Medicine | 9898989801 | CGH |
| Dr. Sanjay Mehta | Cardiology | 9898989802 | CGH |
| Dr. Neha Patel | Orthopedics | 9898989803 | CGH |
| Dr. Vikram Singh | General Medicine | 9898989806 | ACH |
| Dr. Arun Verma | Cardiology | 9898989807 | ACH |

### Patients (Sample)
| Name | Mobile | Hospital | Notes |
|------|--------|----------|-------|
| Ramesh Sharma | 9876501001 | CGH | Family head (3 members) |
| Suresh Patel | 9876501002 | CGH | VIP patient, cardiac history |
| Mahesh Verma | 9876501003 | ACH | Family head (4 members) |

## Password Hash

All passwords are set to `password123` using BCrypt:
```
$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu
```

## Notes

1. **Mobile Numbers**: All start with valid Indian prefixes (6-9)
2. **Aadhaar**: Not seeded for privacy (optional field)
3. **Dates**: Appointments use `CURDATE()` for today's date
4. **GST**: GSTIN and PAN are sample formats
5. **Medicine Prices**: Based on approximate Indian market prices (MRP)

## Resetting Data

To reset and reseed:

```sql
-- Truncate all tables (careful in production!)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE prescription_medicines;
TRUNCATE TABLE prescriptions;
TRUNCATE TABLE lab_order_items;
TRUNCATE TABLE lab_orders;
TRUNCATE TABLE queue_entries;
TRUNCATE TABLE appointments;
TRUNCATE TABLE doctor_schedules;
TRUNCATE TABLE medicine_stock;
TRUNCATE TABLE medicines;
TRUNCATE TABLE lab_tests;
TRUNCATE TABLE patients;
TRUNCATE TABLE doctors;
TRUNCATE TABLE user_roles;
TRUNCATE TABLE users;
TRUNCATE TABLE departments;
TRUNCATE TABLE hospitals;
SET FOREIGN_KEY_CHECKS = 1;
```

Then run the seed scripts again.
