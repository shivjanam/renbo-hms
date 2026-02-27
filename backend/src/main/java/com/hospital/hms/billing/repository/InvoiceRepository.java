package com.hospital.hms.billing.repository;

import com.hospital.hms.billing.entity.Invoice;
import com.hospital.hms.common.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    Page<Invoice> findByIsDeletedFalse(Pageable pageable);

    Page<Invoice> findByHospitalIdAndIsDeletedFalse(Long hospitalId, Pageable pageable);

    @Query("SELECT i FROM Invoice i WHERE i.isDeleted = false " +
           "AND (:status IS NULL OR i.paymentStatus = :status) " +
           "AND (:hospitalId IS NULL OR i.hospitalId = :hospitalId)")
    Page<Invoice> findByFilters(
            @Param("status") PaymentStatus status,
            @Param("hospitalId") Long hospitalId,
            Pageable pageable);

    @Query("SELECT i FROM Invoice i WHERE i.patientId = :patientId AND i.isDeleted = false ORDER BY i.invoiceDate DESC")
    List<Invoice> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT i FROM Invoice i WHERE i.patientUhid = :uhid AND i.isDeleted = false ORDER BY i.invoiceDate DESC")
    List<Invoice> findByPatientUhid(@Param("uhid") String uhid);

    @Query("SELECT i FROM Invoice i WHERE i.hospitalId = :hospitalId AND i.invoiceDate BETWEEN :startDate AND :endDate AND i.isDeleted = false")
    List<Invoice> findByHospitalAndDateRange(
            @Param("hospitalId") Long hospitalId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(i.grandTotal) FROM Invoice i WHERE i.hospitalId = :hospitalId AND i.paymentStatus = 'SUCCESS' AND i.isDeleted = false")
    Double getTotalPaidAmountByHospital(@Param("hospitalId") Long hospitalId);

    @Query("SELECT SUM(i.grandTotal) FROM Invoice i WHERE i.hospitalId = :hospitalId AND i.paymentStatus IN ('PENDING', 'INITIATED', 'PROCESSING') AND i.isDeleted = false")
    Double getTotalPendingAmountByHospital(@Param("hospitalId") Long hospitalId);

    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.hospitalId = :hospitalId AND i.paymentStatus = :status AND i.isDeleted = false")
    long countByHospitalAndStatus(@Param("hospitalId") Long hospitalId, @Param("status") PaymentStatus status);
}
