package com.hospital.hms.config;

import com.hospital.hms.common.enums.*;
import com.hospital.hms.doctor.entity.Doctor;
import com.hospital.hms.doctor.entity.DoctorSchedule;
import com.hospital.hms.hospital.entity.Department;
import com.hospital.hms.hospital.entity.Hospital;
import com.hospital.hms.patient.entity.Patient;
import com.hospital.hms.security.entity.User;
import com.hospital.hms.security.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

/**
 * Initializes sample data for development/testing purposes.
 * Creates 50+ records for each major entity type.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) {
        // Only initialize if database is empty
        if (userRepository.count() > 0) {
            log.info("Database already initialized, skipping data initialization");
            return;
        }

        log.info("Initializing sample data...");

        try {
            // Create hospitals
            List<Hospital> hospitals = createHospitals();

            // Create departments
            List<Department> departments = createDepartments(hospitals);

            // Create admin users
            createAdminUsers(hospitals);

            // Create doctors with users
            List<Doctor> doctors = createDoctors(hospitals, departments);

            // Create doctor schedules
            createDoctorSchedules(doctors, hospitals);

            // Create patients
            List<Patient> patients = createPatients(hospitals);

            log.info("Sample data initialization completed successfully!");
            log.info("Created: {} hospitals, {} departments, {} doctors, {} patients",
                    hospitals.size(), departments.size(), doctors.size(), patients.size());

        } catch (Exception e) {
            log.error("Error initializing sample data: {}", e.getMessage(), e);
        }
    }

    private List<Hospital> createHospitals() {
        List<Hospital> hospitals = new ArrayList<>();

        String[][] hospitalData = {
            {"CGH001", "City General Hospital", "123 MG Road, Sector 15", "New Delhi", "Delhi", "110001"},
            {"APL002", "Apollo Healthcare", "45 Ring Road, Sarita Vihar", "New Delhi", "Delhi", "110076"},
            {"FMR003", "Fortis Memorial Research", "89 Sohna Road", "Gurugram", "Haryana", "122001"},
            {"MAX004", "Max Super Specialty", "67 Patparganj Road", "New Delhi", "Delhi", "110091"},
            {"MED005", "Medanta The Medicity", "CH Baktawar Singh Road", "Gurugram", "Haryana", "122001"}
        };

        for (String[] data : hospitalData) {
            Hospital hospital = Hospital.builder()
                    .hospitalCode(data[0])
                    .name(data[1])
                    .addressLine1(data[2])
                    .city(data[3])
                    .state(data[4])
                    .pincode(data[5])
                    .phone("+91-11-" + (23456789 + hospitals.size()))
                    .email("info@" + data[0].toLowerCase() + ".com")
                    .hospitalType("SUPER_SPECIALTY")
                    .totalBeds(500 + hospitals.size() * 100)
                    .emergencyEnabled(true)
                    .teleconsultationEnabled(true)
                    .build();
            hospital.setIsActive(true);
            hospital.setIsDeleted(false);
            entityManager.persist(hospital);
            hospitals.add(hospital);
        }

        entityManager.flush();
        log.info("Created {} hospitals", hospitals.size());
        return hospitals;
    }

    private List<Department> createDepartments(List<Hospital> hospitals) {
        List<Department> allDepartments = new ArrayList<>();

        Specialization[] specializations = {
            Specialization.GENERAL_MEDICINE, Specialization.CARDIOLOGY,
            Specialization.ORTHOPEDICS, Specialization.NEUROLOGY,
            Specialization.PEDIATRICS, Specialization.GYNECOLOGY,
            Specialization.DERMATOLOGY, Specialization.ENT,
            Specialization.OPHTHALMOLOGY, Specialization.PSYCHIATRY,
            Specialization.ONCOLOGY, Specialization.UROLOGY
        };

        for (Hospital hospital : hospitals) {
            for (int i = 0; i < specializations.length; i++) {
                Specialization spec = specializations[i];
                Department dept = Department.builder()
                        .hospital(hospital)
                        .departmentCode(spec.name().substring(0, Math.min(4, spec.name().length())))
                        .name(spec.getDisplayName())
                        .specialization(spec)
                        .description(spec.getDescription())
                        .floor(String.valueOf((i / 4) + 1))
                        .consultationFee(500.0 + (i * 100))
                        .followUpFee(300.0 + (i * 50))
                        .emergencyFee(1000.0 + (i * 200))
                        .acceptsAppointments(true)
                        .acceptsWalkIns(true)
                        .build();
                dept.setIsActive(true);
                dept.setIsDeleted(false);
                entityManager.persist(dept);
                allDepartments.add(dept);
            }
        }

        entityManager.flush();
        log.info("Created {} departments", allDepartments.size());
        return allDepartments;
    }

    private void createAdminUsers(List<Hospital> hospitals) {
        // Create super admin
        User superAdmin = User.builder()
                .email("admin@hms.com")
                .username("superadmin")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .mobileNumber("9876543210")
                .firstName("Super")
                .lastName("Admin")
                .primaryRole(UserRole.SUPER_ADMIN)
                .roles(new HashSet<>(Set.of(UserRole.HOSPITAL_ADMIN, UserRole.SUPER_ADMIN)))
                .isMobileVerified(true)
                .isEmailVerified(true)
                .build();
        superAdmin.setIsActive(true);
        superAdmin.setIsDeleted(false);
        entityManager.persist(superAdmin);

        // Create hospital admins
        for (Hospital hospital : hospitals) {
            User admin = User.builder()
                    .email("admin@" + hospital.getHospitalCode().toLowerCase() + ".com")
                    .username("admin_" + hospital.getHospitalCode().toLowerCase())
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .mobileNumber("98765432" + (10 + hospitals.indexOf(hospital)))
                    .firstName(hospital.getName().split(" ")[0])
                    .lastName("Admin")
                    .primaryRole(UserRole.HOSPITAL_ADMIN)
                    .roles(new HashSet<>(Set.of(UserRole.HOSPITAL_ADMIN)))
                    .hospitalId(hospital.getId())
                    .isMobileVerified(true)
                    .isEmailVerified(true)
                    .build();
            admin.setIsActive(true);
            admin.setIsDeleted(false);
            entityManager.persist(admin);
        }

        entityManager.flush();
        log.info("Created admin users");
    }

    private List<Doctor> createDoctors(List<Hospital> hospitals, List<Department> departments) {
        List<Doctor> doctors = new ArrayList<>();

        String[][] doctorData = {
            {"Rajesh", "Kumar", "MALE", "1975-03-15", "MBBS, MD (Medicine)", "25", "500"},
            {"Priya", "Sharma", "FEMALE", "1980-07-22", "MBBS, DM (Cardiology)", "20", "800"},
            {"Amit", "Patel", "MALE", "1978-11-05", "MBBS, MS (Ortho)", "22", "600"},
            {"Sunita", "Verma", "FEMALE", "1982-04-18", "MBBS, DM (Neurology)", "18", "700"},
            {"Vikram", "Singh", "MALE", "1976-09-30", "MBBS, MD (Pediatrics)", "24", "450"},
            {"Neha", "Gupta", "FEMALE", "1985-12-12", "MBBS, MS (OBG)", "15", "550"},
            {"Arun", "Mehta", "MALE", "1979-06-25", "MBBS, MD (Derma)", "21", "400"},
            {"Kavita", "Joshi", "FEMALE", "1983-02-08", "MBBS, MS (ENT)", "17", "450"},
            {"Rahul", "Khanna", "MALE", "1977-08-14", "MBBS, DM (Cardiology)", "23", "1200"},
            {"Anjali", "Reddy", "FEMALE", "1981-01-20", "MBBS, MCh (CTVS)", "19", "1500"}
        };

        Specialization[] specs = Specialization.values();
        int deptIdx = 0;

        for (int h = 0; h < hospitals.size(); h++) {
            Hospital hospital = hospitals.get(h);
            int doctorsPerHospital = 10;

            for (int d = 0; d < doctorsPerHospital; d++) {
                int dataIdx = d % doctorData.length;
                String[] data = doctorData[dataIdx];
                String mobile = "98765" + String.format("%05d", doctors.size() + 1);

                // Create user for doctor
                String email = "dr." + data[0].toLowerCase() + "." + data[1].toLowerCase() + 
                              (h > 0 ? h : "") + "@" + hospital.getHospitalCode().toLowerCase() + ".com";

                User doctorUser = User.builder()
                        .email(email)
                        .username("dr_" + data[0].toLowerCase() + "_" + (doctors.size() + 1))
                        .passwordHash(passwordEncoder.encode("Doctor@123"))
                        .mobileNumber(mobile)
                        .firstName(data[0])
                        .lastName(data[1])
                        .primaryRole(UserRole.DOCTOR)
                        .roles(new HashSet<>(Set.of(UserRole.DOCTOR)))
                        .hospitalId(hospital.getId())
                        .isMobileVerified(true)
                        .isEmailVerified(true)
                        .build();
                doctorUser.setIsActive(true);
                doctorUser.setIsDeleted(false);
                entityManager.persist(doctorUser);

                // Get specialization from department
                Department dept = departments.get(deptIdx % departments.size());
                Specialization spec = dept.getSpecialization();
                if (spec == null) {
                    spec = specs[d % specs.length];
                }

                Doctor doctor = Doctor.builder()
                        .userId(doctorUser.getId())
                        .employeeId("DOC" + String.format("%03d", doctors.size() + 1))
                        .firstName(data[0])
                        .lastName(data[1])
                        .title("Dr.")
                        .gender(Gender.valueOf(data[2]))
                        .dateOfBirth(LocalDate.parse(data[3]))
                        .mobileNumber(mobile)
                        .email(email)
                        .qualifications(data[4])
                        .registrationNumber("DMC/" + String.format("%05d", doctors.size() + 1) + "/2020")
                        .experienceYears(Integer.parseInt(data[5]))
                        .primarySpecialization(spec)
                        .primaryHospitalId(hospital.getId())
                        .primaryDepartmentId(dept.getId())
                        .opdConsultationFee(Double.parseDouble(data[6]))
                        .emergencyFee(Double.parseDouble(data[6]) * 2)
                        .followUpFee(Double.parseDouble(data[6]) * 0.6)
                        .bio("Experienced " + spec.getDisplayName() + " specialist with " + data[5] + " years of practice")
                        .acceptsOnlineBooking(true)
                        .acceptsWalkIns(true)
                        .slotDurationMinutes(15)
                        .build();
                doctor.setIsActive(true);
                doctor.setIsDeleted(false);
                entityManager.persist(doctor);
                
                // Update user with doctor ID
                doctorUser.setDoctorId(doctor.getId());
                
                doctors.add(doctor);
                deptIdx++;
            }
        }

        entityManager.flush();
        log.info("Created {} doctors", doctors.size());
        return doctors;
    }

    private void createDoctorSchedules(List<Doctor> doctors, List<Hospital> hospitals) {
        DayOfWeek[] workDays = {DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, 
                               DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY};

        for (Doctor doctor : doctors) {
            Long hospitalId = doctor.getPrimaryHospitalId();
            
            for (DayOfWeek day : workDays) {
                // Morning slot
                DoctorSchedule morningSchedule = DoctorSchedule.builder()
                        .doctor(doctor)
                        .hospitalId(hospitalId)
                        .dayOfWeek(day)
                        .startTime(LocalTime.of(9, 0))
                        .endTime(LocalTime.of(13, 0))
                        .breakStartTime(LocalTime.of(11, 0))
                        .breakEndTime(LocalTime.of(11, 30))
                        .slotDurationMinutes(15)
                        .maxAppointments(16)
                        .isRecurring(true)
                        .isTeleconsultation(false)
                        .build();
                morningSchedule.setIsActive(true);
                morningSchedule.setIsDeleted(false);
                entityManager.persist(morningSchedule);

                // Afternoon slot (only on some days)
                if (day != DayOfWeek.SATURDAY) {
                    DoctorSchedule afternoonSchedule = DoctorSchedule.builder()
                            .doctor(doctor)
                            .hospitalId(hospitalId)
                            .dayOfWeek(day)
                            .startTime(LocalTime.of(14, 0))
                            .endTime(LocalTime.of(17, 0))
                            .slotDurationMinutes(15)
                            .maxAppointments(12)
                            .isRecurring(true)
                            .isTeleconsultation(false)
                            .build();
                    afternoonSchedule.setIsActive(true);
                    afternoonSchedule.setIsDeleted(false);
                    entityManager.persist(afternoonSchedule);
                }
            }
        }

        entityManager.flush();
        log.info("Created doctor schedules");
    }

    private List<Patient> createPatients(List<Hospital> hospitals) {
        List<Patient> patients = new ArrayList<>();

        String[][] patientData = {
            {"Ramesh", "Sharma", "MALE", "1985-05-15", "B_POSITIVE", "9898765001"},
            {"Sunita", "Devi", "FEMALE", "1990-08-22", "O_POSITIVE", "9898765002"},
            {"Ajay", "Kumar", "MALE", "1978-12-10", "A_POSITIVE", "9898765003"},
            {"Meena", "Kumari", "FEMALE", "1995-03-28", "AB_POSITIVE", "9898765004"},
            {"Sanjay", "Verma", "MALE", "1982-07-04", "B_NEGATIVE", "9898765005"},
            {"Rekha", "Singh", "FEMALE", "1988-11-16", "O_NEGATIVE", "9898765006"},
            {"Vikrant", "Patel", "MALE", "1975-02-20", "A_NEGATIVE", "9898765007"},
            {"Anjali", "Gupta", "FEMALE", "1992-06-08", "AB_NEGATIVE", "9898765008"},
            {"Rohit", "Agarwal", "MALE", "1980-09-25", "B_POSITIVE", "9898765009"},
            {"Priyanka", "Joshi", "FEMALE", "1998-01-12", "O_POSITIVE", "9898765010"},
            {"Karan", "Malhotra", "MALE", "1983-04-18", "A_POSITIVE", "9898765011"},
            {"Simran", "Kapoor", "FEMALE", "1991-07-30", "B_POSITIVE", "9898765012"}
        };

        String[] cities = {"New Delhi", "Gurugram", "Noida", "Ghaziabad", "Faridabad"};
        String[] addresses = {"Lajpat Nagar", "Saket", "Rohini", "Dwarka", "Janakpuri", "Vasant Kunj"};

        int patientCount = 0;
        for (Hospital hospital : hospitals) {
            int patientsPerHospital = 12;

            for (int p = 0; p < patientsPerHospital; p++) {
                int dataIdx = p % patientData.length;
                String[] data = patientData[dataIdx];

                Patient patient = Patient.builder()
                        .uhid(hospital.getHospitalCode() + "2026" + String.format("%06d", patientCount + 1))
                        .registeredHospitalId(hospital.getId())
                        .firstName(data[0])
                        .lastName(data[1])
                        .gender(Gender.valueOf(data[2]))
                        .dateOfBirth(LocalDate.parse(data[3]))
                        .bloodGroup(BloodGroup.valueOf(data[4]))
                        .mobileNumber(data[5].substring(0, 7) + String.format("%03d", patientCount + 1))
                        .email(data[0].toLowerCase() + "." + data[1].toLowerCase() + patientCount + "@email.com")
                        .addressLine1(addresses[p % addresses.length])
                        .city(cities[p % cities.length])
                        .state(p % cities.length < 2 ? "Delhi" : "Haryana")
                        .pincode("110" + String.format("%03d", 1 + p))
                        .emergencyContactName(data[1] + " Family")
                        .emergencyContactPhone("98765" + String.format("%05d", patientCount + 100))
                        .emergencyContactRelation("SPOUSE")
                        .build();
                patient.setIsActive(true);
                patient.setIsDeleted(false);
                entityManager.persist(patient);
                patients.add(patient);
                patientCount++;
            }
        }

        entityManager.flush();
        log.info("Created {} patients", patients.size());
        return patients;
    }
}
