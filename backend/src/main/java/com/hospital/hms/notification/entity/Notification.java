package com.hospital.hms.notification.entity;

import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Notification entity - stores notifications for users.
 */
@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notif_user", columnList = "user_id"),
        @Index(name = "idx_notif_type", columnList = "notification_type"),
        @Index(name = "idx_notif_read", columnList = "is_read"),
        @Index(name = "idx_notif_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "patient_id")
    private Long patientId;

    @Column(name = "hospital_id")
    private Long hospitalId;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false)
    private NotificationType notificationType;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "message", length = 1000, nullable = false)
    private String message;

    @Column(name = "message_hindi", length = 1000)
    private String messageHindi;

    // Reference
    @Column(name = "reference_type")
    private String referenceType; // APPOINTMENT, PRESCRIPTION, LAB_ORDER, etc.

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "action_url")
    private String actionUrl;

    // Delivery channels
    @Column(name = "send_push")
    @Builder.Default
    private Boolean sendPush = true;

    @Column(name = "send_sms")
    @Builder.Default
    private Boolean sendSms = false;

    @Column(name = "send_email")
    @Builder.Default
    private Boolean sendEmail = false;

    @Column(name = "send_whatsapp")
    @Builder.Default
    private Boolean sendWhatsapp = false;

    // Status
    @Column(name = "is_read")
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "is_sent")
    @Builder.Default
    private Boolean isSent = false;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "send_error")
    private String sendError;

    // SMS/Email specific
    @Column(name = "sms_sent")
    @Builder.Default
    private Boolean smsSent = false;

    @Column(name = "sms_sent_at")
    private LocalDateTime smsSentAt;

    @Column(name = "email_sent")
    @Builder.Default
    private Boolean emailSent = false;

    @Column(name = "email_sent_at")
    private LocalDateTime emailSentAt;

    @Column(name = "whatsapp_sent")
    @Builder.Default
    private Boolean whatsappSent = false;

    @Column(name = "whatsapp_sent_at")
    private LocalDateTime whatsappSentAt;

    // Priority
    @Column(name = "priority")
    @Builder.Default
    private Integer priority = 0; // Higher = more important

    // Scheduling
    @Column(name = "scheduled_for")
    private LocalDateTime scheduledFor;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    // Recipient details (for SMS/Email)
    @Column(name = "recipient_mobile")
    private String recipientMobile;

    @Column(name = "recipient_email")
    private String recipientEmail;
}
