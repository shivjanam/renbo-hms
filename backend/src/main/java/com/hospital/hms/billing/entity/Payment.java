package com.hospital.hms.billing.entity;

import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.PaymentMode;
import com.hospital.hms.common.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment entity - records all payments made.
 */
@Entity
@Table(name = "payments", indexes = {
        @Index(name = "idx_payment_number", columnList = "payment_number"),
        @Index(name = "idx_payment_invoice", columnList = "invoice_id"),
        @Index(name = "idx_payment_patient", columnList = "patient_id"),
        @Index(name = "idx_payment_date", columnList = "payment_date"),
        @Index(name = "idx_payment_gateway_ref", columnList = "gateway_transaction_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    @Column(name = "payment_number", unique = true, nullable = false)
    private String paymentNumber;

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "invoice_id")
    private Long invoiceId;

    @Column(name = "patient_id")
    private Long patientId;

    @Column(name = "patient_name")
    private String patientName;

    @Column(name = "patient_mobile")
    private String patientMobile;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_mode", nullable = false)
    private PaymentMode paymentMode;

    @Column(name = "amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate;

    @Column(name = "payment_purpose")
    private String paymentPurpose; // ADVANCE, AGAINST_INVOICE, REFUND

    // Gateway details
    @Column(name = "payment_gateway")
    private String paymentGateway; // RAZORPAY, PAYTM, PHONEPE, etc.

    @Column(name = "gateway_order_id")
    private String gatewayOrderId;

    @Column(name = "gateway_transaction_id")
    private String gatewayTransactionId;

    @Column(name = "gateway_payment_id")
    private String gatewayPaymentId;

    @Column(name = "gateway_signature")
    private String gatewaySignature;

    @Column(name = "gateway_response", length = 4000)
    private String gatewayResponse;

    // UPI details
    @Column(name = "upi_transaction_id")
    private String upiTransactionId;

    @Column(name = "upi_vpa")
    private String upiVpa;

    // Card details (masked)
    @Column(name = "card_last_four")
    private String cardLastFour;

    @Column(name = "card_network")
    private String cardNetwork;

    // Cheque/DD details
    @Column(name = "cheque_number")
    private String chequeNumber;

    @Column(name = "cheque_date")
    private LocalDateTime chequeDate;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "bank_branch")
    private String bankBranch;

    // Cash details
    @Column(name = "cash_tendered", precision = 10, scale = 2)
    private BigDecimal cashTendered;

    @Column(name = "change_given", precision = 10, scale = 2)
    private BigDecimal changeGiven;

    // Refund
    @Column(name = "is_refund")
    @Builder.Default
    private Boolean isRefund = false;

    @Column(name = "original_payment_id")
    private Long originalPaymentId;

    @Column(name = "refund_reason")
    private String refundReason;

    @Column(name = "refund_initiated_at")
    private LocalDateTime refundInitiatedAt;

    @Column(name = "refund_completed_at")
    private LocalDateTime refundCompletedAt;

    // Verification
    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;

    @Column(name = "verified_by")
    private String verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    // Receipt
    @Column(name = "receipt_number")
    private String receiptNumber;

    @Column(name = "receipt_pdf_url")
    private String receiptPdfUrl;

    // Notes
    @Column(name = "notes", length = 500)
    private String notes;

    // Collected by
    @Column(name = "collected_by_user_id")
    private Long collectedByUserId;

    @Column(name = "collected_by_name")
    private String collectedByName;

    @Column(name = "counter_number")
    private String counterNumber;
}
