package com.hospital.hms.appointment.entity;

import com.hospital.hms.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Queue entry for real-time queue/token management.
 */
@Entity
@Table(name = "queue_entries", indexes = {
        @Index(name = "idx_queue_doctor_date", columnList = "doctor_id, queue_date"),
        @Index(name = "idx_queue_hospital_date", columnList = "hospital_id, queue_date"),
        @Index(name = "idx_queue_token", columnList = "token_number, queue_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueueEntry extends BaseEntity {

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column(name = "appointment_id")
    private Long appointmentId;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "patient_name")
    private String patientName;

    @Column(name = "queue_date", nullable = false)
    private LocalDate queueDate;

    @Column(name = "token_number", nullable = false)
    private Integer tokenNumber;

    @Column(name = "token_display")
    private String tokenDisplay; // e.g., "A-001", "OPD-045"

    @Column(name = "queue_position")
    private Integer queuePosition;

    @Column(name = "status")
    @Builder.Default
    private String status = "WAITING"; // WAITING, CALLED, IN_CONSULTATION, COMPLETED, SKIPPED, NO_SHOW

    @Column(name = "priority")
    @Builder.Default
    private Integer priority = 0; // Higher = more priority (for VIP, elderly, etc.)

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "called_time")
    private LocalDateTime calledTime;

    @Column(name = "consultation_start_time")
    private LocalDateTime consultationStartTime;

    @Column(name = "consultation_end_time")
    private LocalDateTime consultationEndTime;

    @Column(name = "estimated_wait_minutes")
    private Integer estimatedWaitMinutes;

    @Column(name = "actual_wait_minutes")
    private Integer actualWaitMinutes;

    @Column(name = "counter_number")
    private String counterNumber;

    @Column(name = "room_number")
    private String roomNumber;

    @Column(name = "is_walk_in")
    @Builder.Default
    private Boolean isWalkIn = false;

    @Column(name = "notes")
    private String notes;
}
