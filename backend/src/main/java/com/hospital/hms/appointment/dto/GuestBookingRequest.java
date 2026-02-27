package com.hospital.hms.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for guest (non-authenticated) appointment booking
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestBookingRequest {
    
    // Patient info (for guests)
    private String patientName;
    private String patientMobile;
    private String patientEmail;
    
    // Appointment details
    private Long doctorId;
    private Long hospitalId;
    private LocalDate appointmentDate;
    private String slotTime;
    
    // Payment info
    private String paymentMode;
    private Double amount;
    
    // OTP verification
    private String otp;
    private String otpSessionId;
}
