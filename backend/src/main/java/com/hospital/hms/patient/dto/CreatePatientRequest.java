package com.hospital.hms.patient.dto;

import com.hospital.hms.common.enums.BloodGroup;
import com.hospital.hms.common.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePatientRequest {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @Size(max = 50)
    private String middleName;

    @Size(max = 50)
    private String lastName;

    private LocalDate dateOfBirth;

    // For patients where exact DOB is unknown
    @Min(value = 0, message = "Age cannot be negative")
    @Max(value = 150, message = "Age seems invalid")
    private Integer ageYears;

    private Integer ageMonths;

    @NotNull(message = "Gender is required")
    private Gender gender;

    private BloodGroup bloodGroup;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number")
    private String mobileNumber;

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number")
    private String alternateMobile;

    @Email(message = "Invalid email format")
    private String email;

    // Address
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String district;
    private String state;
    
    @Pattern(regexp = "^\\d{6}$", message = "Invalid pincode")
    private String pincode;

    // Optional Aadhaar
    @Pattern(regexp = "^\\d{12}$", message = "Aadhaar must be 12 digits")
    private String aadhaarNumber;

    // Emergency Contact
    private String emergencyContactName;
    private String emergencyContactRelation;
    
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number")
    private String emergencyContactPhone;

    // Medical Info
    private String allergies;
    private String chronicConditions;
    private String currentMedications;

    // Insurance
    private String insuranceProvider;
    private String insurancePolicyNumber;
    private LocalDate insuranceValidity;

    // Family linking
    private Long primaryAccountId;
    private String relationToPrimary;

    // Preferences
    private String preferredLanguage;
    private Boolean smsConsent;
    private Boolean emailConsent;
    private Boolean whatsappConsent;

    private Long hospitalId;
}
