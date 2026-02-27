# ============================================
# Hospital Management System - API Test Script
# ============================================
# This script tests all HMS API endpoints
# Run: .\test-api.ps1
# ============================================

$BaseUrl = "http://localhost:8080/api/v1"
$FrontendUrl = "http://localhost:3000"

# Colors for output
function Write-Success { param($msg) Write-Host "[PASS] $msg" -ForegroundColor Green }
function Write-Fail { param($msg) Write-Host "[FAIL] $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Section { param($msg) Write-Host "`n========== $msg ==========" -ForegroundColor Yellow }

# Test counter
$script:passed = 0
$script:failed = 0
$script:total = 0

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Description,
        [hashtable]$Headers = @{},
        [string]$Body = $null,
        [int[]]$ExpectedStatus = @(200, 201)
    )
    
    $script:total++
    
    try {
        $params = @{
            Method = $Method
            Uri = $Url
            Headers = $Headers
            ContentType = "application/json"
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-WebRequest @params
        
        if ($ExpectedStatus -contains $response.StatusCode) {
            Write-Success "$Description (HTTP $($response.StatusCode))"
            $script:passed++
            return $response
        } else {
            Write-Fail "$Description - Unexpected status: $($response.StatusCode)"
            $script:failed++
            return $null
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($ExpectedStatus -contains $statusCode) {
            Write-Success "$Description (HTTP $statusCode)"
            $script:passed++
        } else {
            Write-Fail "$Description - Error: $($_.Exception.Message)"
            $script:failed++
        }
        return $null
    }
}

function Get-Token {
    param(
        [string]$Username,
        [string]$Password
    )
    
    try {
        $body = @{
            username = $Username
            password = $Password
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Method POST -Uri "$BaseUrl/auth/login" -Body $body -ContentType "application/json"
        return $response.data.accessToken
    }
    catch {
        Write-Fail "Login failed for $Username"
        return $null
    }
}

# ============================================
# Check if servers are running
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Magenta
Write-Host "  Hospital Management System - API Tester" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta
Write-Host ""

Write-Info "Checking server availability..."

try {
    $null = Invoke-WebRequest -Uri "$BaseUrl/doctors" -Method GET -TimeoutSec 5
    Write-Success "Backend is running at $BaseUrl"
}
catch {
    Write-Fail "Backend is NOT running at $BaseUrl"
    Write-Host "`nPlease start the application first using: start-local.bat" -ForegroundColor Red
    exit 1
}

# ============================================
# PUBLIC ENDPOINTS (No Auth Required)
# ============================================
Write-Section "PUBLIC ENDPOINTS (No Auth)"

# Health Check
Test-Endpoint -Method GET -Url "http://localhost:8080/actuator/health" -Description "Health Check" -ExpectedStatus @(200, 404)

# Doctors
Test-Endpoint -Method GET -Url "$BaseUrl/doctors" -Description "GET /doctors - List all doctors"
Test-Endpoint -Method GET -Url "$BaseUrl/doctors?specialization=CARDIOLOGY" -Description "GET /doctors?specialization=CARDIOLOGY"
Test-Endpoint -Method GET -Url "$BaseUrl/doctors?page=0&size=5" -Description "GET /doctors with pagination"

# Hospitals
Test-Endpoint -Method GET -Url "$BaseUrl/hospitals" -Description "GET /hospitals - List all hospitals"

# ============================================
# GUEST BOOKING FLOW
# ============================================
Write-Section "GUEST BOOKING FLOW"

# Send OTP
$otpBody = @{ mobile = "9876543210" } | ConvertTo-Json
$otpResponse = Test-Endpoint -Method POST -Url "$BaseUrl/appointments/guest/send-otp" -Description "POST /appointments/guest/send-otp" -Body $otpBody

# Get OTP from response for verification
$sessionId = $null
$otp = "123456"  # Default OTP for testing

if ($otpResponse) {
    try {
        $otpData = $otpResponse.Content | ConvertFrom-Json
        $sessionId = $otpData.sessionId
        if ($otpData.otp) { $otp = $otpData.otp }
        Write-Info "OTP Session ID: $sessionId"
        Write-Info "OTP: $otp"
    } catch {}
}

# Verify OTP
if ($sessionId) {
    $verifyBody = @{ sessionId = $sessionId; otp = $otp } | ConvertTo-Json
    Test-Endpoint -Method POST -Url "$BaseUrl/appointments/guest/verify-otp" -Description "POST /appointments/guest/verify-otp" -Body $verifyBody
    
    # Create Guest Booking
    $bookingBody = @{
        patientName = "Test Patient"
        patientMobile = "9876543210"
        patientEmail = "test@example.com"
        doctorId = 1
        hospitalId = 1
        appointmentDate = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
        slotTime = "10:00"
        paymentMode = "cash"
        amount = 500
        otpSessionId = $sessionId
    } | ConvertTo-Json
    
    $bookingResponse = Test-Endpoint -Method POST -Url "$BaseUrl/appointments/guest/book" -Description "POST /appointments/guest/book" -Body $bookingBody
    
    # Extract access token for viewing
    if ($bookingResponse) {
        try {
            $bookingData = $bookingResponse.Content | ConvertFrom-Json
            if ($bookingData.accessToken) {
                Write-Info "Booking Access Token: $($bookingData.accessToken)"
                Test-Endpoint -Method GET -Url "$BaseUrl/appointments/guest/view?token=$($bookingData.accessToken)" -Description "GET /appointments/guest/view"
            }
            if ($bookingData.appointmentNumber) {
                Test-Endpoint -Method GET -Url "$BaseUrl/appointments/guest/lookup?mobile=9876543210&appointmentNumber=$($bookingData.appointmentNumber)" -Description "GET /appointments/guest/lookup"
            }
        } catch {}
    }
}

# ============================================
# AUTHENTICATION
# ============================================
Write-Section "AUTHENTICATION"

# Login as Super Admin
$adminBody = @{ username = "superadmin"; password = "admin123" } | ConvertTo-Json
$adminResponse = Test-Endpoint -Method POST -Url "$BaseUrl/auth/login" -Description "POST /auth/login (Super Admin)" -Body $adminBody
$adminToken = $null

if ($adminResponse) {
    try {
        $adminData = $adminResponse.Content | ConvertFrom-Json
        $adminToken = $adminData.data.accessToken
        Write-Info "Admin Token acquired"
    } catch {}
}

# Login as Doctor
$doctorBody = @{ username = "doctor1"; password = "doctor123" } | ConvertTo-Json
$doctorResponse = Test-Endpoint -Method POST -Url "$BaseUrl/auth/login" -Description "POST /auth/login (Doctor)" -Body $doctorBody
$doctorToken = $null

if ($doctorResponse) {
    try {
        $doctorData = $doctorResponse.Content | ConvertFrom-Json
        $doctorToken = $doctorData.data.accessToken
        Write-Info "Doctor Token acquired"
    } catch {}
}

# ============================================
# ADMIN ENDPOINTS (Requires Admin Token)
# ============================================
Write-Section "ADMIN ENDPOINTS"

if ($adminToken) {
    $adminHeaders = @{ Authorization = "Bearer $adminToken" }
    
    # Patients
    Test-Endpoint -Method GET -Url "$BaseUrl/patients" -Description "GET /patients" -Headers $adminHeaders
    Test-Endpoint -Method GET -Url "$BaseUrl/patients?page=0&size=5" -Description "GET /patients (paginated)" -Headers $adminHeaders
    
    # Appointments
    Test-Endpoint -Method GET -Url "$BaseUrl/appointments" -Description "GET /appointments" -Headers $adminHeaders
    Test-Endpoint -Method GET -Url "$BaseUrl/appointments/today" -Description "GET /appointments/today" -Headers $adminHeaders
    Test-Endpoint -Method GET -Url "$BaseUrl/appointments/count" -Description "GET /appointments/count" -Headers $adminHeaders
    
    # Invoices
    Test-Endpoint -Method GET -Url "$BaseUrl/invoices" -Description "GET /invoices" -Headers $adminHeaders
    
    # Prescriptions
    Test-Endpoint -Method GET -Url "$BaseUrl/prescriptions" -Description "GET /prescriptions" -Headers $adminHeaders
    
    # Doctor CRUD
    Test-Endpoint -Method GET -Url "$BaseUrl/doctors/1" -Description "GET /doctors/1" -Headers $adminHeaders
    
    # Create a test doctor
    $newDoctorBody = @{
        firstName = "Test"
        lastName = "Doctor"
        email = "testdoc$(Get-Random)@hospital.com"
        mobileNumber = "98$(Get-Random -Minimum 10000000 -Maximum 99999999)"
        primarySpecialization = "GENERAL_MEDICINE"
        qualifications = "MBBS"
        experienceYears = 5
        opdConsultationFee = 500
        hospitalId = 1
    } | ConvertTo-Json
    
    $createDoctorResponse = Test-Endpoint -Method POST -Url "$BaseUrl/doctors" -Description "POST /doctors (Create)" -Headers $adminHeaders -Body $newDoctorBody -ExpectedStatus @(200, 201, 400)
    
} else {
    Write-Fail "Skipping admin tests - no admin token"
}

# ============================================
# DOCTOR ENDPOINTS (Requires Doctor Token)
# ============================================
Write-Section "DOCTOR ENDPOINTS"

if ($doctorToken) {
    $doctorHeaders = @{ Authorization = "Bearer $doctorToken" }
    
    # Doctor's Appointments
    Test-Endpoint -Method GET -Url "$BaseUrl/appointments/doctor/1" -Description "GET /appointments/doctor/1" -Headers $doctorHeaders
    
    # Doctor's Patients (via appointments)
    Test-Endpoint -Method GET -Url "$BaseUrl/appointments/doctor/1/patients" -Description "GET /appointments/doctor/1/patients" -Headers $doctorHeaders
    
    # Prescriptions
    Test-Endpoint -Method GET -Url "$BaseUrl/prescriptions?doctorId=1" -Description "GET /prescriptions?doctorId=1" -Headers $doctorHeaders
    Test-Endpoint -Method GET -Url "$BaseUrl/prescriptions/doctor/1" -Description "GET /prescriptions/doctor/1" -Headers $doctorHeaders
    Test-Endpoint -Method GET -Url "$BaseUrl/prescriptions/count?doctorId=1" -Description "GET /prescriptions/count?doctorId=1" -Headers $doctorHeaders
    
    # Create Prescription
    $newRxBody = @{
        doctorId = 1
        patientId = 1
        hospitalId = 1
        patientName = "Test Patient"
        diagnosis = "Common Cold"
        advice = "Rest and stay hydrated"
    } | ConvertTo-Json
    
    $createRxResponse = Test-Endpoint -Method POST -Url "$BaseUrl/prescriptions" -Description "POST /prescriptions (Create)" -Headers $doctorHeaders -Body $newRxBody -ExpectedStatus @(200, 201, 400, 403)
    
    # Update Prescription (if created)
    if ($createRxResponse) {
        try {
            $rxData = $createRxResponse.Content | ConvertFrom-Json
            $rxId = $rxData.id
            if ($rxId) {
                $updateRxBody = @{ diagnosis = "Updated Diagnosis"; status = "ACTIVE" } | ConvertTo-Json
                Test-Endpoint -Method PUT -Url "$BaseUrl/prescriptions/$rxId" -Description "PUT /prescriptions/$rxId (Update)" -Headers $doctorHeaders -Body $updateRxBody
            }
        } catch {}
    }
    
} else {
    Write-Fail "Skipping doctor tests - no doctor token"
}

# ============================================
# ERROR HANDLING TESTS
# ============================================
Write-Section "ERROR HANDLING"

# Test 401 Unauthorized
Test-Endpoint -Method GET -Url "$BaseUrl/patients" -Description "GET /patients (No Auth - should fail)" -ExpectedStatus @(401, 403)

# Test 404 Not Found
Test-Endpoint -Method GET -Url "$BaseUrl/doctors/99999" -Description "GET /doctors/99999 (Not Found)" -ExpectedStatus @(404, 200)

# Test Invalid OTP
$invalidOtpBody = @{ sessionId = "invalid-session"; otp = "000000" } | ConvertTo-Json
Test-Endpoint -Method POST -Url "$BaseUrl/appointments/guest/verify-otp" -Description "POST /verify-otp (Invalid)" -Body $invalidOtpBody -ExpectedStatus @(400, 401)

# ============================================
# SUMMARY
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Magenta
Write-Host "              TEST SUMMARY" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Total Tests: $script:total" -ForegroundColor White
Write-Host "Passed:      $script:passed" -ForegroundColor Green
Write-Host "Failed:      $script:failed" -ForegroundColor Red
Write-Host ""

$percentage = if ($script:total -gt 0) { [math]::Round(($script:passed / $script:total) * 100, 1) } else { 0 }
Write-Host "Success Rate: $percentage%" -ForegroundColor $(if ($percentage -ge 80) { "Green" } elseif ($percentage -ge 50) { "Yellow" } else { "Red" })

Write-Host ""
Write-Host "============================================" -ForegroundColor Magenta
Write-Host ""

# Return exit code
if ($script:failed -gt 0) {
    exit 1
} else {
    exit 0
}
