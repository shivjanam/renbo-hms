package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * User roles in the Hospital Management System.
 * Each role has specific permissions and access levels.
 */
@Getter
@RequiredArgsConstructor
public enum UserRole {
    
    // Patient/Public roles
    PATIENT("Patient", "Regular patient with access to personal records, appointments, and billing"),
    FAMILY_MEMBER("Family Member", "Family member who can book appointments and view records for linked patients"),
    
    // Medical staff roles
    DOCTOR("Doctor", "Licensed physician with access to patient records, prescriptions, and consultations"),
    SPECIALIST("Specialist", "Specialist doctor with advanced consultation access"),
    CONSULTANT("Consultant", "Visiting consultant with limited access"),
    NURSE("Nurse", "Nursing staff with patient care and vitals tracking access"),
    NURSE_HEAD("Head Nurse", "Senior nurse with ward management access"),
    
    // Lab and Pharmacy
    LAB_TECHNICIAN("Lab Technician", "Lab staff with test ordering and report upload access"),
    LAB_HEAD("Lab Head", "Senior lab staff with full lab management access"),
    PHARMACIST("Pharmacist", "Pharmacy staff with medicine dispensing access"),
    PHARMACY_HEAD("Pharmacy Head", "Senior pharmacy staff with inventory management"),
    
    // Administrative roles
    RECEPTIONIST("Receptionist", "Front desk staff for patient registration and appointments"),
    BILLING_STAFF("Billing Staff", "Finance staff for billing and payment processing"),
    CASHIER("Cashier", "Cash handling and payment collection"),
    
    // Management roles
    HOSPITAL_ADMIN("Hospital Admin", "Hospital administrator with full hospital management access"),
    DEPARTMENT_HEAD("Department Head", "Department head with departmental management access"),
    HR_MANAGER("HR Manager", "Human resources management access"),
    FINANCE_MANAGER("Finance Manager", "Financial management and reporting access"),
    
    // Super admin for multi-hospital
    SUPER_ADMIN("Super Admin", "System super administrator with access to all hospitals"),
    
    // Support roles
    IT_SUPPORT("IT Support", "Technical support staff"),
    HOUSEKEEPING("Housekeeping", "Housekeeping staff with cleaning schedule access"),
    SECURITY("Security", "Security staff with visitor management access");

    private final String displayName;
    private final String description;

    public boolean isMedicalStaff() {
        return this == DOCTOR || this == SPECIALIST || this == CONSULTANT || 
               this == NURSE || this == NURSE_HEAD;
    }

    public boolean isLabStaff() {
        return this == LAB_TECHNICIAN || this == LAB_HEAD;
    }

    public boolean isPharmacyStaff() {
        return this == PHARMACIST || this == PHARMACY_HEAD;
    }

    public boolean isAdminStaff() {
        return this == HOSPITAL_ADMIN || this == SUPER_ADMIN || 
               this == DEPARTMENT_HEAD || this == HR_MANAGER || this == FINANCE_MANAGER;
    }

    public boolean isFrontDesk() {
        return this == RECEPTIONIST || this == BILLING_STAFF || this == CASHIER;
    }

    public boolean canAccessPatientRecords() {
        return isMedicalStaff() || isLabStaff() || this == RECEPTIONIST || isAdminStaff();
    }

    public boolean canPrescribe() {
        return this == DOCTOR || this == SPECIALIST || this == CONSULTANT;
    }
}
