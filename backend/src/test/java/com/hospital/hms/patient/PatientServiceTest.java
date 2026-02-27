package com.hospital.hms.patient;

import com.hospital.hms.common.enums.BloodGroup;
import com.hospital.hms.common.enums.Gender;
import com.hospital.hms.common.exception.ResourceNotFoundException;
import com.hospital.hms.common.util.EncryptionUtil;
import com.hospital.hms.factory.TestDataFactory;
import com.hospital.hms.patient.dto.CreatePatientRequest;
import com.hospital.hms.patient.dto.PatientDto;
import com.hospital.hms.patient.entity.Patient;
import com.hospital.hms.patient.repository.PatientRepository;
import com.hospital.hms.patient.service.PatientService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PatientService Tests")
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private EncryptionUtil encryptionUtil;

    @InjectMocks
    private PatientService patientService;

    private Patient testPatient;

    @BeforeEach
    void setUp() {
        TestDataFactory.resetIdGenerator();
        testPatient = TestDataFactory.createPatient();
    }

    @Nested
    @DisplayName("Create Patient Tests")
    class CreatePatientTests {

        @Test
        @DisplayName("Should create patient successfully")
        void shouldCreatePatientSuccessfully() {
            // Given
            CreatePatientRequest request = CreatePatientRequest.builder()
                    .firstName("Ramesh")
                    .lastName("Sharma")
                    .dateOfBirth(LocalDate.of(1980, 5, 15))
                    .gender(Gender.MALE)
                    .bloodGroup(BloodGroup.B_POSITIVE)
                    .mobileNumber("9876543210")
                    .email("ramesh.sharma@test.com")
                    .city("Mumbai")
                    .state("Maharashtra")
                    .pincode("400001")
                    .build();

            when(patientRepository.findMaxUhidNumber(anyString())).thenReturn(0);
            when(patientRepository.save(any(Patient.class))).thenAnswer(i -> {
                Patient p = i.getArgument(0);
                p.setId(1L);
                return p;
            });

            // When
            PatientDto result = patientService.createPatient(request, 1L);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getFirstName()).isEqualTo("Ramesh");
            assertThat(result.getLastName()).isEqualTo("Sharma");
            assertThat(result.getUhid()).startsWith("HMS");
            verify(patientRepository).save(any(Patient.class));
        }

        @Test
        @DisplayName("Should encrypt Aadhaar when provided")
        void shouldEncryptAadhaar() {
            // Given
            CreatePatientRequest request = CreatePatientRequest.builder()
                    .firstName("Suresh")
                    .lastName("Patel")
                    .gender(Gender.MALE)
                    .mobileNumber("9876543211")
                    .aadhaarNumber("123456789012")
                    .build();

            when(patientRepository.findMaxUhidNumber(anyString())).thenReturn(0);
            when(encryptionUtil.encrypt("123456789012")).thenReturn("encrypted_aadhaar");
            when(patientRepository.save(any(Patient.class))).thenAnswer(i -> {
                Patient p = i.getArgument(0);
                p.setId(1L);
                return p;
            });

            // When
            PatientDto result = patientService.createPatient(request, 1L);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getAadhaarMasked()).isEqualTo("XXXX-XXXX-9012");
            verify(encryptionUtil).encrypt("123456789012");
        }

        @Test
        @DisplayName("Should link family member")
        void shouldLinkFamilyMember() {
            // Given
            Patient primaryPatient = TestDataFactory.createPatient();
            primaryPatient.setId(1L);

            CreatePatientRequest request = CreatePatientRequest.builder()
                    .firstName("Kamla")
                    .lastName("Sharma")
                    .gender(Gender.FEMALE)
                    .mobileNumber("9876543210")
                    .primaryAccountId(1L)
                    .relationToPrimary("Wife")
                    .build();

            when(patientRepository.findById(1L)).thenReturn(Optional.of(primaryPatient));
            when(patientRepository.findMaxUhidNumber(anyString())).thenReturn(1);
            when(patientRepository.save(any(Patient.class))).thenAnswer(i -> {
                Patient p = i.getArgument(0);
                p.setId(2L);
                return p;
            });

            // When
            PatientDto result = patientService.createPatient(request, 1L);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getPrimaryAccountId()).isEqualTo(1L);
            assertThat(result.getRelationToPrimary()).isEqualTo("Wife");
        }

        @Test
        @DisplayName("Should fail when linking to non-existent primary account")
        void shouldFailWhenPrimaryAccountNotFound() {
            // Given
            CreatePatientRequest request = CreatePatientRequest.builder()
                    .firstName("Test")
                    .lastName("Patient")
                    .gender(Gender.MALE)
                    .mobileNumber("9876543212")
                    .primaryAccountId(999L)
                    .relationToPrimary("Son")
                    .build();

            when(patientRepository.findById(999L)).thenReturn(Optional.empty());
            when(patientRepository.findMaxUhidNumber(anyString())).thenReturn(0);

            // When/Then
            assertThatThrownBy(() -> patientService.createPatient(request, 1L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Get Patient Tests")
    class GetPatientTests {

        @Test
        @DisplayName("Should get patient by ID")
        void shouldGetPatientById() {
            // Given
            when(patientRepository.findById(1L)).thenReturn(Optional.of(testPatient));

            // When
            PatientDto result = patientService.getPatientById(1L);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(testPatient.getId());
        }

        @Test
        @DisplayName("Should throw exception when patient not found")
        void shouldThrowWhenPatientNotFound() {
            // Given
            when(patientRepository.findById(999L)).thenReturn(Optional.empty());

            // When/Then
            assertThatThrownBy(() -> patientService.getPatientById(999L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Patient");
        }

        @Test
        @DisplayName("Should get patient by UHID")
        void shouldGetPatientByUhid() {
            // Given
            when(patientRepository.findByUhid("HMS2600001")).thenReturn(Optional.of(testPatient));

            // When
            PatientDto result = patientService.getPatientByUhid("HMS2600001");

            // Then
            assertThat(result).isNotNull();
        }

        @Test
        @DisplayName("Should get all patients by mobile (family)")
        void shouldGetAllPatientsByMobile() {
            // Given
            Patient patient1 = TestDataFactory.createPatient();
            Patient patient2 = TestDataFactory.createPatient();
            patient1.setMobileNumber("9876543210");
            patient2.setMobileNumber("9876543210");
            
            when(patientRepository.findAllByMobileNumber("9876543210"))
                    .thenReturn(Arrays.asList(patient1, patient2));

            // When
            List<PatientDto> result = patientService.getPatientsByMobile("9876543210");

            // Then
            assertThat(result).hasSize(2);
        }
    }

    @Nested
    @DisplayName("Update Patient Tests")
    class UpdatePatientTests {

        @Test
        @DisplayName("Should update patient successfully")
        void shouldUpdatePatientSuccessfully() {
            // Given
            CreatePatientRequest request = CreatePatientRequest.builder()
                    .firstName("Updated Name")
                    .email("updated@test.com")
                    .bloodGroup(BloodGroup.A_POSITIVE)
                    .build();

            when(patientRepository.findById(1L)).thenReturn(Optional.of(testPatient));
            when(patientRepository.save(any(Patient.class))).thenReturn(testPatient);

            // When
            PatientDto result = patientService.updatePatient(1L, request);

            // Then
            assertThat(result).isNotNull();
            verify(patientRepository).save(testPatient);
            assertThat(testPatient.getFirstName()).isEqualTo("Updated Name");
            assertThat(testPatient.getEmail()).isEqualTo("updated@test.com");
        }

        @Test
        @DisplayName("Should update only non-null fields")
        void shouldUpdateOnlyNonNullFields() {
            // Given
            String originalEmail = testPatient.getEmail();
            
            CreatePatientRequest request = CreatePatientRequest.builder()
                    .firstName("New First Name")
                    // email is null, should not be updated
                    .build();

            when(patientRepository.findById(1L)).thenReturn(Optional.of(testPatient));
            when(patientRepository.save(any(Patient.class))).thenReturn(testPatient);

            // When
            patientService.updatePatient(1L, request);

            // Then
            assertThat(testPatient.getFirstName()).isEqualTo("New First Name");
            assertThat(testPatient.getEmail()).isEqualTo(originalEmail); // Unchanged
        }
    }

    @Nested
    @DisplayName("Family Member Tests")
    class FamilyMemberTests {

        @Test
        @DisplayName("Should get family members")
        void shouldGetFamilyMembers() {
            // Given
            Patient member1 = TestDataFactory.createPatient();
            member1.setRelationToPrimary("Wife");
            Patient member2 = TestDataFactory.createPatient();
            member2.setRelationToPrimary("Son");
            
            when(patientRepository.findFamilyMembers(1L))
                    .thenReturn(Arrays.asList(member1, member2));

            // When
            List<PatientDto.FamilyMemberDto> result = patientService.getFamilyMembers(1L);

            // Then
            assertThat(result).hasSize(2);
            assertThat(result.get(0).getRelationToPrimary()).isEqualTo("Wife");
            assertThat(result.get(1).getRelationToPrimary()).isEqualTo("Son");
        }
    }
}
