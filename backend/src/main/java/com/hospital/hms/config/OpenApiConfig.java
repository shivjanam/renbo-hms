package com.hospital.hms.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI hospitalManagementOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        
        return new OpenAPI()
                .info(new Info()
                        .title("Hospital Management System API")
                        .description("""
                                Comprehensive REST API for Indian Hospital Management System.
                                
                                ## Features
                                - Patient Management (OTP-based registration, family structure)
                                - Appointment Booking (OPD, Teleconsultation, Follow-ups)
                                - Doctor & Medical Staff Management
                                - Lab & Pharmacy Management
                                - Billing with GST Compliance
                                - Multi-hospital & Multi-branch Support
                                
                                ## Authentication
                                All API endpoints (except public endpoints) require JWT Bearer token authentication.
                                Use the `/api/v1/auth/login` endpoint to obtain a token.
                                
                                ## Indian Context
                                - Aadhaar integration (optional)
                                - UPI & Indian payment gateways
                                - GST compliant invoicing
                                - Multi-language support (English, Hindi)
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("HMS Support")
                                .email("support@hospital.com")
                                .url("https://hospital.com"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://hospital.com/license")))
                .servers(List.of(
                        new Server().url("http://localhost:" + serverPort).description("Development Server"),
                        new Server().url("https://api.hospital.com").description("Production Server")
                ))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT token obtained from /api/v1/auth/login")));
    }
}
