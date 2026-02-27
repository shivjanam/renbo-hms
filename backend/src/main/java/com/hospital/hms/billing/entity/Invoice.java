package com.hospital.hms.billing.entity;

import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.BillingType;
import com.hospital.hms.common.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Invoice entity - GST compliant invoice for all hospital services.
 */
@Entity
@Table(name = "invoices", indexes = {
        @Index(name = "idx_invoice_number", columnList = "invoice_number"),
        @Index(name = "idx_invoice_patient", columnList = "patient_id"),
        @Index(name = "idx_invoice_date", columnList = "invoice_date"),
        @Index(name = "idx_invoice_hospital", columnList = "hospital_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice extends BaseEntity {

    @Column(name = "invoice_number", unique = true, nullable = false)
    private String invoiceNumber;

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "hospital_name")
    private String hospitalName;

    @Column(name = "hospital_gstin")
    private String hospitalGstin;

    @Column(name = "hospital_address", length = 500)
    private String hospitalAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "billing_type", nullable = false)
    private BillingType billingType;

    // Patient/Customer
    @Column(name = "patient_id")
    private Long patientId;

    @Column(name = "patient_uhid")
    private String patientUhid;

    @Column(name = "patient_name", nullable = false)
    private String patientName;

    @Column(name = "patient_mobile")
    private String patientMobile;

    @Column(name = "patient_email")
    private String patientEmail;

    @Column(name = "patient_address", length = 500)
    private String patientAddress;

    @Column(name = "patient_gstin")
    private String patientGstin; // For B2B invoices

    @Column(name = "patient_state_code")
    private String patientStateCode;

    // Reference
    @Column(name = "appointment_id")
    private Long appointmentId;

    @Column(name = "admission_id")
    private Long admissionId;

    @Column(name = "prescription_id")
    private Long prescriptionId;

    @Column(name = "lab_order_id")
    private Long labOrderId;

    // Invoice Details
    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "financial_year")
    private String financialYear;

    // Items
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InvoiceItem> items = new ArrayList<>();

    // Amounts
    @Column(name = "sub_total", precision = 12, scale = 2, nullable = false)
    private BigDecimal subTotal;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "discount_percentage")
    private Double discountPercentage;

    @Column(name = "discount_reason")
    private String discountReason;

    // GST
    @Column(name = "taxable_amount", precision = 12, scale = 2)
    private BigDecimal taxableAmount;

    @Column(name = "cgst_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal cgstAmount = BigDecimal.ZERO;

    @Column(name = "sgst_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal sgstAmount = BigDecimal.ZERO;

    @Column(name = "igst_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal igstAmount = BigDecimal.ZERO;

    @Column(name = "total_tax", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalTax = BigDecimal.ZERO;

    @Column(name = "cess_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal cessAmount = BigDecimal.ZERO;

    @Column(name = "round_off", precision = 6, scale = 2)
    @Builder.Default
    private BigDecimal roundOff = BigDecimal.ZERO;

    @Column(name = "grand_total", precision = 12, scale = 2, nullable = false)
    private BigDecimal grandTotal;

    @Column(name = "amount_in_words")
    private String amountInWords;

    // Payment
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "amount_paid", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal amountPaid = BigDecimal.ZERO;

    @Column(name = "balance_amount", precision = 12, scale = 2)
    private BigDecimal balanceAmount;

    @Column(name = "advance_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal advanceAmount = BigDecimal.ZERO;

    // Insurance
    @Column(name = "is_insurance_claim")
    @Builder.Default
    private Boolean isInsuranceClaim = false;

    @Column(name = "insurance_provider")
    private String insuranceProvider;

    @Column(name = "insurance_claim_amount", precision = 10, scale = 2)
    private BigDecimal insuranceClaimAmount;

    @Column(name = "insurance_claim_status")
    private String insuranceClaimStatus;

    // Status
    @Column(name = "is_cancelled")
    @Builder.Default
    private Boolean isCancelled = false;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancelled_by")
    private String cancelledBy;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    // Credit note reference
    @Column(name = "credit_note_id")
    private Long creditNoteId;

    // PDF
    @Column(name = "pdf_url")
    private String pdfUrl;

    // Notes
    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "terms_conditions", length = 1000)
    private String termsConditions;

    // Created by
    @Column(name = "created_by_user_id")
    private Long createdByUserId;

    @Column(name = "created_by_name")
    private String createdByName;
}
