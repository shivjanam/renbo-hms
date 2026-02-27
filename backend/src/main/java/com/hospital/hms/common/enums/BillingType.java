package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BillingType {
    OPD("OPD", "Outpatient billing"),
    IPD("IPD", "Inpatient billing"),
    EMERGENCY("Emergency", "Emergency billing"),
    LAB("Lab", "Laboratory test billing"),
    PHARMACY("Pharmacy", "Pharmacy/medicine billing"),
    RADIOLOGY("Radiology", "Imaging/radiology billing"),
    PROCEDURE("Procedure", "Medical procedure billing"),
    SURGERY("Surgery", "Surgery billing"),
    PACKAGE("Package", "Health package billing"),
    CONSULTATION("Consultation", "Consultation fee only"),
    TELECONSULTATION("Teleconsultation", "Online consultation billing"),
    VACCINATION("Vaccination", "Vaccination billing"),
    HEALTH_CHECKUP("Health Checkup", "Health checkup package billing");

    private final String displayName;
    private final String description;
}
