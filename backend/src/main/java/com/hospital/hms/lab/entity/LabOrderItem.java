package com.hospital.hms.lab.entity;

import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.TestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Lab order item - individual test in a lab order.
 */
@Entity
@Table(name = "lab_order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabOrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_order_id", nullable = false)
    private LabOrder labOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_test_id", nullable = false)
    private LabTest labTest;

    @Column(name = "test_name")
    private String testName;

    @Column(name = "test_code")
    private String testCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private TestStatus status = TestStatus.ORDERED;

    // Sample
    @Column(name = "sample_id")
    private String sampleId;

    @Column(name = "sample_type")
    private String sampleType;

    @Column(name = "sample_collected_at")
    private LocalDateTime sampleCollectedAt;

    // Results (stored as JSON for flexibility)
    @Column(name = "results", length = 4000)
    private String results; // JSON with parameter values

    @Column(name = "result_summary")
    private String resultSummary;

    @Column(name = "is_abnormal")
    @Builder.Default
    private Boolean isAbnormal = false;

    @Column(name = "abnormal_flags")
    private String abnormalFlags; // HIGH, LOW, CRITICAL, etc.

    @Column(name = "interpretation", length = 1000)
    private String interpretation;

    @Column(name = "comments", length = 500)
    private String comments;

    // Technician
    @Column(name = "performed_by_id")
    private Long performedById;

    @Column(name = "performed_by_name")
    private String performedByName;

    @Column(name = "performed_at")
    private LocalDateTime performedAt;

    // Pricing
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "discount", precision = 10, scale = 2)
    private BigDecimal discount;

    @Column(name = "net_price", precision = 10, scale = 2)
    private BigDecimal netPrice;
}
