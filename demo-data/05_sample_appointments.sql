-- ===========================================
-- Hospital Management System
-- Sample Data: Appointments, Prescriptions, Lab Orders
-- ===========================================

-- ==========================================
-- DOCTOR SCHEDULES
-- ==========================================

INSERT INTO doctor_schedules (doctor_id, hospital_id, department_id, day_of_week, 
    start_time, end_time, break_start_time, break_end_time, 
    slot_duration_minutes, max_appointments, is_teleconsultation, room_number, is_recurring,
    is_active, is_deleted, created_at, created_by)
VALUES
-- Dr. Amit Kumar (General Medicine) - CGH
(1, 1, 1, 'MONDAY', '09:00', '13:00', '11:00', '11:30', 15, 16, FALSE, 'OPD-101', TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 1, 1, 'MONDAY', '14:00', '17:00', NULL, NULL, 15, 12, FALSE, 'OPD-101', TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 1, 1, 'TUESDAY', '09:00', '13:00', '11:00', '11:30', 15, 16, FALSE, 'OPD-101', TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 1, 1, 'WEDNESDAY', '09:00', '13:00', '11:00', '11:30', 15, 16, FALSE, 'OPD-101', TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 1, 1, 'THURSDAY', '09:00', '13:00', '11:00', '11:30', 15, 16, FALSE, 'OPD-101', TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 1, 1, 'FRIDAY', '09:00', '13:00', '11:00', '11:30', 15, 16, FALSE, 'OPD-101', TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 1, 1, 'SATURDAY', '09:00', '12:00', NULL, NULL, 15, 12, FALSE, 'OPD-101', TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Dr. Sanjay Mehta (Cardiology) - CGH
(2, 1, 2, 'MONDAY', '10:00', '14:00', '12:00', '12:30', 20, 12, FALSE, 'CARDIO-201', TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 1, 2, 'WEDNESDAY', '10:00', '14:00', '12:00', '12:30', 20, 12, FALSE, 'CARDIO-201', TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 1, 2, 'FRIDAY', '10:00', '14:00', '12:00', '12:30', 20, 12, FALSE, 'CARDIO-201', TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 1, 2, 'TUESDAY', '16:00', '19:00', NULL, NULL, 20, 9, TRUE, NULL, TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Dr. Vikram Singh (General Medicine) - ACH
(6, 5, 11, 'MONDAY', '09:00', '13:00', '11:00', '11:30', 15, 16, FALSE, 'OPD-A101', TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(6, 5, 11, 'TUESDAY', '09:00', '13:00', '11:00', '11:30', 15, 16, FALSE, 'OPD-A101', TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(6, 5, 11, 'WEDNESDAY', '09:00', '13:00', '11:00', '11:30', 15, 16, FALSE, 'OPD-A101', TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(6, 5, 11, 'THURSDAY', '09:00', '13:00', '11:00', '11:30', 15, 16, FALSE, 'OPD-A101', TRUE, TRUE, FALSE, NOW(), 'SYSTEM'),
(6, 5, 11, 'FRIDAY', '09:00', '13:00', '11:00', '11:30', 15, 16, FALSE, 'OPD-A101', TRUE, TRUE, FALSE, NOW(), 'SYSTEM');

-- ==========================================
-- SAMPLE APPOINTMENTS (Today and upcoming)
-- ==========================================

INSERT INTO appointments (id, appointment_number, hospital_id, department_id, patient_id, patient_name, patient_mobile,
    doctor_id, doctor_name, appointment_type, appointment_date, slot_start_time, slot_end_time,
    status, token_number, consultation_fee, is_fee_paid, is_follow_up, booking_source,
    is_active, is_deleted, created_at, created_by)
VALUES
-- Today's appointments for Dr. Amit Kumar
(1, 'APT2602260001', 1, 1, 1, 'Ramesh Sharma', '9876501001', 1, 'Dr. Amit Kumar', 'OPD', CURDATE(), '09:00', '09:15', 'COMPLETED', 1, 500.00, TRUE, FALSE, 'ONLINE', TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 'APT2602260002', 1, 1, 4, 'Suresh Patel', '9876501002', 1, 'Dr. Amit Kumar', 'OPD', CURDATE(), '09:15', '09:30', 'COMPLETED', 2, 500.00, TRUE, FALSE, 'COUNTER', TRUE, FALSE, NOW(), 'SYSTEM'),
(3, 'APT2602260003', 1, 1, 10, 'Rahul Gupta', '9876501004', 1, 'Dr. Amit Kumar', 'OPD', CURDATE(), '09:30', '09:45', 'IN_PROGRESS', 3, 500.00, TRUE, FALSE, 'ONLINE', TRUE, FALSE, NOW(), 'SYSTEM'),
(4, 'APT2602260004', 1, 1, 11, 'Priya Singh', '9876501005', 1, 'Dr. Amit Kumar', 'OPD', CURDATE(), '09:45', '10:00', 'IN_QUEUE', 4, 500.00, TRUE, FALSE, 'PHONE', TRUE, FALSE, NOW(), 'SYSTEM'),
(5, 'APT2602260005', 1, 1, 12, 'Amit Kumar', '9876501006', 1, 'Dr. Amit Kumar', 'OPD', CURDATE(), '10:00', '10:15', 'CHECKED_IN', 5, 500.00, TRUE, FALSE, 'WALK_IN', TRUE, FALSE, NOW(), 'SYSTEM'),
(6, 'APT2602260006', 1, 1, 17, 'Kavita Menon', '9876502001', 1, 'Dr. Amit Kumar', 'OPD', CURDATE(), '10:15', '10:30', 'CONFIRMED', 6, 500.00, FALSE, FALSE, 'ONLINE', TRUE, FALSE, NOW(), 'SYSTEM'),
(7, 'APT2602260007', 1, 1, 18, 'Vijay Pillai', '9876502002', 1, 'Dr. Amit Kumar', 'FOLLOW_UP', CURDATE(), '10:30', '10:45', 'SCHEDULED', 7, 300.00, FALSE, TRUE, 'ONLINE', TRUE, FALSE, NOW(), 'SYSTEM'),

-- Today's appointments for Dr. Sanjay Mehta (Cardiology)
(10, 'APT2602260010', 1, 2, 4, 'Suresh Patel', '9876501002', 2, 'Dr. Sanjay Mehta', 'OPD', CURDATE(), '10:00', '10:20', 'COMPLETED', 1, 800.00, TRUE, FALSE, 'COUNTER', TRUE, FALSE, NOW(), 'SYSTEM'),
(11, 'APT2602260011', 1, 2, 20, 'Sunil Patil', '9876502004', 2, 'Dr. Sanjay Mehta', 'OPD', CURDATE(), '10:20', '10:40', 'IN_PROGRESS', 2, 800.00, TRUE, FALSE, 'ONLINE', TRUE, FALSE, NOW(), 'SYSTEM'),
(12, 'APT2602260012', 1, 2, 16, 'Rajesh Nair', '9876501010', 2, 'Dr. Sanjay Mehta', 'OPD', CURDATE(), '10:40', '11:00', 'CHECKED_IN', 3, 800.00, TRUE, FALSE, 'ONLINE', TRUE, FALSE, NOW(), 'SYSTEM'),

-- Tomorrow's appointments
(20, 'APT2602270001', 1, 1, 21, 'Manoj Tiwari', '9876502005', 1, 'Dr. Amit Kumar', 'OPD', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00', '09:15', 'CONFIRMED', NULL, 500.00, TRUE, FALSE, 'ONLINE', TRUE, FALSE, NOW(), 'SYSTEM'),
(21, 'APT2602270002', 1, 1, 22, 'Ritu Agarwal', '9876502006', 1, 'Dr. Amit Kumar', 'OPD', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:15', '09:30', 'SCHEDULED', NULL, 500.00, FALSE, FALSE, 'ONLINE', TRUE, FALSE, NOW(), 'SYSTEM'),

-- ACH appointments
(30, 'APT2602260030', 5, 11, 6, 'Mahesh Verma', '9876501003', 6, 'Dr. Vikram Singh', 'OPD', CURDATE(), '09:00', '09:15', 'COMPLETED', 1, 600.00, TRUE, FALSE, 'ONLINE', TRUE, FALSE, NOW(), 'SYSTEM'),
(31, 'APT2602260031', 5, 11, 13, 'Neha Joshi', '9876501007', 6, 'Dr. Vikram Singh', 'OPD', CURDATE(), '09:15', '09:30', 'IN_PROGRESS', 2, 600.00, TRUE, FALSE, 'COUNTER', TRUE, FALSE, NOW(), 'SYSTEM'),
(32, 'APT2602260032', 5, 11, 14, 'Deepak Reddy', '9876501008', 6, 'Dr. Vikram Singh', 'OPD', CURDATE(), '09:30', '09:45', 'CHECKED_IN', 3, 600.00, TRUE, FALSE, 'ONLINE', TRUE, FALSE, NOW(), 'SYSTEM');

-- ==========================================
-- QUEUE ENTRIES
-- ==========================================

INSERT INTO queue_entries (hospital_id, department_id, doctor_id, appointment_id, patient_id, patient_name,
    queue_date, token_number, token_display, queue_position, status, priority, check_in_time, room_number,
    is_walk_in, is_active, is_deleted, created_at, created_by)
VALUES
-- Today's queue for Dr. Amit Kumar
(1, 1, 1, 3, 10, 'Rahul Gupta', CURDATE(), 3, 'OPD-003', 1, 'IN_CONSULTATION', 0, NOW(), 'OPD-101', FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 1, 1, 4, 11, 'Priya Singh', CURDATE(), 4, 'OPD-004', 2, 'WAITING', 0, NOW(), NULL, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 1, 1, 5, 12, 'Amit Kumar', CURDATE(), 5, 'OPD-005', 3, 'WAITING', 0, NOW(), NULL, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 1, 1, 6, 17, 'Kavita Menon', CURDATE(), 6, 'OPD-006', 4, 'WAITING', 1, NOW(), NULL, FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Queue for Dr. Sanjay Mehta
(1, 2, 2, 11, 20, 'Sunil Patil', CURDATE(), 2, 'CAR-002', 1, 'IN_CONSULTATION', 0, NOW(), 'CARDIO-201', FALSE, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 2, 2, 12, 16, 'Rajesh Nair', CURDATE(), 3, 'CAR-003', 2, 'WAITING', 1, NOW(), NULL, FALSE, TRUE, FALSE, NOW(), 'SYSTEM');

-- ==========================================
-- SAMPLE PRESCRIPTIONS
-- ==========================================

INSERT INTO prescriptions (id, prescription_number, hospital_id, patient_id, patient_name, patient_age, patient_gender,
    doctor_id, doctor_name, doctor_registration, appointment_id, prescription_date, valid_until, status,
    chief_complaint, diagnosis, blood_pressure, pulse, temperature, weight,
    advice, follow_up_date, is_digitally_signed, signed_at,
    is_active, is_deleted, created_at, created_by)
VALUES
(1, 'RX2602260001', 1, 1, 'Ramesh Sharma', '60 years', 'Male', 1, 'Dr. Amit Kumar', 'MH/MC/12345', 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'ACTIVE',
 'Fever, body ache, weakness for 3 days', 'Viral Fever', '140/90', '88', '101.2', '78kg',
 'Take plenty of rest. Drink lots of fluids. Avoid oily and spicy food.', DATE_ADD(CURDATE(), INTERVAL 7 DAY), TRUE, NOW(),
 TRUE, FALSE, NOW(), 'SYSTEM'),

(2, 'RX2602260002', 1, 4, 'Suresh Patel', '67 years', 'Male', 2, 'Dr. Sanjay Mehta', 'MH/MC/12346', 10, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'ACTIVE',
 'Chest pain, breathlessness on exertion', 'Stable Angina', '150/95', '92', '98.6', '82kg',
 'Avoid heavy exertion. Take medications regularly. Follow-up with reports.', DATE_ADD(CURDATE(), INTERVAL 14 DAY), TRUE, NOW(),
 TRUE, FALSE, NOW(), 'SYSTEM');

-- Prescription medicines
INSERT INTO prescription_medicines (prescription_id, medicine_id, medicine_name, generic_name, medicine_type, strength,
    dosage, frequency, timing, duration, duration_days, quantity, instructions, is_generic, substitute_allowed, display_order,
    is_active, is_deleted, created_at, created_by)
VALUES
-- Prescription 1 medicines
(1, 5, 'Crocin 500', 'Paracetamol', 'Tablet', '500mg', '1-0-1', 'Twice daily', 'After food', '5 days', 5, 10, 'Take when fever is above 100°F', FALSE, TRUE, 1, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 35, 'Cetzine 10', 'Cetirizine', 'Tablet', '10mg', '0-0-1', 'Once daily at night', 'After dinner', '5 days', 5, 5, 'For cold symptoms', TRUE, TRUE, 2, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 40, 'Becosules', 'B-Complex', 'Capsule', NULL, '1-0-0', 'Once daily', 'After breakfast', '15 days', 15, 15, 'Multivitamin supplement', FALSE, TRUE, 3, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Prescription 2 medicines
(2, 20, 'Ecosprin 75', 'Aspirin', 'Tablet', '75mg', '0-1-0', 'Once daily', 'After lunch', '30 days', 30, 30, 'Do not stop without doctor consultation', TRUE, FALSE, 1, TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 21, 'Lipitor 10', 'Atorvastatin', 'Tablet', '10mg', '0-0-1', 'Once daily at night', 'After dinner', '30 days', 30, 30, 'Take at bedtime', FALSE, TRUE, 2, TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 16, 'Telma 40', 'Telmisartan', 'Tablet', '40mg', '1-0-0', 'Once daily', 'Before breakfast', '30 days', 30, 30, 'Monitor BP regularly', FALSE, TRUE, 3, TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 22, 'Clopilet 75', 'Clopidogrel', 'Tablet', '75mg', '0-1-0', 'Once daily', 'After lunch', '30 days', 30, 30, 'Do not stop without doctor consultation', FALSE, FALSE, 4, TRUE, FALSE, NOW(), 'SYSTEM');

-- ==========================================
-- SAMPLE LAB ORDERS
-- ==========================================

INSERT INTO lab_orders (id, order_number, hospital_id, patient_id, patient_name, patient_age, patient_gender, patient_mobile,
    ordered_by_doctor_id, ordered_by_doctor_name, appointment_id, prescription_id, status, order_date, priority,
    total_amount, discount_amount, net_amount, is_paid,
    is_active, is_deleted, created_at, created_by)
VALUES
(1, 'LAB2602260001', 1, 1, 'Ramesh Sharma', '60 years', 'Male', '9876501001',
 1, 'Dr. Amit Kumar', 1, 1, 'SAMPLE_COLLECTED', NOW(), 'ROUTINE',
 430.00, 0.00, 430.00, TRUE,
 TRUE, FALSE, NOW(), 'SYSTEM'),

(2, 'LAB2602260002', 1, 4, 'Suresh Patel', '67 years', 'Male', '9876501002',
 2, 'Dr. Sanjay Mehta', 10, 2, 'ORDERED', NOW(), 'URGENT',
 4050.00, 0.00, 4050.00, TRUE,
 TRUE, FALSE, NOW(), 'SYSTEM');

-- Lab order items
INSERT INTO lab_order_items (lab_order_id, lab_test_id, test_name, test_code, status, sample_type, price, discount, net_price,
    is_active, is_deleted, created_at, created_by)
VALUES
-- Order 1: CBC + ESR
(1, 1, 'Complete Blood Count', 'LAB001', 'SAMPLE_COLLECTED', 'Blood', 350.00, 0.00, 350.00, TRUE, FALSE, NOW(), 'SYSTEM'),
(1, 3, 'ESR', 'LAB003', 'SAMPLE_COLLECTED', 'Blood', 80.00, 0.00, 80.00, TRUE, FALSE, NOW(), 'SYSTEM'),

-- Order 2: Cardiac workup
(2, 13, 'Lipid Profile', 'LAB013', 'ORDERED', 'Blood', 550.00, 0.00, 550.00, TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 30, 'Troponin T', 'LAB030', 'ORDERED', 'Blood', 1200.00, 0.00, 1200.00, TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 41, 'ECG', 'LAB041', 'ORDERED', 'N/A', 250.00, 0.00, 250.00, TRUE, FALSE, NOW(), 'SYSTEM'),
(2, 43, '2D Echo', 'LAB043', 'ORDERED', 'N/A', 2500.00, 0.00, 2500.00, TRUE, FALSE, NOW(), 'SYSTEM');

SELECT 'Appointments, Prescriptions, and Lab Orders seeded successfully!' as status;
