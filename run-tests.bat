@echo off
REM ============================================
REM Hospital Management System - Test Runner
REM Runs all tests: Backend, Frontend, API, E2E
REM ============================================

setlocal enabledelayedexpansion

echo.
echo ============================================
echo    HMS Test Suite Runner
echo ============================================
echo.

set BACKEND_DIR=backend
set FRONTEND_DIR=web-client
set API_TEST_DIR=tests\api
set E2E_TEST_DIR=tests\e2e
set REPORTS_DIR=tests\reports

REM Create reports directory
if not exist "%REPORTS_DIR%" mkdir "%REPORTS_DIR%"

REM Parse arguments
set RUN_ALL=false
set RUN_BACKEND=false
set RUN_FRONTEND=false
set RUN_API=false
set RUN_E2E=false

if "%1"=="" set RUN_ALL=true
if "%1"=="all" set RUN_ALL=true
if "%1"=="backend" set RUN_BACKEND=true
if "%1"=="frontend" set RUN_FRONTEND=true
if "%1"=="api" set RUN_API=true
if "%1"=="e2e" set RUN_E2E=true

if "%RUN_ALL%"=="true" (
    set RUN_BACKEND=true
    set RUN_FRONTEND=true
    set RUN_API=true
)

REM ============================================
REM Backend Tests (JUnit + Spring Boot Test)
REM ============================================
if "%RUN_BACKEND%"=="true" (
    echo.
    echo [1/4] Running Backend Tests...
    echo ----------------------------------------
    cd %BACKEND_DIR%
    
    REM Run Maven tests with coverage
    call mvn clean test -Dspring.profiles.active=test -DskipITs=false
    
    REM Copy reports
    if exist "target\surefire-reports" (
        xcopy /Y /Q "target\surefire-reports\*.xml" "..\%REPORTS_DIR%\backend\" 2>nul
    )
    if exist "target\site\jacoco" (
        xcopy /Y /Q /S "target\site\jacoco\*" "..\%REPORTS_DIR%\coverage\" 2>nul
    )
    
    cd ..
    echo Backend tests completed.
)

REM ============================================
REM Frontend Tests (Vitest)
REM ============================================
if "%RUN_FRONTEND%"=="true" (
    echo.
    echo [2/4] Running Frontend Tests...
    echo ----------------------------------------
    cd %FRONTEND_DIR%
    
    REM Install dependencies if needed
    if not exist "node_modules" (
        echo Installing dependencies...
        call npm install
    )
    
    REM Install test dependencies
    call npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom 2>nul
    
    REM Run tests with coverage
    call npm run test:coverage 2>nul || call npx vitest run --coverage
    
    REM Copy reports
    if exist "coverage" (
        xcopy /Y /Q /S "coverage\*" "..\%REPORTS_DIR%\frontend-coverage\" 2>nul
    )
    if exist "test-results" (
        xcopy /Y /Q "test-results\*.xml" "..\%REPORTS_DIR%\frontend\" 2>nul
    )
    
    cd ..
    echo Frontend tests completed.
)

REM ============================================
REM API Tests (Newman/Postman)
REM ============================================
if "%RUN_API%"=="true" (
    echo.
    echo [3/4] Running API Tests...
    echo ----------------------------------------
    
    REM Check if Newman is installed
    where newman >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo Installing Newman...
        call npm install -g newman newman-reporter-htmlextra
    )
    
    REM Run Postman collection
    newman run "%API_TEST_DIR%\HMS_API_Tests.postman_collection.json" ^
        -e "%API_TEST_DIR%\HMS_Environment.postman_environment.json" ^
        --reporters cli,junit,htmlextra ^
        --reporter-junit-export "%REPORTS_DIR%\api-tests.xml" ^
        --reporter-htmlextra-export "%REPORTS_DIR%\api-report.html" ^
        --timeout-request 10000
    
    echo API tests completed.
)

REM ============================================
REM E2E Tests (Playwright)
REM ============================================
if "%RUN_E2E%"=="true" (
    echo.
    echo [4/4] Running E2E Tests...
    echo ----------------------------------------
    cd %E2E_TEST_DIR%
    
    REM Install Playwright
    call npm install -D @playwright/test 2>nul
    call npx playwright install chromium
    
    REM Run E2E tests
    call npx playwright test --reporter=html
    
    REM Copy reports
    if exist "playwright-report" (
        xcopy /Y /Q /S "playwright-report\*" "..\reports\e2e-report\" 2>nul
    )
    
    cd ..\..
    echo E2E tests completed.
)

REM ============================================
REM Summary
REM ============================================
echo.
echo ============================================
echo    Test Execution Complete!
echo ============================================
echo.
echo Reports generated in: %REPORTS_DIR%
echo.
echo Report files:
dir /B "%REPORTS_DIR%\*.xml" 2>nul
dir /B "%REPORTS_DIR%\*.html" 2>nul
echo.

endlocal
