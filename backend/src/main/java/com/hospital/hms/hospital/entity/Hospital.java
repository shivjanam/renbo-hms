package com.hospital.hms.hospital.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hospital.hms.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Hospital entity - represents a hospital or branch in multi-hospital setup.
 */
@Entity
@Table(name = "hospitals", indexes = {
        @Index(name = "idx_hospital_code", columnList = "hospital_code"),
        @Index(name = "idx_hospital_parent", columnList = "parent_hospital_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital extends BaseEntity {

    @Column(name = "hospital_code", unique = true, nullable = false)
    private String hospitalCode;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "short_name")
    private String shortName;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "hospital_type")
    private String hospitalType; // General, Specialty, Multi-specialty, etc.

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "accreditation")
    private String accreditation; // NABH, JCI, etc.

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

    // Contact
    @Column(name = "phone")
    private String phone;

    @Column(name = "alternate_phone")
    private String alternatePhone;

    @Column(name = "email")
    private String email;

    @Column(name = "website")
    private String website;

    // Branding
    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "header_image_url")
    private String headerImageUrl;

    @Column(name = "primary_color")
    private String primaryColor;

    // Billing/GST
    @Column(name = "gstin")
    private String gstin;

    @Column(name = "pan")
    private String pan;

    @Column(name = "tan")
    private String tan;

    // Bank Details
    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "bank_account_name")
    private String bankAccountName;

    @Column(name = "bank_account_number")
    private String bankAccountNumber;

    @Column(name = "bank_ifsc")
    private String bankIfsc;

    @Column(name = "bank_branch")
    private String bankBranch;

    @Column(name = "upi_id")
    private String upiId;

    // Multi-hospital hierarchy
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_hospital_id")
    @JsonIgnore
    private Hospital parentHospital;

    @OneToMany(mappedBy = "parentHospital", fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private Set<Hospital> branches = new HashSet<>();

    @Column(name = "is_branch")
    @Builder.Default
    private Boolean isBranch = false;

    // Settings
    @Column(name = "timezone")
    @Builder.Default
    private String timezone = "Asia/Kolkata";

    @Column(name = "currency")
    @Builder.Default
    private String currency = "INR";

    @Column(name = "default_language")
    @Builder.Default
    private String defaultLanguage = "en";

    @Column(name = "total_beds")
    private Integer totalBeds;

    @Column(name = "emergency_enabled")
    @Builder.Default
    private Boolean emergencyEnabled = true;

    @Column(name = "teleconsultation_enabled")
    @Builder.Default
    private Boolean teleconsultationEnabled = true;
}
