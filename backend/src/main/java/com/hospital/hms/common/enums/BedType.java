package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BedType {
    GENERAL("General", "General ward bed", 1),
    SEMI_PRIVATE("Semi Private", "Semi-private room with shared facilities", 2),
    PRIVATE("Private", "Private single room", 3),
    DELUXE("Deluxe", "Deluxe room with premium facilities", 4),
    SUITE("Suite", "Suite room with luxury amenities", 5),
    ICU("ICU", "Intensive Care Unit bed", 10),
    NICU("NICU", "Neonatal ICU bed", 10),
    PICU("PICU", "Pediatric ICU bed", 10),
    CCU("CCU", "Cardiac Care Unit bed", 10),
    HDU("HDU", "High Dependency Unit bed", 7),
    ISOLATION("Isolation", "Isolation ward bed", 6),
    EMERGENCY("Emergency", "Emergency room bed", 8),
    RECOVERY("Recovery", "Post-operative recovery bed", 5),
    DAYCARE("Daycare", "Daycare/observation bed", 2);

    private final String displayName;
    private final String description;
    private final int priorityLevel;

    public boolean isICUType() {
        return this == ICU || this == NICU || this == PICU || this == CCU;
    }

    public boolean isPremium() {
        return this == PRIVATE || this == DELUXE || this == SUITE;
    }
}
