package com.hospital.hms.audit.service;

import com.hospital.hms.audit.entity.AuditLog;
import com.hospital.hms.audit.repository.AuditLogRepository;
import com.hospital.hms.security.jwt.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void logAction(String entityType, Long entityId, String action, String description) {
        try {
            AuditLog.AuditLogBuilder builder = AuditLog.builder()
                    .entityType(entityType)
                    .entityId(entityId)
                    .action(action)
                    .description(description)
                    .timestamp(LocalDateTime.now())
                    .status("SUCCESS");

            // Get current user
            try {
                var auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.getPrincipal() instanceof UserPrincipal) {
                    UserPrincipal user = (UserPrincipal) auth.getPrincipal();
                    builder.userId(user.getId())
                           .username(user.getUsername())
                           .userRole(user.getPrimaryRole().name())
                           .userDisplayName(user.getDisplayName())
                           .hospitalId(user.getHospitalId());
                }
            } catch (Exception e) {
                log.debug("Could not get user context for audit log");
            }

            // Get request info
            try {
                ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attrs != null) {
                    HttpServletRequest request = attrs.getRequest();
                    builder.ipAddress(getClientIp(request))
                           .userAgent(request.getHeader("User-Agent"))
                           .requestUrl(request.getRequestURI())
                           .requestMethod(request.getMethod());
                }
            } catch (Exception e) {
                log.debug("Could not get request context for audit log");
            }

            auditLogRepository.save(builder.build());
        } catch (Exception e) {
            log.error("Failed to create audit log", e);
        }
    }

    @Async
    public void logActionWithValues(String entityType, Long entityId, String action, 
                                    String description, String oldValues, String newValues) {
        try {
            AuditLog.AuditLogBuilder builder = AuditLog.builder()
                    .entityType(entityType)
                    .entityId(entityId)
                    .action(action)
                    .description(description)
                    .oldValues(oldValues)
                    .newValues(newValues)
                    .timestamp(LocalDateTime.now())
                    .status("SUCCESS");

            // Get current user
            try {
                var auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.getPrincipal() instanceof UserPrincipal) {
                    UserPrincipal user = (UserPrincipal) auth.getPrincipal();
                    builder.userId(user.getId())
                           .username(user.getUsername())
                           .userRole(user.getPrimaryRole().name())
                           .userDisplayName(user.getDisplayName())
                           .hospitalId(user.getHospitalId());
                }
            } catch (Exception e) {
                log.debug("Could not get user context for audit log");
            }

            auditLogRepository.save(builder.build());
        } catch (Exception e) {
            log.error("Failed to create audit log with values", e);
        }
    }

    @Async
    public void logLogin(Long userId, String username, boolean success, String ipAddress, String userAgent) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .entityType("USER")
                    .entityId(userId)
                    .action("LOGIN")
                    .description(success ? "User logged in successfully" : "Failed login attempt")
                    .userId(userId)
                    .username(username)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .timestamp(LocalDateTime.now())
                    .status(success ? "SUCCESS" : "FAILURE")
                    .build();

            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to log login event", e);
        }
    }

    @Async
    public void logLogout(Long userId, String username) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .entityType("USER")
                    .entityId(userId)
                    .action("LOGOUT")
                    .description("User logged out")
                    .userId(userId)
                    .username(username)
                    .timestamp(LocalDateTime.now())
                    .status("SUCCESS")
                    .build();

            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to log logout event", e);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
}
