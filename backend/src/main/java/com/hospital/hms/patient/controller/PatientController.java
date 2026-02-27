package com.hospital.hms.patient.controller;

import com.hospital.hms.common.dto.ApiResponse;
import com.hospital.hms.common.dto.PageResponse;
import com.hospital.hms.patient.dto.CreatePatientRequest;
import com.hospital.hms.patient.dto.PatientDto;
import com.hospital.hms.patient.service.PatientService;
import com.hospital.hms.security.jwt.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
@Tag(name = "Patient Management", description = "Patient registration and management endpoints")
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    @Operation(summary = "Register Patient", description = "Register a new patient")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'HOSPITAL_ADMIN', 'SUPER_ADMIN', 'PATIENT')")
    public ResponseEntity<ApiResponse<PatientDto>> createPatient(
            @Valid @RequestBody CreatePatientRequest request,
            @AuthenticationPrincipal UserPrincipal user) {
        Long hospitalId = request.getHospitalId() != null ? request.getHospitalId() : user.getHospitalId();
        PatientDto patient = patientService.createPatient(request, hospitalId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Patient registered successfully", patient));
    }

    @GetMapping
    @Operation(summary = "Get All Patients", description = "Get all patients with pagination")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'DOCTOR', 'NURSE', 'HOSPITAL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<PatientDto>>> getAllPatients(
            @RequestParam(required = false) String query,
            @RequestHeader(value = "X-Hospital-Id", required = false) Long hospitalId,
            @AuthenticationPrincipal UserPrincipal user,
            @PageableDefault(size = 10) Pageable pageable) {
        Long hId = hospitalId != null ? hospitalId : (user != null ? user.getHospitalId() : null);
        PageResponse<PatientDto> patients;
        if (query != null && !query.isEmpty()) {
            patients = patientService.searchPatients(query, hId, pageable);
        } else {
            patients = patientService.getAllPatients(hId, pageable);
        }
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Patient by ID", description = "Get patient details by ID")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'DOCTOR', 'NURSE', 'HOSPITAL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<PatientDto>> getPatientById(@PathVariable Long id) {
        PatientDto patient = patientService.getPatientById(id);
        return ResponseEntity.ok(ApiResponse.success(patient));
    }

    @GetMapping("/uhid/{uhid}")
    @Operation(summary = "Get Patient by UHID", description = "Get patient details by UHID")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'DOCTOR', 'NURSE', 'HOSPITAL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<PatientDto>> getPatientByUhid(@PathVariable String uhid) {
        PatientDto patient = patientService.getPatientByUhid(uhid);
        return ResponseEntity.ok(ApiResponse.success(patient));
    }

    @GetMapping("/mobile/{mobile}")
    @Operation(summary = "Get Patients by Mobile", description = "Get all patients registered under a mobile number")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'HOSPITAL_ADMIN', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<PatientDto>>> getPatientsByMobile(@PathVariable String mobile) {
        List<PatientDto> patients = patientService.getPatientsByMobile(mobile);
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    @GetMapping("/{id}/family")
    @Operation(summary = "Get Family Members", description = "Get family members linked to a patient")
    public ResponseEntity<ApiResponse<List<PatientDto.FamilyMemberDto>>> getFamilyMembers(@PathVariable Long id) {
        List<PatientDto.FamilyMemberDto> members = patientService.getFamilyMembers(id);
        return ResponseEntity.ok(ApiResponse.success(members));
    }

    @GetMapping("/search")
    @Operation(summary = "Search Patients", description = "Search patients by name, mobile, or UHID")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'DOCTOR', 'NURSE', 'HOSPITAL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<PatientDto>>> searchPatients(
            @RequestParam String query,
            @RequestHeader(value = "X-Hospital-Id", required = false) Long hospitalId,
            @AuthenticationPrincipal UserPrincipal user,
            @PageableDefault(size = 20) Pageable pageable) {
        Long hId = hospitalId != null ? hospitalId : user.getHospitalId();
        PageResponse<PatientDto> patients = patientService.searchPatients(query, hId, pageable);
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Patient", description = "Update patient information")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'HOSPITAL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<PatientDto>> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody CreatePatientRequest request) {
        PatientDto patient = patientService.updatePatient(id, request);
        return ResponseEntity.ok(ApiResponse.success("Patient updated successfully", patient));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Patient", description = "Soft delete a patient")
    @PreAuthorize("hasAnyRole('HOSPITAL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok(ApiResponse.success("Patient deleted successfully", null));
    }

    // Patient self-service endpoints
    @GetMapping("/me")
    @Operation(summary = "Get My Profile", description = "Get current patient's profile")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<List<PatientDto>>> getMyPatients(
            @AuthenticationPrincipal UserPrincipal user) {
        List<PatientDto> patients = patientService.getPatientsByMobile(user.getMobileNumber());
        return ResponseEntity.ok(ApiResponse.success(patients));
    }
}
