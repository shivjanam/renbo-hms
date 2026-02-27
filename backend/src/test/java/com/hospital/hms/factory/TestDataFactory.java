package com.hospital.hms.factory;

import com.hospital.hms.common.enums.*;
import com.hospital.hms.security.entity.User;
import com.hospital.hms.patient.entity.Patient;
import com.hospital.hms.doctor.entity.Doctor;
import com.hospital.hms.appointment.entity.Appointment;
import com.hospital.hms.hospital.entity.Hospital;
import com.hospital.hms.hospital.entity.Department;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Factory class for creating test data with realistic Indian data.
 */
public class TestDataFactory {

    private static final AtomicLong idGenerator = new AtomicLong(1);
    private static final Random random = new Random();

    // Indian names for test data
    private static final String[] INDIAN_FIRST_NAMES_MALE = {
        "Ramesh", "Suresh", "Mahesh", "Rajesh", "Amit", "Anil", "Sunil", "Vijay", "Sanjay", "Deepak"
    };
    
    private static final String[] INDIAN_FIRST_NAMES_FEMALE = {
        "Priya", "Neha", "Sunita", "Kavita", "Meera", "Rekha", "Anita", "Geeta", "Suman", "Ritu"
    };
    
    private static final String[] INDIAN_LAST_NAMES = {
        "Sharma", "Verma", "Gupta", "Patel", "Kumar", "Singh", "Reddy", "Nair", "Iyer", "Joshi"
    };

    // ==========================================
    // USER FACTORY
    // ==========================================

    public static User createUser() {
        return createUser(UserRole.PATIENT);
    }

    public static User createUser(UserRole role) {
        boolean isMale = random.nextBoolean();
        String firstName = isMale ? 
            INDIAN_FIRST_NAMES_MALE[random.nextInt(INDIAN_FIRST_NAMES_MALE.length)] :
            INDIAN_FIRST_NAMES_FEMALE[random.nextInt(INDIAN_FIRST_NAMES_FEMALE.length)];
        String lastName = INDIAN_LAST_NAMES[random.nextInt(INDIAN_LAST_NAMES.length)];

        User user = new User();
        user.setMobileNumber(generateIndianMobile());
        user.setEmail(firstName.toLowerCase() + "." + lastName.toLowerCase() + "@test.com");
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setDisplayName(firstName + " " + lastName);
        user.setPrimaryRole(role);
        user.setRoles(new HashSet<>());
        user.setIsMobileVerified(true);
        user.setIsEmailVerified(false);
        user.setIsLocked(false);
        user.setPreferredLanguage("en");
        return user;
    }

    public static User createAdminUser() {
        User user = createUser(UserRole.HOSPITAL_ADMIN);
        user.setUsername("admin_" + idGenerator.getAndIncrement());
        user.setPasswordHash("$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu");
        user.setHospitalId(1L);
        return user;
    }

    public static User createDoctorUser() {
        User user = createUser(UserRole.DOCTOR);
        user.setUsername("dr_" + idGenerator.getAndIncrement());
        user.setPasswordHash("$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.iqpfmGWqZJqrAu");
        user.setHospitalId(1L);
        user.setDepartmentId(1L);
        return user;
    }

    public static User createPatientUser() {
        return createUser(UserRole.PATIENT);
    }

    // ==========================================
    // PATIENT FACTORY
    // ==========================================

    public static Patient createPatient() {
        return createPatient(1L);
    }

    public static Patient createPatient(Long hospitalId) {
        long sequence = idGenerator.getAndIncrement();
        boolean isMale = random.nextBoolean();
        String firstName = isMale ? 
            INDIAN_FIRST_NAMES_MALE[random.nextInt(INDIAN_FIRST_NAMES_MALE.length)] :
            INDIAN_FIRST_NAMES_FEMALE[random.nextInt(INDIAN_FIRST_NAMES_FEMALE.length)];
        String lastName = INDIAN_LAST_NAMES[random.nextInt(INDIAN_LAST_NAMES.length)];

        Patient patient = new Patient();
        patient.setUhid("HMS26" + String.format("%05d", sequence));
        patient.setRegisteredHospitalId(hospitalId);
        patient.setFirstName(firstName);
        patient.setLastName(lastName);
        patient.setDateOfBirth(LocalDate.now().minusYears(20 + random.nextInt(50)));
        patient.setGender(isMale ? Gender.MALE : Gender.FEMALE);
        patient.setBloodGroup(BloodGroup.values()[random.nextInt(BloodGroup.values().length)]);
        patient.setMobileNumber(generateIndianMobile());
        patient.setEmail(firstName.toLowerCase() + "." + lastName.toLowerCase() + "@test.com");
        patient.setCity("Mumbai");
        patient.setState("Maharashtra");
        patient.setPincode("400001");
        patient.setPreferredLanguage("en");
        patient.setSmsConsent(true);
        patient.setEmailConsent(true);
        patient.setWhatsappConsent(true);
        patient.setIsVip(false);
        return patient;
    }

    public static Patient createPatientWithChronicCondition() {
        Patient patient = createPatient();
        patient.setChronicConditions("Diabetes Type 2, Hypertension");
        patient.setCurrentMedications("Metformin 500mg, Amlodipine 5mg");
        patient.setAllergies("Penicillin");
        return patient;
    }

    // ==========================================
    // DOCTOR FACTORY
    // ==========================================

    public static Doctor createDoctor() {
        return createDoctor(Specialization.GENERAL_MEDICINE);
    }

    public static Doctor createDoctor(Specialization specialization) {
        long sequence = idGenerator.getAndIncrement();
        boolean isMale = random.nextBoolean();
        String firstName = isMale ? 
            INDIAN_FIRST_NAMES_MALE[random.nextInt(INDIAN_FIRST_NAMES_MALE.length)] :
            INDIAN_FIRST_NAMES_FEMALE[random.nextInt(INDIAN_FIRST_NAMES_FEMALE.length)];
        String lastName = INDIAN_LAST_NAMES[random.nextInt(INDIAN_LAST_NAMES.length)];

        Doctor doctor = new Doctor();
        doctor.setEmployeeId("DOC" + String.format("%04d", sequence));
        doctor.setFirstName(firstName);
        doctor.setLastName(lastName);
        doctor.setDisplayName("Dr. " + firstName + " " + lastName);
        doctor.setTitle("Dr.");
        doctor.setGender(isMale ? Gender.MALE : Gender.FEMALE);
        doctor.setMobileNumber(generateIndianMobile());
        doctor.setEmail("dr." + firstName.toLowerCase() + "@hospital.com");
        doctor.setRegistrationNumber("MH/MC/" + (10000 + sequence));
        doctor.setRegistrationcouncil("Maharashtra Medical Council");
        doctor.setRegistrationValidUntil(LocalDate.now().plusYears(2));
        doctor.setPrimarySpecialization(specialization);
        doctor.setQualifications(getQualificationForSpecialization(specialization));
        doctor.setExperienceYears(5 + random.nextInt(20));
        doctor.setPrimaryHospitalId(1L);
        doctor.setPrimaryDepartmentId(1L);
        doctor.setOpdConsultationFee(500.0 + random.nextInt(500));
        doctor.setFollowUpFee(300.0);
        doctor.setSlotDurationMinutes(15);
        doctor.setMaxPatientsPerDay(40);
        doctor.setAcceptsOnlineBooking(true);
        doctor.setAcceptsWalkIns(true);
        doctor.setTeleconsultationEnabled(true);
        doctor.setIsOnLeave(false);
        return doctor;
    }

    // ==========================================
    // HOSPITAL FACTORY
    // ==========================================

    public static Hospital createHospital() {
        long sequence = idGenerator.getAndIncrement();
        
        Hospital hospital = new Hospital();
        hospital.setHospitalCode("HOSP" + String.format("%03d", sequence));
        hospital.setName("City General Hospital " + sequence);
        hospital.setShortName("CGH" + sequence);
        hospital.setHospitalType("Multi-Specialty");
        hospital.setRegistrationNumber("MH/REG/" + (2024000 + sequence));
        hospital.setAddressLine1("123 Main Street");
        hospital.setCity("Mumbai");
        hospital.setState("Maharashtra");
        hospital.setPincode("400001");
        hospital.setPhone("+91-22-1234567" + sequence);
        hospital.setEmail("info@hospital" + sequence + ".com");
        hospital.setGstin("27AABCU9603R1Z" + (char)('A' + sequence % 26));
        hospital.setIsBranch(false);
        hospital.setTimezone("Asia/Kolkata");
        hospital.setCurrency("INR");
        hospital.setDefaultLanguage("en");
        hospital.setTotalBeds(100 + random.nextInt(200));
        hospital.setEmergencyEnabled(true);
        hospital.setTeleconsultationEnabled(true);
        return hospital;
    }

    // ==========================================
    // DEPARTMENT FACTORY
    // ==========================================

    public static Department createDepartment(Hospital hospital, Specialization specialization) {
        long sequence = idGenerator.getAndIncrement();
        
        Department department = new Department();
        department.setHospital(hospital);
        department.setDepartmentCode("DEPT" + String.format("%03d", sequence));
        department.setName(specialization.getDisplayName());
        department.setShortName(specialization.name().substring(0, Math.min(4, specialization.name().length())));
        department.setSpecialization(specialization);
        department.setFloor("Ground Floor");
        department.setConsultationFee(500.0);
        department.setFollowUpFee(300.0);
        department.setAcceptsAppointments(true);
        department.setAcceptsWalkIns(true);
        department.setIsEmergency(specialization == Specialization.EMERGENCY_MEDICINE);
        department.setDisplayOrder((int) sequence);
        return department;
    }

    // ==========================================
    // APPOINTMENT FACTORY
    // ==========================================

    public static Appointment createAppointment(Patient patient, Doctor doctor) {
        return createAppointment(patient, doctor, LocalDate.now(), LocalTime.of(10, 0));
    }

    public static Appointment createAppointment(Patient patient, Doctor doctor, 
            LocalDate date, LocalTime time) {
        long sequence = idGenerator.getAndIncrement();
        
        Appointment appointment = new Appointment();
        appointment.setAppointmentNumber("APT" + LocalDate.now().getYear() + String.format("%06d", sequence));
        appointment.setHospitalId(doctor.getPrimaryHospitalId());
        appointment.setDepartmentId(doctor.getPrimaryDepartmentId());
        appointment.setPatientId(patient.getId());
        appointment.setPatientName(patient.getFullName());
        appointment.setPatientMobile(patient.getMobileNumber());
        appointment.setDoctorId(doctor.getId());
        appointment.setDoctorName(doctor.getDisplayName());
        appointment.setAppointmentType(AppointmentType.OPD);
        appointment.setAppointmentDate(date);
        appointment.setSlotStartTime(time);
        appointment.setSlotEndTime(time.plusMinutes(doctor.getSlotDurationMinutes()));
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        appointment.setConsultationFee(doctor.getOpdConsultationFee());
        appointment.setIsFeePaid(false);
        appointment.setIsFollowUp(false);
        appointment.setRescheduleCount(0);
        appointment.setBookingSource("ONLINE");
        appointment.setReminderSent(false);
        return appointment;
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    public static String generateIndianMobile() {
        // Indian mobile numbers start with 6, 7, 8, or 9
        int[] prefixes = {6, 7, 8, 9};
        StringBuilder mobile = new StringBuilder();
        mobile.append(prefixes[random.nextInt(prefixes.length)]);
        for (int i = 0; i < 9; i++) {
            mobile.append(random.nextInt(10));
        }
        return mobile.toString();
    }

    private static String getQualificationForSpecialization(Specialization specialization) {
        return switch (specialization) {
            case GENERAL_MEDICINE -> "MBBS, MD (General Medicine)";
            case CARDIOLOGY -> "MBBS, MD, DM (Cardiology)";
            case ORTHOPEDICS -> "MBBS, MS (Orthopedics)";
            case PEDIATRICS -> "MBBS, MD (Pediatrics)";
            case GYNECOLOGY -> "MBBS, MS (OBG)";
            case NEUROLOGY -> "MBBS, MD, DM (Neurology)";
            case DERMATOLOGY -> "MBBS, MD (Dermatology)";
            default -> "MBBS, MD";
        };
    }

    // Reset ID generator for test isolation
    public static void resetIdGenerator() {
        idGenerator.set(1);
    }
}
