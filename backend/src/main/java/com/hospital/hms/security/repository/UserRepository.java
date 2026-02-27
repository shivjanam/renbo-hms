package com.hospital.hms.security.repository;

import com.hospital.hms.common.enums.UserRole;
import com.hospital.hms.security.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByMobileNumber(String mobileNumber);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByMobileNumber(String mobileNumber);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.mobileNumber = :mobileNumber AND u.isDeleted = false")
    Optional<User> findActiveByMobileNumber(@Param("mobileNumber") String mobileNumber);

    @Query("SELECT u FROM User u WHERE u.primaryRole = :role AND u.hospitalId = :hospitalId AND u.isDeleted = false")
    List<User> findByRoleAndHospital(@Param("role") UserRole role, @Param("hospitalId") Long hospitalId);

    @Query("SELECT u FROM User u WHERE u.hospitalId = :hospitalId AND u.isDeleted = false")
    Page<User> findByHospital(@Param("hospitalId") Long hospitalId, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.primaryRole IN :roles AND u.hospitalId = :hospitalId AND u.isDeleted = false")
    List<User> findByRolesAndHospital(@Param("roles") List<UserRole> roles, @Param("hospitalId") Long hospitalId);

    @Query("SELECT u FROM User u WHERE u.patientId = :patientId AND u.isDeleted = false")
    Optional<User> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT u FROM User u WHERE u.doctorId = :doctorId AND u.isDeleted = false")
    Optional<User> findByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT u FROM User u WHERE u.staffId = :staffId AND u.isDeleted = false")
    Optional<User> findByStaffId(@Param("staffId") Long staffId);
}
