-- ===========================================
-- Hospital Management System
-- Sample Data: Medicines & Lab Tests
-- ===========================================

-- ==========================================
-- MEDICINES (100 medicines - Indian market)
-- ==========================================

INSERT INTO medicines (id, medicine_code, name, generic_name, brand_name, manufacturer, medicine_type,
    strength, composition, category, schedule, hsn_code, unit, pack_size,
    mrp, purchase_price, selling_price, gst_percentage,
    reorder_level, max_stock_level,
    is_generic, is_narcotic, requires_prescription, is_refrigerated,
    is_active, is_deleted, created_at, created_by)
VALUES
-- Antibiotics
(1, 'MED001', 'Amoxicillin 500mg', 'Amoxicillin', 'Mox 500', 'Cipla', 'CAPSULE', '500mg', 'Amoxicillin 500mg', 'Antibiotic', 'H', '3004', 'Strip', 10, 120.00, 80.00, 100.00, 12.0, 100, 1000, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 'MED002', 'Azithromycin 500mg', 'Azithromycin', 'Azithral 500', 'Alembic', 'TABLET', '500mg', 'Azithromycin 500mg', 'Antibiotic', 'H', '3004', 'Strip', 3, 180.00, 120.00, 150.00, 12.0, 50, 500, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(3, 'MED003', 'Ciprofloxacin 500mg', 'Ciprofloxacin', 'Ciplox 500', 'Cipla', 'TABLET', '500mg', 'Ciprofloxacin 500mg', 'Antibiotic', 'H', '3004', 'Strip', 10, 85.00, 55.00, 70.00, 12.0, 100, 1000, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(4, 'MED004', 'Cefixime 200mg', 'Cefixime', 'Taxim-O 200', 'Alkem', 'TABLET', '200mg', 'Cefixime 200mg', 'Antibiotic', 'H', '3004', 'Strip', 10, 250.00, 170.00, 210.00, 12.0, 80, 800, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Analgesics & Anti-inflammatory
(5, 'MED005', 'Paracetamol 500mg', 'Paracetamol', 'Crocin 500', 'GSK', 'TABLET', '500mg', 'Paracetamol 500mg', 'Analgesic', NULL, '3004', 'Strip', 15, 25.00, 15.00, 20.00, 12.0, 500, 5000, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(6, 'MED006', 'Ibuprofen 400mg', 'Ibuprofen', 'Brufen 400', 'Abbott', 'TABLET', '400mg', 'Ibuprofen 400mg', 'NSAID', NULL, '3004', 'Strip', 10, 35.00, 22.00, 28.00, 12.0, 200, 2000, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(7, 'MED007', 'Diclofenac 50mg', 'Diclofenac', 'Voveran 50', 'Novartis', 'TABLET', '50mg', 'Diclofenac Sodium 50mg', 'NSAID', NULL, '3004', 'Strip', 10, 30.00, 18.00, 24.00, 12.0, 200, 2000, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(8, 'MED008', 'Tramadol 50mg', 'Tramadol', 'Ultracet', 'J&J', 'TABLET', '50mg', 'Tramadol 37.5mg + Paracetamol 325mg', 'Opioid Analgesic', 'H', '3004', 'Strip', 10, 180.00, 120.00, 150.00, 12.0, 50, 500, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Antidiabetics
(10, 'MED010', 'Metformin 500mg', 'Metformin', 'Glycomet 500', 'USV', 'TABLET', '500mg', 'Metformin HCl 500mg', 'Antidiabetic', 'H', '3004', 'Strip', 20, 45.00, 28.00, 36.00, 12.0, 200, 2000, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(11, 'MED011', 'Glimepiride 2mg', 'Glimepiride', 'Amaryl 2', 'Sanofi', 'TABLET', '2mg', 'Glimepiride 2mg', 'Antidiabetic', 'H', '3004', 'Strip', 10, 120.00, 80.00, 100.00, 12.0, 100, 1000, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(12, 'MED012', 'Sitagliptin 100mg', 'Sitagliptin', 'Januvia 100', 'MSD', 'TABLET', '100mg', 'Sitagliptin 100mg', 'Antidiabetic', 'H', '3004', 'Strip', 7, 650.00, 450.00, 560.00, 12.0, 50, 500, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Antihypertensives
(15, 'MED015', 'Amlodipine 5mg', 'Amlodipine', 'Stamlo 5', 'Dr Reddy', 'TABLET', '5mg', 'Amlodipine Besylate 5mg', 'Antihypertensive', 'H', '3004', 'Strip', 10, 45.00, 28.00, 36.00, 12.0, 200, 2000, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(16, 'MED016', 'Telmisartan 40mg', 'Telmisartan', 'Telma 40', 'Glenmark', 'TABLET', '40mg', 'Telmisartan 40mg', 'Antihypertensive', 'H', '3004', 'Strip', 10, 90.00, 58.00, 75.00, 12.0, 150, 1500, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(17, 'MED017', 'Atenolol 50mg', 'Atenolol', 'Tenormin 50', 'AstraZeneca', 'TABLET', '50mg', 'Atenolol 50mg', 'Beta Blocker', 'H', '3004', 'Strip', 14, 35.00, 22.00, 28.00, 12.0, 200, 2000, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Cardiac
(20, 'MED020', 'Aspirin 75mg', 'Aspirin', 'Ecosprin 75', 'USV', 'TABLET', '75mg', 'Aspirin 75mg (Enteric Coated)', 'Antiplatelet', NULL, '3004', 'Strip', 14, 25.00, 15.00, 20.00, 12.0, 300, 3000, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(21, 'MED021', 'Atorvastatin 10mg', 'Atorvastatin', 'Lipitor 10', 'Pfizer', 'TABLET', '10mg', 'Atorvastatin 10mg', 'Statin', 'H', '3004', 'Strip', 10, 150.00, 95.00, 125.00, 12.0, 150, 1500, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(22, 'MED022', 'Clopidogrel 75mg', 'Clopidogrel', 'Clopilet 75', 'Sun Pharma', 'TABLET', '75mg', 'Clopidogrel 75mg', 'Antiplatelet', 'H', '3004', 'Strip', 10, 120.00, 78.00, 100.00, 12.0, 100, 1000, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Gastrointestinal
(25, 'MED025', 'Omeprazole 20mg', 'Omeprazole', 'Omez 20', 'Dr Reddy', 'CAPSULE', '20mg', 'Omeprazole 20mg', 'PPI', 'H', '3004', 'Strip', 15, 85.00, 55.00, 70.00, 12.0, 200, 2000, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(26, 'MED026', 'Pantoprazole 40mg', 'Pantoprazole', 'Pan 40', 'Alkem', 'TABLET', '40mg', 'Pantoprazole 40mg', 'PPI', 'H', '3004', 'Strip', 15, 120.00, 78.00, 100.00, 12.0, 200, 2000, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(27, 'MED027', 'Domperidone 10mg', 'Domperidone', 'Domstal 10', 'Torrent', 'TABLET', '10mg', 'Domperidone 10mg', 'Antiemetic', 'H', '3004', 'Strip', 10, 35.00, 22.00, 28.00, 12.0, 200, 2000, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Respiratory
(30, 'MED030', 'Salbutamol Inhaler', 'Salbutamol', 'Asthalin Inhaler', 'Cipla', 'INHALER', '100mcg', 'Salbutamol 100mcg/puff', 'Bronchodilator', 'H', '3004', 'Inhaler', 1, 150.00, 95.00, 125.00, 12.0, 50, 500, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(31, 'MED031', 'Montelukast 10mg', 'Montelukast', 'Montair 10', 'Cipla', 'TABLET', '10mg', 'Montelukast 10mg', 'Leukotriene Antagonist', 'H', '3004', 'Strip', 10, 180.00, 115.00, 150.00, 12.0, 100, 1000, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Antihistamines
(35, 'MED035', 'Cetirizine 10mg', 'Cetirizine', 'Cetzine 10', 'Dr Reddy', 'TABLET', '10mg', 'Cetirizine 10mg', 'Antihistamine', NULL, '3004', 'Strip', 10, 25.00, 15.00, 20.00, 12.0, 300, 3000, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(36, 'MED036', 'Levocetirizine 5mg', 'Levocetirizine', 'Xyzal 5', 'UCB', 'TABLET', '5mg', 'Levocetirizine 5mg', 'Antihistamine', 'H', '3004', 'Strip', 10, 65.00, 42.00, 55.00, 12.0, 200, 2000, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Vitamins & Supplements
(40, 'MED040', 'Vitamin B Complex', 'B-Complex', 'Becosules', 'Pfizer', 'CAPSULE', NULL, 'B1, B2, B3, B6, B12', 'Vitamin', NULL, '3004', 'Strip', 20, 45.00, 28.00, 38.00, 5.0, 200, 2000, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(41, 'MED041', 'Calcium + Vitamin D3', 'Calcium', 'Shelcal 500', 'Torrent', 'TABLET', '500mg', 'Calcium 500mg + Vitamin D3 250 IU', 'Supplement', NULL, '3004', 'Strip', 15, 180.00, 115.00, 150.00, 5.0, 150, 1500, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(42, 'MED042', 'Iron + Folic Acid', 'Iron', 'Autrin', 'Pfizer', 'CAPSULE', NULL, 'Ferrous Fumarate + Folic Acid', 'Supplement', NULL, '3004', 'Strip', 30, 85.00, 55.00, 70.00, 5.0, 100, 1000, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Injectables
(50, 'MED050', 'Insulin Glargine', 'Insulin Glargine', 'Lantus', 'Sanofi', 'INJECTION', '100 IU/ml', 'Insulin Glargine', 'Insulin', 'H', '3004', 'Pen', 1, 1800.00, 1250.00, 1500.00, 5.0, 20, 200, FALSE, FALSE, TRUE, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(51, 'MED051', 'Ceftriaxone 1g', 'Ceftriaxone', 'Monocef 1g', 'Aristo', 'INJECTION', '1g', 'Ceftriaxone 1g', 'Antibiotic', 'H', '3004', 'Vial', 1, 85.00, 55.00, 70.00, 12.0, 100, 1000, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Syrups
(60, 'MED060', 'Cough Syrup', 'Dextromethorphan', 'Benadryl', 'J&J', 'SYRUP', '10mg/5ml', 'Diphenhydramine + Ammonium Chloride', 'Cough Suppressant', NULL, '3004', 'Bottle', 1, 95.00, 62.00, 80.00, 12.0, 100, 1000, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(61, 'MED061', 'Paracetamol Syrup', 'Paracetamol', 'Calpol', 'GSK', 'SYRUP', '120mg/5ml', 'Paracetamol 120mg/5ml', 'Analgesic', NULL, '3004', 'Bottle', 1, 65.00, 42.00, 55.00, 12.0, 150, 1500, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Creams & Ointments
(70, 'MED070', 'Clotrimazole Cream', 'Clotrimazole', 'Candid Cream', 'Glenmark', 'CREAM', '1%', 'Clotrimazole 1%', 'Antifungal', 'H', '3004', 'Tube', 1, 85.00, 55.00, 70.00, 12.0, 80, 800, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(71, 'MED071', 'Betamethasone Cream', 'Betamethasone', 'Betnovate', 'GSK', 'CREAM', '0.1%', 'Betamethasone 0.1%', 'Corticosteroid', 'H', '3004', 'Tube', 1, 120.00, 78.00, 100.00, 12.0, 60, 600, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, NOW(), 'SYSTEM');

-- ==========================================
-- LAB TESTS (Common Indian lab tests)
-- ==========================================

INSERT INTO lab_tests (id, test_code, name, short_name, description, category, sub_category, department,
    sample_type, sample_volume, container_type, fasting_required, fasting_hours, turnaround_time, turnaround_hours,
    price, cost, gst_percentage, is_panel, is_outsourced, is_home_collection_available, display_order,
    is_active, is_deleted, created_at, created_by)
VALUES
-- Hematology
(1, 'LAB001', 'Complete Blood Count', 'CBC', 'Full blood count including RBC, WBC, platelets, hemoglobin', 'Hematology', NULL, 'Pathology',
 'Blood', '3ml', 'EDTA', FALSE, NULL, '4 hours', 4, 350.00, 150.00, 5.0, TRUE, FALSE, TRUE, 1, TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 'LAB002', 'Hemoglobin', 'Hb', 'Hemoglobin estimation', 'Hematology', NULL, 'Pathology',
 'Blood', '2ml', 'EDTA', FALSE, NULL, '2 hours', 2, 80.00, 30.00, 5.0, FALSE, FALSE, TRUE, 2, TRUE, FALSE, NOW(), 'SYSTEM'),
(3, 'LAB003', 'Erythrocyte Sedimentation Rate', 'ESR', 'ESR Westergren method', 'Hematology', NULL, 'Pathology',
 'Blood', '2ml', 'EDTA', FALSE, NULL, '2 hours', 2, 100.00, 40.00, 5.0, FALSE, FALSE, TRUE, 3, TRUE, FALSE, NOW(), 'SYSTEM'),
(4, 'LAB004', 'Platelet Count', 'PLT', 'Platelet count', 'Hematology', NULL, 'Pathology',
 'Blood', '2ml', 'EDTA', FALSE, NULL, '2 hours', 2, 120.00, 50.00, 5.0, FALSE, FALSE, TRUE, 4, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Biochemistry
(10, 'LAB010', 'Fasting Blood Sugar', 'FBS', 'Fasting glucose level', 'Biochemistry', 'Diabetes', 'Pathology',
 'Blood', '2ml', 'Fluoride', TRUE, 8, '2 hours', 2, 80.00, 35.00, 5.0, FALSE, FALSE, TRUE, 10, TRUE, FALSE, NOW(), 'SYSTEM'),
(11, 'LAB011', 'Post Prandial Blood Sugar', 'PPBS', 'Post meal glucose level', 'Biochemistry', 'Diabetes', 'Pathology',
 'Blood', '2ml', 'Fluoride', FALSE, NULL, '2 hours', 2, 80.00, 35.00, 5.0, FALSE, FALSE, TRUE, 11, TRUE, FALSE, NOW(), 'SYSTEM'),
(12, 'LAB012', 'HbA1c', 'HbA1c', 'Glycated hemoglobin', 'Biochemistry', 'Diabetes', 'Pathology',
 'Blood', '3ml', 'EDTA', FALSE, NULL, '24 hours', 24, 450.00, 200.00, 5.0, FALSE, FALSE, TRUE, 12, TRUE, FALSE, NOW(), 'SYSTEM'),
(13, 'LAB013', 'Lipid Profile', 'Lipid', 'Total cholesterol, HDL, LDL, triglycerides, VLDL', 'Biochemistry', 'Cardiac', 'Pathology',
 'Blood', '3ml', 'Plain', TRUE, 12, '6 hours', 6, 550.00, 250.00, 5.0, TRUE, FALSE, TRUE, 13, TRUE, FALSE, NOW(), 'SYSTEM'),
(14, 'LAB014', 'Liver Function Test', 'LFT', 'Complete liver profile including SGOT, SGPT, ALP, Bilirubin', 'Biochemistry', 'Hepatic', 'Pathology',
 'Blood', '3ml', 'Plain', FALSE, NULL, '6 hours', 6, 650.00, 300.00, 5.0, TRUE, FALSE, TRUE, 14, TRUE, FALSE, NOW(), 'SYSTEM'),
(15, 'LAB015', 'Kidney Function Test', 'KFT', 'Urea, Creatinine, BUN, Uric Acid, Electrolytes', 'Biochemistry', 'Renal', 'Pathology',
 'Blood', '3ml', 'Plain', FALSE, NULL, '6 hours', 6, 600.00, 280.00, 5.0, TRUE, FALSE, TRUE, 15, TRUE, FALSE, NOW(), 'SYSTEM'),
(16, 'LAB016', 'Thyroid Profile', 'Thyroid', 'T3, T4, TSH', 'Biochemistry', 'Endocrine', 'Pathology',
 'Blood', '3ml', 'Plain', FALSE, NULL, '24 hours', 24, 800.00, 400.00, 5.0, TRUE, FALSE, TRUE, 16, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Urine Analysis
(20, 'LAB020', 'Urine Routine', 'Urine R/M', 'Complete urine analysis', 'Clinical Pathology', NULL, 'Pathology',
 'Urine', '30ml', 'Sterile Container', FALSE, NULL, '2 hours', 2, 150.00, 60.00, 5.0, FALSE, FALSE, FALSE, 20, TRUE, FALSE, NOW(), 'SYSTEM'),
(21, 'LAB021', 'Urine Culture', 'Urine C/S', 'Urine culture and sensitivity', 'Microbiology', NULL, 'Pathology',
 'Urine', '30ml', 'Sterile Container', FALSE, NULL, '48 hours', 48, 550.00, 250.00, 5.0, FALSE, FALSE, FALSE, 21, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Cardiac Markers
(30, 'LAB030', 'Troponin T', 'TropT', 'Cardiac troponin T', 'Biochemistry', 'Cardiac', 'Pathology',
 'Blood', '3ml', 'Plain', FALSE, NULL, '4 hours', 4, 1200.00, 600.00, 5.0, FALSE, FALSE, TRUE, 30, TRUE, FALSE, NOW(), 'SYSTEM'),
(31, 'LAB031', 'CPK-MB', 'CK-MB', 'Creatine Kinase MB fraction', 'Biochemistry', 'Cardiac', 'Pathology',
 'Blood', '3ml', 'Plain', FALSE, NULL, '4 hours', 4, 450.00, 200.00, 5.0, FALSE, FALSE, TRUE, 31, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Radiology (Imaging)
(40, 'LAB040', 'Chest X-Ray PA View', 'CXR', 'Chest X-ray Posteroanterior view', 'Radiology', 'X-Ray', 'Radiology',
 'N/A', NULL, NULL, FALSE, NULL, '1 hour', 1, 350.00, 150.00, 18.0, FALSE, FALSE, FALSE, 40, TRUE, FALSE, NOW(), 'SYSTEM'),
(41, 'LAB041', 'ECG', 'ECG', '12-lead electrocardiogram', 'Cardiology', NULL, 'Cardiology',
 'N/A', NULL, NULL, FALSE, NULL, '30 min', 0, 250.00, 100.00, 18.0, FALSE, FALSE, FALSE, 41, TRUE, FALSE, NOW(), 'SYSTEM'),
(42, 'LAB042', 'USG Abdomen', 'USG Abd', 'Ultrasonography of whole abdomen', 'Radiology', 'USG', 'Radiology',
 'N/A', NULL, NULL, TRUE, 6, '1 hour', 1, 1200.00, 600.00, 18.0, FALSE, FALSE, FALSE, 42, TRUE, FALSE, NOW(), 'SYSTEM'),
(43, 'LAB043', '2D Echo', 'Echo', '2D Echocardiography', 'Cardiology', NULL, 'Cardiology',
 'N/A', NULL, NULL, FALSE, NULL, '1 hour', 1, 2500.00, 1200.00, 18.0, FALSE, FALSE, FALSE, 43, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Special Tests
(50, 'LAB050', 'COVID-19 RT-PCR', 'COVID PCR', 'SARS-CoV-2 RT-PCR', 'Molecular Diagnostics', NULL, 'Pathology',
 'Nasopharyngeal Swab', NULL, 'VTM', FALSE, NULL, '24 hours', 24, 500.00, 250.00, 5.0, FALSE, FALSE, TRUE, 50, TRUE, FALSE, NOW(), 'SYSTEM'),
(51, 'LAB051', 'Dengue NS1 Antigen', 'NS1', 'Dengue NS1 antigen test', 'Serology', NULL, 'Pathology',
 'Blood', '3ml', 'Plain', FALSE, NULL, '4 hours', 4, 800.00, 400.00, 5.0, FALSE, FALSE, TRUE, 51, TRUE, FALSE, NOW(), 'SYSTEM'),
(52, 'LAB052', 'Vitamin D3', 'Vit D3', '25-hydroxyvitamin D', 'Biochemistry', 'Vitamins', 'Pathology',
 'Blood', '3ml', 'Plain', FALSE, NULL, '24 hours', 24, 1200.00, 600.00, 5.0, FALSE, FALSE, TRUE, 52, TRUE, FALSE, NOW(), 'SYSTEM'),
(53, 'LAB053', 'Vitamin B12', 'Vit B12', 'Serum Vitamin B12', 'Biochemistry', 'Vitamins', 'Pathology',
 'Blood', '3ml', 'Plain', FALSE, NULL, '24 hours', 24, 800.00, 400.00, 5.0, FALSE, FALSE, TRUE, 53, TRUE, FALSE, NOW(), 'SYSTEM');

SELECT 'Medicines and Lab Tests seeded successfully!' as status;
SELECT COUNT(*) as total_medicines FROM medicines;
SELECT COUNT(*) as total_lab_tests FROM lab_tests;
