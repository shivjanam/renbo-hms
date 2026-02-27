package com.hospital.hms.security.entity;

import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * User entity for authentication and authorization.
 * Supports multiple roles and multi-hospital access.
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_mobile", columnList = "mobile_number"),
        @Index(name = "idx_user_email", columnList = "email"),
        @Index(name = "idx_user_username", columnList = "username")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(name = "username", unique = true)
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "mobile_number", nullable = false)
    private String mobileNumber;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "primary_role", nullable = false)
    private UserRole primaryRole;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    @Builder.Default
    private Set<UserRole> roles = new HashSet<>();

    @Column(name = "hospital_id")
    private Long hospitalId;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_hospital_access", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "hospital_id")
    @Builder.Default
    private Set<Long> accessibleHospitalIds = new HashSet<>();

    @Column(name = "department_id")
    private Long departmentId;

    // OTP-based login
    @Column(name = "otp")
    private String otp;

    @Column(name = "otp_expiry")
    private LocalDateTime otpExpiry;

    @Column(name = "otp_attempts")
    @Builder.Default
    private Integer otpAttempts = 0;

    @Column(name = "last_otp_sent")
    private LocalDateTime lastOtpSent;

    @Column(name = "daily_otp_count")
    @Builder.Default
    private Integer dailyOtpCount = 0;

    @Column(name = "daily_otp_reset_date")
    private LocalDateTime dailyOtpResetDate;

    // Account security
    @Column(name = "is_mobile_verified")
    @Builder.Default
    private Boolean isMobileVerified = false;

    @Column(name = "is_email_verified")
    @Builder.Default
    private Boolean isEmailVerified = false;

    @Column(name = "is_locked")
    @Builder.Default
    private Boolean isLocked = false;

    @Column(name = "lock_reason")
    private String lockReason;

    @Column(name = "locked_at")
    private LocalDateTime lockedAt;

    @Column(name = "failed_login_attempts")
    @Builder.Default
    private Integer failedLoginAttempts = 0;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "last_login_ip")
    private String lastLoginIp;

    @Column(name = "password_changed_at")
    private LocalDateTime passwordChangedAt;

    @Column(name = "must_change_password")
    @Builder.Default
    private Boolean mustChangePassword = false;

    // Preferences
    @Column(name = "preferred_language")
    @Builder.Default
    private String preferredLanguage = "en";

    @Column(name = "timezone")
    @Builder.Default
    private String timezone = "Asia/Kolkata";

    // Linked entities
    @Column(name = "patient_id")
    private Long patientId;

    @Column(name = "doctor_id")
    private Long doctorId;

    @Column(name = "staff_id")
    private Long staffId;

    @PrePersist
    @PreUpdate
    private void updateDisplayName() {
        if (displayName == null || displayName.isEmpty()) {
            displayName = firstName + (lastName != null ? " " + lastName : "");
        }
    }

    public String getFullName() {
        return firstName + (lastName != null ? " " + lastName : "");
    }

    public boolean hasRole(UserRole role) {
        return roles.contains(role) || primaryRole == role;
    }

    public boolean hasAnyRole(UserRole... checkRoles) {
        for (UserRole role : checkRoles) {
            if (hasRole(role)) return true;
        }
        return false;
    }

    public boolean canAccessHospital(Long hospitalId) {
        if (primaryRole == UserRole.SUPER_ADMIN) return true;
        if (this.hospitalId != null && this.hospitalId.equals(hospitalId)) return true;
        return accessibleHospitalIds.contains(hospitalId);
    }
}
