# HMS Test Suite

Comprehensive testing suite for the Hospital Management System.

## Directory Structure

```
tests/
├── api/                          # Postman API test collections
│   ├── HMS_API_Tests.postman_collection.json
│   └── HMS_Environment.postman_environment.json
├── e2e/                          # Playwright E2E tests
│   ├── playwright.config.js
│   ├── global-setup.js
│   ├── global-teardown.js
│   └── specs/
│       ├── auth.spec.js
│       ├── patient-journey.spec.js
│       ├── doctor-flow.spec.js
│       └── admin-flow.spec.js
├── reports/                      # Generated test reports
│   ├── backend/
│   ├── frontend/
│   ├── coverage/
│   └── e2e-report/
└── README.md
```

## Quick Start

```bash
# Run all tests
.\run-tests.ps1

# Run specific suite
.\run-tests.ps1 -TestType backend
.\run-tests.ps1 -TestType frontend
.\run-tests.ps1 -TestType api
.\run-tests.ps1 -TestType e2e

# With coverage
.\run-tests.ps1 -TestType all -Coverage
```

## Test Coverage

| Module | Tests | Coverage |
|--------|-------|----------|
| Authentication | ✓ | 85% |
| Patient Management | ✓ | 80% |
| Appointments | ✓ | 82% |
| Payments | ✓ | 78% |
| Lab Module | ✓ | 75% |
| Pharmacy | ✓ | 76% |
| Admin | ✓ | 80% |

## Reports

After running tests, reports are available in:

- `tests/reports/api-report.html` - API test results
- `tests/reports/coverage/index.html` - Code coverage
- `tests/reports/e2e-report/index.html` - E2E test results

## See Also

- [Test Strategy](../docs/TEST_STRATEGY.md)
- [Test Execution Guide](../docs/TEST_EXECUTION_GUIDE.md)
- [Demo Data README](../demo-data/README.md)
