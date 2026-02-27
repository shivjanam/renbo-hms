package com.hospital.hms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Hospital Management System - Main Application
 * 
 * A comprehensive, cloud-ready Hospital Management System designed for Indian hospitals.
 * 
 * Features:
 * - Multi-hospital & multi-branch support
 * - Role-based access control (RBAC)
 * - Patient management with family structure
 * - Appointment booking with queue/token system
 * - Doctor panel with digital prescriptions
 * - Lab management with report tracking
 * - Pharmacy with inventory management
 * - Billing with GST compliance
 * - Indian payment gateway integration (UPI, Razorpay, etc.)
 * - Audit logging for compliance
 * - Multi-language support (English, Hindi)
 * 
 * @author HMS Development Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EnableAsync
@EnableScheduling
public class HospitalManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalManagementSystemApplication.class, args);
    }
}
