package com.hospital.hms.security;

import com.hospital.hms.common.enums.UserRole;
import com.hospital.hms.common.exception.BadRequestException;
import com.hospital.hms.common.exception.ResourceNotFoundException;
import com.hospital.hms.common.exception.UnauthorizedException;
import com.hospital.hms.factory.TestDataFactory;
import com.hospital.hms.security.dto.*;
import com.hospital.hms.security.entity.RefreshToken;
import com.hospital.hms.security.entity.User;
import com.hospital.hms.security.jwt.JwtTokenProvider;
import com.hospital.hms.security.repository.RefreshTokenRepository;
import com.hospital.hms.security.repository.UserRepository;
import com.hospital.hms.security.service.AuthService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        TestDataFactory.resetIdGenerator();
        testUser = TestDataFactory.createPatientUser();
        testUser.setMobileNumber("9876543210");
        testUser.setIsMobileVerified(true);
        testUser.setRoles(new HashSet<>());
        
        // Set config values via reflection
        ReflectionTestUtils.setField(authService, "otpExpiryMinutes", 10);
        ReflectionTestUtils.setField(authService, "otpCooldownSeconds", 60);
        ReflectionTestUtils.setField(authService, "maxDailyOtpLimit", 10);
        ReflectionTestUtils.setField(authService, "otpLength", 6);
    }

    @Nested
    @DisplayName("Send OTP Tests")
    class SendOtpTests {

        @Test
        @DisplayName("Should send OTP for new user")
        void shouldSendOtpForNewUser() {
            // Given
            OtpRequest request = OtpRequest.builder()
                    .mobileNumber("9876543210")
                    .build();
            
            when(userRepository.findByMobileNumber("9876543210")).thenReturn(Optional.empty());
            when(passwordEncoder.encode(anyString())).thenReturn("encoded_otp");
            when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

            // When
            assertThatCode(() -> authService.sendOtp(request))
                    .doesNotThrowAnyException();

            // Then
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("Should send OTP for existing user")
        void shouldSendOtpForExistingUser() {
            // Given
            OtpRequest request = OtpRequest.builder()
                    .mobileNumber("9876543210")
                    .build();
            
            testUser.setLastOtpSent(LocalDateTime.now().minusMinutes(5));
            testUser.setDailyOtpCount(0);
            
            when(userRepository.findByMobileNumber("9876543210")).thenReturn(Optional.of(testUser));
            when(passwordEncoder.encode(anyString())).thenReturn("encoded_otp");
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            assertThatCode(() -> authService.sendOtp(request))
                    .doesNotThrowAnyException();

            // Then
            verify(userRepository).save(testUser);
            assertThat(testUser.getOtp()).isNotNull();
        }

        @Test
        @DisplayName("Should enforce OTP cooldown")
        void shouldEnforceOtpCooldown() {
            // Given
            OtpRequest request = OtpRequest.builder()
                    .mobileNumber("9876543210")
                    .build();
            
            testUser.setLastOtpSent(LocalDateTime.now().minusSeconds(30)); // Less than cooldown
            
            when(userRepository.findByMobileNumber("9876543210")).thenReturn(Optional.of(testUser));

            // When/Then
            assertThatThrownBy(() -> authService.sendOtp(request))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("wait");
        }

        @Test
        @DisplayName("Should enforce daily OTP limit")
        void shouldEnforceDailyOtpLimit() {
            // Given
            OtpRequest request = OtpRequest.builder()
                    .mobileNumber("9876543210")
                    .build();
            
            testUser.setLastOtpSent(LocalDateTime.now().minusMinutes(5));
            testUser.setDailyOtpCount(10);
            testUser.setDailyOtpResetDate(LocalDateTime.now());
            
            when(userRepository.findByMobileNumber("9876543210")).thenReturn(Optional.of(testUser));

            // When/Then
            assertThatThrownBy(() -> authService.sendOtp(request))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("limit exceeded");
        }
    }

    @Nested
    @DisplayName("Login with OTP Tests")
    class LoginWithOtpTests {

        @Test
        @DisplayName("Should login successfully with valid OTP")
        void shouldLoginWithValidOtp() {
            // Given
            LoginRequest request = LoginRequest.builder()
                    .mobileNumber("9876543210")
                    .otp("123456")
                    .build();
            
            testUser.setOtp("encoded_otp");
            testUser.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
            testUser.setOtpAttempts(0);
            
            when(userRepository.findByMobileNumber("9876543210")).thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches("123456", "encoded_otp")).thenReturn(true);
            when(userRepository.save(any(User.class))).thenReturn(testUser);
            when(tokenProvider.generateAccessToken(anyLong(), anyString(), any(), any(), any()))
                    .thenReturn("access_token");
            when(tokenProvider.getExpirationInSeconds()).thenReturn(3600L);
            when(tokenProvider.getRefreshExpirationInSeconds()).thenReturn(86400L);
            when(refreshTokenRepository.save(any(RefreshToken.class)))
                    .thenAnswer(i -> {
                        RefreshToken rt = i.getArgument(0);
                        rt.setToken("refresh_token");
                        return rt;
                    });

            // When
            AuthResponse response = authService.loginWithOtp(request);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getAccessToken()).isEqualTo("access_token");
            assertThat(response.getUser().getMobileNumber()).isEqualTo("9876543210");
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("Should reject invalid OTP")
        void shouldRejectInvalidOtp() {
            // Given
            LoginRequest request = LoginRequest.builder()
                    .mobileNumber("9876543210")
                    .otp("wrong_otp")
                    .build();
            
            testUser.setOtp("encoded_otp");
            testUser.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
            testUser.setOtpAttempts(0);
            
            when(userRepository.findByMobileNumber("9876543210")).thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches("wrong_otp", "encoded_otp")).thenReturn(false);
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When/Then
            assertThatThrownBy(() -> authService.loginWithOtp(request))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Invalid OTP");
        }

        @Test
        @DisplayName("Should reject expired OTP")
        void shouldRejectExpiredOtp() {
            // Given
            LoginRequest request = LoginRequest.builder()
                    .mobileNumber("9876543210")
                    .otp("123456")
                    .build();
            
            testUser.setOtp("encoded_otp");
            testUser.setOtpExpiry(LocalDateTime.now().minusMinutes(5)); // Expired
            testUser.setOtpAttempts(0);
            
            when(userRepository.findByMobileNumber("9876543210")).thenReturn(Optional.of(testUser));

            // When/Then
            assertThatThrownBy(() -> authService.loginWithOtp(request))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("expired");
        }

        @Test
        @DisplayName("Should block after max OTP attempts")
        void shouldBlockAfterMaxOtpAttempts() {
            // Given
            LoginRequest request = LoginRequest.builder()
                    .mobileNumber("9876543210")
                    .otp("123456")
                    .build();
            
            testUser.setOtp("encoded_otp");
            testUser.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
            testUser.setOtpAttempts(3); // Max attempts reached
            
            when(userRepository.findByMobileNumber("9876543210")).thenReturn(Optional.of(testUser));

            // When/Then
            assertThatThrownBy(() -> authService.loginWithOtp(request))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("failed attempts");
        }

        @Test
        @DisplayName("Should throw exception for non-existent user")
        void shouldThrowForNonExistentUser() {
            // Given
            LoginRequest request = LoginRequest.builder()
                    .mobileNumber("9876543210")
                    .otp("123456")
                    .build();
            
            when(userRepository.findByMobileNumber("9876543210")).thenReturn(Optional.empty());

            // When/Then
            assertThatThrownBy(() -> authService.loginWithOtp(request))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Login with Password Tests")
    class LoginWithPasswordTests {

        @Test
        @DisplayName("Should login with valid password")
        void shouldLoginWithValidPassword() {
            // Given
            LoginRequest request = LoginRequest.builder()
                    .username("test_user")
                    .password("password123")
                    .build();
            
            testUser.setUsername("test_user");
            testUser.setPasswordHash("encoded_password");
            testUser.setIsLocked(false);
            testUser.setFailedLoginAttempts(0);
            
            when(userRepository.findByUsername("test_user")).thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches("password123", "encoded_password")).thenReturn(true);
            when(userRepository.save(any(User.class))).thenReturn(testUser);
            when(tokenProvider.generateAccessToken(anyLong(), anyString(), any(), any(), any()))
                    .thenReturn("access_token");
            when(tokenProvider.getExpirationInSeconds()).thenReturn(3600L);
            when(tokenProvider.getRefreshExpirationInSeconds()).thenReturn(86400L);
            when(refreshTokenRepository.save(any(RefreshToken.class)))
                    .thenAnswer(i -> {
                        RefreshToken rt = i.getArgument(0);
                        rt.setToken("refresh_token");
                        return rt;
                    });

            // When
            AuthResponse response = authService.loginWithPassword(request);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getAccessToken()).isEqualTo("access_token");
        }

        @Test
        @DisplayName("Should reject wrong password")
        void shouldRejectWrongPassword() {
            // Given
            LoginRequest request = LoginRequest.builder()
                    .username("test_user")
                    .password("wrong_password")
                    .build();
            
            testUser.setUsername("test_user");
            testUser.setPasswordHash("encoded_password");
            testUser.setIsLocked(false);
            testUser.setFailedLoginAttempts(0);
            
            when(userRepository.findByUsername("test_user")).thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches("wrong_password", "encoded_password")).thenReturn(false);
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When/Then
            assertThatThrownBy(() -> authService.loginWithPassword(request))
                    .isInstanceOf(UnauthorizedException.class);
        }

        @Test
        @DisplayName("Should lock account after 5 failed attempts")
        void shouldLockAccountAfterFailedAttempts() {
            // Given
            LoginRequest request = LoginRequest.builder()
                    .username("test_user")
                    .password("wrong_password")
                    .build();
            
            testUser.setUsername("test_user");
            testUser.setPasswordHash("encoded_password");
            testUser.setIsLocked(false);
            testUser.setFailedLoginAttempts(4); // One more will lock
            
            when(userRepository.findByUsername("test_user")).thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches("wrong_password", "encoded_password")).thenReturn(false);
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When/Then
            assertThatThrownBy(() -> authService.loginWithPassword(request))
                    .isInstanceOf(UnauthorizedException.class);
            
            assertThat(testUser.getIsLocked()).isTrue();
            assertThat(testUser.getLockReason()).contains("failed login");
        }
    }

    @Nested
    @DisplayName("Token Refresh Tests")
    class TokenRefreshTests {

        @Test
        @DisplayName("Should refresh valid token")
        void shouldRefreshValidToken() {
            // Given
            RefreshToken refreshToken = RefreshToken.builder()
                    .token("valid_refresh_token")
                    .user(testUser)
                    .expiresAt(LocalDateTime.now().plusDays(1))
                    .isRevoked(false)
                    .build();
            refreshToken.setIsActive(true);
            
            when(refreshTokenRepository.findByToken("valid_refresh_token"))
                    .thenReturn(Optional.of(refreshToken));
            when(tokenProvider.generateAccessToken(anyLong(), anyString(), any(), any(), any()))
                    .thenReturn("new_access_token");
            when(tokenProvider.getExpirationInSeconds()).thenReturn(3600L);
            when(tokenProvider.getRefreshExpirationInSeconds()).thenReturn(86400L);
            when(refreshTokenRepository.save(any(RefreshToken.class)))
                    .thenAnswer(i -> i.getArgument(0));

            // When
            AuthResponse response = authService.refreshToken("valid_refresh_token");

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getAccessToken()).isEqualTo("new_access_token");
        }

        @Test
        @DisplayName("Should reject expired refresh token")
        void shouldRejectExpiredRefreshToken() {
            // Given
            RefreshToken refreshToken = RefreshToken.builder()
                    .token("expired_token")
                    .user(testUser)
                    .expiresAt(LocalDateTime.now().minusDays(1)) // Expired
                    .isRevoked(false)
                    .build();
            refreshToken.setIsActive(true);
            
            when(refreshTokenRepository.findByToken("expired_token"))
                    .thenReturn(Optional.of(refreshToken));

            // When/Then
            assertThatThrownBy(() -> authService.refreshToken("expired_token"))
                    .isInstanceOf(UnauthorizedException.class);
        }

        @Test
        @DisplayName("Should reject revoked refresh token")
        void shouldRejectRevokedRefreshToken() {
            // Given
            RefreshToken refreshToken = RefreshToken.builder()
                    .token("revoked_token")
                    .user(testUser)
                    .expiresAt(LocalDateTime.now().plusDays(1))
                    .isRevoked(true) // Revoked
                    .build();
            refreshToken.setIsActive(true);
            
            when(refreshTokenRepository.findByToken("revoked_token"))
                    .thenReturn(Optional.of(refreshToken));

            // When/Then
            assertThatThrownBy(() -> authService.refreshToken("revoked_token"))
                    .isInstanceOf(UnauthorizedException.class);
        }
    }
}
