package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AdmissionStatus {
    REQUESTED("Requested", "Admission requested"),
    APPROVED("Approved", "Admission approved"),
    ADMITTED("Admitted", "Patient admitted"),
    UNDER_TREATMENT("Under Treatment", "Patient receiving treatment"),
    STABLE("Stable", "Patient condition stable"),
    CRITICAL("Critical", "Patient in critical condition"),
    RECOVERING("Recovering", "Patient recovering"),
    READY_FOR_DISCHARGE("Ready for Discharge", "Patient ready to be discharged"),
    DISCHARGED("Discharged", "Patient discharged"),
    TRANSFERRED("Transferred", "Patient transferred to another facility"),
    ABSCONDED("Absconded", "Patient left without authorization"),
    DECEASED("Deceased", "Patient expired");

    private final String displayName;
    private final String description;

    public boolean isActive() {
        return this == ADMITTED || this == UNDER_TREATMENT || this == STABLE || 
               this == CRITICAL || this == RECOVERING;
    }

    public boolean requiresUrgentAttention() {
        return this == CRITICAL;
    }
}
