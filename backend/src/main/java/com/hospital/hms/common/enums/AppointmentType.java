package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AppointmentType {
    OPD("OPD", "Outpatient Department Visit"),
    FOLLOW_UP("Follow Up", "Follow-up consultation"),
    TELECONSULTATION("Teleconsultation", "Online video consultation"),
    EMERGENCY("Emergency", "Emergency visit"),
    HEALTH_CHECKUP("Health Checkup", "Routine health checkup"),
    LAB_VISIT("Lab Visit", "Visit for lab tests only"),
    VACCINATION("Vaccination", "Vaccination appointment"),
    PROCEDURE("Procedure", "Minor procedure/treatment");

    private final String displayName;
    private final String description;
}
