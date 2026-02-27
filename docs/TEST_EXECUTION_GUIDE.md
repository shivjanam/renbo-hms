# Hospital Management System - Test Execution Guide

## Quick Start

### Run All Tests
```bash
# Windows Batch
.\run-tests.bat

# PowerShell
.\run-tests.ps1 -TestType all -Coverage
```

### Run Specific Test Suites
```bash
# Backend tests only
.\run-tests.ps1 -TestType backend

# Frontend tests only
.\run-tests.ps1 -TestType frontend

# API tests only
.\run-tests.ps1 -TestType api

# E2E tests only
.\run-tests.ps1 -TestType e2e
```

## Prerequisites

### Backend
- Java 17+
- Maven 3.8+
- MySQL/PostgreSQL (for integration tests)

### Frontend
- Node.js 18+
- npm 9+

### API Testing
- Newman (`npm install -g newman newman-reporter-htmlextra`)

### E2E Testing
- Playwright (`npx playwright install`)

## Local Environment Setup

### 1. Start Database
```bash
# Using Docker
docker run -d --name hms-db -p 5432:5432 \
  -e POSTGRES_DB=hms_test \
  -e POSTGRES_USER=hms \
  -e POSTGRES_PASSWORD=hms123 \
  postgres:15

# Or use H2 (in-memory) for tests
# No setup needed, configured in application-test.yml
```

### 2. Seed Test Data
```bash
# Connect to database and run seed scripts
cd demo-data
cat 0*.sql | mysql -u root -p hms_test
```

### 3. Start Backend
```bash
cd backend
mvn spring-boot:run -Dspring.profiles.active=dev
```

### 4. Start Frontend
```bash
cd web-client
npm install
npm run dev
```

## Test Types

### 1. Backend Unit Tests
Location: `backend/src/test/java/`

```bash
cd backend
mvn test
```

Key test files:
- `AuthServiceTest.java` - Authentication tests
- `PatientServiceTest.java` - Patient management tests
- `AppointmentServiceTest.java` - Appointment tests
- `PaymentServiceTest.java` - Payment & GST tests

### 2. Backend Integration Tests
Location: `backend/src/test/java/com/hospital/hms/integration/`

```bash
cd backend
mvn verify -DskipUTs=true
```

Uses MockMvc for API endpoint testing.

### 3. Frontend Unit Tests
Location: `web-client/src/__tests__/`

```bash
cd web-client
npm run test
npm run test:coverage
```

Key test files:
- `Login.test.jsx` - Login component tests
- `authStore.test.js` - Auth state management tests
- `api.test.js` - API service tests

### 4. API Tests (Postman)
Location: `tests/api/`

```bash
newman run tests/api/HMS_API_Tests.postman_collection.json \
  -e tests/api/HMS_Environment.postman_environment.json \
  --reporters cli,junit \
  --reporter-junit-export tests/reports/api-tests.xml
```

Collection includes:
- Authentication tests
- Patient management
- Appointment booking
- Payment processing
- Lab & Pharmacy
- Admin functions

### 5. E2E Tests (Playwright)
Location: `tests/e2e/specs/`

```bash
cd tests/e2e
npx playwright test
npx playwright test --ui  # Interactive mode
```

Test flows:
- `auth.spec.js` - Login/logout flows
- `patient-journey.spec.js` - Complete patient flow
- `doctor-flow.spec.js` - Doctor portal tests
- `admin-flow.spec.js` - Admin dashboard tests

## Test Reports

All reports are generated in `tests/reports/`:

| Report Type | Location | Format |
|------------|----------|--------|
| Backend Unit | `tests/reports/backend/` | JUnit XML |
| Coverage | `tests/reports/coverage/` | HTML/JaCoCo |
| Frontend | `tests/reports/frontend/` | JUnit XML |
| Frontend Coverage | `tests/reports/frontend-coverage/` | Istanbul HTML |
| API Tests | `tests/reports/api-report.html` | HTML |
| E2E Tests | `tests/reports/e2e-report/` | Playwright HTML |

## Test Data

### Test Credentials

| Role | Username/Mobile | Password |
|------|-----------------|----------|
| Super Admin | superadmin | password123 |
| Hospital Admin (CGH) | admin.cgh | password123 |
| Hospital Admin (ACH) | admin.ach | password123 |
| Doctor | dr.amit.kumar | password123 |
| Patient | 9876543210 | OTP-based |

### Sample Patient Data
- 50 patients with Indian names
- Family-based records
- Various medical conditions

### Sample Inventory
- 70+ medicines
- 50+ lab tests

## Coverage Requirements

| Category | Threshold |
|----------|-----------|
| Statements | 80% |
| Branches | 70% |
| Functions | 80% |
| Lines | 80% |

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          
      - name: Backend Tests
        run: |
          cd backend
          mvn test
          
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Frontend Tests
        run: |
          cd web-client
          npm ci
          npm run test:coverage
          
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
```

## Troubleshooting

### Backend Tests Fail
1. Check database connection in `application-test.yml`
2. Ensure H2 is configured for test profile
3. Run `mvn clean` before tests

### Frontend Tests Fail
1. Run `npm install` to update dependencies
2. Check `setupTests.js` for proper mocks
3. Clear `.vitest` cache

### API Tests Fail
1. Ensure backend is running on port 8080
2. Check environment variables in Postman environment
3. Verify authentication tokens

### E2E Tests Fail
1. Ensure frontend is running on port 3000
2. Run `npx playwright install` for browsers
3. Check network mocks in test files

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Reset state between tests
3. **Mocking**: Use mocks for external services
4. **Naming**: Use descriptive test names
5. **Coverage**: Aim for 80%+ coverage
6. **Speed**: Tests should complete in < 5 minutes
