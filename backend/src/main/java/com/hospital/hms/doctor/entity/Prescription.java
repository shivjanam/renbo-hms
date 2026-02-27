package com.hospital.hms.doctor.entity;

import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.PrescriptionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Prescription entity - digital prescription issued by doctors.
 */
@Entity
@Table(name = "prescriptions", indexes = {
        @Index(name = "idx_rx_patient", columnList = "patient_id"),
        @Index(name = "idx_rx_doctor", columnList = "doctor_id"),
        @Index(name = "idx_rx_appointment", columnList = "appointment_id"),
        @Index(name = "idx_rx_date", columnList = "prescription_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription extends BaseEntity {

    @Column(name = "prescription_number", unique = true, nullable = false)
    private String prescriptionNumber;

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "patient_name")
    private String patientName;

    @Column(name = "patient_age")
    private String patientAge;

    @Column(name = "patient_gender")
    private String patientGender;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column(name = "doctor_name")
    private String doctorName;

    @Column(name = "doctor_registration")
    private String doctorRegistration;

    @Column(name = "appointment_id")
    private Long appointmentId;

    @Column(name = "prescription_date", nullable = false)
    private LocalDate prescriptionDate;

    @Column(name = "valid_until")
    private LocalDate validUntil;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private PrescriptionStatus status = PrescriptionStatus.ACTIVE;

    // Clinical Information
    @Column(name = "chief_complaint", length = 1000)
    private String chiefComplaint;

    @Column(name = "history_of_present_illness", length = 2000)
    private String historyOfPresentIllness;

    @Column(name = "examination_findings", length = 2000)
    private String examinationFindings;

    @Column(name = "diagnosis", length = 1000)
    private String diagnosis;

    @Column(name = "provisional_diagnosis", length = 500)
    private String provisionalDiagnosis;

    // Vitals at consultation
    @Column(name = "blood_pressure")
    private String bloodPressure;

    @Column(name = "pulse")
    private String pulse;

    @Column(name = "temperature")
    private String temperature;

    @Column(name = "weight")
    private String weight;

    @Column(name = "height")
    private String height;

    @Column(name = "spo2")
    private String spo2;

    @Column(name = "respiratory_rate")
    private String respiratoryRate;

    // Medicines
    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PrescriptionMedicine> medicines = new ArrayList<>();

    // Lab tests ordered
    @Column(name = "lab_tests_ordered", length = 2000)
    private String labTestsOrdered;

    // Advice
    @Column(name = "advice", length = 2000)
    private String advice;

    @Column(name = "dietary_advice", length = 1000)
    private String dietaryAdvice;

    // Follow-up
    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(name = "follow_up_notes")
    private String followUpNotes;

    // Referral
    @Column(name = "referred_to_doctor_id")
    private Long referredToDoctorId;

    @Column(name = "referred_to_department")
    private String referredToDepartment;

    @Column(name = "referral_reason")
    private String referralReason;

    // Signature
    @Column(name = "is_digitally_signed")
    @Builder.Default
    private Boolean isDigitallySigned = true;

    @Column(name = "signed_at")
    private LocalDateTime signedAt;

    // PDF
    @Column(name = "pdf_url")
    private String pdfUrl;
}
