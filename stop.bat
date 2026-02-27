@echo off
:: ============================================
:: Hospital Management System - Stop Services
:: ============================================

title HMS - Stopping Services

powershell -ExecutionPolicy Bypass -File "%~dp0stop.ps1"

pause
