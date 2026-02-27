package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AppointmentStatus {
    SCHEDULED("Scheduled", "Appointment is scheduled"),
    CONFIRMED("Confirmed", "Appointment confirmed by hospital"),
    CHECKED_IN("Checked In", "Patient has arrived and checked in"),
    IN_QUEUE("In Queue", "Patient is waiting in queue"),
    IN_PROGRESS("In Progress", "Consultation is ongoing"),
    COMPLETED("Completed", "Appointment completed"),
    CANCELLED_BY_PATIENT("Cancelled by Patient", "Cancelled by the patient"),
    CANCELLED_BY_HOSPITAL("Cancelled by Hospital", "Cancelled by the hospital"),
    NO_SHOW("No Show", "Patient did not arrive"),
    RESCHEDULED("Rescheduled", "Appointment has been rescheduled");

    private final String displayName;
    private final String description;

    public boolean isCancelled() {
        return this == CANCELLED_BY_PATIENT || this == CANCELLED_BY_HOSPITAL;
    }

    public boolean isActive() {
        return this == SCHEDULED || this == CONFIRMED || this == CHECKED_IN || 
               this == IN_QUEUE || this == IN_PROGRESS;
    }

    public boolean isCompleted() {
        return this == COMPLETED;
    }
}
