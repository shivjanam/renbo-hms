package com.hospital.hms.doctor.controller;

import com.hospital.hms.common.enums.Specialization;
import com.hospital.hms.doctor.entity.Doctor;
import com.hospital.hms.doctor.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    /**
     * Get all active doctors with pagination and optional specialization filter
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllDoctors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "firstName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String query) {
        
        log.info("Fetching doctors - page: {}, size: {}, specialization: {}, query: {}", page, size, specialization, query);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Doctor> doctorPage;
        
        // If specialization filter is provided, filter by it
        if (specialization != null && !specialization.isEmpty()) {
            try {
                Specialization spec = Specialization.valueOf(specialization.toUpperCase());
                List<Doctor> allDoctors = doctorRepository.findByPrimarySpecializationAndIsActiveTrue(spec);
                
                // Apply search query if provided
                if (query != null && !query.isEmpty()) {
                    String searchQuery = query.toLowerCase();
                    allDoctors = allDoctors.stream()
                            .filter(doc -> 
                                (doc.getFirstName() != null && doc.getFirstName().toLowerCase().contains(searchQuery)) ||
                                (doc.getLastName() != null && doc.getLastName().toLowerCase().contains(searchQuery)) ||
                                (doc.getEmployeeId() != null && doc.getEmployeeId().toLowerCase().contains(searchQuery)))
                            .collect(Collectors.toList());
                }
                
                // Manual pagination for filtered list
                int start = (int) pageable.getOffset();
                int end = Math.min(start + pageable.getPageSize(), allDoctors.size());
                List<Doctor> pageContent = start < allDoctors.size() ? allDoctors.subList(start, end) : List.of();
                
                Map<String, Object> response = new HashMap<>();
                response.put("content", pageContent);
                response.put("totalElements", allDoctors.size());
                response.put("totalPages", (int) Math.ceil((double) allDoctors.size() / pageable.getPageSize()));
                response.put("currentPage", page);
                response.put("size", size);
                
                return ResponseEntity.ok(response);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid specialization provided: {}", specialization);
            }
        }
        
        // Default: get all doctors with pagination
        doctorPage = doctorRepository.findByIsActiveTrueAndIsDeletedFalse(pageable);
        
        // Apply search query filter if provided
        if (query != null && !query.isEmpty()) {
            String searchQuery = query.toLowerCase();
            List<Doctor> filtered = doctorPage.getContent().stream()
                    .filter(doc -> 
                        (doc.getFirstName() != null && doc.getFirstName().toLowerCase().contains(searchQuery)) ||
                        (doc.getLastName() != null && doc.getLastName().toLowerCase().contains(searchQuery)) ||
                        (doc.getEmployeeId() != null && doc.getEmployeeId().toLowerCase().contains(searchQuery)))
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", filtered);
            response.put("totalElements", filtered.size());
            response.put("totalPages", 1);
            response.put("currentPage", page);
            response.put("size", size);
            
            return ResponseEntity.ok(response);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", doctorPage.getContent());
        response.put("totalElements", doctorPage.getTotalElements());
        response.put("totalPages", doctorPage.getTotalPages());
        response.put("currentPage", doctorPage.getNumber());
        response.put("size", doctorPage.getSize());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get all doctors as a simple list (for dropdowns, etc.)
     */
    @GetMapping("/list")
    public ResponseEntity<List<Doctor>> getDoctorList() {
        log.info("Fetching doctor list");
        List<Doctor> doctors = doctorRepository.findByIsActiveTrueAndIsDeletedFalse();
        return ResponseEntity.ok(doctors);
    }

    /**
     * Get doctor by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        log.info("Fetching doctor by id: {}", id);
        return doctorRepository.findByIdAndIsActiveTrue(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search doctors by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> searchDoctors(@RequestParam String query) {
        log.info("Searching doctors with query: {}", query);
        List<Doctor> doctors = doctorRepository.searchByName(query);
        return ResponseEntity.ok(doctors);
    }

    /**
     * Get doctors by specialization
     */
    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialization(
            @PathVariable String specialization) {
        log.info("Fetching doctors by specialization: {}", specialization);
        try {
            Specialization spec = Specialization.valueOf(specialization.toUpperCase());
            List<Doctor> doctors = doctorRepository.findByPrimarySpecializationAndIsActiveTrue(spec);
            return ResponseEntity.ok(doctors);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid specialization: {}", specialization);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get doctors by hospital
     */
    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Doctor>> getDoctorsByHospital(@PathVariable Long hospitalId) {
        log.info("Fetching doctors by hospital: {}", hospitalId);
        List<Doctor> doctors = doctorRepository.findByPrimaryHospitalIdAndIsActiveTrue(hospitalId);
        return ResponseEntity.ok(doctors);
    }

    /**
     * Get doctors with filters
     */
    @GetMapping("/filter")
    public ResponseEntity<List<Doctor>> getDoctorsWithFilters(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) Long hospitalId) {
        log.info("Filtering doctors - specialization: {}, hospitalId: {}", specialization, hospitalId);
        
        Specialization spec = null;
        if (specialization != null && !specialization.isEmpty()) {
            try {
                spec = Specialization.valueOf(specialization.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid specialization: {}", specialization);
            }
        }
        
        List<Doctor> doctors = doctorRepository.findByFilters(spec, hospitalId);
        return ResponseEntity.ok(doctors);
    }

    /**
     * Get count of active doctors
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getDoctorCount() {
        long count = doctorRepository.countActiveDoctors();
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all available specializations
     */
    @GetMapping("/specializations")
    public ResponseEntity<List<Map<String, String>>> getSpecializations() {
        List<Map<String, String>> specializations = java.util.Arrays.stream(Specialization.values())
                .map(spec -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("value", spec.name());
                    map.put("label", spec.getDisplayName());
                    map.put("description", spec.getDescription());
                    return map;
                })
                .toList();
        return ResponseEntity.ok(specializations);
    }

    /**
     * Create a new doctor
     */
    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        log.info("Creating new doctor: {} {}", doctor.getFirstName(), doctor.getLastName());
        
        // Generate employee ID if not provided
        if (doctor.getEmployeeId() == null || doctor.getEmployeeId().isEmpty()) {
            long count = doctorRepository.count();
            doctor.setEmployeeId("DOC" + String.format("%04d", count + 1));
        }
        
        doctor.setIsActive(true);
        doctor.setIsDeleted(false);
        Doctor savedDoctor = doctorRepository.save(doctor);
        
        return ResponseEntity.ok(savedDoctor);
    }

    /**
     * Update an existing doctor
     */
    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctorDetails) {
        log.info("Updating doctor with id: {}", id);
        
        return doctorRepository.findById(id)
                .map(doctor -> {
                    if (doctorDetails.getFirstName() != null) doctor.setFirstName(doctorDetails.getFirstName());
                    if (doctorDetails.getLastName() != null) doctor.setLastName(doctorDetails.getLastName());
                    if (doctorDetails.getEmail() != null) doctor.setEmail(doctorDetails.getEmail());
                    if (doctorDetails.getMobileNumber() != null) doctor.setMobileNumber(doctorDetails.getMobileNumber());
                    if (doctorDetails.getPrimarySpecialization() != null) doctor.setPrimarySpecialization(doctorDetails.getPrimarySpecialization());
                    if (doctorDetails.getQualifications() != null) doctor.setQualifications(doctorDetails.getQualifications());
                    if (doctorDetails.getExperienceYears() != null) doctor.setExperienceYears(doctorDetails.getExperienceYears());
                    if (doctorDetails.getOpdConsultationFee() != null) doctor.setOpdConsultationFee(doctorDetails.getOpdConsultationFee());
                    if (doctorDetails.getRegistrationNumber() != null) doctor.setRegistrationNumber(doctorDetails.getRegistrationNumber());
                    if (doctorDetails.getBio() != null) doctor.setBio(doctorDetails.getBio());
                    
                    Doctor updatedDoctor = doctorRepository.save(doctor);
                    return ResponseEntity.ok(updatedDoctor);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a doctor (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteDoctor(@PathVariable Long id) {
        log.info("Deleting doctor with id: {}", id);
        
        return doctorRepository.findById(id)
                .map(doctor -> {
                    doctor.setIsDeleted(true);
                    doctor.setIsActive(false);
                    doctorRepository.save(doctor);
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "Doctor deleted successfully");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
