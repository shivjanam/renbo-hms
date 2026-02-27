package com.hospital.hms.lab.entity;

import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.TestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Lab order entity - order for lab tests.
 */
@Entity
@Table(name = "lab_orders", indexes = {
        @Index(name = "idx_lab_order_patient", columnList = "patient_id"),
        @Index(name = "idx_lab_order_doctor", columnList = "ordered_by_doctor_id"),
        @Index(name = "idx_lab_order_date", columnList = "order_date"),
        @Index(name = "idx_lab_order_number", columnList = "order_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabOrder extends BaseEntity {

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "patient_name")
    private String patientName;

    @Column(name = "patient_age")
    private String patientAge;

    @Column(name = "patient_gender")
    private String patientGender;

    @Column(name = "patient_mobile")
    private String patientMobile;

    @Column(name = "ordered_by_doctor_id")
    private Long orderedByDoctorId;

    @Column(name = "ordered_by_doctor_name")
    private String orderedByDoctorName;

    @Column(name = "appointment_id")
    private Long appointmentId;

    @Column(name = "prescription_id")
    private Long prescriptionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private TestStatus status = TestStatus.ORDERED;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "priority")
    @Builder.Default
    private String priority = "ROUTINE"; // ROUTINE, URGENT, STAT

    @Column(name = "is_emergency")
    @Builder.Default
    private Boolean isEmergency = false;

    // Sample collection
    @Column(name = "sample_collected_at")
    private LocalDateTime sampleCollectedAt;

    @Column(name = "sample_collected_by")
    private String sampleCollectedBy;

    @Column(name = "sample_collection_notes")
    private String sampleCollectionNotes;

    // Processing
    @Column(name = "processing_started_at")
    private LocalDateTime processingStartedAt;

    @Column(name = "result_entered_at")
    private LocalDateTime resultEnteredAt;

    @Column(name = "result_entered_by")
    private String resultEnteredBy;

    // Verification
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "verified_by_id")
    private Long verifiedById;

    @Column(name = "verified_by_name")
    private String verifiedByName;

    // Delivery
    @Column(name = "report_delivered_at")
    private LocalDateTime reportDeliveredAt;

    @Column(name = "delivery_mode")
    private String deliveryMode; // PRINT, EMAIL, WHATSAPP, ONLINE

    // Tests
    @OneToMany(mappedBy = "labOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<LabOrderItem> items = new ArrayList<>();

    // Billing
    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "net_amount", precision = 10, scale = 2)
    private BigDecimal netAmount;

    @Column(name = "is_paid")
    @Builder.Default
    private Boolean isPaid = false;

    @Column(name = "payment_id")
    private Long paymentId;

    // Report
    @Column(name = "report_pdf_url")
    private String reportPdfUrl;

    @Column(name = "clinical_notes", length = 1000)
    private String clinicalNotes;

    @Column(name = "internal_notes", length = 500)
    private String internalNotes;
}
