# ============================================
# Hospital Management System - Stop Services
# ============================================

Write-Host ""
Write-Host "  Stopping Hospital Management System..." -ForegroundColor Yellow
Write-Host ""

# Stop processes on port 8080 (Backend)
Write-Host "  [1/2] Stopping Backend (port 8080)..." -ForegroundColor Cyan
$port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($port8080) {
    $procs = $port8080 | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($proc in $procs) {
        try {
            $processName = (Get-Process -Id $proc -ErrorAction SilentlyContinue).ProcessName
            Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
            Write-Host "       Stopped $processName (PID: $proc)" -ForegroundColor Gray
        } catch {}
    }
    Write-Host "       Backend stopped" -ForegroundColor Green
} else {
    Write-Host "       Backend was not running" -ForegroundColor Gray
}

# Stop processes on port 3000 (Frontend)
Write-Host "  [2/2] Stopping Frontend (port 3000)..." -ForegroundColor Cyan
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    $procs = $port3000 | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($proc in $procs) {
        try {
            $processName = (Get-Process -Id $proc -ErrorAction SilentlyContinue).ProcessName
            Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
            Write-Host "       Stopped $processName (PID: $proc)" -ForegroundColor Gray
        } catch {}
    }
    Write-Host "       Frontend stopped" -ForegroundColor Green
} else {
    Write-Host "       Frontend was not running" -ForegroundColor Gray
}

# Kill any remaining node/java processes that might be orphaned
Write-Host ""
Write-Host "  Cleaning up orphaned processes..." -ForegroundColor Cyan

# Find and kill node processes with vite in command line
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.MainWindowTitle -like "*HMS*" -or $_.MainWindowTitle -like "*vite*"
} | ForEach-Object {
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    Write-Host "       Stopped node (PID: $($_.Id))" -ForegroundColor Gray
}

Write-Host ""
Write-Host "  [OK] All HMS services stopped" -ForegroundColor Green
Write-Host ""
