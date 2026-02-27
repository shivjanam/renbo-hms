package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PaymentStatus {
    PENDING("Pending", "Payment is pending"),
    INITIATED("Initiated", "Payment has been initiated"),
    PROCESSING("Processing", "Payment is being processed"),
    SUCCESS("Success", "Payment successful"),
    PARTIALLY_PAID("Partially Paid", "Partial payment received"),
    FAILED("Failed", "Payment failed"),
    CANCELLED("Cancelled", "Payment cancelled"),
    REFUND_INITIATED("Refund Initiated", "Refund has been initiated"),
    REFUND_PROCESSING("Refund Processing", "Refund is being processed"),
    REFUNDED("Refunded", "Payment has been refunded"),
    PARTIAL_REFUND("Partial Refund", "Partial amount refunded"),
    EXPIRED("Expired", "Payment link/request expired");

    private final String displayName;
    private final String description;

    public boolean isSuccessful() {
        return this == SUCCESS;
    }

    public boolean isPending() {
        return this == PENDING || this == INITIATED || this == PROCESSING;
    }

    public boolean isFailed() {
        return this == FAILED || this == CANCELLED || this == EXPIRED;
    }

    public boolean isRefunded() {
        return this == REFUNDED || this == PARTIAL_REFUND;
    }
}
