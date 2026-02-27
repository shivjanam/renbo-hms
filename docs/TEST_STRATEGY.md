# Hospital Management System - Test Strategy

## 1. Overview

This document outlines the comprehensive testing strategy for the Hospital Management System (HMS), ensuring 100% functional coverage across all modules.

## 2. Testing Scope

### 2.1 Modules Under Test

| Module | Backend API | Frontend UI | E2E Flow |
|--------|------------|-------------|----------|
| Authentication (OTP/Password) | ✓ | ✓ | ✓ |
| Patient Registration | ✓ | ✓ | ✓ |
| Appointment Booking | ✓ | ✓ | ✓ |
| Doctor Portal | ✓ | ✓ | ✓ |
| Prescription | ✓ | ✓ | ✓ |
| Lab Module | ✓ | ✓ | ✓ |
| Pharmacy | ✓ | ✓ | ✓ |
| Billing & Payments | ✓ | ✓ | ✓ |
| Hospital Admin | ✓ | ✓ | ✓ |
| Reports | ✓ | ✓ | ✓ |

### 2.2 Test Types

1. **Unit Tests** - Individual component testing
2. **Integration Tests** - API & database integration
3. **API Tests** - REST endpoint validation
4. **UI Tests** - Frontend component testing
5. **E2E Tests** - Complete user journey validation
6. **Performance Tests** - Load and response time testing
7. **Security Tests** - Authentication, authorization, injection

## 3. Test Environment

### 3.1 Local Setup

```
Backend:  localhost:8080
Frontend: localhost:3000
Database: MySQL/PostgreSQL (local)
Redis:    localhost:6379 (optional)
```

### 3.2 Test Database

- Separate test database: `hms_test`
- Auto-reset before each test run
- Seeded with sample Indian data

## 4. Sample Data Requirements

### 4.1 Hospitals & Branches
- 2 Hospitals
- 3 Branches per hospital

### 4.2 Staff
- 10 Doctors (various specializations)
- 5 Nurses
- 3 Lab Technicians
- 2 Pharmacists
- 2 Admin Users

### 4.3 Patients
- 50 Patients with Indian names
- Family-based records (1 mobile → multiple patients)
- Valid Indian phone numbers (starting with 6-9)

### 4.4 Inventory
- 100 Medicines (generic + branded)
- Various expiry dates
- Realistic stock levels

## 5. Test Categories

### 5.1 Authentication Tests

| Test Case | Type | Priority |
|-----------|------|----------|
| OTP send success | API | P0 |
| OTP verify success | API | P0 |
| Invalid OTP rejection | API | P0 |
| OTP expiry handling | API | P1 |
| OTP rate limiting | API | P1 |
| Password login success | API | P0 |
| Invalid credentials rejection | API | P0 |
| Role-based access validation | API | P0 |
| Token refresh | API | P1 |
| Session expiry | API | P1 |

### 5.2 Appointment Tests

| Test Case | Type | Priority |
|-----------|------|----------|
| Book appointment success | API/UI | P0 |
| Slot unavailable handling | API | P0 |
| Double booking prevention | API | P0 |
| Reschedule appointment | API | P1 |
| Cancel appointment | API | P1 |
| Doctor unavailable | API | P1 |
| Queue/Token generation | API | P0 |
| Walk-in registration | API | P1 |

### 5.3 Payment Tests

| Test Case | Type | Priority |
|-----------|------|----------|
| UPI payment success | API | P0 |
| Payment failure handling | API | P0 |
| Timeout handling | API | P0 |
| Duplicate payment prevention | API | P0 |
| Refund processing | API | P1 |
| Receipt generation | API | P0 |
| Partial payment | API | P1 |
| GST calculation | API | P0 |

### 5.4 Doctor API Tests

| Test Case | Type | Priority |
|-----------|------|----------|
| View assigned patients | API | P0 |
| Submit prescription | API | P0 |
| Invalid medicine handling | API | P1 |
| Lab test ordering | API | P0 |
| Patient history access | API | P1 |
| Follow-up scheduling | API | P1 |

### 5.5 Lab Tests

| Test Case | Type | Priority |
|-----------|------|----------|
| Order lab test | API | P0 |
| Upload report (PDF) | API | P0 |
| Invalid file format rejection | API | P1 |
| Unauthorized access prevention | API | P0 |
| Report verification workflow | API | P1 |

### 5.6 Pharmacy Tests

| Test Case | Type | Priority |
|-----------|------|----------|
| Dispense medicine | API | P0 |
| Out of stock handling | API | P0 |
| Expired medicine prevention | API | P0 |
| Stock update | API | P0 |
| Low stock alerts | API | P1 |

### 5.7 Admin Tests

| Test Case | Type | Priority |
|-----------|------|----------|
| Staff creation | API | P0 |
| Duplicate handling | API | P1 |
| Role changes | API | P1 |
| Soft delete | API | P1 |
| Hospital configuration | API | P1 |

## 6. E2E Critical Flows

### Flow 1: Patient Journey
```
Patient Registers → Books Appointment → Pays → Receives Receipt → Views Queue
```

### Flow 2: Consultation Flow
```
Doctor Consults → Creates Prescription → Orders Lab Test → Schedules Follow-up
```

### Flow 3: Lab Flow
```
Sample Collection → Test Processing → Report Upload → Verification → Patient Access
```

### Flow 4: Pharmacy Flow
```
Prescription Received → Medicine Dispensed → Stock Updated → Bill Generated
```

### Flow 5: Admin Flow
```
Admin Login → Views Dashboard → Generates Reports → Downloads PDF
```

## 7. Edge Cases & Failure Scenarios

- Server down scenarios
- Database connection failure
- Partial data save
- Network interruption during payment
- Concurrent appointment booking
- Duplicate API requests (idempotency)
- Large payload handling
- SQL/XSS injection attempts
- Session expiry during operation
- Invalid file uploads
- Maximum file size exceeded

## 8. Performance Criteria

| Metric | Target |
|--------|--------|
| API Response Time | < 300ms |
| Page Load Time | < 2 seconds |
| Concurrent Users | 100+ |
| Database Query Time | < 100ms |
| File Upload (10MB) | < 5 seconds |

## 9. Test Automation Stack

### Backend
- **Framework**: JUnit 5 + Spring Boot Test
- **Mocking**: Mockito
- **API Testing**: MockMvc + RestAssured
- **Coverage**: JaCoCo

### Frontend
- **Framework**: Vitest + React Testing Library
- **E2E**: Playwright
- **Coverage**: Istanbul

### API Testing
- **Tool**: Postman/Newman
- **Collection**: HMS_API_Tests.postman_collection.json

## 10. Test Execution

### Daily
- All unit tests
- Critical API tests
- Smoke tests

### Pre-Release
- Full test suite
- Performance tests
- Security scan

### Commands

```bash
# Backend tests
cd backend && mvn test

# Frontend tests
cd web-client && npm test

# API tests
newman run tests/api/HMS_API_Tests.postman_collection.json

# E2E tests
cd web-client && npm run test:e2e
```

## 11. Reporting

- JUnit XML reports
- JaCoCo coverage HTML
- Postman HTML reports
- Playwright trace files

## 12. Quality Gates

- Unit test coverage: > 80%
- All P0 tests: PASS
- No critical security issues
- API response time: < 300ms
- Zero regression in E2E flows
