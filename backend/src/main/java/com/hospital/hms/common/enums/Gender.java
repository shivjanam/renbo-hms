package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Gender {
    MALE("Male", "M"),
    FEMALE("Female", "F"),
    OTHER("Other", "O"),
    PREFER_NOT_TO_SAY("Prefer not to say", "N");

    private final String displayName;
    private final String code;
}
