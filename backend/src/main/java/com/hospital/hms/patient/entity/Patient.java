package com.hospital.hms.patient.entity;

import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.BloodGroup;
import com.hospital.hms.common.enums.Gender;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Patient entity - core entity for patient information.
 * Supports Indian family structure with linked family members.
 */
@Entity
@Table(name = "patients", indexes = {
        @Index(name = "idx_patient_uhid", columnList = "uhid"),
        @Index(name = "idx_patient_mobile", columnList = "mobile_number"),
        @Index(name = "idx_patient_aadhaar", columnList = "aadhaar_encrypted"),
        @Index(name = "idx_patient_hospital", columnList = "registered_hospital_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient extends BaseEntity {

    // Unique Hospital ID - auto-generated
    @Column(name = "uhid", unique = true, nullable = false)
    private String uhid;

    @Column(name = "registered_hospital_id")
    private Long registeredHospitalId;

    // Personal Information
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "age_years")
    private Integer ageYears;

    @Column(name = "age_months")
    private Integer ageMonths;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group")
    private BloodGroup bloodGroup;

    // Contact
    @Column(name = "mobile_number", nullable = false)
    private String mobileNumber;

    @Column(name = "alternate_mobile")
    private String alternateMobile;

    @Column(name = "email")
    private String email;

    // Address
    @Column(name = "address_line1")
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    @Column(name = "city")
    private String city;

    @Column(name = "district")
    private String district;

    @Column(name = "state")
    private String state;

    @Column(name = "pincode")
    private String pincode;

    @Column(name = "country")
    @Builder.Default
    private String country = "India";

    // Identity (encrypted)
    @Column(name = "aadhaar_encrypted")
    private String aadhaarEncrypted;

    @Column(name = "aadhaar_last_four")
    private String aadhaarLastFour;

    @Column(name = "pan")
    private String pan;

    @Column(name = "passport_number")
    private String passportNumber;

    // Emergency Contact
    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_relation")
    private String emergencyContactRelation;

    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    // Family linking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "primary_account_id")
    private Patient primaryAccount;

    @Column(name = "relation_to_primary")
    private String relationToPrimary;

    @OneToMany(mappedBy = "primaryAccount", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Patient> familyMembers = new HashSet<>();

    // Medical Information
    @Column(name = "allergies", length = 1000)
    private String allergies;

    @Column(name = "chronic_conditions", length = 1000)
    private String chronicConditions;

    @Column(name = "current_medications", length = 1000)
    private String currentMedications;

    @Column(name = "medical_notes", length = 2000)
    private String medicalNotes;

    // Insurance
    @Column(name = "insurance_provider")
    private String insuranceProvider;

    @Column(name = "insurance_policy_number")
    private String insurancePolicyNumber;

    @Column(name = "insurance_validity")
    private LocalDate insuranceValidity;

    // Profile
    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "preferred_language")
    @Builder.Default
    private String preferredLanguage = "en";

    @Column(name = "occupation")
    private String occupation;

    @Column(name = "marital_status")
    private String maritalStatus;

    // VIP/Special handling
    @Column(name = "is_vip")
    @Builder.Default
    private Boolean isVip = false;

    @Column(name = "vip_notes")
    private String vipNotes;

    // Consent
    @Column(name = "sms_consent")
    @Builder.Default
    private Boolean smsConsent = true;

    @Column(name = "email_consent")
    @Builder.Default
    private Boolean emailConsent = true;

    @Column(name = "whatsapp_consent")
    @Builder.Default
    private Boolean whatsappConsent = true;

    @Column(name = "marketing_consent")
    @Builder.Default
    private Boolean marketingConsent = false;

    @Column(name = "data_sharing_consent")
    @Builder.Default
    private Boolean dataSharingConsent = false;

    // User link
    @Column(name = "user_id")
    private Long userId;

    public String getFullName() {
        StringBuilder name = new StringBuilder(firstName);
        if (middleName != null && !middleName.isEmpty()) {
            name.append(" ").append(middleName);
        }
        if (lastName != null && !lastName.isEmpty()) {
            name.append(" ").append(lastName);
        }
        return name.toString();
    }

    public Integer getCalculatedAge() {
        if (dateOfBirth != null) {
            return java.time.Period.between(dateOfBirth, LocalDate.now()).getYears();
        }
        return ageYears;
    }
}
