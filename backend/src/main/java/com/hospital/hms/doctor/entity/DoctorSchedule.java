package com.hospital.hms.doctor.entity;

import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.DayOfWeek;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Doctor schedule entity - defines when a doctor is available for appointments.
 */
@Entity
@Table(name = "doctor_schedules", indexes = {
        @Index(name = "idx_schedule_doctor", columnList = "doctor_id"),
        @Index(name = "idx_schedule_hospital", columnList = "hospital_id"),
        @Index(name = "idx_schedule_day", columnList = "day_of_week")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorSchedule extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "department_id")
    private Long departmentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "break_start_time")
    private LocalTime breakStartTime;

    @Column(name = "break_end_time")
    private LocalTime breakEndTime;

    @Column(name = "slot_duration_minutes")
    private Integer slotDurationMinutes;

    @Column(name = "max_appointments")
    private Integer maxAppointments;

    @Column(name = "is_teleconsultation")
    @Builder.Default
    private Boolean isTeleconsultation = false;

    @Column(name = "room_number")
    private String roomNumber;

    // For temporary/date-specific schedules
    @Column(name = "specific_date")
    private LocalDate specificDate;

    @Column(name = "is_recurring")
    @Builder.Default
    private Boolean isRecurring = true;

    // For date range schedules
    @Column(name = "effective_from")
    private LocalDate effectiveFrom;

    @Column(name = "effective_until")
    private LocalDate effectiveUntil;

    @Column(name = "notes")
    private String notes;

    public int calculateTotalSlots() {
        if (slotDurationMinutes == null || slotDurationMinutes == 0) {
            slotDurationMinutes = 15;
        }
        
        int totalMinutes = (endTime.getHour() * 60 + endTime.getMinute()) - 
                          (startTime.getHour() * 60 + startTime.getMinute());
        
        // Subtract break time
        if (breakStartTime != null && breakEndTime != null) {
            int breakMinutes = (breakEndTime.getHour() * 60 + breakEndTime.getMinute()) - 
                              (breakStartTime.getHour() * 60 + breakStartTime.getMinute());
            totalMinutes -= breakMinutes;
        }
        
        return totalMinutes / slotDurationMinutes;
    }
}
