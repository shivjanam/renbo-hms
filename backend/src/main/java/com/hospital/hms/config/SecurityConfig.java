package com.hospital.hms.config;

import com.hospital.hms.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/public/**").permitAll()
                        
                        // Guest booking endpoints (public access for OTP-verified booking)
                        .requestMatchers("/api/v1/appointments/guest/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/appointments/slots/**").permitAll()
                        
                        // Public access to doctors and hospitals for search (GET only)
                        .requestMatchers(HttpMethod.GET, "/api/v1/doctors/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/hospitals/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/departments/**").permitAll()
                        
                        // Doctor CRUD (POST/PUT/DELETE) requires admin role
                        .requestMatchers(HttpMethod.POST, "/api/v1/doctors/**").hasAnyRole("HOSPITAL_ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/doctors/**").hasAnyRole("HOSPITAL_ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/doctors/**").hasAnyRole("HOSPITAL_ADMIN", "SUPER_ADMIN")
                        
                        // Admin access to patients, appointments, and invoices
                        .requestMatchers("/api/v1/patients/**").hasAnyRole("RECEPTIONIST", "DOCTOR", "NURSE", "HOSPITAL_ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/appointments/**").hasAnyRole("RECEPTIONIST", "DOCTOR", "NURSE", "HOSPITAL_ADMIN", "SUPER_ADMIN", "PATIENT")
                        .requestMatchers("/api/v1/invoices/**").hasAnyRole("RECEPTIONIST", "HOSPITAL_ADMIN", "SUPER_ADMIN")
                        
                        // Prescriptions endpoint
                        .requestMatchers("/api/v1/prescriptions/**").hasAnyRole("DOCTOR", "NURSE", "HOSPITAL_ADMIN", "SUPER_ADMIN")
                        
                        // Swagger/OpenAPI
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                        
                        // Health checks
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        
                        // WebSocket
                        .requestMatchers("/ws/**").permitAll()
                        
                        // H2 Console (dev only)
                        .requestMatchers("/h2-console/**").permitAll()
                        
                        // Static resources
                        .requestMatchers("/", "/index.html", "/favicon.ico", "/static/**").permitAll()
                        
                        // Patient endpoints
                        .requestMatchers("/api/v1/patients/me/**").hasAnyRole("PATIENT", "FAMILY_MEMBER")
                        
                        // Doctor endpoints
                        .requestMatchers("/api/v1/doctor/**").hasAnyRole("DOCTOR", "SPECIALIST", "CONSULTANT")
                        
                        // Nurse endpoints
                        .requestMatchers("/api/v1/nurse/**").hasAnyRole("NURSE", "NURSE_HEAD")
                        
                        // Lab endpoints
                        .requestMatchers("/api/v1/lab/**").hasAnyRole("LAB_TECHNICIAN", "LAB_HEAD")
                        
                        // Pharmacy endpoints
                        .requestMatchers("/api/v1/pharmacy/**").hasAnyRole("PHARMACIST", "PHARMACY_HEAD")
                        
                        // Admin endpoints
                        .requestMatchers("/api/v1/admin/**").hasAnyRole("HOSPITAL_ADMIN", "SUPER_ADMIN")
                        
                        // Super admin only
                        .requestMatchers("/api/v1/superadmin/**").hasRole("SUPER_ADMIN")
                        
                        // All other authenticated requests
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin()) // For H2 console
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization", "Content-Type", "X-Requested-With", "Accept", 
                "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers",
                "X-Hospital-Id", "X-Branch-Id", "Accept-Language"
        ));
        configuration.setExposedHeaders(Arrays.asList(
                "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials",
                "X-Total-Count", "X-Page-Number", "X-Page-Size"
        ));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
