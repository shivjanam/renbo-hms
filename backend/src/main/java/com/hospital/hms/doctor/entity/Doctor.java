package com.hospital.hms.doctor.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.Gender;
import com.hospital.hms.common.enums.Specialization;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Doctor entity - represents a doctor/physician in the hospital.
 */
@Entity
@Table(name = "doctors", indexes = {
        @Index(name = "idx_doctor_reg", columnList = "registration_number"),
        @Index(name = "idx_doctor_hospital", columnList = "primary_hospital_id"),
        @Index(name = "idx_doctor_dept", columnList = "primary_department_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor extends BaseEntity {

    @Column(name = "employee_id")
    private String employeeId;

    // Personal Information
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "title")
    private String title; // Dr., Prof., etc.

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    // Contact
    @Column(name = "mobile_number", nullable = false)
    private String mobileNumber;

    @Column(name = "alternate_mobile")
    private String alternateMobile;

    @Column(name = "email")
    private String email;

    // Professional Information
    @Column(name = "registration_number", nullable = false)
    private String registrationNumber; // Medical council registration

    @Column(name = "registration_council")
    private String registrationcouncil; // MCI, State Medical Council

    @Column(name = "registration_valid_until")
    private LocalDate registrationValidUntil;

    @Enumerated(EnumType.STRING)
    @Column(name = "primary_specialization", nullable = false)
    private Specialization primarySpecialization;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "doctor_specializations", joinColumns = @JoinColumn(name = "doctor_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "specialization")
    @Builder.Default
    private Set<Specialization> additionalSpecializations = new HashSet<>();

    @Column(name = "qualifications")
    private String qualifications; // MBBS, MD, etc.

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "bio", length = 2000)
    private String bio;

    // Hospital & Department
    @Column(name = "primary_hospital_id")
    private Long primaryHospitalId;

    @Column(name = "primary_department_id")
    private Long primaryDepartmentId;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "doctor_hospitals", joinColumns = @JoinColumn(name = "doctor_id"))
    @Column(name = "hospital_id")
    @Builder.Default
    @JsonIgnore
    private Set<Long> accessibleHospitalIds = new HashSet<>();

    // Consultation Fees
    @Column(name = "opd_consultation_fee")
    private Double opdConsultationFee;

    @Column(name = "follow_up_fee")
    private Double followUpFee;

    @Column(name = "emergency_fee")
    private Double emergencyFee;

    @Column(name = "teleconsultation_fee")
    private Double teleconsultationFee;

    @Column(name = "follow_up_validity_days")
    @Builder.Default
    private Integer followUpValidityDays = 7;

    // Appointment Settings
    @Column(name = "slot_duration_minutes")
    @Builder.Default
    private Integer slotDurationMinutes = 15;

    @Column(name = "max_patients_per_day")
    private Integer maxPatientsPerDay;

    @Column(name = "buffer_time_minutes")
    @Builder.Default
    private Integer bufferTimeMinutes = 5;

    @Column(name = "accepts_online_booking")
    @Builder.Default
    private Boolean acceptsOnlineBooking = true;

    @Column(name = "accepts_walk_ins")
    @Builder.Default
    private Boolean acceptsWalkIns = true;

    @Column(name = "teleconsultation_enabled")
    @Builder.Default
    private Boolean teleconsultationEnabled = false;

    // Profile
    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "signature_url")
    private String signatureUrl;

    // Status
    @Column(name = "is_on_leave")
    @Builder.Default
    private Boolean isOnLeave = false;

    @Column(name = "leave_reason")
    private String leaveReason;

    @Column(name = "leave_from")
    private LocalDate leaveFrom;

    @Column(name = "leave_to")
    private LocalDate leaveTo;

    // User link
    @Column(name = "user_id")
    private Long userId;

    public String getFullName() {
        String name = (title != null ? title + " " : "") + firstName;
        if (lastName != null && !lastName.isEmpty()) {
            name += " " + lastName;
        }
        return name;
    }

    @PrePersist
    @PreUpdate
    private void updateDisplayName() {
        if (displayName == null || displayName.isEmpty()) {
            displayName = getFullName();
        }
    }
}
