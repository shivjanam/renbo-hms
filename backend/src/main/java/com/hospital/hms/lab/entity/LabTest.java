package com.hospital.hms.lab.entity;

import com.hospital.hms.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Lab test master entity - catalog of available tests.
 */
@Entity
@Table(name = "lab_tests", indexes = {
        @Index(name = "idx_test_code", columnList = "test_code"),
        @Index(name = "idx_test_category", columnList = "category")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabTest extends BaseEntity {

    @Column(name = "test_code", unique = true, nullable = false)
    private String testCode;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "short_name")
    private String shortName;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "category")
    private String category; // Hematology, Biochemistry, Microbiology, etc.

    @Column(name = "sub_category")
    private String subCategory;

    @Column(name = "department")
    private String department;

    @Column(name = "sample_type")
    private String sampleType; // Blood, Urine, Stool, etc.

    @Column(name = "sample_volume")
    private String sampleVolume;

    @Column(name = "container_type")
    private String containerType; // EDTA, Plain, etc.

    @Column(name = "fasting_required")
    @Builder.Default
    private Boolean fastingRequired = false;

    @Column(name = "fasting_hours")
    private Integer fastingHours;

    @Column(name = "turnaround_time")
    private String turnaroundTime; // e.g., "4 hours", "24 hours"

    @Column(name = "turnaround_hours")
    private Integer turnaroundHours;

    // Pricing
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "cost", precision = 10, scale = 2)
    private BigDecimal cost;

    @Column(name = "gst_percentage")
    private Double gstPercentage;

    // Parameters
    @Column(name = "parameters", length = 4000)
    private String parameters; // JSON array of test parameters

    @Column(name = "reference_values", length = 4000)
    private String referenceValues; // JSON for reference ranges

    @Column(name = "method")
    private String method; // Testing methodology

    @Column(name = "equipment")
    private String equipment;

    // Instructions
    @Column(name = "patient_instructions", length = 1000)
    private String patientInstructions;

    @Column(name = "collection_instructions", length = 1000)
    private String collectionInstructions;

    // Flags
    @Column(name = "is_panel")
    @Builder.Default
    private Boolean isPanel = false; // Test panel/profile

    @Column(name = "is_outsourced")
    @Builder.Default
    private Boolean isOutsourced = false;

    @Column(name = "outsource_lab_name")
    private String outsourceLabName;

    @Column(name = "is_home_collection_available")
    @Builder.Default
    private Boolean isHomeCollectionAvailable = false;

    @Column(name = "display_order")
    private Integer displayOrder;
}
