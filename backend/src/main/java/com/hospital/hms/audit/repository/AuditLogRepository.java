package com.hospital.hms.audit.repository;

import com.hospital.hms.audit.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByEntityTypeAndEntityIdOrderByTimestampDesc(
            String entityType, Long entityId, Pageable pageable);

    Page<AuditLog> findByUserIdOrderByTimestampDesc(Long userId, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.hospitalId = :hospitalId " +
           "AND a.timestamp BETWEEN :from AND :to ORDER BY a.timestamp DESC")
    Page<AuditLog> findByHospitalAndDateRange(
            @Param("hospitalId") Long hospitalId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.entityType = :entityType " +
           "AND a.action = :action AND a.timestamp >= :since ORDER BY a.timestamp DESC")
    List<AuditLog> findRecentByTypeAndAction(
            @Param("entityType") String entityType,
            @Param("action") String action,
            @Param("since") LocalDateTime since);

    @Query("SELECT a FROM AuditLog a WHERE a.userId = :userId " +
           "AND a.action = 'LOGIN' ORDER BY a.timestamp DESC")
    List<AuditLog> findLoginHistoryByUser(@Param("userId") Long userId, Pageable pageable);
}
