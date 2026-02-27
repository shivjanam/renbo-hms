@echo off
echo ==========================================
echo Hospital Management System - Shutdown
echo ==========================================

echo.
echo Stopping all containers...
echo.

docker-compose down

echo.
echo Application stopped.
echo.

pause
