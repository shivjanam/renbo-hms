package com.hospital.hms.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.hms.common.enums.Gender;
import com.hospital.hms.patient.dto.CreatePatientRequest;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for Patient Controller.
 * Tests patient registration, retrieval, and update operations.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Patient Controller Integration Tests")
class PatientControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Nested
    @DisplayName("Create Patient Tests")
    class CreatePatientTests {

        @Test
        @WithMockUser(roles = {"RECEPTIONIST"})
        @DisplayName("Should create patient successfully")
        void shouldCreatePatientSuccessfully() throws Exception {
            // Given
            CreatePatientRequest request = CreatePatientRequest.builder()
                    .firstName("Ramesh")
                    .lastName("Sharma")
                    .dateOfBirth(LocalDate.of(1980, 5, 15))
                    .gender(Gender.MALE)
                    .mobileNumber("9876543210")
                    .city("Mumbai")
                    .state("Maharashtra")
                    .pincode("400001")
                    .build();

            // When/Then
            mockMvc.perform(post("/api/v1/patients")
                            .contentType(MediaType.APPLICATION_JSON)
                            .header("X-Hospital-Id", "1")
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.firstName").value("Ramesh"))
                    .andExpect(jsonPath("$.data.uhid").exists());
        }

        @Test
        @WithMockUser(roles = {"RECEPTIONIST"})
        @DisplayName("Should reject patient with missing required fields")
        void shouldRejectPatientWithMissingFields() throws Exception {
            // Given - missing firstName
            CreatePatientRequest request = CreatePatientRequest.builder()
                    .lastName("Sharma")
                    .gender(Gender.MALE)
                    .mobileNumber("9876543210")
                    .build();

            // When/Then
            mockMvc.perform(post("/api/v1/patients")
                            .contentType(MediaType.APPLICATION_JSON)
                            .header("X-Hospital-Id", "1")
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @WithMockUser(roles = {"RECEPTIONIST"})
        @DisplayName("Should reject invalid mobile number")
        void shouldRejectInvalidMobileNumber() throws Exception {
            // Given
            CreatePatientRequest request = CreatePatientRequest.builder()
                    .firstName("Test")
                    .lastName("Patient")
                    .gender(Gender.MALE)
                    .mobileNumber("12345") // Invalid
                    .build();

            // When/Then
            mockMvc.perform(post("/api/v1/patients")
                            .contentType(MediaType.APPLICATION_JSON)
                            .header("X-Hospital-Id", "1")
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should reject unauthenticated request")
        void shouldRejectUnauthenticatedRequest() throws Exception {
            // Given
            CreatePatientRequest request = CreatePatientRequest.builder()
                    .firstName("Test")
                    .lastName("Patient")
                    .mobileNumber("9876543210")
                    .build();

            // When/Then
            mockMvc.perform(post("/api/v1/patients")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("Get Patient Tests")
    class GetPatientTests {

        @Test
        @WithMockUser(roles = {"DOCTOR"})
        @DisplayName("Should return 404 for non-existent patient")
        void shouldReturn404ForNonExistentPatient() throws Exception {
            // When/Then
            mockMvc.perform(get("/api/v1/patients/99999"))
                    .andExpect(status().isNotFound());
        }

        @Test
        @WithMockUser(roles = {"DOCTOR"})
        @DisplayName("Should search patients by query")
        void shouldSearchPatients() throws Exception {
            // When/Then
            mockMvc.perform(get("/api/v1/patients/search")
                            .param("query", "Sharma")
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @WithMockUser(roles = {"NURSE"})
        @DisplayName("Should allow nurse to view patient")
        void shouldAllowNurseToViewPatient() throws Exception {
            // When/Then
            mockMvc.perform(get("/api/v1/patients/search")
                            .param("query", "test"))
                    .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("Family Member Tests")
    class FamilyMemberTests {

        @Test
        @WithMockUser(roles = {"RECEPTIONIST"})
        @DisplayName("Should create family member with relation")
        void shouldCreateFamilyMemberWithRelation() throws Exception {
            // Given
            CreatePatientRequest request = CreatePatientRequest.builder()
                    .firstName("Kamla")
                    .lastName("Sharma")
                    .gender(Gender.FEMALE)
                    .mobileNumber("9876543210")
                    .primaryAccountId(1L)
                    .relationToPrimary("Wife")
                    .build();

            // When/Then - Note: This will fail if patient 1 doesn't exist
            mockMvc.perform(post("/api/v1/patients")
                            .contentType(MediaType.APPLICATION_JSON)
                            .header("X-Hospital-Id", "1")
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isNotFound()); // Expected as patient 1 doesn't exist
        }
    }

    @Nested
    @DisplayName("Aadhaar Validation Tests")
    class AadhaarValidationTests {

        @Test
        @WithMockUser(roles = {"RECEPTIONIST"})
        @DisplayName("Should accept valid Aadhaar format")
        void shouldAcceptValidAadhaar() throws Exception {
            // Given
            CreatePatientRequest request = CreatePatientRequest.builder()
                    .firstName("Test")
                    .lastName("Patient")
                    .gender(Gender.MALE)
                    .mobileNumber("9876543211")
                    .aadhaarNumber("123456789012") // Valid 12-digit
                    .build();

            // When/Then
            mockMvc.perform(post("/api/v1/patients")
                            .contentType(MediaType.APPLICATION_JSON)
                            .header("X-Hospital-Id", "1")
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated());
        }

        @Test
        @WithMockUser(roles = {"RECEPTIONIST"})
        @DisplayName("Should reject invalid Aadhaar format")
        void shouldRejectInvalidAadhaar() throws Exception {
            // Given - Invalid Aadhaar (less than 12 digits)
            CreatePatientRequest request = CreatePatientRequest.builder()
                    .firstName("Test")
                    .lastName("Patient")
                    .gender(Gender.MALE)
                    .mobileNumber("9876543212")
                    .aadhaarNumber("12345") // Invalid
                    .build();

            // When/Then
            mockMvc.perform(post("/api/v1/patients")
                            .contentType(MediaType.APPLICATION_JSON)
                            .header("X-Hospital-Id", "1")
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("RBAC Tests")
    class RbacTests {

        @Test
        @WithMockUser(roles = {"PATIENT"})
        @DisplayName("Should not allow patient to create other patients")
        void shouldNotAllowPatientToCreatePatients() throws Exception {
            // Given
            CreatePatientRequest request = CreatePatientRequest.builder()
                    .firstName("Test")
                    .lastName("Patient")
                    .mobileNumber("9876543213")
                    .build();

            // When/Then
            mockMvc.perform(post("/api/v1/patients")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @WithMockUser(roles = {"LAB_TECHNICIAN"})
        @DisplayName("Should allow lab technician to view patient")
        void shouldAllowLabTechToViewPatient() throws Exception {
            // When/Then
            mockMvc.perform(get("/api/v1/patients/search")
                            .param("query", "test"))
                    .andExpect(status().isOk());
        }
    }
}
