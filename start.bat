@echo off
:: ============================================
:: Hospital Management System - Quick Start
:: Double-click this file to start both services
:: ============================================

title HMS - Hospital Management System

:: Run PowerShell script with execution policy bypass
powershell -ExecutionPolicy Bypass -File "%~dp0start.ps1"

pause
