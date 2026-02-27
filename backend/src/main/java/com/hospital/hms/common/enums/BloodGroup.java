package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BloodGroup {
    A_POSITIVE("A+", "A Positive"),
    A_NEGATIVE("A-", "A Negative"),
    B_POSITIVE("B+", "B Positive"),
    B_NEGATIVE("B-", "B Negative"),
    AB_POSITIVE("AB+", "AB Positive"),
    AB_NEGATIVE("AB-", "AB Negative"),
    O_POSITIVE("O+", "O Positive"),
    O_NEGATIVE("O-", "O Negative"),
    UNKNOWN("Unknown", "Unknown");

    private final String code;
    private final String displayName;
}
