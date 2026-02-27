# ==========================================
# Hospital Management System - Startup Script
# ==========================================

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Hospital Management System - Startup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
$dockerRunning = docker info 2>$null
if (-not $?) {
    Write-Host "Error: Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

Write-Host "Starting application with Docker Compose..." -ForegroundColor Yellow
Write-Host ""

docker-compose up -d --build

if ($?) {
    Write-Host ""
    Write-Host "Application started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access the application:" -ForegroundColor Cyan
    Write-Host "  Frontend:    http://localhost" -ForegroundColor White
    Write-Host "  Backend API: http://localhost:8080" -ForegroundColor White
    Write-Host "  API Docs:    http://localhost:8080/swagger-ui.html" -ForegroundColor White
    Write-Host ""
    Write-Host "To view logs: docker-compose logs -f" -ForegroundColor Yellow
    Write-Host "To stop: docker-compose down" -ForegroundColor Yellow
} else {
    Write-Host "Failed to start the application." -ForegroundColor Red
}
