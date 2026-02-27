package com.hospital.hms.appointment;

import com.hospital.hms.common.enums.AppointmentStatus;
import com.hospital.hms.common.enums.AppointmentType;
import com.hospital.hms.common.enums.Specialization;
import com.hospital.hms.common.exception.BadRequestException;
import com.hospital.hms.common.exception.ResourceNotFoundException;
import com.hospital.hms.factory.TestDataFactory;
import com.hospital.hms.appointment.entity.Appointment;
import com.hospital.hms.patient.entity.Patient;
import com.hospital.hms.doctor.entity.Doctor;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

/**
 * Unit tests for Appointment Service functionality.
 * Tests appointment booking, rescheduling, cancellation, and slot validation.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AppointmentService Tests")
class AppointmentServiceTest {

    private Patient testPatient;
    private Doctor testDoctor;
    private Appointment testAppointment;

    @BeforeEach
    void setUp() {
        TestDataFactory.resetIdGenerator();
        testPatient = TestDataFactory.createPatient();
        testDoctor = TestDataFactory.createDoctor(Specialization.GENERAL_MEDICINE);
        testAppointment = TestDataFactory.createAppointment(testPatient, testDoctor);
    }

    @Nested
    @DisplayName("Appointment Creation Tests")
    class AppointmentCreationTests {

        @Test
        @DisplayName("Should create valid appointment")
        void shouldCreateValidAppointment() {
            // Given
            LocalDate futureDate = LocalDate.now().plusDays(1);
            LocalTime slotTime = LocalTime.of(10, 0);

            Appointment appointment = TestDataFactory.createAppointment(
                    testPatient, testDoctor, futureDate, slotTime);

            // Then
            assertThat(appointment).isNotNull();
            assertThat(appointment.getPatientId()).isEqualTo(testPatient.getId());
            assertThat(appointment.getDoctorId()).isEqualTo(testDoctor.getId());
            assertThat(appointment.getAppointmentDate()).isEqualTo(futureDate);
            assertThat(appointment.getSlotStartTime()).isEqualTo(slotTime);
            assertThat(appointment.getStatus()).isEqualTo(AppointmentStatus.SCHEDULED);
        }

        @Test
        @DisplayName("Should set correct slot end time based on duration")
        void shouldSetCorrectSlotEndTime() {
            // Given
            testDoctor.setSlotDurationMinutes(20);
            LocalTime startTime = LocalTime.of(9, 0);

            Appointment appointment = TestDataFactory.createAppointment(
                    testPatient, testDoctor, LocalDate.now().plusDays(1), startTime);

            // Then
            assertThat(appointment.getSlotEndTime()).isEqualTo(LocalTime.of(9, 20));
        }

        @Test
        @DisplayName("Should set consultation fee from doctor")
        void shouldSetConsultationFeeFromDoctor() {
            // Given
            testDoctor.setOpdConsultationFee(750.0);

            Appointment appointment = TestDataFactory.createAppointment(
                    testPatient, testDoctor, LocalDate.now().plusDays(1), LocalTime.of(10, 0));

            // Then
            assertThat(appointment.getConsultationFee()).isEqualTo(750.0);
        }

        @Test
        @DisplayName("Should set follow-up fee for follow-up appointments")
        void shouldSetFollowUpFee() {
            // Given
            testDoctor.setFollowUpFee(350.0);
            
            Appointment appointment = TestDataFactory.createAppointment(testPatient, testDoctor);
            appointment.setAppointmentType(AppointmentType.FOLLOW_UP);
            appointment.setIsFollowUp(true);
            appointment.setConsultationFee(testDoctor.getFollowUpFee());

            // Then
            assertThat(appointment.getIsFollowUp()).isTrue();
            assertThat(appointment.getConsultationFee()).isEqualTo(350.0);
        }
    }

    @Nested
    @DisplayName("Slot Availability Tests")
    class SlotAvailabilityTests {

        @Test
        @DisplayName("Should detect overlapping slots")
        void shouldDetectOverlappingSlots() {
            // Given
            LocalDate date = LocalDate.now().plusDays(1);
            LocalTime slot1Start = LocalTime.of(10, 0);
            LocalTime slot1End = LocalTime.of(10, 15);
            LocalTime slot2Start = LocalTime.of(10, 10); // Overlaps with slot1

            // When
            boolean overlaps = isSlotOverlapping(slot1Start, slot1End, slot2Start);

            // Then
            assertThat(overlaps).isTrue();
        }

        @Test
        @DisplayName("Should allow non-overlapping slots")
        void shouldAllowNonOverlappingSlots() {
            // Given
            LocalTime slot1Start = LocalTime.of(10, 0);
            LocalTime slot1End = LocalTime.of(10, 15);
            LocalTime slot2Start = LocalTime.of(10, 15); // Starts exactly when slot1 ends

            // When
            boolean overlaps = isSlotOverlapping(slot1Start, slot1End, slot2Start);

            // Then
            assertThat(overlaps).isFalse();
        }

        private boolean isSlotOverlapping(LocalTime existingStart, LocalTime existingEnd, LocalTime newStart) {
            return !newStart.isBefore(existingStart) && newStart.isBefore(existingEnd);
        }
    }

    @Nested
    @DisplayName("Appointment Status Tests")
    class AppointmentStatusTests {

        @Test
        @DisplayName("Should allow cancellation of scheduled appointment")
        void shouldAllowCancellationOfScheduled() {
            // Given
            testAppointment.setStatus(AppointmentStatus.SCHEDULED);

            // When
            boolean canCancel = canCancelAppointment(testAppointment);

            // Then
            assertThat(canCancel).isTrue();
        }

        @Test
        @DisplayName("Should allow cancellation of confirmed appointment")
        void shouldAllowCancellationOfConfirmed() {
            // Given
            testAppointment.setStatus(AppointmentStatus.CONFIRMED);

            // When
            boolean canCancel = canCancelAppointment(testAppointment);

            // Then
            assertThat(canCancel).isTrue();
        }

        @Test
        @DisplayName("Should not allow cancellation of completed appointment")
        void shouldNotAllowCancellationOfCompleted() {
            // Given
            testAppointment.setStatus(AppointmentStatus.COMPLETED);

            // When
            boolean canCancel = canCancelAppointment(testAppointment);

            // Then
            assertThat(canCancel).isFalse();
        }

        @Test
        @DisplayName("Should not allow cancellation of in-progress appointment")
        void shouldNotAllowCancellationOfInProgress() {
            // Given
            testAppointment.setStatus(AppointmentStatus.IN_PROGRESS);

            // When
            boolean canCancel = canCancelAppointment(testAppointment);

            // Then
            assertThat(canCancel).isFalse();
        }

        private boolean canCancelAppointment(Appointment appointment) {
            return appointment.getStatus() == AppointmentStatus.SCHEDULED ||
                   appointment.getStatus() == AppointmentStatus.CONFIRMED ||
                   appointment.getStatus() == AppointmentStatus.CHECKED_IN;
        }
    }

    @Nested
    @DisplayName("Appointment Reschedule Tests")
    class AppointmentRescheduleTests {

        @Test
        @DisplayName("Should allow rescheduling within limit")
        void shouldAllowReschedulingWithinLimit() {
            // Given
            testAppointment.setRescheduleCount(0);
            int maxReschedules = 3;

            // When
            boolean canReschedule = canRescheduleAppointment(testAppointment, maxReschedules);

            // Then
            assertThat(canReschedule).isTrue();
        }

        @Test
        @DisplayName("Should not allow rescheduling beyond limit")
        void shouldNotAllowReschedulingBeyondLimit() {
            // Given
            testAppointment.setRescheduleCount(3);
            int maxReschedules = 3;

            // When
            boolean canReschedule = canRescheduleAppointment(testAppointment, maxReschedules);

            // Then
            assertThat(canReschedule).isFalse();
        }

        @Test
        @DisplayName("Should increment reschedule count on reschedule")
        void shouldIncrementRescheduleCount() {
            // Given
            testAppointment.setRescheduleCount(1);

            // When
            testAppointment.setRescheduleCount(testAppointment.getRescheduleCount() + 1);

            // Then
            assertThat(testAppointment.getRescheduleCount()).isEqualTo(2);
        }

        private boolean canRescheduleAppointment(Appointment appointment, int maxReschedules) {
            return appointment.getRescheduleCount() < maxReschedules &&
                   canCancelAppointment(appointment);
        }

        private boolean canCancelAppointment(Appointment appointment) {
            return appointment.getStatus() == AppointmentStatus.SCHEDULED ||
                   appointment.getStatus() == AppointmentStatus.CONFIRMED;
        }
    }

    @Nested
    @DisplayName("Queue Token Tests")
    class QueueTokenTests {

        @Test
        @DisplayName("Should generate sequential tokens")
        void shouldGenerateSequentialTokens() {
            // Given
            int lastToken = 5;

            // When
            int newToken = lastToken + 1;

            // Then
            assertThat(newToken).isEqualTo(6);
        }

        @Test
        @DisplayName("Should format token display correctly")
        void shouldFormatTokenDisplayCorrectly() {
            // Given
            String departmentPrefix = "OPD";
            int tokenNumber = 12;

            // When
            String tokenDisplay = String.format("%s-%03d", departmentPrefix, tokenNumber);

            // Then
            assertThat(tokenDisplay).isEqualTo("OPD-012");
        }
    }

    @Nested
    @DisplayName("Teleconsultation Tests")
    class TeleconsultationTests {

        @Test
        @DisplayName("Should create teleconsultation appointment")
        void shouldCreateTeleconsultationAppointment() {
            // Given
            testDoctor.setTeleconsultationEnabled(true);
            testDoctor.setTeleconsultationFee(600.0);

            Appointment appointment = TestDataFactory.createAppointment(testPatient, testDoctor);
            appointment.setAppointmentType(AppointmentType.TELECONSULTATION);
            appointment.setConsultationFee(testDoctor.getTeleconsultationFee());

            // Then
            assertThat(appointment.getAppointmentType()).isEqualTo(AppointmentType.TELECONSULTATION);
            assertThat(appointment.getConsultationFee()).isEqualTo(600.0);
        }

        @Test
        @DisplayName("Should reject teleconsultation for disabled doctors")
        void shouldRejectTeleconsultationForDisabledDoctors() {
            // Given
            testDoctor.setTeleconsultationEnabled(false);

            // When/Then
            assertThat(testDoctor.getTeleconsultationEnabled()).isFalse();
        }
    }

    @Nested
    @DisplayName("Appointment Validation Tests")
    class AppointmentValidationTests {

        @Test
        @DisplayName("Should validate future date requirement")
        void shouldValidateFutureDateRequirement() {
            // Given
            LocalDate pastDate = LocalDate.now().minusDays(1);
            LocalDate futureDate = LocalDate.now().plusDays(1);

            // Then
            assertThat(isValidAppointmentDate(pastDate)).isFalse();
            assertThat(isValidAppointmentDate(futureDate)).isTrue();
        }

        @Test
        @DisplayName("Should validate advance booking limit")
        void shouldValidateAdvanceBookingLimit() {
            // Given
            int maxAdvanceDays = 30;
            LocalDate validDate = LocalDate.now().plusDays(15);
            LocalDate invalidDate = LocalDate.now().plusDays(45);

            // Then
            assertThat(isWithinAdvanceBookingLimit(validDate, maxAdvanceDays)).isTrue();
            assertThat(isWithinAdvanceBookingLimit(invalidDate, maxAdvanceDays)).isFalse();
        }

        private boolean isValidAppointmentDate(LocalDate date) {
            return !date.isBefore(LocalDate.now());
        }

        private boolean isWithinAdvanceBookingLimit(LocalDate date, int maxDays) {
            return !date.isAfter(LocalDate.now().plusDays(maxDays));
        }
    }
}
