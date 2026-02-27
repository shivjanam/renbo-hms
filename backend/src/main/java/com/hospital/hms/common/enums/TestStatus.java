package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TestStatus {
    ORDERED("Ordered", "Test has been ordered"),
    SAMPLE_PENDING("Sample Pending", "Waiting for sample collection"),
    SAMPLE_COLLECTED("Sample Collected", "Sample has been collected"),
    IN_PROGRESS("In Progress", "Test is being processed"),
    AWAITING_RESULT("Awaiting Result", "Waiting for results"),
    RESULT_READY("Result Ready", "Results are ready"),
    VERIFIED("Verified", "Results verified by lab head"),
    DELIVERED("Delivered", "Results delivered to patient/doctor"),
    CANCELLED("Cancelled", "Test cancelled");

    private final String displayName;
    private final String description;

    public boolean isComplete() {
        return this == RESULT_READY || this == VERIFIED || this == DELIVERED;
    }

    public boolean isPending() {
        return this == ORDERED || this == SAMPLE_PENDING || this == SAMPLE_COLLECTED || 
               this == IN_PROGRESS || this == AWAITING_RESULT;
    }
}
