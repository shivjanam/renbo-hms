package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NotificationType {
    // Appointment notifications
    APPOINTMENT_BOOKED("Appointment Booked", "appointment"),
    APPOINTMENT_CONFIRMED("Appointment Confirmed", "appointment"),
    APPOINTMENT_REMINDER("Appointment Reminder", "appointment"),
    APPOINTMENT_CANCELLED("Appointment Cancelled", "appointment"),
    APPOINTMENT_RESCHEDULED("Appointment Rescheduled", "appointment"),
    
    // Queue notifications
    QUEUE_UPDATE("Queue Update", "queue"),
    YOUR_TURN("Your Turn", "queue"),
    
    // Lab notifications
    LAB_SAMPLE_COLLECTED("Sample Collected", "lab"),
    LAB_RESULT_READY("Lab Result Ready", "lab"),
    
    // Prescription notifications
    PRESCRIPTION_CREATED("New Prescription", "prescription"),
    MEDICINE_REMINDER("Medicine Reminder", "prescription"),
    
    // Billing notifications
    BILL_GENERATED("Bill Generated", "billing"),
    PAYMENT_RECEIVED("Payment Received", "billing"),
    PAYMENT_DUE("Payment Due", "billing"),
    REFUND_PROCESSED("Refund Processed", "billing"),
    
    // Admission notifications
    ADMISSION_CONFIRMED("Admission Confirmed", "admission"),
    DISCHARGE_READY("Discharge Ready", "admission"),
    DISCHARGED("Discharged", "admission"),
    
    // General
    OTP("OTP", "auth"),
    WELCOME("Welcome", "general"),
    FEEDBACK_REQUEST("Feedback Request", "general"),
    ANNOUNCEMENT("Announcement", "general");

    private final String displayName;
    private final String category;
}
