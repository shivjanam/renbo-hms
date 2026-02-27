-- ===========================================
-- Hospital Management System
-- Sample Data: Staff, Doctors, Nurses
-- ===========================================

-- ==========================================
-- USERS (Authentication)
-- ==========================================

-- Admin Users
INSERT INTO users (id, username, email, mobile_number, password_hash, first_name, last_name, display_name,
    primary_role, hospital_id, is_mobile_verified, is_active, is_deleted, created_at, created_by)
VALUES
-- Super Admin
(1, 'superadmin', 'superadmin@hms.in', '9999999999', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'System', 'Administrator', 'System Admin', 'SUPER_ADMIN', NULL, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Hospital Admins
(2, 'admin.cgh', 'admin@citygeneralhospital.in', '9876543210', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Rajesh', 'Sharma', 'Rajesh Sharma', 'HOSPITAL_ADMIN', 1, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(3, 'admin.ach', 'admin@apollocare.in', '9876543211', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Priya', 'Gupta', 'Priya Gupta', 'HOSPITAL_ADMIN', 5, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Receptionists
(4, 'reception.cgh', 'reception@citygeneralhospital.in', '9876543220', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Sunita', 'Devi', 'Sunita Devi', 'RECEPTIONIST', 1, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(5, 'reception.ach', 'reception@apollocare.in', '9876543221', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Kavita', 'Singh', 'Kavita Singh', 'RECEPTIONIST', 5, TRUE, TRUE, FALSE, NOW(), 'SYSTEM');

-- User roles mapping
INSERT INTO user_roles (user_id, role) VALUES
(1, 'SUPER_ADMIN'),
(2, 'HOSPITAL_ADMIN'),
(3, 'HOSPITAL_ADMIN'),
(4, 'RECEPTIONIST'),
(5, 'RECEPTIONIST');

-- ==========================================
-- DOCTORS
-- ==========================================

-- Doctor Users
INSERT INTO users (id, username, email, mobile_number, password_hash, first_name, last_name, display_name,
    primary_role, hospital_id, department_id, is_mobile_verified, is_active, is_deleted, created_at, created_by)
VALUES
-- CGH Doctors
(10, 'dr.amit.kumar', 'amit.kumar@citygeneralhospital.in', '9898989801', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Amit', 'Kumar', 'Dr. Amit Kumar', 'DOCTOR', 1, 1, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(11, 'dr.sanjay.mehta', 'sanjay.mehta@citygeneralhospital.in', '9898989802', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Sanjay', 'Mehta', 'Dr. Sanjay Mehta', 'SPECIALIST', 1, 2, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(12, 'dr.neha.patel', 'neha.patel@citygeneralhospital.in', '9898989803', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Neha', 'Patel', 'Dr. Neha Patel', 'DOCTOR', 1, 3, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(13, 'dr.rekha.sharma', 'rekha.sharma@citygeneralhospital.in', '9898989804', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Rekha', 'Sharma', 'Dr. Rekha Sharma', 'DOCTOR', 1, 4, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(14, 'dr.meera.iyer', 'meera.iyer@citygeneralhospital.in', '9898989805', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Meera', 'Iyer', 'Dr. Meera Iyer', 'SPECIALIST', 1, 5, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- ACH Doctors
(15, 'dr.vikram.singh', 'vikram.singh@apollocare.in', '9898989806', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Vikram', 'Singh', 'Dr. Vikram Singh', 'DOCTOR', 5, 11, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(16, 'dr.arun.verma', 'arun.verma@apollocare.in', '9898989807', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Arun', 'Verma', 'Dr. Arun Verma', 'SPECIALIST', 5, 12, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(17, 'dr.suresh.nair', 'suresh.nair@apollocare.in', '9898989808', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Suresh', 'Nair', 'Dr. Suresh Nair', 'SPECIALIST', 5, 13, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(18, 'dr.deepak.joshi', 'deepak.joshi@apollocare.in', '9898989809', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Deepak', 'Joshi', 'Dr. Deepak Joshi', 'DOCTOR', 5, 14, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(19, 'dr.anita.reddy', 'anita.reddy@apollocare.in', '9898989810', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Anita', 'Reddy', 'Dr. Anita Reddy', 'SPECIALIST', 5, 15, TRUE, TRUE, FALSE, NOW(), 'SYSTEM');

-- User roles for doctors
INSERT INTO user_roles (user_id, role) VALUES
(10, 'DOCTOR'), (11, 'SPECIALIST'), (12, 'DOCTOR'), (13, 'DOCTOR'), (14, 'SPECIALIST'),
(15, 'DOCTOR'), (16, 'SPECIALIST'), (17, 'SPECIALIST'), (18, 'DOCTOR'), (19, 'SPECIALIST');

-- Doctor profiles
INSERT INTO doctors (id, employee_id, first_name, last_name, display_name, title, gender, date_of_birth,
    mobile_number, email, registration_number, registration_council, registration_valid_until,
    primary_specialization, qualifications, experience_years, bio,
    primary_hospital_id, primary_department_id,
    opd_consultation_fee, follow_up_fee, emergency_fee, teleconsultation_fee, follow_up_validity_days,
    slot_duration_minutes, max_patients_per_day, accepts_online_booking, accepts_walk_ins, teleconsultation_enabled,
    user_id, is_active, is_deleted, created_at, created_by)
VALUES
-- CGH Doctors
(1, 'CGH-D001', 'Amit', 'Kumar', 'Dr. Amit Kumar', 'Dr.', 'MALE', '1975-05-15',
 '9898989801', 'amit.kumar@citygeneralhospital.in', 'MH/MC/12345', 'Maharashtra Medical Council', '2026-12-31',
 'GENERAL_MEDICINE', 'MBBS, MD (General Medicine)', 20, 'Senior General Physician with 20 years of experience in treating chronic diseases and preventive healthcare.',
 1, 1, 500, 300, 800, 400, 7, 15, 40, TRUE, TRUE, TRUE, 10, TRUE, FALSE, NOW(), 'SYSTEM'),

(2, 'CGH-D002', 'Sanjay', 'Mehta', 'Dr. Sanjay Mehta', 'Dr.', 'MALE', '1970-08-22',
 '9898989802', 'sanjay.mehta@citygeneralhospital.in', 'MH/MC/12346', 'Maharashtra Medical Council', '2026-12-31',
 'CARDIOLOGY', 'MBBS, MD, DM (Cardiology)', 25, 'Renowned Cardiologist specializing in interventional cardiology and heart failure management.',
 1, 2, 800, 500, 1500, 700, 14, 20, 30, TRUE, TRUE, TRUE, 11, TRUE, FALSE, NOW(), 'SYSTEM'),

(3, 'CGH-D003', 'Neha', 'Patel', 'Dr. Neha Patel', 'Dr.', 'FEMALE', '1982-03-10',
 '9898989803', 'neha.patel@citygeneralhospital.in', 'MH/MC/12347', 'Maharashtra Medical Council', '2026-12-31',
 'ORTHOPEDICS', 'MBBS, MS (Orthopedics)', 15, 'Orthopedic surgeon specializing in joint replacement and sports medicine.',
 1, 3, 700, 400, 1200, 600, 10, 20, 25, TRUE, TRUE, FALSE, 12, TRUE, FALSE, NOW(), 'SYSTEM'),

(4, 'CGH-D004', 'Rekha', 'Sharma', 'Dr. Rekha Sharma', 'Dr.', 'FEMALE', '1978-11-28',
 '9898989804', 'rekha.sharma@citygeneralhospital.in', 'MH/MC/12348', 'Maharashtra Medical Council', '2026-12-31',
 'PEDIATRICS', 'MBBS, MD (Pediatrics)', 18, 'Pediatrician with expertise in neonatal care and childhood development.',
 1, 4, 600, 350, 1000, 500, 7, 15, 35, TRUE, TRUE, TRUE, 13, TRUE, FALSE, NOW(), 'SYSTEM'),

(5, 'CGH-D005', 'Meera', 'Iyer', 'Dr. Meera Iyer', 'Dr.', 'FEMALE', '1976-07-05',
 '9898989805', 'meera.iyer@citygeneralhospital.in', 'MH/MC/12349', 'Maharashtra Medical Council', '2026-12-31',
 'GYNECOLOGY', 'MBBS, MS (OBG), DNB', 22, 'Senior Gynecologist specializing in high-risk pregnancies and laparoscopic surgery.',
 1, 5, 700, 400, 1200, 600, 14, 20, 28, TRUE, TRUE, TRUE, 14, TRUE, FALSE, NOW(), 'SYSTEM'),

-- ACH Doctors
(6, 'ACH-D001', 'Vikram', 'Singh', 'Dr. Vikram Singh', 'Dr.', 'MALE', '1980-02-14',
 '9898989806', 'vikram.singh@apollocare.in', 'DL/MC/23456', 'Delhi Medical Council', '2026-12-31',
 'GENERAL_MEDICINE', 'MBBS, MD (Internal Medicine)', 17, 'Internal Medicine specialist with focus on diabetes and metabolic disorders.',
 5, 11, 600, 350, 1000, 500, 7, 15, 40, TRUE, TRUE, TRUE, 15, TRUE, FALSE, NOW(), 'SYSTEM'),

(7, 'ACH-D002', 'Arun', 'Verma', 'Dr. Arun Verma', 'Dr.', 'MALE', '1968-09-30',
 '9898989807', 'arun.verma@apollocare.in', 'DL/MC/23457', 'Delhi Medical Council', '2026-12-31',
 'CARDIOLOGY', 'MBBS, MD, DM (Cardiology), FACC', 28, 'Senior Interventional Cardiologist with expertise in complex angioplasty and valve interventions.',
 5, 12, 1000, 600, 2000, 800, 14, 30, 20, TRUE, TRUE, TRUE, 16, TRUE, FALSE, NOW(), 'SYSTEM'),

(8, 'ACH-D003', 'Suresh', 'Nair', 'Dr. Suresh Nair', 'Dr.', 'MALE', '1972-04-18',
 '9898989808', 'suresh.nair@apollocare.in', 'DL/MC/23458', 'Delhi Medical Council', '2026-12-31',
 'NEUROLOGY', 'MBBS, MD, DM (Neurology)', 24, 'Neurologist specializing in stroke management and epilepsy.',
 5, 13, 1200, 700, 2500, 1000, 14, 30, 18, TRUE, TRUE, TRUE, 17, TRUE, FALSE, NOW(), 'SYSTEM'),

(9, 'ACH-D004', 'Deepak', 'Joshi', 'Dr. Deepak Joshi', 'Dr.', 'MALE', '1979-12-08',
 '9898989809', 'deepak.joshi@apollocare.in', 'DL/MC/23459', 'Delhi Medical Council', '2026-12-31',
 'ORTHOPEDICS', 'MBBS, MS (Orthopedics), MCh (Spine)', 18, 'Spine surgeon with expertise in minimally invasive spine surgery.',
 5, 14, 800, 500, 1500, 700, 10, 20, 22, TRUE, TRUE, FALSE, 18, TRUE, FALSE, NOW(), 'SYSTEM'),

(10, 'ACH-D005', 'Anita', 'Reddy', 'Dr. Anita Reddy', 'Dr.', 'FEMALE', '1974-06-25',
 '9898989810', 'anita.reddy@apollocare.in', 'DL/MC/23460', 'Delhi Medical Council', '2026-12-31',
 'GYNECOLOGY', 'MBBS, MS (OBG), Fellowship in Reproductive Medicine', 23, 'Fertility specialist and high-risk pregnancy expert.',
 5, 15, 900, 550, 1800, 750, 14, 20, 25, TRUE, TRUE, TRUE, 19, TRUE, FALSE, NOW(), 'SYSTEM');

-- ==========================================
-- NURSES
-- ==========================================

INSERT INTO users (id, username, email, mobile_number, password_hash, first_name, last_name, display_name,
    primary_role, hospital_id, is_mobile_verified, is_active, is_deleted, created_at, created_by)
VALUES
(30, 'nurse.lata', 'lata.kumari@citygeneralhospital.in', '9876540001', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Lata', 'Kumari', 'Nurse Lata Kumari', 'NURSE', 1, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(31, 'nurse.pooja', 'pooja.singh@citygeneralhospital.in', '9876540002', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Pooja', 'Singh', 'Nurse Pooja Singh', 'NURSE', 1, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(32, 'nurse.geeta', 'geeta.devi@apollocare.in', '9876540003', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Geeta', 'Devi', 'Nurse Geeta Devi', 'NURSE_HEAD', 5, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(33, 'nurse.suman', 'suman.rani@apollocare.in', '9876540004', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Suman', 'Rani', 'Nurse Suman Rani', 'NURSE', 5, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(34, 'nurse.kiran', 'kiran.bala@apollocare.in', '9876540005', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Kiran', 'Bala', 'Nurse Kiran Bala', 'NURSE', 5, TRUE, TRUE, FALSE, NOW(), 'SYSTEM');

INSERT INTO user_roles (user_id, role) VALUES
(30, 'NURSE'), (31, 'NURSE'), (32, 'NURSE_HEAD'), (33, 'NURSE'), (34, 'NURSE');

-- ==========================================
-- LAB TECHNICIANS
-- ==========================================

INSERT INTO users (id, username, email, mobile_number, password_hash, first_name, last_name, display_name,
    primary_role, hospital_id, is_mobile_verified, is_active, is_deleted, created_at, created_by)
VALUES
(40, 'lab.ravi', 'ravi.kumar@citygeneralhospital.in', '9876550001', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Ravi', 'Kumar', 'Ravi Kumar', 'LAB_HEAD', 1, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(41, 'lab.mohan', 'mohan.lal@citygeneralhospital.in', '9876550002', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Mohan', 'Lal', 'Mohan Lal', 'LAB_TECHNICIAN', 1, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(42, 'lab.sunil', 'sunil.sharma@apollocare.in', '9876550003', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Sunil', 'Sharma', 'Sunil Sharma', 'LAB_TECHNICIAN', 5, TRUE, TRUE, FALSE, NOW(), 'SYSTEM');

INSERT INTO user_roles (user_id, role) VALUES
(40, 'LAB_HEAD'), (41, 'LAB_TECHNICIAN'), (42, 'LAB_TECHNICIAN');

-- ==========================================
-- PHARMACISTS
-- ==========================================

INSERT INTO users (id, username, email, mobile_number, password_hash, first_name, last_name, display_name,
    primary_role, hospital_id, is_mobile_verified, is_active, is_deleted, created_at, created_by)
VALUES
(50, 'pharma.ramesh', 'ramesh.gupta@citygeneralhospital.in', '9876560001', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Ramesh', 'Gupta', 'Ramesh Gupta', 'PHARMACY_HEAD', 1, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(51, 'pharma.dinesh', 'dinesh.verma@apollocare.in', '9876560002', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu', 'Dinesh', 'Verma', 'Dinesh Verma', 'PHARMACIST', 5, TRUE, TRUE, FALSE, NOW(), 'SYSTEM');

INSERT INTO user_roles (user_id, role) VALUES
(50, 'PHARMACY_HEAD'), (51, 'PHARMACIST');

SELECT 'Staff and Doctors seeded successfully!' as status;
