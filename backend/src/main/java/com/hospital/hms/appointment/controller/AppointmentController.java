package com.hospital.hms.appointment.controller;

import com.hospital.hms.appointment.dto.GuestBookingRequest;
import com.hospital.hms.appointment.dto.GuestBookingResponse;
import com.hospital.hms.appointment.entity.Appointment;
import com.hospital.hms.appointment.repository.AppointmentRepository;
import com.hospital.hms.common.enums.AppointmentStatus;
import com.hospital.hms.common.enums.AppointmentType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Year;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Appointment Management", description = "Appointment management endpoints")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    
    // In-memory OTP store (use Redis in production)
    private static final Map<String, OtpSession> otpStore = new ConcurrentHashMap<>();
    // In-memory access token store for guest appointments
    private static final Map<String, Long> accessTokenStore = new ConcurrentHashMap<>();
    
    private static final SecureRandom random = new SecureRandom();
    
    // OTP Session class
    private static class OtpSession {
        String otp;
        String mobile;
        long expiryTime;
        boolean verified;
        
        OtpSession(String otp, String mobile) {
            this.otp = otp;
            this.mobile = mobile;
            this.expiryTime = System.currentTimeMillis() + 300000; // 5 minutes
            this.verified = false;
        }
    }

    @GetMapping
    @Operation(summary = "Get All Appointments", description = "Get all appointments with pagination and optional filters")
    public ResponseEntity<Map<String, Object>> getAllAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long hospitalId) {

        log.info("Fetching appointments - page: {}, size: {}, status: {}, date: {}", page, size, status, date);

        Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending());

        Page<Appointment> appointmentPage;
        
        AppointmentStatus statusEnum = null;
        if (status != null && !status.isEmpty()) {
            try {
                statusEnum = AppointmentStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status: {}", status);
            }
        }

        appointmentPage = appointmentRepository.findByFilters(statusEnum, date, hospitalId, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", appointmentPage.getContent());
        response.put("totalElements", appointmentPage.getTotalElements());
        response.put("totalPages", appointmentPage.getTotalPages());
        response.put("currentPage", page);
        response.put("size", size);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/list")
    @Operation(summary = "Get Appointments List", description = "Get simple list of appointments")
    public ResponseEntity<List<Appointment>> getAppointmentList() {
        log.info("Fetching all appointments as list");
        List<Appointment> appointments = appointmentRepository.findByIsDeletedFalse(
                PageRequest.of(0, 100, Sort.by("appointmentDate").descending())).getContent();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Appointment by ID", description = "Get appointment details by ID")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        log.info("Fetching appointment by id: {}", id);
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get Patient Appointments", description = "Get all appointments for a patient")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable Long patientId) {
        log.info("Fetching appointments for patient: {}", patientId);
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Get Doctor Appointments", description = "Get all appointments for a doctor")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable Long doctorId) {
        log.info("Fetching appointments for doctor: {}", doctorId);
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/today")
    @Operation(summary = "Get Today's Appointments", description = "Get all appointments for today")
    public ResponseEntity<List<Appointment>> getTodayAppointments(
            @RequestParam(required = false) Long hospitalId) {
        log.info("Fetching today's appointments for hospital: {}", hospitalId);
        LocalDate today = LocalDate.now();
        List<Appointment> appointments;
        if (hospitalId != null) {
            appointments = appointmentRepository.findByHospitalIdAndDate(hospitalId, today);
        } else {
            Pageable pageable = PageRequest.of(0, 100, Sort.by("slotStartTime").ascending());
            appointments = appointmentRepository.findByFilters(null, today, null, pageable).getContent();
        }
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/count")
    @Operation(summary = "Get Appointment Count", description = "Get appointment count by hospital and status")
    public ResponseEntity<Map<String, Long>> getAppointmentCount(
            @RequestParam(required = false) Long hospitalId) {
        log.info("Getting appointment counts");
        
        Map<String, Long> counts = new HashMap<>();
        counts.put("total", appointmentRepository.count());
        
        if (hospitalId != null) {
            LocalDate today = LocalDate.now();
            counts.put("today", appointmentRepository.countByHospitalAndDate(hospitalId, today));
            counts.put("scheduled", appointmentRepository.countByHospitalAndStatus(hospitalId, AppointmentStatus.SCHEDULED));
            counts.put("completed", appointmentRepository.countByHospitalAndStatus(hospitalId, AppointmentStatus.COMPLETED));
            counts.put("cancelledByPatient", appointmentRepository.countByHospitalAndStatus(hospitalId, AppointmentStatus.CANCELLED_BY_PATIENT));
            counts.put("cancelledByHospital", appointmentRepository.countByHospitalAndStatus(hospitalId, AppointmentStatus.CANCELLED_BY_HOSPITAL));
        }
        
        return ResponseEntity.ok(counts);
    }
    
    // ==================== GUEST BOOKING ENDPOINTS ====================
    
    /**
     * Send OTP for guest booking verification
     */
    @PostMapping("/guest/send-otp")
    @Operation(summary = "Send OTP", description = "Send OTP to mobile for guest booking verification")
    public ResponseEntity<Map<String, Object>> sendOtp(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobile");
        log.info("Sending OTP for guest booking to: {}", mobile);
        
        if (mobile == null || mobile.length() != 10) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid mobile number"));
        }
        
        // Generate OTP and session
//        String otp = String.format("%06d", random.nextInt(1000000));
        String otp = "123456";  // Fixed OTP for development
        String sessionId = UUID.randomUUID().toString();
        
        otpStore.put(sessionId, new OtpSession(otp, mobile));
        
        // In production, send OTP via SMS gateway
        log.info("Generated OTP: {} for session: {}", otp, sessionId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", sessionId);
        response.put("message", "OTP sent successfully");
        // For development, include OTP in response
        response.put("otp", otp); // Remove in production!
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Verify OTP for guest booking
     */
    @PostMapping("/guest/verify-otp")
    @Operation(summary = "Verify OTP", description = "Verify OTP for guest booking")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> request) {
        String sessionId = request.get("sessionId");
        String otp = request.get("otp");
        
        log.info("Verifying OTP for session: {}", sessionId);
        
        OtpSession session = otpStore.get(sessionId);
        if (session == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired session"));
        }
        
        if (System.currentTimeMillis() > session.expiryTime) {
            otpStore.remove(sessionId);
            return ResponseEntity.badRequest().body(Map.of("error", "OTP expired"));
        }
        
        if (!session.otp.equals(otp)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP"));
        }
        
        session.verified = true;
        
        Map<String, Object> response = new HashMap<>();
        response.put("verified", true);
        response.put("message", "OTP verified successfully");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Create guest booking (after OTP verification)
     */
    @PostMapping("/guest/book")
    @Operation(summary = "Guest Booking", description = "Create appointment for guest user after OTP verification")
    public ResponseEntity<?> createGuestBooking(@RequestBody GuestBookingRequest request) {
        log.info("Creating guest booking for: {}", request.getPatientMobile());
        
        // Verify OTP session
        if (request.getOtpSessionId() != null) {
            OtpSession session = otpStore.get(request.getOtpSessionId());
            if (session == null || !session.verified) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please verify your mobile number first"));
            }
            if (!session.mobile.equals(request.getPatientMobile())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mobile number mismatch"));
            }
        }
        
        // Generate appointment number
        String appointmentNumber = "APT" + Year.now().getValue() + String.format("%06d", appointmentRepository.count() + 1);
        
        // Parse slot time
        LocalTime slotTime = LocalTime.parse(request.getSlotTime());
        
        // Create appointment
        Appointment appointment = Appointment.builder()
                .appointmentNumber(appointmentNumber)
                .hospitalId(request.getHospitalId() != null ? request.getHospitalId() : 1L)
                .patientId(0L) // Guest patient - no patient ID
                .patientName(request.getPatientName())
                .patientMobile(request.getPatientMobile())
                .doctorId(request.getDoctorId())
                .appointmentType(AppointmentType.OPD)
                .appointmentDate(request.getAppointmentDate())
                .slotStartTime(slotTime)
                .slotEndTime(slotTime.plusMinutes(15))
                .status(AppointmentStatus.SCHEDULED)
                .tokenNumber((int) (appointmentRepository.count() % 100) + 1)
                .consultationFee(request.getAmount())
                .bookingSource("ONLINE_GUEST")
                .build();
        
        appointment = appointmentRepository.save(appointment);
        
        // Generate secure access token for viewing this appointment
        String accessToken = UUID.randomUUID().toString();
        accessTokenStore.put(accessToken, appointment.getId());
        
        // Clean up OTP session
        if (request.getOtpSessionId() != null) {
            otpStore.remove(request.getOtpSessionId());
        }
        
        GuestBookingResponse response = GuestBookingResponse.builder()
                .appointmentId(appointment.getId())
                .appointmentNumber(appointmentNumber)
                .accessToken(accessToken)
                .patientName(appointment.getPatientName())
                .doctorName(appointment.getDoctorName())
                .appointmentDate(appointment.getAppointmentDate())
                .slotTime(appointment.getSlotStartTime())
                .tokenNumber(appointment.getTokenNumber())
                .status("CONFIRMED")
                .message("Appointment booked successfully! Save your access token to view appointment details later.")
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * View guest appointment using access token
     */
    @GetMapping("/guest/view")
    @Operation(summary = "View Guest Appointment", description = "View appointment using access token (for guests)")
    public ResponseEntity<?> viewGuestAppointment(@RequestParam String token) {
        log.info("Viewing guest appointment with token: {}", token);
        
        Long appointmentId = accessTokenStore.get(token);
        if (appointmentId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired access token"));
        }
        
        return appointmentRepository.findById(appointmentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * View appointment by mobile + appointment number (alternative for guests)
     */
    @GetMapping("/guest/lookup")
    @Operation(summary = "Lookup Appointment", description = "Find appointment by mobile and appointment number")
    public ResponseEntity<?> lookupAppointment(
            @RequestParam String mobile,
            @RequestParam String appointmentNumber) {
        log.info("Looking up appointment: {} for mobile: {}", appointmentNumber, mobile);
        
        return appointmentRepository.findByAppointmentNumber(appointmentNumber)
                .filter(apt -> mobile.equals(apt.getPatientMobile()))
                .map(apt -> ResponseEntity.ok((Object) apt))
                .orElse(ResponseEntity.badRequest().body(Map.of(
                        "error", "No appointment found with this number and mobile")));
    }
    
    // ==================== DOCTOR PATIENT MAPPING ====================
    
    /**
     * Get patients for a doctor (via appointments)
     */
    @GetMapping("/doctor/{doctorId}/patients")
    @Operation(summary = "Get Doctor's Patients", description = "Get all unique patients who have appointments with this doctor")
    public ResponseEntity<Map<String, Object>> getDoctorPatients(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Fetching patients for doctor: {}", doctorId);
        
        List<Appointment> allAppointments = appointmentRepository.findByDoctorId(doctorId);
        
        // Extract unique patients
        Map<Long, Map<String, Object>> uniquePatients = new LinkedHashMap<>();
        for (Appointment apt : allAppointments) {
            if (!uniquePatients.containsKey(apt.getPatientId())) {
                Map<String, Object> patient = new HashMap<>();
                patient.put("id", apt.getPatientId());
                patient.put("patientName", apt.getPatientName());
                patient.put("patientMobile", apt.getPatientMobile());
                patient.put("lastVisit", apt.getAppointmentDate());
                patient.put("totalVisits", 1);
                uniquePatients.put(apt.getPatientId(), patient);
            } else {
                Map<String, Object> patient = uniquePatients.get(apt.getPatientId());
                patient.put("totalVisits", (int) patient.get("totalVisits") + 1);
                if (apt.getAppointmentDate().isAfter((LocalDate) patient.get("lastVisit"))) {
                    patient.put("lastVisit", apt.getAppointmentDate());
                }
            }
        }
        
        List<Map<String, Object>> patients = new ArrayList<>(uniquePatients.values());
        
        // Pagination
        int start = page * size;
        int end = Math.min(start + size, patients.size());
        List<Map<String, Object>> pageContent = start < patients.size() ? 
                patients.subList(start, end) : List.of();
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", pageContent);
        response.put("totalElements", patients.size());
        response.put("totalPages", (int) Math.ceil((double) patients.size() / size));
        response.put("currentPage", page);
        
        return ResponseEntity.ok(response);
    }
}
