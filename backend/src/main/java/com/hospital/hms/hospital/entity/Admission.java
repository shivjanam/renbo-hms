package com.hospital.hms.hospital.entity;

import com.hospital.hms.common.entity.BaseEntity;
import com.hospital.hms.common.enums.AdmissionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Admission entity - patient hospital admission management.
 */
@Entity
@Table(name = "admissions", indexes = {
        @Index(name = "idx_admission_patient", columnList = "patient_id"),
        @Index(name = "idx_admission_hospital", columnList = "hospital_id"),
        @Index(name = "idx_admission_number", columnList = "admission_number"),
        @Index(name = "idx_admission_date", columnList = "admission_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admission extends BaseEntity {

    @Column(name = "admission_number", unique = true, nullable = false)
    private String admissionNumber;

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "patient_name")
    private String patientName;

    @Column(name = "patient_uhid")
    private String patientUhid;

    @Column(name = "patient_mobile")
    private String patientMobile;

    // Admission details
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private AdmissionStatus status = AdmissionStatus.ADMITTED;

    @Column(name = "admission_date", nullable = false)
    private LocalDateTime admissionDate;

    @Column(name = "expected_discharge_date")
    private LocalDate expectedDischargeDate;

    @Column(name = "actual_discharge_date")
    private LocalDateTime actualDischargeDate;

    @Column(name = "admission_type")
    private String admissionType; // PLANNED, EMERGENCY, DAYCARE

    @Column(name = "admission_source")
    private String admissionSource; // OPD, EMERGENCY, REFERRAL, TRANSFER

    // Bed assignment
    @Column(name = "bed_id")
    private Long bedId;

    @Column(name = "bed_number")
    private String bedNumber;

    @Column(name = "ward_id")
    private Long wardId;

    @Column(name = "ward_name")
    private String wardName;

    @Column(name = "room_number")
    private String roomNumber;

    // Department & Doctor
    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "department_name")
    private String departmentName;

    @Column(name = "admitting_doctor_id")
    private Long admittingDoctorId;

    @Column(name = "admitting_doctor_name")
    private String admittingDoctorName;

    @Column(name = "primary_doctor_id")
    private Long primaryDoctorId;

    @Column(name = "primary_doctor_name")
    private String primaryDoctorName;

    // Clinical
    @Column(name = "chief_complaint", length = 1000)
    private String chiefComplaint;

    @Column(name = "provisional_diagnosis", length = 1000)
    private String provisionalDiagnosis;

    @Column(name = "final_diagnosis", length = 1000)
    private String finalDiagnosis;

    @Column(name = "procedures_done", length = 2000)
    private String proceduresDone;

    @Column(name = "admission_notes", length = 2000)
    private String admissionNotes;

    @Column(name = "discharge_notes", length = 2000)
    private String dischargeNotes;

    @Column(name = "discharge_summary", length = 4000)
    private String dischargeSummary;

    // Attendant
    @Column(name = "attendant_name")
    private String attendantName;

    @Column(name = "attendant_relation")
    private String attendantRelation;

    @Column(name = "attendant_mobile")
    private String attendantMobile;

    @Column(name = "attendant_address", length = 500)
    private String attendantAddress;

    // MLC (Medico-Legal Case)
    @Column(name = "is_mlc")
    @Builder.Default
    private Boolean isMlc = false;

    @Column(name = "mlc_number")
    private String mlcNumber;

    @Column(name = "police_station")
    private String policeStation;

    @Column(name = "brought_by")
    private String broughtBy;

    // Billing
    @Column(name = "estimated_cost", precision = 12, scale = 2)
    private BigDecimal estimatedCost;

    @Column(name = "advance_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal advanceAmount = BigDecimal.ZERO;

    @Column(name = "total_billed", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalBilled = BigDecimal.ZERO;

    @Column(name = "total_paid", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalPaid = BigDecimal.ZERO;

    @Column(name = "balance_amount", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal balanceAmount = BigDecimal.ZERO;

    // Insurance
    @Column(name = "is_insurance")
    @Builder.Default
    private Boolean isInsurance = false;

    @Column(name = "insurance_provider")
    private String insuranceProvider;

    @Column(name = "insurance_policy_number")
    private String insurancePolicyNumber;

    @Column(name = "insurance_approval_number")
    private String insuranceApprovalNumber;

    @Column(name = "insurance_approved_amount", precision = 10, scale = 2)
    private BigDecimal insuranceApprovedAmount;

    // Discharge
    @Column(name = "discharge_type")
    private String dischargeType; // NORMAL, LAMA, DAMA, TRANSFER, EXPIRED, ABSCONDED

    @Column(name = "discharged_by_id")
    private Long dischargedById;

    @Column(name = "discharged_by_name")
    private String dischargedByName;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(name = "follow_up_instructions", length = 1000)
    private String followUpInstructions;

    // PDF reports
    @Column(name = "discharge_summary_pdf_url")
    private String dischargeSummaryPdfUrl;
}
