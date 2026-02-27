@echo off
REM ============================================
REM Hospital Management System - Stop Local
REM Stops Backend and Frontend processes
REM ============================================

echo.
echo Stopping HMS services...
echo.

REM Kill Java processes (Spring Boot)
echo Stopping Backend (Java)...
taskkill /F /FI "WINDOWTITLE eq HMS Backend*" 2>nul
for /f "tokens=1" %%i in ('jps -l ^| findstr "spring-boot"') do taskkill /F /PID %%i 2>nul

REM Kill Node processes (Vite)
echo Stopping Frontend (Node)...
taskkill /F /FI "WINDOWTITLE eq HMS Frontend*" 2>nul
for /f "tokens=1" %%i in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    set line=%%i
)

echo.
echo HMS services stopped.
echo.
pause
