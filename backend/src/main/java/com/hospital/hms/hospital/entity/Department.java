package com.hospital.hms.hospital.entity;

import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.Specialization;
import jakarta.persistence.*;
import lombok.*;

/**
 * Department entity - represents a department within a hospital.
 */
@Entity
@Table(name = "departments", indexes = {
        @Index(name = "idx_dept_hospital", columnList = "hospital_id"),
        @Index(name = "idx_dept_code", columnList = "department_code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Column(name = "department_code", nullable = false)
    private String departmentCode;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "short_name")
    private String shortName;

    @Column(name = "description", length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "specialization")
    private Specialization specialization;

    @Column(name = "floor")
    private String floor;

    @Column(name = "building")
    private String building;

    @Column(name = "extension_number")
    private String extensionNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "head_doctor_id")
    private Long headDoctorId;

    @Column(name = "opd_timings")
    private String opdTimings; // JSON or structured string

    @Column(name = "consultation_fee")
    private Double consultationFee;

    @Column(name = "follow_up_fee")
    private Double followUpFee;

    @Column(name = "emergency_fee")
    private Double emergencyFee;

    @Column(name = "accepts_appointments")
    @Builder.Default
    private Boolean acceptsAppointments = true;

    @Column(name = "accepts_walk_ins")
    @Builder.Default
    private Boolean acceptsWalkIns = true;

    @Column(name = "is_emergency")
    @Builder.Default
    private Boolean isEmergency = false;

    @Column(name = "display_order")
    private Integer displayOrder;
}
