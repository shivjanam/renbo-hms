package com.hospital.hms.hospital.entity;

import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.BedType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Bed entity - hospital bed management.
 */
@Entity
@Table(name = "beds", indexes = {
        @Index(name = "idx_bed_hospital", columnList = "hospital_id"),
        @Index(name = "idx_bed_ward", columnList = "ward_id"),
        @Index(name = "idx_bed_number", columnList = "bed_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bed extends BaseEntity {

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "ward_id")
    private Long wardId;

    @Column(name = "ward_name")
    private String wardName;

    @Column(name = "bed_number", nullable = false)
    private String bedNumber;

    @Column(name = "bed_name")
    private String bedName;

    @Enumerated(EnumType.STRING)
    @Column(name = "bed_type", nullable = false)
    private BedType bedType;

    @Column(name = "floor")
    private String floor;

    @Column(name = "building")
    private String building;

    @Column(name = "room_number")
    private String roomNumber;

    // Pricing
    @Column(name = "daily_rate", precision = 10, scale = 2)
    private BigDecimal dailyRate;

    @Column(name = "nursing_charges", precision = 10, scale = 2)
    private BigDecimal nursingCharges;

    // Features
    @Column(name = "has_ac")
    @Builder.Default
    private Boolean hasAc = false;

    @Column(name = "has_tv")
    @Builder.Default
    private Boolean hasTv = false;

    @Column(name = "has_attached_bathroom")
    @Builder.Default
    private Boolean hasAttachedBathroom = false;

    @Column(name = "has_oxygen")
    @Builder.Default
    private Boolean hasOxygen = false;

    @Column(name = "has_ventilator")
    @Builder.Default
    private Boolean hasVentilator = false;

    @Column(name = "has_monitor")
    @Builder.Default
    private Boolean hasMonitor = false;

    // Status
    @Column(name = "status")
    @Builder.Default
    private String status = "AVAILABLE"; // AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE, CLEANING

    @Column(name = "current_patient_id")
    private Long currentPatientId;

    @Column(name = "current_admission_id")
    private Long currentAdmissionId;

    @Column(name = "reserved_for_patient_id")
    private Long reservedForPatientId;

    @Column(name = "reserved_until")
    private java.time.LocalDateTime reservedUntil;

    // Maintenance
    @Column(name = "last_cleaned_at")
    private java.time.LocalDateTime lastCleanedAt;

    @Column(name = "last_maintenance_at")
    private java.time.LocalDateTime lastMaintenanceAt;

    @Column(name = "maintenance_notes")
    private String maintenanceNotes;

    @Column(name = "display_order")
    private Integer displayOrder;

    public boolean isAvailable() {
        return "AVAILABLE".equals(status);
    }

    public boolean isOccupied() {
        return "OCCUPIED".equals(status);
    }
}
