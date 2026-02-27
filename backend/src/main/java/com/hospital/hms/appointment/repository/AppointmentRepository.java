package com.hospital.hms.appointment.repository;

import com.hospital.hms.appointment.entity.Appointment;
import com.hospital.hms.common.enums.AppointmentStatus;
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
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    Optional<Appointment> findByAppointmentNumber(String appointmentNumber);

    Page<Appointment> findByIsDeletedFalse(Pageable pageable);

    Page<Appointment> findByHospitalIdAndIsDeletedFalse(Long hospitalId, Pageable pageable);

    @Query("SELECT a FROM Appointment a WHERE a.isDeleted = false " +
           "AND (:status IS NULL OR a.status = :status) " +
           "AND (:date IS NULL OR a.appointmentDate = :date) " +
           "AND (:hospitalId IS NULL OR a.hospitalId = :hospitalId)")
    Page<Appointment> findByFilters(
            @Param("status") AppointmentStatus status,
            @Param("date") LocalDate date,
            @Param("hospitalId") Long hospitalId,
            Pageable pageable);

    @Query("SELECT a FROM Appointment a WHERE a.patientId = :patientId AND a.isDeleted = false ORDER BY a.appointmentDate DESC, a.slotStartTime DESC")
    List<Appointment> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.doctorId = :doctorId AND a.isDeleted = false ORDER BY a.appointmentDate DESC, a.slotStartTime DESC")
    List<Appointment> findByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT a FROM Appointment a WHERE a.doctorId = :doctorId AND a.appointmentDate = :date AND a.isDeleted = false ORDER BY a.slotStartTime")
    List<Appointment> findByDoctorIdAndDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.hospitalId = :hospitalId AND a.appointmentDate = :date AND a.isDeleted = false")
    List<Appointment> findByHospitalIdAndDate(@Param("hospitalId") Long hospitalId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.hospitalId = :hospitalId AND a.appointmentDate = :date AND a.isDeleted = false")
    long countByHospitalAndDate(@Param("hospitalId") Long hospitalId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.hospitalId = :hospitalId AND a.status = :status AND a.isDeleted = false")
    long countByHospitalAndStatus(@Param("hospitalId") Long hospitalId, @Param("status") AppointmentStatus status);

    // Query for patient mobile lookups
    @Query("SELECT a FROM Appointment a WHERE a.patientMobile = :mobile AND a.isDeleted = false ORDER BY a.appointmentDate DESC")
    List<Appointment> findByPatientMobile(@Param("mobile") String mobile);
    
    // Paginated doctor appointments
    @Query("SELECT a FROM Appointment a WHERE a.doctorId = :doctorId AND a.isDeleted = false")
    Page<Appointment> findByDoctorIdPaged(@Param("doctorId") Long doctorId, Pageable pageable);
}
