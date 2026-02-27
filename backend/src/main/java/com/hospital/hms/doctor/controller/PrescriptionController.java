package com.hospital.hms.doctor.controller;

import com.hospital.hms.common.enums.PrescriptionStatus;
import com.hospital.hms.doctor.entity.Prescription;
import com.hospital.hms.doctor.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/prescriptions")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionRepository prescriptionRepository;

    /**
     * Get all prescriptions with pagination and filters
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPrescriptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long hospitalId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String date) {
        
        log.info("Fetching prescriptions - page: {}, size: {}, doctorId: {}, status: {}, date: {}", 
                page, size, doctorId, status, date);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("prescriptionDate").descending());
        
        PrescriptionStatus prescriptionStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                prescriptionStatus = PrescriptionStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status: {}", status);
            }
        }
        
        LocalDate filterDate = null;
        if (date != null && !date.isEmpty()) {
            try {
                filterDate = LocalDate.parse(date);
            } catch (Exception e) {
                log.warn("Invalid date format: {}", date);
            }
        }
        
        Page<Prescription> prescriptionPage;
        if (doctorId != null) {
            prescriptionPage = prescriptionRepository.findByDoctorIdWithFilters(
                    doctorId, prescriptionStatus, filterDate, pageable);
        } else {
            prescriptionPage = prescriptionRepository.findWithFilters(
                    hospitalId, prescriptionStatus, pageable);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", prescriptionPage.getContent());
        response.put("totalElements", prescriptionPage.getTotalElements());
        response.put("totalPages", prescriptionPage.getTotalPages());
        response.put("currentPage", prescriptionPage.getNumber());
        response.put("size", prescriptionPage.getSize());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get prescription by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        log.info("Fetching prescription by id: {}", id);
        return prescriptionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get prescription by number
     */
    @GetMapping("/number/{number}")
    public ResponseEntity<Prescription> getPrescriptionByNumber(@PathVariable String number) {
        log.info("Fetching prescription by number: {}", number);
        return prescriptionRepository.findByPrescriptionNumber(number)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get prescriptions by doctor
     */
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<Map<String, Object>> getPrescriptionsByDoctor(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Fetching prescriptions for doctor: {}", doctorId);
        Pageable pageable = PageRequest.of(page, size, Sort.by("prescriptionDate").descending());
        Page<Prescription> prescriptionPage = prescriptionRepository.findByDoctorIdOrderByPrescriptionDateDesc(doctorId, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", prescriptionPage.getContent());
        response.put("totalElements", prescriptionPage.getTotalElements());
        response.put("totalPages", prescriptionPage.getTotalPages());
        response.put("currentPage", prescriptionPage.getNumber());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get prescriptions by patient
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Map<String, Object>> getPrescriptionsByPatient(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Fetching prescriptions for patient: {}", patientId);
        Pageable pageable = PageRequest.of(page, size, Sort.by("prescriptionDate").descending());
        Page<Prescription> prescriptionPage = prescriptionRepository.findByPatientIdOrderByPrescriptionDateDesc(patientId, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", prescriptionPage.getContent());
        response.put("totalElements", prescriptionPage.getTotalElements());
        response.put("totalPages", prescriptionPage.getTotalPages());
        response.put("currentPage", prescriptionPage.getNumber());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new prescription
     */
    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@RequestBody Prescription prescription) {
        log.info("Creating new prescription for patient: {}", prescription.getPatientId());
        
        // Generate prescription number
        if (prescription.getPrescriptionNumber() == null || prescription.getPrescriptionNumber().isEmpty()) {
            String prefix = "RX-" + Year.now().getValue() + "-";
            long count = prescriptionRepository.count();
            prescription.setPrescriptionNumber(prefix + String.format("%05d", count + 1));
        }
        
        if (prescription.getPrescriptionDate() == null) {
            prescription.setPrescriptionDate(LocalDate.now());
        }
        
        if (prescription.getStatus() == null) {
            prescription.setStatus(PrescriptionStatus.ACTIVE);
        }
        
        Prescription saved = prescriptionRepository.save(prescription);
        return ResponseEntity.ok(saved);
    }

    /**
     * Update prescription
     */
    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(
            @PathVariable Long id,
            @RequestBody Prescription prescriptionDetails) {
        
        log.info("Updating prescription: {}", id);
        return prescriptionRepository.findById(id)
                .map(prescription -> {
                    if (prescriptionDetails.getDiagnosis() != null) 
                        prescription.setDiagnosis(prescriptionDetails.getDiagnosis());
                    if (prescriptionDetails.getAdvice() != null) 
                        prescription.setAdvice(prescriptionDetails.getAdvice());
                    if (prescriptionDetails.getStatus() != null) 
                        prescription.setStatus(prescriptionDetails.getStatus());
                    if (prescriptionDetails.getFollowUpDate() != null) 
                        prescription.setFollowUpDate(prescriptionDetails.getFollowUpDate());
                    if (prescriptionDetails.getFollowUpNotes() != null) 
                        prescription.setFollowUpNotes(prescriptionDetails.getFollowUpNotes());
                    
                    return ResponseEntity.ok(prescriptionRepository.save(prescription));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update prescription status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Prescription> updatePrescriptionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        
        log.info("Updating prescription status: {}", id);
        String statusStr = statusUpdate.get("status");
        
        return prescriptionRepository.findById(id)
                .map(prescription -> {
                    try {
                        PrescriptionStatus status = PrescriptionStatus.valueOf(statusStr.toUpperCase());
                        prescription.setStatus(status);
                        return ResponseEntity.ok(prescriptionRepository.save(prescription));
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().<Prescription>build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get today's prescriptions for a doctor
     */
    @GetMapping("/today/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getTodaysPrescriptions(@PathVariable Long doctorId) {
        log.info("Fetching today's prescriptions for doctor: {}", doctorId);
        List<Prescription> prescriptions = prescriptionRepository.findByDoctorIdAndPrescriptionDate(
                doctorId, LocalDate.now());
        return ResponseEntity.ok(prescriptions);
    }

    /**
     * Get prescription count for dashboard
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getPrescriptionCount(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long hospitalId) {
        
        Map<String, Object> response = new HashMap<>();
        LocalDate today = LocalDate.now();
        
        if (doctorId != null) {
            response.put("todayCount", prescriptionRepository.countByDoctorAndDate(doctorId, today));
        } else if (hospitalId != null) {
            response.put("todayCount", prescriptionRepository.countByHospitalAndDate(hospitalId, today));
        }
        
        response.put("totalCount", prescriptionRepository.count());
        return ResponseEntity.ok(response);
    }
}
