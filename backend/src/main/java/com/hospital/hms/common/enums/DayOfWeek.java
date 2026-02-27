package com.hospital.hms.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DayOfWeek {
    MONDAY("Monday", "Mon", 1),
    TUESDAY("Tuesday", "Tue", 2),
    WEDNESDAY("Wednesday", "Wed", 3),
    THURSDAY("Thursday", "Thu", 4),
    FRIDAY("Friday", "Fri", 5),
    SATURDAY("Saturday", "Sat", 6),
    SUNDAY("Sunday", "Sun", 7);

    private final String displayName;
    private final String shortName;
    private final int dayNumber;

    public boolean isWeekend() {
        return this == SATURDAY || this == SUNDAY;
    }

    public static DayOfWeek fromJavaDay(java.time.DayOfWeek javaDayOfWeek) {
        return DayOfWeek.valueOf(javaDayOfWeek.name());
    }
}
