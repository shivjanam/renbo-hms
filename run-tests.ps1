# ============================================
# Hospital Management System - Test Runner
# PowerShell version for Windows
# ============================================

param(
    [Parameter(Position=0)]
    [ValidateSet('all', 'backend', 'frontend', 'api', 'e2e')]
    [string]$TestType = 'all',
    
    [switch]$Coverage,
    [switch]$Verbose
)

$ErrorActionPreference = "Continue"

# Directories
$BackendDir = "backend"
$FrontendDir = "web-client"
$ApiTestDir = "tests\api"
$E2ETestDir = "tests\e2e"
$ReportsDir = "tests\reports"

# Create reports directory
if (-not (Test-Path $ReportsDir)) {
    New-Item -ItemType Directory -Path $ReportsDir | Out-Null
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   HMS Test Suite Runner" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Running: $TestType tests" -ForegroundColor Yellow
Write-Host ""

$startTime = Get-Date
$results = @{}

# ============================================
# Backend Tests (JUnit + Spring Boot Test)
# ============================================
if ($TestType -eq 'all' -or $TestType -eq 'backend') {
    Write-Host "[1/4] Running Backend Tests..." -ForegroundColor Green
    Write-Host "----------------------------------------"
    
    Push-Location $BackendDir
    try {
        # Run Maven tests
        $mavenArgs = "clean", "test", "-Dspring.profiles.active=test"
        if ($Coverage) {
            $mavenArgs += "-Djacoco.skip=false"
        }
        
        & mvn @mavenArgs
        $results['backend'] = $LASTEXITCODE -eq 0
        
        # Copy reports
        if (Test-Path "target\surefire-reports") {
            $destDir = "..\$ReportsDir\backend"
            if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }
            Copy-Item "target\surefire-reports\*.xml" $destDir -Force -ErrorAction SilentlyContinue
        }
        
        if ($Coverage -and (Test-Path "target\site\jacoco")) {
            $destDir = "..\$ReportsDir\coverage"
            if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }
            Copy-Item "target\site\jacoco\*" $destDir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    finally {
        Pop-Location
    }
    Write-Host "Backend tests completed." -ForegroundColor Green
    Write-Host ""
}

# ============================================
# Frontend Tests (Vitest)
# ============================================
if ($TestType -eq 'all' -or $TestType -eq 'frontend') {
    Write-Host "[2/4] Running Frontend Tests..." -ForegroundColor Green
    Write-Host "----------------------------------------"
    
    Push-Location $FrontendDir
    try {
        # Install dependencies if needed
        if (-not (Test-Path "node_modules")) {
            Write-Host "Installing dependencies..."
            npm install
        }
        
        # Install test dependencies
        npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom 2>$null
        
        # Run tests
        if ($Coverage) {
            npm run test:coverage 2>$null
            if ($LASTEXITCODE -ne 0) {
                npx vitest run --coverage
            }
        } else {
            npm run test 2>$null
            if ($LASTEXITCODE -ne 0) {
                npx vitest run
            }
        }
        $results['frontend'] = $LASTEXITCODE -eq 0
        
        # Copy reports
        if (Test-Path "coverage") {
            $destDir = "..\$ReportsDir\frontend-coverage"
            if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }
            Copy-Item "coverage\*" $destDir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    finally {
        Pop-Location
    }
    Write-Host "Frontend tests completed." -ForegroundColor Green
    Write-Host ""
}

# ============================================
# API Tests (Newman/Postman)
# ============================================
if ($TestType -eq 'all' -or $TestType -eq 'api') {
    Write-Host "[3/4] Running API Tests..." -ForegroundColor Green
    Write-Host "----------------------------------------"
    
    # Check if Newman is installed
    $newman = Get-Command newman -ErrorAction SilentlyContinue
    if (-not $newman) {
        Write-Host "Installing Newman..."
        npm install -g newman newman-reporter-htmlextra
    }
    
    # Run Postman collection
    $collectionPath = "$ApiTestDir\HMS_API_Tests.postman_collection.json"
    $envPath = "$ApiTestDir\HMS_Environment.postman_environment.json"
    
    if (Test-Path $collectionPath) {
        newman run $collectionPath `
            -e $envPath `
            --reporters cli,junit,htmlextra `
            --reporter-junit-export "$ReportsDir\api-tests.xml" `
            --reporter-htmlextra-export "$ReportsDir\api-report.html" `
            --timeout-request 10000
        
        $results['api'] = $LASTEXITCODE -eq 0
    } else {
        Write-Host "Postman collection not found: $collectionPath" -ForegroundColor Yellow
        $results['api'] = $false
    }
    Write-Host "API tests completed." -ForegroundColor Green
    Write-Host ""
}

# ============================================
# E2E Tests (Playwright)
# ============================================
if ($TestType -eq 'e2e') {
    Write-Host "[4/4] Running E2E Tests..." -ForegroundColor Green
    Write-Host "----------------------------------------"
    
    Push-Location $E2ETestDir
    try {
        # Install Playwright
        npm install -D @playwright/test 2>$null
        npx playwright install chromium
        
        # Run E2E tests
        npx playwright test --reporter=html
        $results['e2e'] = $LASTEXITCODE -eq 0
        
        # Copy reports
        if (Test-Path "playwright-report") {
            $destDir = "..\reports\e2e-report"
            if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }
            Copy-Item "playwright-report\*" $destDir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    finally {
        Pop-Location
    }
    Write-Host "E2E tests completed." -ForegroundColor Green
    Write-Host ""
}

# ============================================
# Summary
# ============================================
$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Test Execution Complete!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Duration: $($duration.ToString('mm\:ss'))" -ForegroundColor White
Write-Host ""
Write-Host "Results:" -ForegroundColor White

foreach ($key in $results.Keys) {
    $status = if ($results[$key]) { "PASS" } else { "FAIL" }
    $color = if ($results[$key]) { "Green" } else { "Red" }
    Write-Host "  $key`: $status" -ForegroundColor $color
}

Write-Host ""
Write-Host "Reports generated in: $ReportsDir" -ForegroundColor Yellow
Write-Host ""

# List report files
if (Test-Path $ReportsDir) {
    Get-ChildItem $ReportsDir -Recurse -Include *.xml, *.html | ForEach-Object {
        Write-Host "  - $($_.Name)" -ForegroundColor Gray
    }
}

# Return exit code
$failedTests = $results.Values | Where-Object { $_ -eq $false }
if ($failedTests) {
    exit 1
}
exit 0
