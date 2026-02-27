@echo off
echo ==========================================
echo Hospital Management System - Startup
echo ==========================================

echo.
echo Starting application with Docker...
echo.

docker-compose up -d --build

echo.
echo Application is starting...
echo.
echo Frontend: http://localhost
echo Backend API: http://localhost:8080
echo API Docs: http://localhost:8080/swagger-ui.html
echo.

pause
