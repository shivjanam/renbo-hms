package com.hospital.hms.doctor.repository;

import com.hospital.hms.common.enums.PrescriptionStatus;
import com.hospital.hms.doctor.entity.Prescription;
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
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    Optional<Prescription> findByPrescriptionNumber(String prescriptionNumber);

    Page<Prescription> findByDoctorIdOrderByPrescriptionDateDesc(Long doctorId, Pageable pageable);

    Page<Prescription> findByPatientIdOrderByPrescriptionDateDesc(Long patientId, Pageable pageable);

    Page<Prescription> findByHospitalIdOrderByPrescriptionDateDesc(Long hospitalId, Pageable pageable);

    List<Prescription> findByDoctorIdAndPrescriptionDate(Long doctorId, LocalDate date);

    List<Prescription> findByPatientIdAndStatus(Long patientId, PrescriptionStatus status);

    @Query("SELECT p FROM Prescription p WHERE p.doctorId = :doctorId " +
           "AND (:status IS NULL OR p.status = :status) " +
           "AND (:date IS NULL OR p.prescriptionDate = :date) " +
           "ORDER BY p.prescriptionDate DESC")
    Page<Prescription> findByDoctorIdWithFilters(
            @Param("doctorId") Long doctorId,
            @Param("status") PrescriptionStatus status,
            @Param("date") LocalDate date,
            Pageable pageable);

    @Query("SELECT p FROM Prescription p WHERE " +
           "(:hospitalId IS NULL OR p.hospitalId = :hospitalId) " +
           "AND (:status IS NULL OR p.status = :status) " +
           "ORDER BY p.prescriptionDate DESC")
    Page<Prescription> findWithFilters(
            @Param("hospitalId") Long hospitalId,
            @Param("status") PrescriptionStatus status,
            Pageable pageable);

    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.doctorId = :doctorId AND p.prescriptionDate = :date")
    long countByDoctorAndDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.hospitalId = :hospitalId AND p.prescriptionDate = :date")
    long countByHospitalAndDate(@Param("hospitalId") Long hospitalId, @Param("date") LocalDate date);
}
