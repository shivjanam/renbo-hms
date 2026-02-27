package com.hospital.hms.patient.service;

import com.hospital.hms.common.dto.PageResponse;
import com.hospital.hms.common.exception.BadRequestException;
import com.hospital.hms.common.exception.DuplicateResourceException;
import com.hospital.hms.common.exception.ResourceNotFoundException;
import com.hospital.hms.common.util.EncryptionUtil;
import com.hospital.hms.patient.dto.CreatePatientRequest;
import com.hospital.hms.patient.dto.PatientDto;
import com.hospital.hms.patient.entity.Patient;
import com.hospital.hms.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final EncryptionUtil encryptionUtil;

    /**
     * Register a new patient
     */
    @Transactional
    public PatientDto createPatient(CreatePatientRequest request, Long hospitalId) {
        // Generate UHID
        String uhid = generateUhid(hospitalId);

        Patient patient = Patient.builder()
                .uhid(uhid)
                .registeredHospitalId(hospitalId)
                .firstName(request.getFirstName())
                .middleName(request.getMiddleName())
                .lastName(request.getLastName())
                .dateOfBirth(request.getDateOfBirth())
                .ageYears(request.getAgeYears())
                .ageMonths(request.getAgeMonths())
                .gender(request.getGender())
                .bloodGroup(request.getBloodGroup())
                .mobileNumber(request.getMobileNumber())
                .alternateMobile(request.getAlternateMobile())
                .email(request.getEmail())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .city(request.getCity())
                .district(request.getDistrict())
                .state(request.getState())
                .pincode(request.getPincode())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactRelation(request.getEmergencyContactRelation())
                .emergencyContactPhone(request.getEmergencyContactPhone())
                .allergies(request.getAllergies())
                .chronicConditions(request.getChronicConditions())
                .currentMedications(request.getCurrentMedications())
                .insuranceProvider(request.getInsuranceProvider())
                .insurancePolicyNumber(request.getInsurancePolicyNumber())
                .insuranceValidity(request.getInsuranceValidity())
                .preferredLanguage(request.getPreferredLanguage() != null ? request.getPreferredLanguage() : "en")
                .smsConsent(request.getSmsConsent() != null ? request.getSmsConsent() : true)
                .emailConsent(request.getEmailConsent() != null ? request.getEmailConsent() : true)
                .whatsappConsent(request.getWhatsappConsent() != null ? request.getWhatsappConsent() : true)
                .build();

        // Handle Aadhaar encryption
        if (request.getAadhaarNumber() != null && !request.getAadhaarNumber().isEmpty()) {
            patient.setAadhaarEncrypted(encryptionUtil.encrypt(request.getAadhaarNumber()));
            patient.setAadhaarLastFour(request.getAadhaarNumber().substring(8));
        }

        // Handle family linking
        if (request.getPrimaryAccountId() != null) {
            Patient primaryAccount = patientRepository.findById(request.getPrimaryAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Primary account", "id", request.getPrimaryAccountId()));
            patient.setPrimaryAccount(primaryAccount);
            patient.setRelationToPrimary(request.getRelationToPrimary());
        }

        patient = patientRepository.save(patient);
        log.info("Created patient with UHID: {}", uhid);

        return toDto(patient);
    }

    /**
     * Get patient by ID
     */
    @Transactional(readOnly = true)
    public PatientDto getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        return toDto(patient);
    }

    /**
     * Get patient by UHID
     */
    @Transactional(readOnly = true)
    public PatientDto getPatientByUhid(String uhid) {
        Patient patient = patientRepository.findByUhid(uhid)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "uhid", uhid));
        return toDto(patient);
    }

    /**
     * Get all patients under a mobile number (family)
     */
    @Transactional(readOnly = true)
    public List<PatientDto> getPatientsByMobile(String mobileNumber) {
        return patientRepository.findAllByMobileNumber(mobileNumber)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get family members
     */
    @Transactional(readOnly = true)
    public List<PatientDto.FamilyMemberDto> getFamilyMembers(Long primaryPatientId) {
        return patientRepository.findFamilyMembers(primaryPatientId)
                .stream()
                .map(p -> PatientDto.FamilyMemberDto.builder()
                        .id(p.getId())
                        .uhid(p.getUhid())
                        .fullName(p.getFullName())
                        .age(p.getCalculatedAge())
                        .gender(p.getGender())
                        .relationToPrimary(p.getRelationToPrimary())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Get all patients with pagination
     */
    @Transactional(readOnly = true)
    public PageResponse<PatientDto> getAllPatients(Long hospitalId, Pageable pageable) {
        Page<Patient> page;
        if (hospitalId != null) {
            page = patientRepository.findByRegisteredHospitalIdAndIsActiveTrue(hospitalId, pageable);
        } else {
            page = patientRepository.findByIsActiveTrue(pageable);
        }
        List<PatientDto> dtos = page.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return PageResponse.of(page, dtos);
    }

    /**
     * Search patients
     */
    @Transactional(readOnly = true)
    public PageResponse<PatientDto> searchPatients(String query, Long hospitalId, Pageable pageable) {
        Page<Patient> page = patientRepository.searchPatients(query, hospitalId, pageable);
        List<PatientDto> dtos = page.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return PageResponse.of(page, dtos);
    }

    /**
     * Update patient
     */
    @Transactional
    public PatientDto updatePatient(Long id, CreatePatientRequest request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));

        // Update fields
        if (request.getFirstName() != null) patient.setFirstName(request.getFirstName());
        if (request.getMiddleName() != null) patient.setMiddleName(request.getMiddleName());
        if (request.getLastName() != null) patient.setLastName(request.getLastName());
        if (request.getDateOfBirth() != null) patient.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) patient.setGender(request.getGender());
        if (request.getBloodGroup() != null) patient.setBloodGroup(request.getBloodGroup());
        if (request.getAlternateMobile() != null) patient.setAlternateMobile(request.getAlternateMobile());
        if (request.getEmail() != null) patient.setEmail(request.getEmail());
        if (request.getAddressLine1() != null) patient.setAddressLine1(request.getAddressLine1());
        if (request.getAddressLine2() != null) patient.setAddressLine2(request.getAddressLine2());
        if (request.getCity() != null) patient.setCity(request.getCity());
        if (request.getDistrict() != null) patient.setDistrict(request.getDistrict());
        if (request.getState() != null) patient.setState(request.getState());
        if (request.getPincode() != null) patient.setPincode(request.getPincode());
        if (request.getEmergencyContactName() != null) patient.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactRelation() != null) patient.setEmergencyContactRelation(request.getEmergencyContactRelation());
        if (request.getEmergencyContactPhone() != null) patient.setEmergencyContactPhone(request.getEmergencyContactPhone());
        if (request.getAllergies() != null) patient.setAllergies(request.getAllergies());
        if (request.getChronicConditions() != null) patient.setChronicConditions(request.getChronicConditions());
        if (request.getCurrentMedications() != null) patient.setCurrentMedications(request.getCurrentMedications());
        if (request.getInsuranceProvider() != null) patient.setInsuranceProvider(request.getInsuranceProvider());
        if (request.getInsurancePolicyNumber() != null) patient.setInsurancePolicyNumber(request.getInsurancePolicyNumber());
        if (request.getInsuranceValidity() != null) patient.setInsuranceValidity(request.getInsuranceValidity());
        if (request.getPreferredLanguage() != null) patient.setPreferredLanguage(request.getPreferredLanguage());

        patient = patientRepository.save(patient);
        return toDto(patient);
    }

    /**
     * Delete patient (soft delete)
     */
    @Transactional
    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        
        patient.setIsActive(false);
        patient.setIsDeleted(true);
        patientRepository.save(patient);
        log.info("Soft deleted patient with id: {}", id);
    }

    private String generateUhid(Long hospitalId) {
        // Format: HMS + Year(2 digits) + Sequence (6 digits)
        // e.g., HMS2600001
        String prefix = "HMS" + String.valueOf(Year.now().getValue()).substring(2);
        Integer maxNumber = patientRepository.findMaxUhidNumber(prefix);
        int nextNumber = (maxNumber != null ? maxNumber : 0) + 1;
        return prefix + String.format("%06d", nextNumber);
    }

    private PatientDto toDto(Patient patient) {
        PatientDto dto = PatientDto.builder()
                .id(patient.getId())
                .uhid(patient.getUhid())
                .registeredHospitalId(patient.getRegisteredHospitalId())
                .firstName(patient.getFirstName())
                .middleName(patient.getMiddleName())
                .lastName(patient.getLastName())
                .fullName(patient.getFullName())
                .dateOfBirth(patient.getDateOfBirth())
                .age(patient.getCalculatedAge())
                .gender(patient.getGender())
                .bloodGroup(patient.getBloodGroup())
                .mobileNumber(patient.getMobileNumber())
                .alternateMobile(patient.getAlternateMobile())
                .email(patient.getEmail())
                .addressLine1(patient.getAddressLine1())
                .addressLine2(patient.getAddressLine2())
                .city(patient.getCity())
                .district(patient.getDistrict())
                .state(patient.getState())
                .pincode(patient.getPincode())
                .aadhaarMasked(patient.getAadhaarLastFour() != null ? 
                        "XXXX-XXXX-" + patient.getAadhaarLastFour() : null)
                .emergencyContactName(patient.getEmergencyContactName())
                .emergencyContactRelation(patient.getEmergencyContactRelation())
                .emergencyContactPhone(patient.getEmergencyContactPhone())
                .allergies(patient.getAllergies())
                .chronicConditions(patient.getChronicConditions())
                .currentMedications(patient.getCurrentMedications())
                .insuranceProvider(patient.getInsuranceProvider())
                .insurancePolicyNumber(patient.getInsurancePolicyNumber())
                .insuranceValidity(patient.getInsuranceValidity())
                .profileImageUrl(patient.getProfileImageUrl())
                .preferredLanguage(patient.getPreferredLanguage())
                .isVip(patient.getIsVip())
                .primaryAccountId(patient.getPrimaryAccount() != null ? patient.getPrimaryAccount().getId() : null)
                .relationToPrimary(patient.getRelationToPrimary())
                .createdAt(patient.getCreatedAt())
                .updatedAt(patient.getUpdatedAt())
                .build();

        return dto;
    }
}
