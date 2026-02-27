@echo off
REM ============================================
REM Hospital Management System - Local Starter
REM Runs Backend (Spring Boot) + Frontend (Vite)
REM ============================================

setlocal enabledelayedexpansion

echo.
echo ============================================
echo    Hospital Management System
echo    Local Development Starter
echo ============================================
echo.

REM Check if Java is installed
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java is not installed or not in PATH
    echo Please install Java 17+ and try again
    pause
    exit /b 1
)

REM Check if Node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 18+ and try again
    pause
    exit /b 1
)

echo [OK] Java found
echo [OK] Node.js found
echo.

REM ============================================
REM Start Backend
REM ============================================
echo [1/2] Starting Backend (Spring Boot)...
echo      URL: http://localhost:8080
echo      API: http://localhost:8080/api/v1
echo      Swagger: http://localhost:8080/swagger-ui.html
echo.

cd backend

REM Check if Maven wrapper exists - using H2 in-memory database by default
if exist "mvnw.cmd" (
    start "HMS Backend" cmd /k "title HMS Backend - Spring Boot && color 0A && mvnw.cmd spring-boot:run -Dmaven.test.skip=true"
) else (
    REM Use global Maven
    start "HMS Backend" cmd /k "title HMS Backend - Spring Boot && color 0A && mvn spring-boot:run -Dmaven.test.skip=true"
)

cd ..

REM Wait for backend to initialize
echo Waiting for backend to start...
timeout /t 10 /nobreak >nul

REM ============================================
REM Start Frontend
REM ============================================
echo.
echo [2/2] Starting Frontend (Vite + React)...
echo      URL: http://localhost:3000
echo.

cd web-client

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Start Vite dev server
start "HMS Frontend" cmd /k "title HMS Frontend - React && color 0B && npm run dev"

cd ..

REM ============================================
REM Summary
REM ============================================
echo.
echo ============================================
echo    HMS is starting up!
echo ============================================
echo.
echo    Backend:  http://localhost:8080
echo    Frontend: http://localhost:3000
echo    Swagger:  http://localhost:8080/swagger-ui.html
echo.
echo    Two new terminal windows have been opened:
echo    - HMS Backend (Green)
echo    - HMS Frontend (Cyan)
echo.
echo    Press any key to open the application in browser...
pause >nul

REM Open browser
start "" "http://localhost:3000"

echo.
echo To stop the application, close the terminal windows.
echo.

endlocal
