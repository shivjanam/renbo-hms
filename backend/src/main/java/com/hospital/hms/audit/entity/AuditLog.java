package com.hospital.hms.audit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Audit log entity - tracks all critical actions for compliance.
 */
@Entity
@Table(name = "audit_logs", indexes = {
        @Index(name = "idx_audit_entity", columnList = "entity_type, entity_id"),
        @Index(name = "idx_audit_user", columnList = "user_id"),
        @Index(name = "idx_audit_action", columnList = "action"),
        @Index(name = "idx_audit_timestamp", columnList = "timestamp"),
        @Index(name = "idx_audit_hospital", columnList = "hospital_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hospital_id")
    private Long hospitalId;

    @Column(name = "entity_type", nullable = false)
    private String entityType; // PATIENT, APPOINTMENT, PRESCRIPTION, etc.

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "action", nullable = false)
    private String action; // CREATE, UPDATE, DELETE, VIEW, EXPORT, LOGIN, LOGOUT

    @Column(name = "description", length = 1000)
    private String description;

    // Before/After values for tracking changes
    @Column(name = "old_values", length = 4000)
    private String oldValues; // JSON

    @Column(name = "new_values", length = 4000)
    private String newValues; // JSON

    @Column(name = "changed_fields")
    private String changedFields;

    // User information
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "username")
    private String username;

    @Column(name = "user_role")
    private String userRole;

    @Column(name = "user_display_name")
    private String userDisplayName;

    // Request information
    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "request_url")
    private String requestUrl;

    @Column(name = "request_method")
    private String requestMethod;

    @Column(name = "session_id")
    private String sessionId;

    // Timestamp
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    // Status
    @Column(name = "status")
    @Builder.Default
    private String status = "SUCCESS"; // SUCCESS, FAILURE

    @Column(name = "error_message")
    private String errorMessage;

    // Additional context
    @Column(name = "module")
    private String module;

    @Column(name = "sub_module")
    private String subModule;

    @Column(name = "remarks", length = 500)
    private String remarks;

    @PrePersist
    private void setTimestamp() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
