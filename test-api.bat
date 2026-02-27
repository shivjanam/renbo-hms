@echo off
REM ============================================
REM Hospital Management System - API Test Runner
REM ============================================

echo.
echo ============================================
echo    HMS API Test Runner
echo ============================================
echo.

REM Check if PowerShell is available
where powershell >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PowerShell is not available
    pause
    exit /b 1
)

REM Run the PowerShell test script
powershell -ExecutionPolicy Bypass -File "%~dp0test-api.ps1"

echo.
pause
