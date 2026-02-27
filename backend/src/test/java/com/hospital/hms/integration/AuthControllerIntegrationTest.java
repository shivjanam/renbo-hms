package com.hospital.hms.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.hms.security.dto.LoginRequest;
import com.hospital.hms.security.dto.OtpRequest;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for Authentication Controller.
 * Tests OTP flow, password login, and token refresh endpoints.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Auth Controller Integration Tests")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Nested
    @DisplayName("OTP Send Tests")
    class OtpSendTests {

        @Test
        @DisplayName("Should send OTP successfully")
        void shouldSendOtpSuccessfully() throws Exception {
            // Given
            OtpRequest request = OtpRequest.builder()
                    .mobileNumber("9876543210")
                    .build();

            // When/Then
            mockMvc.perform(post("/api/v1/auth/otp/send")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").exists());
        }

        @Test
        @DisplayName("Should reject invalid mobile number")
        void shouldRejectInvalidMobileNumber() throws Exception {
            // Given - Invalid mobile (less than 10 digits)
            OtpRequest request = OtpRequest.builder()
                    .mobileNumber("12345")
                    .build();

            // When/Then
            mockMvc.perform(post("/api/v1/auth/otp/send")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should reject empty mobile number")
        void shouldRejectEmptyMobileNumber() throws Exception {
            // Given
            OtpRequest request = OtpRequest.builder()
                    .mobileNumber("")
                    .build();

            // When/Then
            mockMvc.perform(post("/api/v1/auth/otp/send")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("OTP Verify Tests")
    class OtpVerifyTests {

        @Test
        @DisplayName("Should reject invalid OTP")
        void shouldRejectInvalidOtp() throws Exception {
            // Given
            LoginRequest request = LoginRequest.builder()
                    .mobileNumber("9876543210")
                    .otp("000000")
                    .build();

            // When/Then
            mockMvc.perform(post("/api/v1/auth/otp/verify")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("Should reject OTP for non-existent user")
        void shouldRejectOtpForNonExistentUser() throws Exception {
            // Given
            LoginRequest request = LoginRequest.builder()
                    .mobileNumber("1111111111")
                    .otp("123456")
                    .build();

            // When/Then
            mockMvc.perform(post("/api/v1/auth/otp/verify")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("Password Login Tests")
    class PasswordLoginTests {

        @Test
        @DisplayName("Should reject non-existent username")
        void shouldRejectNonExistentUsername() throws Exception {
            // Given
            LoginRequest request = LoginRequest.builder()
                    .username("nonexistent_user")
                    .password("password123")
                    .build();

            // When/Then
            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("Should reject empty credentials")
        void shouldRejectEmptyCredentials() throws Exception {
            // Given
            LoginRequest request = LoginRequest.builder()
                    .username("")
                    .password("")
                    .build();

            // When/Then
            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("Token Refresh Tests")
    class TokenRefreshTests {

        @Test
        @DisplayName("Should reject invalid refresh token")
        void shouldRejectInvalidRefreshToken() throws Exception {
            // When/Then
            mockMvc.perform(post("/api/v1/auth/refresh")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"refreshToken\": \"invalid_token\"}"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Should reject missing refresh token")
        void shouldRejectMissingRefreshToken() throws Exception {
            // When/Then
            mockMvc.perform(post("/api/v1/auth/refresh")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("Protected Endpoint Tests")
    class ProtectedEndpointTests {

        @Test
        @DisplayName("Should reject unauthenticated access to protected endpoint")
        void shouldRejectUnauthenticatedAccess() throws Exception {
            // When/Then
            mockMvc.perform(get("/api/v1/auth/me"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Should reject invalid token")
        void shouldRejectInvalidToken() throws Exception {
            // When/Then
            mockMvc.perform(get("/api/v1/auth/me")
                            .header("Authorization", "Bearer invalid_token"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Should reject malformed authorization header")
        void shouldRejectMalformedAuthHeader() throws Exception {
            // When/Then
            mockMvc.perform(get("/api/v1/auth/me")
                            .header("Authorization", "InvalidScheme token"))
                    .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("Role-Based Access Tests")
    class RoleBasedAccessTests {

        @Test
        @DisplayName("Should reject admin endpoint without admin role")
        void shouldRejectAdminEndpointWithoutRole() throws Exception {
            // When/Then
            mockMvc.perform(get("/api/v1/admin/dashboard"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Should reject doctor endpoint without doctor role")
        void shouldRejectDoctorEndpointWithoutRole() throws Exception {
            // When/Then
            mockMvc.perform(get("/api/v1/doctor/appointments"))
                    .andExpect(status().isUnauthorized());
        }
    }
}
