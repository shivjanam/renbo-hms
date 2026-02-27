package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PrescriptionStatus {
    ACTIVE("Active", "Prescription is currently active"),
    DISPENSED("Dispensed", "Medicines have been dispensed"),
    PARTIALLY_DISPENSED("Partially Dispensed", "Some medicines dispensed"),
    COMPLETED("Completed", "Prescription course completed"),
    CANCELLED("Cancelled", "Prescription cancelled"),
    EXPIRED("Expired", "Prescription has expired");

    private final String displayName;
    private final String description;
}
