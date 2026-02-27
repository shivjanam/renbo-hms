package com.hospital.hms.hospital.repository;

import com.hospital.hms.hospital.entity.Hospital;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    List<Hospital> findByIsActiveTrue();

    List<Hospital> findByIsActiveTrueAndIsDeletedFalse();

    Page<Hospital> findByIsActiveTrueAndIsDeletedFalse(Pageable pageable);

    Optional<Hospital> findByHospitalCode(String hospitalCode);

    Optional<Hospital> findByIdAndIsActiveTrue(Long id);

    @Query("SELECT h FROM Hospital h WHERE h.isActive = true AND h.isDeleted = false AND h.isBranch = false")
    List<Hospital> findAllMainHospitals();

    @Query("SELECT h FROM Hospital h WHERE h.parentHospital.id = :parentId AND h.isActive = true")
    List<Hospital> findBranchesByParentId(Long parentId);

    @Query("SELECT COUNT(h) FROM Hospital h WHERE h.isActive = true AND h.isDeleted = false")
    long countActiveHospitals();
}
