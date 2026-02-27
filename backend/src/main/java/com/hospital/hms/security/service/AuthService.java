package com.hospital.hms.security.service;

import com.hospital.hms.common.enums.UserRole;
import com.hospital.hms.common.exception.*;
import com.hospital.hms.security.dto.*;
import com.hospital.hms.security.entity.RefreshToken;
import com.hospital.hms.security.entity.User;
import com.hospital.hms.security.jwt.JwtTokenProvider;
import com.hospital.hms.security.jwt.UserPrincipal;
import com.hospital.hms.security.repository.RefreshTokenRepository;
import com.hospital.hms.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    @Value("${app.otp.cooldown-seconds:60}")
    private int otpCooldownSeconds;

    @Value("${app.otp.max-daily-limit:10}")
    private int maxDailyOtpLimit;

    @Value("${app.otp.length:6}")
    private int otpLength;

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Send OTP to mobile number for login/registration
     */
    @Transactional
    public void sendOtp(OtpRequest request) {
        String mobile = request.getMobileNumber();
        
        User user = userRepository.findByMobileNumber(mobile).orElse(null);
        
        if (user != null) {
            // Check cooldown
            if (user.getLastOtpSent() != null && 
                user.getLastOtpSent().plusSeconds(otpCooldownSeconds).isAfter(LocalDateTime.now())) {
                throw new BadRequestException("Please wait before requesting another OTP", "OTP_COOLDOWN");
            }

            // Check daily limit
            if (user.getDailyOtpResetDate() != null && 
                user.getDailyOtpResetDate().toLocalDate().equals(LocalDateTime.now().toLocalDate())) {
                if (user.getDailyOtpCount() >= maxDailyOtpLimit) {
                    throw new BadRequestException("Daily OTP limit exceeded. Please try again tomorrow.", "OTP_LIMIT_EXCEEDED");
                }
            } else {
                user.setDailyOtpCount(0);
                user.setDailyOtpResetDate(LocalDateTime.now());
            }
        } else {
            // Create temporary user for registration
            user = User.builder()
                    .mobileNumber(mobile)
                    .primaryRole(UserRole.PATIENT)
                    .roles(new HashSet<>())
                    .firstName("New User")
                    .isMobileVerified(false)
                    .build();
        }

        // Generate OTP
        String otp = generateOtp();
        user.setOtp(passwordEncoder.encode(otp));
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        user.setOtpAttempts(0);
        user.setLastOtpSent(LocalDateTime.now());
        user.setDailyOtpCount((user.getDailyOtpCount() != null ? user.getDailyOtpCount() : 0) + 1);

        userRepository.save(user);

        // TODO: Send OTP via SMS
        log.info("OTP for {}: {}", mobile, otp);
        // smsService.sendOtp(mobile, otp);
    }

    /**
     * Verify OTP and login
     */
    @Transactional
    public AuthResponse loginWithOtp(LoginRequest request) {
        User user = userRepository.findByMobileNumber(request.getMobileNumber())
                .orElseThrow(() -> new ResourceNotFoundException("User not found. Please register first."));

        validateOtp(user, request.getOtp());

        // Mark mobile as verified
        user.setIsMobileVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setOtpAttempts(0);
        user.setLastLoginAt(LocalDateTime.now());
        user.setFailedLoginAttempts(0);
        
        userRepository.save(user);

        return generateAuthResponse(user);
    }

    /**
     * Register a new user (patient by default)
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if user exists
        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            User existingUser = userRepository.findByMobileNumber(request.getMobileNumber()).get();
            
            if (existingUser.getIsMobileVerified()) {
                throw new DuplicateResourceException("User", "mobileNumber", request.getMobileNumber());
            }
            
            // User exists but not verified - verify OTP and complete registration
            validateOtp(existingUser, request.getOtp());
            
            existingUser.setFirstName(request.getFirstName());
            existingUser.setLastName(request.getLastName());
            existingUser.setEmail(request.getEmail());
            existingUser.setIsMobileVerified(true);
            existingUser.setOtp(null);
            existingUser.setOtpExpiry(null);
            
            if (request.getPassword() != null) {
                existingUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            }
            
            if (request.getPreferredLanguage() != null) {
                existingUser.setPreferredLanguage(request.getPreferredLanguage());
            }
            
            userRepository.save(existingUser);
            return generateAuthResponse(existingUser);
        }

        throw new BadRequestException("Please request OTP first", "OTP_REQUIRED");
    }

    /**
     * Login with password (for staff)
     */
    @Transactional
    public AuthResponse loginWithPassword(LoginRequest request) {
        String identifier = request.getUsername() != null ? request.getUsername() : 
                          request.getEmail() != null ? request.getEmail() : request.getMobileNumber();

        User user = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .or(() -> userRepository.findByMobileNumber(identifier))
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (user.getIsLocked()) {
            throw new ForbiddenException("Account is locked. " + user.getLockReason());
        }

        if (user.getPasswordHash() == null) {
            throw new BadRequestException("Please use OTP login", "PASSWORD_NOT_SET");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            user.setFailedLoginAttempts((user.getFailedLoginAttempts() != null ? user.getFailedLoginAttempts() : 0) + 1);
            
            if (user.getFailedLoginAttempts() >= 5) {
                user.setIsLocked(true);
                user.setLockReason("Too many failed login attempts");
                user.setLockedAt(LocalDateTime.now());
            }
            
            userRepository.save(user);
            throw new UnauthorizedException("Invalid credentials");
        }

        user.setLastLoginAt(LocalDateTime.now());
        user.setFailedLoginAttempts(0);
        userRepository.save(user);

        return generateAuthResponse(user);
    }

    /**
     * Refresh access token
     */
    @Transactional
    public AuthResponse refreshToken(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenStr)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (!refreshToken.isValid()) {
            throw new UnauthorizedException("Refresh token is expired or revoked");
        }

        User user = refreshToken.getUser();
        return generateAuthResponse(user);
    }

    /**
     * Logout - revoke refresh token
     */
    @Transactional
    public void logout(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenStr).orElse(null);
        if (refreshToken != null) {
            refreshToken.setIsRevoked(true);
            refreshToken.setRevokedAt(LocalDateTime.now());
            refreshTokenRepository.save(refreshToken);
        }
    }

    /**
     * Logout from all devices
     */
    @Transactional
    public void logoutAll(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        refreshTokenRepository.revokeAllByUser(user, LocalDateTime.now());
    }

    private void validateOtp(User user, String otp) {
        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            throw new BadRequestException("No OTP found. Please request a new OTP.", "OTP_NOT_FOUND");
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new BadRequestException("OTP has expired. Please request a new OTP.", "OTP_EXPIRED");
        }

        if (user.getOtpAttempts() >= 3) {
            throw new BadRequestException("Too many failed attempts. Please request a new OTP.", "OTP_MAX_ATTEMPTS");
        }

        if (!passwordEncoder.matches(otp, user.getOtp())) {
            user.setOtpAttempts((user.getOtpAttempts() != null ? user.getOtpAttempts() : 0) + 1);
            userRepository.save(user);
            throw new BadRequestException("Invalid OTP", "INVALID_OTP");
        }
    }

    private AuthResponse generateAuthResponse(User user) {
        String accessToken = tokenProvider.generateAccessToken(
                user.getId(),
                user.getMobileNumber(),
                user.getPrimaryRole(),
                user.getRoles(),
                user.getHospitalId()
        );

        // Create refresh token
        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(LocalDateTime.now().plusSeconds(tokenProvider.getRefreshExpirationInSeconds()))
                .isRevoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationInSeconds())
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .mobileNumber(user.getMobileNumber())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .displayName(user.getDisplayName())
                        .profileImageUrl(user.getProfileImageUrl())
                        .primaryRole(user.getPrimaryRole())
                        .roles(user.getRoles())
                        .hospitalId(user.getHospitalId())
                        .preferredLanguage(user.getPreferredLanguage())
                        .mustChangePassword(user.getMustChangePassword())
                        .build())
                .build();
    }

    private String generateOtp() {
        // Fixed OTP for development/testing - change to random generation in production
        // StringBuilder otp = new StringBuilder();
        // for (int i = 0; i < otpLength; i++) {
        //     otp.append(secureRandom.nextInt(10));
        // }
        // return otp.toString();
        
        return "123456";  // Hardcoded OTP for testing
    }
}
