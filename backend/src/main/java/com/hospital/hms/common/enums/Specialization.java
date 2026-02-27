package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Specialization {
    GENERAL_MEDICINE("General Medicine", "General Physician"),
    GENERAL_SURGERY("General Surgery", "General Surgeon"),
    PEDIATRICS("Pediatrics", "Child Specialist"),
    GYNECOLOGY("Gynecology & Obstetrics", "Gynecologist"),
    ORTHOPEDICS("Orthopedics", "Bone Specialist"),
    CARDIOLOGY("Cardiology", "Heart Specialist"),
    NEUROLOGY("Neurology", "Brain & Nerve Specialist"),
    NEPHROLOGY("Nephrology", "Kidney Specialist"),
    UROLOGY("Urology", "Urologist"),
    DERMATOLOGY("Dermatology", "Skin Specialist"),
    ENT("ENT", "Ear, Nose, Throat Specialist"),
    OPHTHALMOLOGY("Ophthalmology", "Eye Specialist"),
    PSYCHIATRY("Psychiatry", "Mental Health Specialist"),
    PULMONOLOGY("Pulmonology", "Lung Specialist"),
    GASTROENTEROLOGY("Gastroenterology", "Digestive System Specialist"),
    ENDOCRINOLOGY("Endocrinology", "Hormone Specialist"),
    ONCOLOGY("Oncology", "Cancer Specialist"),
    RADIOLOGY("Radiology", "Imaging Specialist"),
    PATHOLOGY("Pathology", "Lab Specialist"),
    ANESTHESIOLOGY("Anesthesiology", "Anesthesiologist"),
    DENTISTRY("Dentistry", "Dental Specialist"),
    PHYSIOTHERAPY("Physiotherapy", "Physical Therapist"),
    EMERGENCY_MEDICINE("Emergency Medicine", "Emergency Specialist"),
    INTENSIVE_CARE("Intensive Care", "ICU Specialist"),
    PLASTIC_SURGERY("Plastic Surgery", "Plastic Surgeon"),
    CARDIAC_SURGERY("Cardiac Surgery", "Heart Surgeon"),
    NEURO_SURGERY("Neuro Surgery", "Brain Surgeon"),
    RHEUMATOLOGY("Rheumatology", "Joint & Muscle Specialist"),
    DIABETOLOGY("Diabetology", "Diabetes Specialist"),
    AYURVEDA("Ayurveda", "Ayurvedic Medicine"),
    HOMEOPATHY("Homeopathy", "Homeopathic Medicine"),
    UNANI("Unani", "Unani Medicine");

    private final String displayName;
    private final String description;
}
