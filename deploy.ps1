# ===========================================
# Hospital Management System
# Production Deployment Script (PowerShell)
# ===========================================

$ErrorActionPreference = "Stop"

# Colors
function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }

# Banner
Write-Host ""
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host "      Hospital Management System                  " -ForegroundColor Cyan
Write-Host "      Production Deployment                        " -ForegroundColor Cyan
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Info "Checking prerequisites..."

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Success "Docker found: $dockerVersion"
} catch {
    Write-Err "Docker is not installed. Please install Docker Desktop first."
    exit 1
}

# Check Docker Compose
try {
    $composeVersion = docker-compose --version
    Write-Success "Docker Compose found: $composeVersion"
} catch {
    Write-Err "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
}

# Check .env file
if (-not (Test-Path ".env")) {
    Write-Warn ".env file not found. Creating from .env.example..."
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Warn "Please update .env file with your configuration before deploying."
        exit 1
    } else {
        Write-Err ".env.example file not found. Cannot proceed."
        exit 1
    }
}

Write-Host ""
Write-Info "Starting deployment process..."

# Pull latest images
Write-Info "Pulling latest Docker images..."
docker-compose pull

# Build images
Write-Info "Building Docker images..."
docker-compose build --no-cache

# Create backup
Write-Info "Creating database backup..."
$backupFile = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
try {
    docker-compose exec -T db pg_dump -U hms_user hms_db | Out-File -FilePath $backupFile -Encoding utf8
    Write-Success "Backup created: $backupFile"
} catch {
    Write-Warn "Could not create backup (database might not be running)"
}

# Stop existing containers
Write-Info "Stopping existing containers..."
docker-compose down

# Start services
Write-Info "Starting services..."
docker-compose up -d

# Wait for services
Write-Info "Waiting for services to be ready..."
Start-Sleep -Seconds 30

# Health checks
Write-Info "Performing health checks..."

# Backend health check
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Success "Backend is healthy"
    }
} catch {
    Write-Err "Backend health check failed"
    docker-compose logs backend
    exit 1
}

# Frontend health check
try {
    $response = Invoke-WebRequest -Uri "http://localhost/health" -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Success "Frontend is healthy"
    }
} catch {
    Write-Err "Frontend health check failed"
    docker-compose logs frontend
    exit 1
}

# Database health check
try {
    docker-compose exec -T db pg_isready -U hms_user | Out-Null
    Write-Success "Database is healthy"
} catch {
    Write-Err "Database health check failed"
    exit 1
}

# Cleanup
Write-Info "Cleaning up old Docker images..."
docker system prune -af --volumes --filter "until=168h" | Out-Null

Write-Host ""
Write-Success "Deployment completed successfully!"
Write-Host ""
Write-Host "  +-------------------------------------------+" -ForegroundColor White
Write-Host "  |  Frontend:   http://localhost              |" -ForegroundColor White
Write-Host "  |  Backend:    http://localhost:8080        |" -ForegroundColor White
Write-Host "  |  Swagger:    http://localhost:8080/swagger-ui.html |" -ForegroundColor White
Write-Host "  +-------------------------------------------+" -ForegroundColor White
Write-Host ""
