package com.hospital.hms.patient.dto;

import com.hospital.hms.common.enums.BloodGroup;
import com.hospital.hms.common.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientDto {

    private Long id;
    private String uhid;
    private Long registeredHospitalId;
    private String hospitalName;

    // Personal Info
    private String firstName;
    private String middleName;
    private String lastName;
    private String fullName;
    private LocalDate dateOfBirth;
    private Integer age;
    private Gender gender;
    private BloodGroup bloodGroup;

    // Contact
    private String mobileNumber;
    private String alternateMobile;
    private String email;

    // Address
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String district;
    private String state;
    private String pincode;

    // Identity (masked)
    private String aadhaarMasked;

    // Emergency Contact
    private String emergencyContactName;
    private String emergencyContactRelation;
    private String emergencyContactPhone;

    // Medical
    private String allergies;
    private String chronicConditions;
    private String currentMedications;

    // Insurance
    private String insuranceProvider;
    private String insurancePolicyNumber;
    private LocalDate insuranceValidity;

    // Profile
    private String profileImageUrl;
    private String preferredLanguage;
    private Boolean isVip;

    // Family
    private Long primaryAccountId;
    private String relationToPrimary;
    private List<FamilyMemberDto> familyMembers;

    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FamilyMemberDto {
        private Long id;
        private String uhid;
        private String fullName;
        private Integer age;
        private Gender gender;
        private String relationToPrimary;
    }
}
