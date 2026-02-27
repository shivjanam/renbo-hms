package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MedicineType {
    TABLET("Tablet", "TAB"),
    CAPSULE("Capsule", "CAP"),
    SYRUP("Syrup", "SYR"),
    INJECTION("Injection", "INJ"),
    CREAM("Cream", "CRM"),
    OINTMENT("Ointment", "OIN"),
    GEL("Gel", "GEL"),
    DROPS("Drops", "DRP"),
    INHALER("Inhaler", "INH"),
    POWDER("Powder", "PWD"),
    SUSPENSION("Suspension", "SUS"),
    LOTION("Lotion", "LOT"),
    SPRAY("Spray", "SPR"),
    PATCH("Patch", "PAT"),
    SUPPOSITORY("Suppository", "SUP"),
    SOLUTION("Solution", "SOL"),
    IV_FLUID("IV Fluid", "IVF"),
    VACCINE("Vaccine", "VAC");

    private final String displayName;
    private final String code;
}
