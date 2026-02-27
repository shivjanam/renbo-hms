-- ===========================================
-- Hospital Management System
-- Sample Data: Hospitals, Branches & Departments
-- ===========================================

-- Clear existing data (for fresh seeding)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE departments;
TRUNCATE TABLE hospitals;
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- HOSPITALS
-- ==========================================

-- Hospital 1: City General Hospital (Main)
INSERT INTO hospitals (id, hospital_code, name, short_name, description, hospital_type, 
    registration_number, license_number, accreditation,
    address_line1, address_line2, city, district, state, pincode, country,
    phone, alternate_phone, email, website,
    gstin, pan, bank_name, bank_account_name, bank_account_number, bank_ifsc, bank_branch, upi_id,
    is_branch, timezone, currency, default_language, total_beds, emergency_enabled, teleconsultation_enabled,
    is_active, is_deleted, created_at, created_by)
VALUES 
(1, 'CGH001', 'City General Hospital', 'CGH', 
 'Premier multi-specialty hospital serving the community since 1995', 'Multi-Specialty',
 'MH/REG/2024/001', 'MH/LIC/2024/001', 'NABH Accredited',
 'Plot No. 45, Sector 18', 'Near Metro Station', 'Mumbai', 'Mumbai Suburban', 'Maharashtra', '400076', 'India',
 '+91-22-26789012', '+91-22-26789013', 'info@citygeneralhospital.in', 'www.citygeneralhospital.in',
 '27AABCU9603R1ZM', 'AABCU9603R', 'State Bank of India', 'City General Hospital', '39876543210123', 'SBIN0001234', 'Vashi Branch', 'citygeneralhospital@upi',
 FALSE, 'Asia/Kolkata', 'INR', 'en', 200, TRUE, TRUE,
 TRUE, FALSE, NOW(), 'SYSTEM'),

-- Hospital 1 - Branch 1: CGH Thane
(2, 'CGH002', 'City General Hospital - Thane', 'CGH Thane', 
 'Thane branch of City General Hospital', 'Multi-Specialty',
 'MH/REG/2024/002', 'MH/LIC/2024/002', 'NABH Accredited',
 'Ghodbunder Road', 'Opposite Viviana Mall', 'Thane', 'Thane', 'Maharashtra', '400607', 'India',
 '+91-22-25678901', NULL, 'thane@citygeneralhospital.in', 'www.citygeneralhospital.in/thane',
 '27AABCU9603R1ZM', 'AABCU9603R', 'State Bank of India', 'City General Hospital', '39876543210124', 'SBIN0005678', 'Thane Branch', 'cghthane@upi',
 TRUE, 'Asia/Kolkata', 'INR', 'en', 100, TRUE, TRUE,
 TRUE, FALSE, NOW(), 'SYSTEM'),

-- Hospital 1 - Branch 2: CGH Navi Mumbai  
(3, 'CGH003', 'City General Hospital - Navi Mumbai', 'CGH Navi Mumbai',
 'Navi Mumbai branch of City General Hospital', 'Multi-Specialty',
 'MH/REG/2024/003', 'MH/LIC/2024/003', NULL,
 'Sector 15, CBD Belapur', 'Palm Beach Road', 'Navi Mumbai', 'Thane', 'Maharashtra', '400614', 'India',
 '+91-22-27891234', NULL, 'navimumbai@citygeneralhospital.in', 'www.citygeneralhospital.in/navimumbai',
 '27AABCU9603R1ZM', 'AABCU9603R', 'HDFC Bank', 'City General Hospital NM', '50100123456789', 'HDFC0001234', 'Belapur Branch', 'cghnm@upi',
 TRUE, 'Asia/Kolkata', 'INR', 'en', 75, TRUE, FALSE,
 TRUE, FALSE, NOW(), 'SYSTEM'),

-- Hospital 1 - Branch 3: CGH Pune
(4, 'CGH004', 'City General Hospital - Pune', 'CGH Pune',
 'Pune branch of City General Hospital', 'Multi-Specialty',
 'MH/REG/2024/004', 'MH/LIC/2024/004', NULL,
 'Baner Road', 'Near Balewadi Stadium', 'Pune', 'Pune', 'Maharashtra', '411045', 'India',
 '+91-20-27891234', NULL, 'pune@citygeneralhospital.in', 'www.citygeneralhospital.in/pune',
 '27AABCU9603R1ZM', 'AABCU9603R', 'ICICI Bank', 'City General Hospital Pune', '123456789012', 'ICIC0001234', 'Baner Branch', 'cghpune@upi',
 TRUE, 'Asia/Kolkata', 'INR', 'en', 80, TRUE, TRUE,
 TRUE, FALSE, NOW(), 'SYSTEM');

-- Hospital 2: Apollo Care Hospital (Main)
INSERT INTO hospitals (id, hospital_code, name, short_name, description, hospital_type,
    registration_number, license_number, accreditation,
    address_line1, address_line2, city, district, state, pincode, country,
    phone, alternate_phone, email, website,
    gstin, pan, bank_name, bank_account_name, bank_account_number, bank_ifsc, bank_branch, upi_id,
    is_branch, timezone, currency, default_language, total_beds, emergency_enabled, teleconsultation_enabled,
    is_active, is_deleted, created_at, created_by)
VALUES
(5, 'ACH001', 'Apollo Care Hospital', 'ACH',
 'Advanced healthcare with cutting-edge technology', 'Super-Specialty',
 'DL/REG/2024/001', 'DL/LIC/2024/001', 'NABH, JCI Accredited',
 'Sarita Vihar', 'Mathura Road', 'New Delhi', 'South Delhi', 'Delhi', '110076', 'India',
 '+91-11-26891234', '+91-11-26891235', 'info@apollocare.in', 'www.apollocare.in',
 '07AABCA1234R1ZP', 'AABCA1234R', 'Axis Bank', 'Apollo Care Hospital', '917020012345678', 'UTIB0001234', 'Sarita Vihar Branch', 'apollocare@upi',
 FALSE, 'Asia/Kolkata', 'INR', 'en', 300, TRUE, TRUE,
 TRUE, FALSE, NOW(), 'SYSTEM'),

-- Hospital 2 - Branch 1: ACH Gurgaon
(6, 'ACH002', 'Apollo Care Hospital - Gurgaon', 'ACH Gurgaon',
 'Gurgaon branch of Apollo Care Hospital', 'Super-Specialty',
 'HR/REG/2024/001', 'HR/LIC/2024/001', 'NABH Accredited',
 'DLF Cyber City', 'Phase 2', 'Gurgaon', 'Gurgaon', 'Haryana', '122002', 'India',
 '+91-124-4567890', NULL, 'gurgaon@apollocare.in', 'www.apollocare.in/gurgaon',
 '06AABCA1234R1ZP', 'AABCA1234R', 'Axis Bank', 'Apollo Care Hospital Gurgaon', '917020012345679', 'UTIB0005678', 'Cyber City Branch', 'achgurgaon@upi',
 TRUE, 'Asia/Kolkata', 'INR', 'en', 150, TRUE, TRUE,
 TRUE, FALSE, NOW(), 'SYSTEM'),

-- Hospital 2 - Branch 2: ACH Noida
(7, 'ACH003', 'Apollo Care Hospital - Noida', 'ACH Noida',
 'Noida branch of Apollo Care Hospital', 'Multi-Specialty',
 'UP/REG/2024/001', 'UP/LIC/2024/001', NULL,
 'Sector 62', 'Near NSEZ Metro', 'Noida', 'Gautam Buddha Nagar', 'Uttar Pradesh', '201309', 'India',
 '+91-120-4567890', NULL, 'noida@apollocare.in', 'www.apollocare.in/noida',
 '09AABCA1234R1ZP', 'AABCA1234R', 'HDFC Bank', 'Apollo Care Hospital Noida', '50100987654321', 'HDFC0005678', 'Sector 62 Branch', 'achnoida@upi',
 TRUE, 'Asia/Kolkata', 'INR', 'en', 100, TRUE, FALSE,
 TRUE, FALSE, NOW(), 'SYSTEM'),

-- Hospital 2 - Branch 3: ACH Faridabad
(8, 'ACH004', 'Apollo Care Hospital - Faridabad', 'ACH Faridabad',
 'Faridabad branch of Apollo Care Hospital', 'General',
 'HR/REG/2024/002', 'HR/LIC/2024/002', NULL,
 'Sector 16', 'Near NHPC Chowk', 'Faridabad', 'Faridabad', 'Haryana', '121002', 'India',
 '+91-129-4567890', NULL, 'faridabad@apollocare.in', 'www.apollocare.in/faridabad',
 '06AABCA1234R2ZP', 'AABCA1234R', 'Punjab National Bank', 'Apollo Care Hospital Faridabad', '1234567890123456', 'PUNB0012340', 'Sector 16 Branch', 'achfbd@upi',
 TRUE, 'Asia/Kolkata', 'INR', 'hi', 60, TRUE, FALSE,
 TRUE, FALSE, NOW(), 'SYSTEM');

-- Set parent hospital references
UPDATE hospitals SET parent_hospital_id = 1 WHERE id IN (2, 3, 4);
UPDATE hospitals SET parent_hospital_id = 5 WHERE id IN (6, 7, 8);

-- ==========================================
-- DEPARTMENTS
-- ==========================================

-- Departments for CGH (Hospital 1)
INSERT INTO departments (hospital_id, department_code, name, short_name, description, specialization,
    floor, building, consultation_fee, follow_up_fee, emergency_fee,
    accepts_appointments, accepts_walk_ins, is_emergency, display_order,
    is_active, is_deleted, created_at, created_by)
VALUES
-- CGH Main Departments
(1, 'CGH-GEN', 'General Medicine', 'Gen Med', 'Primary care and internal medicine', 'GENERAL_MEDICINE', 'Ground Floor', 'Main Building', 500, 300, 800, TRUE, TRUE, FALSE, 1, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 'CGH-CAR', 'Cardiology', 'Cardio', 'Heart and cardiovascular care', 'CARDIOLOGY', '2nd Floor', 'Main Building', 800, 500, 1500, TRUE, TRUE, FALSE, 2, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 'CGH-ORT', 'Orthopedics', 'Ortho', 'Bone and joint care', 'ORTHOPEDICS', '3rd Floor', 'Main Building', 700, 400, 1200, TRUE, TRUE, FALSE, 3, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 'CGH-PED', 'Pediatrics', 'Peds', 'Child healthcare', 'PEDIATRICS', '1st Floor', 'Children Wing', 600, 350, 1000, TRUE, TRUE, FALSE, 4, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 'CGH-GYN', 'Gynecology & Obstetrics', 'Gyn', 'Women health and maternity', 'GYNECOLOGY', '4th Floor', 'Women Wing', 700, 400, 1200, TRUE, TRUE, FALSE, 5, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 'CGH-EMR', 'Emergency', 'ER', '24x7 Emergency services', 'EMERGENCY_MEDICINE', 'Ground Floor', 'Emergency Block', 1000, NULL, 1000, FALSE, TRUE, TRUE, 99, TRUE, FALSE, NOW(), 'SYSTEM'),

-- CGH Thane Departments
(2, 'CGH-TH-GEN', 'General Medicine', 'Gen Med', 'Primary care and internal medicine', 'GENERAL_MEDICINE', 'Ground Floor', 'Main Building', 400, 250, 700, TRUE, TRUE, FALSE, 1, TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 'CGH-TH-CAR', 'Cardiology', 'Cardio', 'Heart and cardiovascular care', 'CARDIOLOGY', '1st Floor', 'Main Building', 700, 450, 1200, TRUE, TRUE, FALSE, 2, TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 'CGH-TH-ORT', 'Orthopedics', 'Ortho', 'Bone and joint care', 'ORTHOPEDICS', '1st Floor', 'Main Building', 600, 350, 1000, TRUE, TRUE, FALSE, 3, TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 'CGH-TH-PED', 'Pediatrics', 'Peds', 'Child healthcare', 'PEDIATRICS', 'Ground Floor', 'Main Building', 500, 300, 800, TRUE, TRUE, FALSE, 4, TRUE, FALSE, NOW(), 'SYSTEM'),

-- ACH Main Departments
(5, 'ACH-GEN', 'General Medicine', 'Gen Med', 'Primary care and internal medicine', 'GENERAL_MEDICINE', 'Ground Floor', 'OPD Block', 600, 350, 1000, TRUE, TRUE, FALSE, 1, TRUE, FALSE, NOW(), 'SYSTEM'),
(5, 'ACH-CAR', 'Cardiology', 'Cardio', 'Advanced heart care', 'CARDIOLOGY', '3rd Floor', 'Cardiac Centre', 1000, 600, 2000, TRUE, TRUE, FALSE, 2, TRUE, FALSE, NOW(), 'SYSTEM'),
(5, 'ACH-NEU', 'Neurology', 'Neuro', 'Brain and nerve care', 'NEUROLOGY', '4th Floor', 'Neuro Centre', 1200, 700, 2500, TRUE, TRUE, FALSE, 3, TRUE, FALSE, NOW(), 'SYSTEM'),
(5, 'ACH-ORT', 'Orthopedics', 'Ortho', 'Bone, joint and spine care', 'ORTHOPEDICS', '2nd Floor', 'OPD Block', 800, 500, 1500, TRUE, TRUE, FALSE, 4, TRUE, FALSE, NOW(), 'SYSTEM'),
(5, 'ACH-GYN', 'Gynecology & Obstetrics', 'Gyn', 'Women health and fertility', 'GYNECOLOGY', '5th Floor', 'Women Centre', 900, 550, 1800, TRUE, TRUE, FALSE, 5, TRUE, FALSE, NOW(), 'SYSTEM'),
(5, 'ACH-EMR', 'Emergency', 'ER', '24x7 Trauma and Emergency', 'EMERGENCY_MEDICINE', 'Ground Floor', 'Emergency Block', 1500, NULL, 1500, FALSE, TRUE, TRUE, 99, TRUE, FALSE, NOW(), 'SYSTEM');

SELECT 'Hospitals and Departments seeded successfully!' as status;
