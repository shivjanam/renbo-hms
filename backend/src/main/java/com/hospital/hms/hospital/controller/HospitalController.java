package com.hospital.hms.hospital.controller;

import com.hospital.hms.hospital.entity.Hospital;
import com.hospital.hms.hospital.repository.HospitalRepository;
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

@RestController
@RequestMapping("/api/v1/hospitals")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class HospitalController {

    private final HospitalRepository hospitalRepository;

    /**
     * Get all active hospitals with pagination
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllHospitals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        log.info("Fetching all hospitals - page: {}, size: {}", page, size);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Hospital> hospitalPage = hospitalRepository.findByIsActiveTrueAndIsDeletedFalse(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", hospitalPage.getContent());
        response.put("totalElements", hospitalPage.getTotalElements());
        response.put("totalPages", hospitalPage.getTotalPages());
        response.put("currentPage", hospitalPage.getNumber());
        response.put("size", hospitalPage.getSize());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get all hospitals as a simple list
     */
    @GetMapping("/list")
    public ResponseEntity<List<Hospital>> getHospitalList() {
        log.info("Fetching hospital list");
        List<Hospital> hospitals = hospitalRepository.findByIsActiveTrueAndIsDeletedFalse();
        return ResponseEntity.ok(hospitals);
    }

    /**
     * Get hospital by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Hospital> getHospitalById(@PathVariable Long id) {
        log.info("Fetching hospital by id: {}", id);
        return hospitalRepository.findByIdAndIsActiveTrue(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get hospital by code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<Hospital> getHospitalByCode(@PathVariable String code) {
        log.info("Fetching hospital by code: {}", code);
        return hospitalRepository.findByHospitalCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all main hospitals (not branches)
     */
    @GetMapping("/main")
    public ResponseEntity<List<Hospital>> getMainHospitals() {
        log.info("Fetching main hospitals");
        List<Hospital> hospitals = hospitalRepository.findAllMainHospitals();
        return ResponseEntity.ok(hospitals);
    }

    /**
     * Get branches of a hospital
     */
    @GetMapping("/{id}/branches")
    public ResponseEntity<List<Hospital>> getHospitalBranches(@PathVariable Long id) {
        log.info("Fetching branches for hospital: {}", id);
        List<Hospital> branches = hospitalRepository.findBranchesByParentId(id);
        return ResponseEntity.ok(branches);
    }

    /**
     * Get count of active hospitals
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getHospitalCount() {
        long count = hospitalRepository.countActiveHospitals();
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}
