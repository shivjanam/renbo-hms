package com.hospital.hms.doctor.entity;

import com.hospital.hms.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * Prescription medicine item - individual medicine in a prescription.
 */
@Entity
@Table(name = "prescription_medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionMedicine extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @Column(name = "medicine_id")
    private Long medicineId;

    @Column(name = "medicine_name", nullable = false)
    private String medicineName;

    @Column(name = "generic_name")
    private String genericName;

    @Column(name = "medicine_type")
    private String medicineType; // Tablet, Capsule, Syrup, etc.

    @Column(name = "strength")
    private String strength; // 500mg, 250mg, etc.

    @Column(name = "dosage")
    private String dosage; // 1-0-1, 1-1-1, etc.

    @Column(name = "frequency")
    private String frequency; // Once daily, Twice daily, etc.

    @Column(name = "timing")
    private String timing; // Before food, After food, With food

    @Column(name = "route")
    private String route; // Oral, IV, IM, etc.

    @Column(name = "duration")
    private String duration; // 7 days, 2 weeks, etc.

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "instructions", length = 500)
    private String instructions;

    @Column(name = "is_generic")
    @Builder.Default
    private Boolean isGeneric = false;

    @Column(name = "substitute_allowed")
    @Builder.Default
    private Boolean substituteAllowed = true;

    @Column(name = "display_order")
    private Integer displayOrder;
}
