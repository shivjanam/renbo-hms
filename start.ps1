# ============================================
# Hospital Management System - Unified Starter
# Runs Backend (Spring Boot) + Frontend (Vite)
# ============================================

param(
    [switch]$SkipBrowser,
    [switch]$BackendOnly,
    [switch]$FrontendOnly
)

$ErrorActionPreference = "Continue"
$Host.UI.RawUI.WindowTitle = "HMS - Hospital Management System"

# Colors
function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }

# Banner
Write-Host ""
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host "      Hospital Management System                  " -ForegroundColor Cyan
Write-Host "      Local Development Server                    " -ForegroundColor Cyan
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host ""

# Store PIDs for cleanup
$script:backendProcess = $null
$script:frontendProcess = $null
$script:projectRoot = $PSScriptRoot

# Cleanup function
function Stop-AllServices {
    Write-Host ""
    Write-Warn "Shutting down services..."
    
    # Kill backend (port 8080)
    $port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
    if ($port8080) {
        $procs = $port8080 | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($proc in $procs) {
            Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
        }
    }
    
    # Kill frontend (port 3000)
    $port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($port3000) {
        $procs = $port3000 | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($proc in $procs) {
            Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
        }
    }
    
    Write-Success "All services stopped."
}

# Check prerequisites
Write-Info "Checking prerequisites..."

# Check Java
$javaVersion = java -version 2>&1 | Select-String -Pattern 'version' | Select-Object -First 1
if ($LASTEXITCODE -ne 0) {
    Write-Err "Java is not installed or not in PATH"
    Write-Host "Please install Java 17+ and try again" -ForegroundColor Yellow
    exit 1
}
Write-Success "Java found"

# Check Node
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Err "Node.js is not installed or not in PATH"
    Write-Host "Please install Node.js 18+ and try again" -ForegroundColor Yellow
    exit 1
}
Write-Success "Node.js found: $nodeVersion"

Write-Host ""

# ============================================
# Start Backend
# ============================================
if (-not $FrontendOnly) {
    Write-Host "------------------------------------------------" -ForegroundColor DarkGray
    Write-Info "Starting Backend (Spring Boot)..."
    Write-Host "   API:     http://localhost:8080/api/v1" -ForegroundColor White
    Write-Host "   Swagger: http://localhost:8080/swagger-ui.html" -ForegroundColor White
    Write-Host "   H2 DB:   http://localhost:8080/h2-console" -ForegroundColor White
    Write-Host ""
    
    $backendDir = Join-Path $script:projectRoot "backend"
    
    # Check if port 8080 is already in use
    $port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
    if ($port8080) {
        Write-Warn "Port 8080 is already in use. Attempting to free it..."
        $procs = $port8080 | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($proc in $procs) {
            Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
    }
    
    # Start Spring Boot using cmd to avoid PowerShell parsing issues
    $script:backendProcess = Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/c", "cd /d `"$backendDir`" && .\mvnw.cmd spring-boot:run -DskipTests" `
        -PassThru `
        -WindowStyle Normal
    
    Write-Info "Backend starting (PID: $($script:backendProcess.Id))..."
    
    # Wait for backend to be ready
    Write-Info "Waiting for backend to initialize..."
    $maxWait = 90
    $waited = 0
    $backendReady = $false
    
    while ($waited -lt $maxWait) {
        Start-Sleep -Seconds 3
        $waited += 3
        
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                $backendReady = $true
                break
            }
        } catch {
            Write-Host "." -NoNewline
        }
    }
    
    Write-Host ""
    if ($backendReady) {
        Write-Success "Backend is ready!"
    } else {
        Write-Warn "Backend may still be starting. Continuing anyway..."
    }
}

# ============================================
# Start Frontend
# ============================================
if (-not $BackendOnly) {
    Write-Host ""
    Write-Host "------------------------------------------------" -ForegroundColor DarkGray
    Write-Info "Starting Frontend (Vite + React)..."
    Write-Host "   URL: http://localhost:3000" -ForegroundColor White
    Write-Host ""
    
    $frontendDir = Join-Path $script:projectRoot "web-client"
    
    # Check if port 3000 is already in use
    $port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($port3000) {
        Write-Warn "Port 3000 is already in use. Attempting to free it..."
        $procs = $port3000 | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($proc in $procs) {
            Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
    }
    
    # Install dependencies if needed
    $nodeModulesPath = Join-Path $frontendDir "node_modules"
    if (-not (Test-Path $nodeModulesPath)) {
        Write-Info "Installing frontend dependencies..."
        Push-Location $frontendDir
        npm install
        Pop-Location
    }
    
    # Start Vite using cmd
    $script:frontendProcess = Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/c", "cd /d `"$frontendDir`" && npm run dev" `
        -PassThru `
        -WindowStyle Normal
    
    Write-Info "Frontend starting (PID: $($script:frontendProcess.Id))..."
    
    # Wait for frontend to be ready
    Start-Sleep -Seconds 5
    Write-Success "Frontend is ready!"
}

# ============================================
# Summary
# ============================================
Write-Host ""
Write-Host "------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  [OK] Hospital Management System is running!" -ForegroundColor Green
Write-Host ""
Write-Host "  +-------------------------------------------+" -ForegroundColor White
Write-Host "  |  Frontend:   http://localhost:3000        |" -ForegroundColor White
Write-Host "  |  Backend:    http://localhost:8080        |" -ForegroundColor White
Write-Host "  |  Swagger:    http://localhost:8080/swagger-ui.html |" -ForegroundColor White
Write-Host "  |  H2 Console: http://localhost:8080/h2-console     |" -ForegroundColor White
Write-Host "  +-------------------------------------------+" -ForegroundColor White
Write-Host ""
Write-Host "  Two terminal windows have been opened." -ForegroundColor Yellow
Write-Host "  Close them or run stop.ps1 to stop services." -ForegroundColor Yellow
Write-Host ""

# Open browser
if (-not $SkipBrowser) {
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3000"
}

Write-Host "Press any key to exit this window..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
