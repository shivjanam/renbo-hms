package com.hospital.hms.doctor.repository;

import com.hospital.hms.common.enums.Specialization;
import com.hospital.hms.doctor.entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findByIsActiveTrue();

    List<Doctor> findByIsActiveTrueAndIsDeletedFalse();

    Page<Doctor> findByIsActiveTrueAndIsDeletedFalse(Pageable pageable);

    Optional<Doctor> findByIdAndIsActiveTrue(Long id);

    Optional<Doctor> findByEmployeeId(String employeeId);

    Optional<Doctor> findByRegistrationNumber(String registrationNumber);

    List<Doctor> findByPrimarySpecializationAndIsActiveTrue(Specialization specialization);

    List<Doctor> findByPrimaryHospitalIdAndIsActiveTrue(Long hospitalId);

    @Query("SELECT d FROM Doctor d WHERE d.isActive = true AND d.isDeleted = false " +
           "AND (:specialization IS NULL OR d.primarySpecialization = :specialization) " +
           "AND (:hospitalId IS NULL OR d.primaryHospitalId = :hospitalId)")
    List<Doctor> findByFilters(@Param("specialization") Specialization specialization,
                               @Param("hospitalId") Long hospitalId);

    @Query("SELECT d FROM Doctor d WHERE d.isActive = true AND d.isDeleted = false " +
           "AND (LOWER(d.firstName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(d.lastName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(d.displayName) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Doctor> searchByName(@Param("query") String query);

    @Query("SELECT COUNT(d) FROM Doctor d WHERE d.isActive = true AND d.isDeleted = false")
    long countActiveDoctors();

    @Query("SELECT COUNT(d) FROM Doctor d WHERE d.primaryHospitalId = :hospitalId AND d.isActive = true")
    long countByHospital(@Param("hospitalId") Long hospitalId);
}
