package com.hospital.hms.appointment.entity;

import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.AppointmentStatus;
import com.hospital.hms.common.enums.AppointmentType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Appointment entity - represents a patient appointment with a doctor.
 */
@Entity
@Table(name = "appointments", indexes = {
        @Index(name = "idx_appt_patient", columnList = "patient_id"),
        @Index(name = "idx_appt_doctor", columnList = "doctor_id"),
        @Index(name = "idx_appt_date", columnList = "appointment_date"),
        @Index(name = "idx_appt_hospital", columnList = "hospital_id"),
        @Index(name = "idx_appt_status", columnList = "status"),
        @Index(name = "idx_appt_token", columnList = "token_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment extends BaseEntity {

    @Column(name = "appointment_number", unique = true, nullable = false)
    private String appointmentNumber;

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "patient_name")
    private String patientName;

    @Column(name = "patient_mobile")
    private String patientMobile;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column(name = "doctor_name")
    private String doctorName;

    @Enumerated(EnumType.STRING)
    @Column(name = "appointment_type", nullable = false)
    private AppointmentType appointmentType;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "slot_start_time", nullable = false)
    private LocalTime slotStartTime;

    @Column(name = "slot_end_time")
    private LocalTime slotEndTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;

    // Token/Queue
    @Column(name = "token_number")
    private Integer tokenNumber;

    @Column(name = "queue_position")
    private Integer queuePosition;

    @Column(name = "estimated_wait_minutes")
    private Integer estimatedWaitMinutes;

    // Check-in/out
    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    @Column(name = "consultation_started_at")
    private LocalDateTime consultationStartedAt;

    @Column(name = "consultation_ended_at")
    private LocalDateTime consultationEndedAt;

    // Follow-up reference
    @Column(name = "previous_appointment_id")
    private Long previousAppointmentId;

    @Column(name = "is_follow_up")
    @Builder.Default
    private Boolean isFollowUp = false;

    // Fees
    @Column(name = "consultation_fee")
    private Double consultationFee;

    @Column(name = "is_fee_paid")
    @Builder.Default
    private Boolean isFeePaid = false;

    @Column(name = "payment_id")
    private Long paymentId;

    // Cancellation
    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancelled_by")
    private String cancelledBy;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "reschedule_count")
    @Builder.Default
    private Integer rescheduleCount = 0;

    // Teleconsultation
    @Column(name = "teleconsultation_link")
    private String teleconsultationLink;

    @Column(name = "teleconsultation_meeting_id")
    private String teleconsultationMeetingId;

    // Notes
    @Column(name = "chief_complaint", length = 500)
    private String chiefComplaint;

    @Column(name = "booking_notes", length = 500)
    private String bookingNotes;

    @Column(name = "internal_notes", length = 500)
    private String internalNotes;

    // Booked by
    @Column(name = "booked_by_user_id")
    private Long bookedByUserId;

    @Column(name = "booking_source")
    private String bookingSource; // ONLINE, COUNTER, PHONE, WALK_IN

    // Reminders
    @Column(name = "reminder_sent")
    @Builder.Default
    private Boolean reminderSent = false;

    @Column(name = "reminder_sent_at")
    private LocalDateTime reminderSentAt;
}
