package com.hospital.hms.patient.repository;

import com.hospital.hms.patient.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByUhid(String uhid);

    Optional<Patient> findByMobileNumber(String mobileNumber);

    List<Patient> findByMobileNumberAndIsDeletedFalse(String mobileNumber);

    boolean existsByUhid(String uhid);

    @Query("SELECT p FROM Patient p WHERE p.mobileNumber = :mobile AND p.isDeleted = false ORDER BY p.createdAt")
    List<Patient> findAllByMobileNumber(@Param("mobile") String mobileNumber);

    @Query("SELECT p FROM Patient p WHERE p.primaryAccount.id = :primaryId AND p.isDeleted = false")
    List<Patient> findFamilyMembers(@Param("primaryId") Long primaryPatientId);

    @Query("SELECT p FROM Patient p WHERE p.registeredHospitalId = :hospitalId AND p.isDeleted = false")
    Page<Patient> findByHospital(@Param("hospitalId") Long hospitalId, Pageable pageable);

    @Query("SELECT p FROM Patient p WHERE p.registeredHospitalId = :hospitalId AND p.isActive = true AND p.isDeleted = false")
    Page<Patient> findByRegisteredHospitalIdAndIsActiveTrue(@Param("hospitalId") Long hospitalId, Pageable pageable);

    @Query("SELECT p FROM Patient p WHERE p.isActive = true AND p.isDeleted = false")
    Page<Patient> findByIsActiveTrue(Pageable pageable);

    @Query("SELECT p FROM Patient p WHERE " +
           "(LOWER(p.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "p.mobileNumber LIKE CONCAT('%', :query, '%') OR " +
           "p.uhid LIKE CONCAT('%', :query, '%')) AND " +
           "p.registeredHospitalId = :hospitalId AND p.isDeleted = false")
    Page<Patient> searchPatients(@Param("query") String query, @Param("hospitalId") Long hospitalId, Pageable pageable);

    @Query("SELECT p FROM Patient p WHERE p.userId = :userId AND p.isDeleted = false")
    Optional<Patient> findByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Patient p WHERE p.aadhaarLastFour = :lastFour AND p.registeredHospitalId = :hospitalId AND p.isDeleted = false")
    List<Patient> findByAadhaarLastFour(@Param("lastFour") String lastFour, @Param("hospitalId") Long hospitalId);

    @Query("SELECT COUNT(p) FROM Patient p WHERE p.registeredHospitalId = :hospitalId AND p.isDeleted = false")
    long countByHospital(@Param("hospitalId") Long hospitalId);

    @Query("SELECT MAX(CAST(SUBSTRING(p.uhid, 4) AS int)) FROM Patient p WHERE p.uhid LIKE :prefix%")
    Integer findMaxUhidNumber(@Param("prefix") String prefix);
}
