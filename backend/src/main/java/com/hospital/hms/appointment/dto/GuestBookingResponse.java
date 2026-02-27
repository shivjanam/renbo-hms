package com.hospital.hms.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Response DTO for guest booking
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestBookingResponse {
    
    private Long appointmentId;
    private String appointmentNumber;
    private String accessToken;  // Secure token for viewing appointment without login
    
    private String patientName;
    private String doctorName;
    private LocalDate appointmentDate;
    private LocalTime slotTime;
    private Integer tokenNumber;
    
    private String status;
    private String message;
}
