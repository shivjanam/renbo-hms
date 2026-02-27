-- ===========================================
-- Hospital Management System
-- Sample Data: Patients (50 with Indian names)
-- ===========================================

-- ==========================================
-- PATIENT USERS (for login)
-- ==========================================

INSERT INTO users (id, mobile_number, first_name, last_name, display_name, primary_role, 
    is_mobile_verified, is_active, is_deleted, preferred_language, created_at, created_by)
VALUES
-- Family 1: Sharma Family (3 members on same mobile)
(100, '9876501001', 'Ramesh', 'Sharma', 'Ramesh Sharma', 'PATIENT', TRUE, TRUE, FALSE, 'hi', NOW(), 'SYSTEM'),
-- Family 2: Patel Family (2 members)
(101, '9876501002', 'Suresh', 'Patel', 'Suresh Patel', 'PATIENT', TRUE, TRUE, FALSE, 'en', NOW(), 'SYSTEM'),
-- Family 3: Verma Family (4 members)
(102, '9876501003', 'Mahesh', 'Verma', 'Mahesh Verma', 'PATIENT', TRUE, TRUE, FALSE, 'hi', NOW(), 'SYSTEM'),
-- Individual patients
(103, '9876501004', 'Rahul', 'Gupta', 'Rahul Gupta', 'PATIENT', TRUE, TRUE, FALSE, 'en', NOW(), 'SYSTEM'),
(104, '9876501005', 'Priya', 'Singh', 'Priya Singh', 'PATIENT', TRUE, TRUE, FALSE, 'en', NOW(), 'SYSTEM'),
(105, '9876501006', 'Amit', 'Kumar', 'Amit Kumar', 'PATIENT', TRUE, TRUE, FALSE, 'hi', NOW(), 'SYSTEM'),
(106, '9876501007', 'Neha', 'Joshi', 'Neha Joshi', 'PATIENT', TRUE, TRUE, FALSE, 'en', NOW(), 'SYSTEM'),
(107, '9876501008', 'Deepak', 'Reddy', 'Deepak Reddy', 'PATIENT', TRUE, TRUE, FALSE, 'en', NOW(), 'SYSTEM'),
(108, '9876501009', 'Sneha', 'Iyer', 'Sneha Iyer', 'PATIENT', TRUE, TRUE, FALSE, 'en', NOW(), 'SYSTEM'),
(109, '9876501010', 'Rajesh', 'Nair', 'Rajesh Nair', 'PATIENT', TRUE, TRUE, FALSE, 'en', NOW(), 'SYSTEM');

INSERT INTO user_roles (user_id, role) VALUES
(100, 'PATIENT'), (101, 'PATIENT'), (102, 'PATIENT'), (103, 'PATIENT'), (104, 'PATIENT'),
(105, 'PATIENT'), (106, 'PATIENT'), (107, 'PATIENT'), (108, 'PATIENT'), (109, 'PATIENT');

-- ==========================================
-- PATIENTS (50 patients)
-- ==========================================

INSERT INTO patients (id, uhid, registered_hospital_id, first_name, middle_name, last_name, 
    date_of_birth, gender, blood_group, mobile_number, alternate_mobile, email,
    address_line1, address_line2, city, district, state, pincode,
    emergency_contact_name, emergency_contact_relation, emergency_contact_phone,
    allergies, chronic_conditions, current_medications,
    insurance_provider, insurance_policy_number, insurance_validity,
    preferred_language, is_vip, sms_consent, email_consent, whatsapp_consent,
    user_id, is_active, is_deleted, created_at, created_by)
VALUES
-- Family 1: Sharma Family (Primary: Ramesh)
(1, 'HMS2600001', 1, 'Ramesh', NULL, 'Sharma', '1965-03-15', 'MALE', 'B_POSITIVE', '9876501001', '9876501011', 'ramesh.sharma@gmail.com',
 'B-45, Sector 18', 'Near Metro Station', 'Mumbai', 'Mumbai Suburban', 'Maharashtra', '400076',
 'Kamla Sharma', 'Wife', '9876501011',
 'Penicillin', 'Diabetes Type 2, Hypertension', 'Metformin 500mg, Amlodipine 5mg',
 'Star Health', 'SH/2024/123456', '2025-12-31',
 'hi', FALSE, TRUE, TRUE, TRUE, 100, TRUE, FALSE, NOW(), 'SYSTEM'),

(2, 'HMS2600002', 1, 'Kamla', 'Devi', 'Sharma', '1970-08-22', 'FEMALE', 'O_POSITIVE', '9876501001', NULL, NULL,
 'B-45, Sector 18', 'Near Metro Station', 'Mumbai', 'Mumbai Suburban', 'Maharashtra', '400076',
 'Ramesh Sharma', 'Husband', '9876501001',
 NULL, 'Hypothyroidism', 'Thyronorm 50mcg',
 'Star Health', 'SH/2024/123457', '2025-12-31',
 'hi', FALSE, TRUE, FALSE, TRUE, NULL, TRUE, FALSE, NOW(), 'SYSTEM'),

(3, 'HMS2600003', 1, 'Rahul', NULL, 'Sharma', '1995-11-10', 'MALE', 'B_POSITIVE', '9876501001', '9876501012', 'rahul.sharma@gmail.com',
 'B-45, Sector 18', 'Near Metro Station', 'Mumbai', 'Mumbai Suburban', 'Maharashtra', '400076',
 'Ramesh Sharma', 'Father', '9876501001',
 NULL, NULL, NULL,
 NULL, NULL, NULL,
 'en', FALSE, TRUE, TRUE, TRUE, NULL, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Family 2: Patel Family
(4, 'HMS2600004', 1, 'Suresh', 'Bhai', 'Patel', '1958-05-20', 'MALE', 'A_POSITIVE', '9876501002', NULL, 'suresh.patel@yahoo.com',
 '12, Gokuldham Society', 'Andheri East', 'Mumbai', 'Mumbai Suburban', 'Maharashtra', '400069',
 'Jayaben Patel', 'Wife', '9876501022',
 'Sulfa drugs', 'Coronary Artery Disease', 'Aspirin 75mg, Atorvastatin 20mg',
 'ICICI Lombard', 'IL/2024/789012', '2025-06-30',
 'en', TRUE, TRUE, TRUE, TRUE, 101, TRUE, FALSE, NOW(), 'SYSTEM'),

(5, 'HMS2600005', 1, 'Jayaben', NULL, 'Patel', '1962-09-14', 'FEMALE', 'A_NEGATIVE', '9876501002', NULL, NULL,
 '12, Gokuldham Society', 'Andheri East', 'Mumbai', 'Mumbai Suburban', 'Maharashtra', '400069',
 'Suresh Patel', 'Husband', '9876501002',
 'Ibuprofen', 'Arthritis', 'Calcium supplements',
 'ICICI Lombard', 'IL/2024/789013', '2025-06-30',
 'en', TRUE, TRUE, FALSE, TRUE, NULL, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Family 3: Verma Family (4 members)
(6, 'HMS2600006', 5, 'Mahesh', 'Chandra', 'Verma', '1972-12-05', 'MALE', 'O_NEGATIVE', '9876501003', '9876501033', 'mahesh.verma@outlook.com',
 'C-78, Greater Kailash', 'Part 2', 'New Delhi', 'South Delhi', 'Delhi', '110048',
 'Sunita Verma', 'Wife', '9876501003',
 NULL, 'Asthma', 'Asthalin inhaler',
 'Max Bupa', 'MB/2024/456789', '2026-03-31',
 'hi', FALSE, TRUE, TRUE, TRUE, 102, TRUE, FALSE, NOW(), 'SYSTEM'),

(7, 'HMS2600007', 5, 'Sunita', NULL, 'Verma', '1978-04-18', 'FEMALE', 'AB_POSITIVE', '9876501003', NULL, 'sunita.verma@gmail.com',
 'C-78, Greater Kailash', 'Part 2', 'New Delhi', 'South Delhi', 'Delhi', '110048',
 'Mahesh Verma', 'Husband', '9876501003',
 'Peanuts', 'PCOS', 'Birth control pills',
 'Max Bupa', 'MB/2024/456790', '2026-03-31',
 'en', FALSE, TRUE, TRUE, TRUE, NULL, TRUE, FALSE, NOW(), 'SYSTEM'),

(8, 'HMS2600008', 5, 'Ankur', NULL, 'Verma', '2005-07-25', 'MALE', 'O_NEGATIVE', '9876501003', NULL, NULL,
 'C-78, Greater Kailash', 'Part 2', 'New Delhi', 'South Delhi', 'Delhi', '110048',
 'Mahesh Verma', 'Father', '9876501003',
 'Dust allergy', NULL, NULL,
 'Max Bupa', 'MB/2024/456791', '2026-03-31',
 'en', FALSE, TRUE, FALSE, TRUE, NULL, TRUE, FALSE, NOW(), 'SYSTEM'),

(9, 'HMS2600009', 5, 'Ankita', NULL, 'Verma', '2008-02-12', 'FEMALE', 'AB_POSITIVE', '9876501003', NULL, NULL,
 'C-78, Greater Kailash', 'Part 2', 'New Delhi', 'South Delhi', 'Delhi', '110048',
 'Sunita Verma', 'Mother', '9876501003',
 NULL, NULL, NULL,
 'Max Bupa', 'MB/2024/456792', '2026-03-31',
 'en', FALSE, TRUE, FALSE, FALSE, NULL, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Individual Patients (10-50)
(10, 'HMS2600010', 1, 'Rahul', NULL, 'Gupta', '1988-06-30', 'MALE', 'B_NEGATIVE', '9876501004', NULL, 'rahul.gupta@gmail.com',
 '25, MG Road', 'Vile Parle', 'Mumbai', 'Mumbai Suburban', 'Maharashtra', '400057',
 'Sanjay Gupta', 'Brother', '9876501044',
 NULL, 'Migraine', 'Sumatriptan as needed',
 NULL, NULL, NULL, 'en', FALSE, TRUE, TRUE, TRUE, 103, TRUE, FALSE, NOW(), 'SYSTEM'),

(11, 'HMS2600011', 1, 'Priya', 'Kumari', 'Singh', '1992-01-15', 'FEMALE', 'A_POSITIVE', '9876501005', NULL, 'priya.singh@hotmail.com',
 '56, Lokhandwala', 'Andheri West', 'Mumbai', 'Mumbai Suburban', 'Maharashtra', '400053',
 'Raj Singh', 'Husband', '9876501055',
 'Shellfish', 'PCOD', 'Multivitamins',
 'HDFC Ergo', 'HE/2024/111222', '2025-09-30',
 'en', FALSE, TRUE, TRUE, TRUE, 104, TRUE, FALSE, NOW(), 'SYSTEM'),

(12, 'HMS2600012', 1, 'Amit', 'Prakash', 'Kumar', '1979-09-08', 'MALE', 'O_POSITIVE', '9876501006', '9876501066', 'amit.kumar@yahoo.com',
 '89, Powai Lake Road', 'Hiranandani Gardens', 'Mumbai', 'Mumbai Suburban', 'Maharashtra', '400076',
 'Reena Kumar', 'Wife', '9876501066',
 NULL, 'Diabetes Type 2', 'Glimepiride 2mg',
 'Reliance General', 'RG/2024/333444', '2025-12-31',
 'hi', FALSE, TRUE, TRUE, TRUE, 105, TRUE, FALSE, NOW(), 'SYSTEM'),

(13, 'HMS2600013', 5, 'Neha', NULL, 'Joshi', '1990-04-22', 'FEMALE', 'B_POSITIVE', '9876501007', NULL, 'neha.joshi@gmail.com',
 'D-12, Vasant Kunj', 'Sector D', 'New Delhi', 'South West Delhi', 'Delhi', '110070',
 'Vijay Joshi', 'Father', '9876501077',
 'Latex', 'Anxiety disorder', 'Escitalopram 10mg',
 'Niva Bupa', 'NB/2024/555666', '2026-01-31',
 'en', FALSE, TRUE, TRUE, FALSE, 106, TRUE, FALSE, NOW(), 'SYSTEM'),

(14, 'HMS2600014', 5, 'Deepak', NULL, 'Reddy', '1985-11-30', 'MALE', 'AB_NEGATIVE', '9876501008', NULL, 'deepak.reddy@outlook.com',
 'E-45, Saket', 'Near Select City Walk', 'New Delhi', 'South Delhi', 'Delhi', '110017',
 'Lakshmi Reddy', 'Mother', '9876501088',
 NULL, 'Slip disc', 'Pregabalin 75mg',
 'Aditya Birla Health', 'ABH/2024/777888', '2025-08-31',
 'en', FALSE, TRUE, TRUE, TRUE, 107, TRUE, FALSE, NOW(), 'SYSTEM'),

(15, 'HMS2600015', 5, 'Sneha', 'Venkat', 'Iyer', '1994-07-18', 'FEMALE', 'A_NEGATIVE', '9876501009', NULL, 'sneha.iyer@gmail.com',
 'F-23, Defence Colony', 'Block A', 'New Delhi', 'South Delhi', 'Delhi', '110024',
 'Venkatesh Iyer', 'Father', '9876501099',
 'Eggs', 'Eczema', 'Tacrolimus ointment',
 NULL, NULL, NULL, 'en', FALSE, TRUE, TRUE, TRUE, 108, TRUE, FALSE, NOW(), 'SYSTEM'),

-- More individual patients (16-50)
(16, 'HMS2600016', 1, 'Rajesh', 'Krishnan', 'Nair', '1968-03-25', 'MALE', 'O_POSITIVE', '9876501010', NULL, 'rajesh.nair@gmail.com',
 'G-78, Bandra West', 'Turner Road', 'Mumbai', 'Mumbai Suburban', 'Maharashtra', '400050',
 'Lakshmi Nair', 'Wife', '9876501100',
 NULL, 'Prostate enlargement, High cholesterol', 'Tamsulosin 0.4mg, Rosuvastatin 10mg',
 'SBI General', 'SBI/2024/999000', '2025-11-30',
 'en', TRUE, TRUE, TRUE, TRUE, 109, TRUE, FALSE, NOW(), 'SYSTEM'),

(17, 'HMS2600017', 1, 'Kavita', NULL, 'Menon', '1987-08-12', 'FEMALE', 'B_POSITIVE', '9876502001', NULL, 'kavita.menon@yahoo.com',
 '23, Juhu Tara Road', 'Juhu', 'Mumbai', 'Mumbai Suburban', 'Maharashtra', '400049',
 'Suresh Menon', 'Husband', '9876502011',
 NULL, 'Thyroid disorder', 'Eltroxin 100mcg',
 NULL, NULL, NULL, 'en', FALSE, TRUE, TRUE, TRUE, NULL, TRUE, FALSE, NOW(), 'SYSTEM'),

(18, 'HMS2600018', 1, 'Vijay', 'Shankar', 'Pillai', '1975-12-03', 'MALE', 'A_POSITIVE', '9876502002', NULL, 'vijay.pillai@outlook.com',
 '45, Dadar TT Circle', 'Dadar West', 'Mumbai', 'Mumbai', 'Maharashtra', '400028',
 'Meera Pillai', 'Wife', '9876502022',
 'Aspirin', 'Gout', 'Febuxostat 40mg',
 'New India Assurance', 'NIA/2024/112233', '2026-02-28',
 'en', FALSE, TRUE, FALSE, TRUE, NULL, TRUE, FALSE, NOW(), 'SYSTEM'),

(19, 'HMS2600019', 1, 'Ananya', NULL, 'Desai', '2010-05-28', 'FEMALE', 'O_NEGATIVE', '9876502003', NULL, NULL,
 '67, Malad West', 'Link Road', 'Mumbai', 'Mumbai Suburban', 'Maharashtra', '400064',
 'Rakesh Desai', 'Father', '9876502003',
 'Pollen', 'Allergic rhinitis', 'Cetirizine 10mg as needed',
 NULL, NULL, NULL, 'en', FALSE, TRUE, FALSE, FALSE, NULL, TRUE, FALSE, NOW(), 'SYSTEM'),

(20, 'HMS2600020', 1, 'Sunil', 'Ramchandra', 'Patil', '1960-10-17', 'MALE', 'AB_POSITIVE', '9876502004', '9876502044', 'sunil.patil@gmail.com',
 '89, Borivali East', 'Near IC Colony', 'Mumbai', 'Mumbai Suburban', 'Maharashtra', '400066',
 'Sunanda Patil', 'Wife', '9876502004',
 NULL, 'Chronic kidney disease Stage 2, Hypertension', 'Telmisartan 40mg, Low protein diet',
 'Oriental Insurance', 'OI/2024/445566', '2025-07-31',
 'hi', TRUE, TRUE, TRUE, TRUE, NULL, TRUE, FALSE, NOW(), 'SYSTEM');

-- Set family relationships
UPDATE patients SET primary_account_id = 1, relation_to_primary = 'Wife' WHERE id = 2;
UPDATE patients SET primary_account_id = 1, relation_to_primary = 'Son' WHERE id = 3;
UPDATE patients SET primary_account_id = 4, relation_to_primary = 'Wife' WHERE id = 5;
UPDATE patients SET primary_account_id = 6, relation_to_primary = 'Wife' WHERE id = 7;
UPDATE patients SET primary_account_id = 6, relation_to_primary = 'Son' WHERE id = 8;
UPDATE patients SET primary_account_id = 6, relation_to_primary = 'Daughter' WHERE id = 9;

-- Continue with patients 21-50 (abbreviated for space)
INSERT INTO patients (id, uhid, registered_hospital_id, first_name, last_name, date_of_birth, gender, blood_group, 
    mobile_number, city, state, pincode, preferred_language, is_active, is_deleted, created_at, created_by)
VALUES
(21, 'HMS2600021', 1, 'Manoj', 'Tiwari', '1982-02-14', 'MALE', 'B_POSITIVE', '9876502005', 'Mumbai', 'Maharashtra', '400001', 'hi', TRUE, FALSE, NOW(), 'SYSTEM'),
(22, 'HMS2600022', 1, 'Ritu', 'Agarwal', '1989-06-20', 'FEMALE', 'A_POSITIVE', '9876502006', 'Mumbai', 'Maharashtra', '400002', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(23, 'HMS2600023', 1, 'Sanjay', 'Yadav', '1977-09-11', 'MALE', 'O_POSITIVE', '9876502007', 'Mumbai', 'Maharashtra', '400003', 'hi', TRUE, FALSE, NOW(), 'SYSTEM'),
(24, 'HMS2600024', 1, 'Pooja', 'Saxena', '1995-03-28', 'FEMALE', 'B_NEGATIVE', '9876502008', 'Mumbai', 'Maharashtra', '400004', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(25, 'HMS2600025', 1, 'Rohit', 'Chauhan', '1983-11-05', 'MALE', 'AB_POSITIVE', '9876502009', 'Mumbai', 'Maharashtra', '400005', 'hi', TRUE, FALSE, NOW(), 'SYSTEM'),
(26, 'HMS2600026', 5, 'Meenakshi', 'Pillai', '1991-07-16', 'FEMALE', 'A_NEGATIVE', '9876502010', 'Delhi', 'Delhi', '110001', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(27, 'HMS2600027', 5, 'Arvind', 'Kejriwal', '1969-08-16', 'MALE', 'O_POSITIVE', '9876502011', 'Delhi', 'Delhi', '110002', 'hi', TRUE, FALSE, NOW(), 'SYSTEM'),
(28, 'HMS2600028', 5, 'Deepika', 'Padukone', '1986-01-05', 'FEMALE', 'B_POSITIVE', '9876502012', 'Delhi', 'Delhi', '110003', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(29, 'HMS2600029', 5, 'Virat', 'Kohli', '1988-11-05', 'MALE', 'A_POSITIVE', '9876502013', 'Delhi', 'Delhi', '110004', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(30, 'HMS2600030', 5, 'Anushka', 'Sharma', '1988-05-01', 'FEMALE', 'O_NEGATIVE', '9876502014', 'Delhi', 'Delhi', '110005', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(31, 'HMS2600031', 1, 'Karan', 'Johar', '1972-05-25', 'MALE', 'B_POSITIVE', '9876502015', 'Mumbai', 'Maharashtra', '400006', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(32, 'HMS2600032', 1, 'Alia', 'Bhatt', '1993-03-15', 'FEMALE', 'A_POSITIVE', '9876502016', 'Mumbai', 'Maharashtra', '400007', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(33, 'HMS2600033', 1, 'Ranbir', 'Kapoor', '1982-09-28', 'MALE', 'O_POSITIVE', '9876502017', 'Mumbai', 'Maharashtra', '400008', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(34, 'HMS2600034', 1, 'Katrina', 'Kaif', '1983-07-16', 'FEMALE', 'B_NEGATIVE', '9876502018', 'Mumbai', 'Maharashtra', '400009', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(35, 'HMS2600035', 1, 'Salman', 'Khan', '1965-12-27', 'MALE', 'AB_POSITIVE', '9876502019', 'Mumbai', 'Maharashtra', '400010', 'hi', TRUE, FALSE, NOW(), 'SYSTEM'),
(36, 'HMS2600036', 5, 'Priyanka', 'Chopra', '1982-07-18', 'FEMALE', 'A_POSITIVE', '9876502020', 'Delhi', 'Delhi', '110006', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(37, 'HMS2600037', 5, 'Shahid', 'Kapoor', '1981-02-25', 'MALE', 'O_POSITIVE', '9876502021', 'Delhi', 'Delhi', '110007', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(38, 'HMS2600038', 5, 'Mira', 'Rajput', '1994-09-07', 'FEMALE', 'B_POSITIVE', '9876502022', 'Delhi', 'Delhi', '110008', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(39, 'HMS2600039', 5, 'Ranveer', 'Singh', '1985-07-06', 'MALE', 'A_NEGATIVE', '9876502023', 'Delhi', 'Delhi', '110009', 'hi', TRUE, FALSE, NOW(), 'SYSTEM'),
(40, 'HMS2600040', 5, 'Deepti', 'Sharma', '1997-08-24', 'FEMALE', 'O_POSITIVE', '9876502024', 'Delhi', 'Delhi', '110010', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(41, 'HMS2600041', 1, 'Ajay', 'Devgn', '1969-04-02', 'MALE', 'B_POSITIVE', '9876502025', 'Mumbai', 'Maharashtra', '400011', 'hi', TRUE, FALSE, NOW(), 'SYSTEM'),
(42, 'HMS2600042', 1, 'Kajol', 'Devgn', '1974-08-05', 'FEMALE', 'A_POSITIVE', '9876502026', 'Mumbai', 'Maharashtra', '400012', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(43, 'HMS2600043', 1, 'Hrithik', 'Roshan', '1974-01-10', 'MALE', 'O_NEGATIVE', '9876502027', 'Mumbai', 'Maharashtra', '400013', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(44, 'HMS2600044', 1, 'Suzanne', 'Khan', '1978-10-26', 'FEMALE', 'B_POSITIVE', '9876502028', 'Mumbai', 'Maharashtra', '400014', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(45, 'HMS2600045', 1, 'Akshay', 'Kumar', '1967-09-09', 'MALE', 'AB_POSITIVE', '9876502029', 'Mumbai', 'Maharashtra', '400015', 'hi', TRUE, FALSE, NOW(), 'SYSTEM'),
(46, 'HMS2600046', 5, 'Twinkle', 'Khanna', '1974-12-29', 'FEMALE', 'A_POSITIVE', '9876502030', 'Delhi', 'Delhi', '110011', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(47, 'HMS2600047', 5, 'Saif', 'Ali Khan', '1970-08-16', 'MALE', 'O_POSITIVE', '9876502031', 'Delhi', 'Delhi', '110012', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(48, 'HMS2600048', 5, 'Kareena', 'Kapoor', '1980-09-21', 'FEMALE', 'B_NEGATIVE', '9876502032', 'Delhi', 'Delhi', '110013', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(49, 'HMS2600049', 5, 'Arjun', 'Kapoor', '1985-06-26', 'MALE', 'A_POSITIVE', '9876502033', 'Delhi', 'Delhi', '110014', 'en', TRUE, FALSE, NOW(), 'SYSTEM'),
(50, 'HMS2600050', 5, 'Malaika', 'Arora', '1973-10-23', 'FEMALE', 'O_POSITIVE', '9876502034', 'Delhi', 'Delhi', '110015', 'en', TRUE, FALSE, NOW(), 'SYSTEM');

SELECT 'Patients seeded successfully!' as status;
SELECT COUNT(*) as total_patients FROM patients;
