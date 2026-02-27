package com.hospital.hms.security.dto;

import com.hospital.hms.common.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private UserDto user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String username;
        private String mobileNumber;
        private String email;
        private String firstName;
        private String lastName;
        private String displayName;
        private String profileImageUrl;
        private UserRole primaryRole;
        private Set<UserRole> roles;
        private Long hospitalId;
        private String hospitalName;
        private Long departmentId;
        private String departmentName;
        private String preferredLanguage;
        private Boolean mustChangePassword;
    }
}
