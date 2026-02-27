# ===========================================
# CMS to HMS Environment Variables Converter
# ===========================================
# Converts College Management System .env to Hospital Management System .env

param(
    [Parameter(Mandatory=$true)]
    [string]$CmsEnvFile,
    
    [Parameter(Mandatory=$false)]
    [string]$OutputFile = ".env"
)

$ErrorActionPreference = "Stop"

function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }

Write-Host ""
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host "      CMS to HMS Environment Converter            " -ForegroundColor Cyan
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host ""

# Check if CMS file exists
if (-not (Test-Path $CmsEnvFile)) {
    Write-Err "CMS environment file not found: $CmsEnvFile"
    exit 1
}

Write-Info "Reading CMS environment file: $CmsEnvFile"

# Read CMS .env file
$cmsEnv = @{}
Get-Content $CmsEnvFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line -match '^([^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $cmsEnv[$key] = $value
    }
}

Write-Success "Found $($cmsEnv.Count) environment variables"

# Mapping rules: CMS Variable -> HMS Variable
$mappings = @{
    # Database
    "DB_HOST" = { param($val) "DATABASE_URL=jdbc:postgresql://$val:5432/hms_db" }
    "DB_NAME" = { param($val) "# DB_NAME mapped to DATABASE_URL" }
    "DB_USER" = { param($val) "DB_USERNAME=$val" }
    "DB_USERNAME" = { param($val) "DB_USERNAME=$val" }
    "DB_PASSWORD" = { param($val) "DB_PASSWORD=$val" }
    "DATABASE_URL" = { param($val) "DATABASE_URL=$val" }
    
    # Security
    "JWT_SECRET" = { param($val) "JWT_SECRET=$val" }
    "SECRET_KEY" = { param($val) "JWT_SECRET=$val" }
    "ENCRYPTION_KEY" = { param($val) "ENCRYPTION_KEY=$val" }
    
    # URLs
    "FRONTEND_URL" = { param($val) "FRONTEND_URL=$val" }
    "BACKEND_URL" = { param($val) "VITE_API_URL=$val" }
    "API_BASE_URL" = { param($val) "VITE_API_URL=$val" }
    "APP_URL" = { param($val) "APP_BASE_URL=$val" }
    "BASE_URL" = { param($val) "APP_BASE_URL=$val" }
    
    # Email
    "EMAIL_HOST" = { param($val) "MAIL_HOST=$val" }
    "EMAIL_PORT" = { param($val) "MAIL_PORT=$val" }
    "EMAIL_USER" = { param($val) "MAIL_USERNAME=$val" }
    "EMAIL_USERNAME" = { param($val) "MAIL_USERNAME=$val" }
    "EMAIL_PASSWORD" = { param($val) "MAIL_PASSWORD=$val" }
    "EMAIL_FROM" = { param($val) "RESEND_FROM_EMAIL=$val" }
    "RESEND_API_KEY" = { param($val) "RESEND_API_KEY=$val" }
    
    # SMS
    "SMS_API_KEY" = { param($val) "FAST2SMS_API_KEY=$val" }
    "FAST2SMS_API_KEY" = { param($val) "FAST2SMS_API_KEY=$val" }
    "SMS_PROVIDER" = { param($val) "SMS_PROVIDER=$val" }
    
    # Payment
    "RAZORPAY_KEY_ID" = { param($val) "RAZORPAY_KEY_ID=$val" }
    "RAZORPAY_KEY_SECRET" = { param($val) "RAZORPAY_KEY_SECRET=$val" }
    "RAZORPAY_WEBHOOK_SECRET" = { param($val) "RAZORPAY_WEBHOOK_SECRET=$val" }
    "PAYMENT_GATEWAY" = { param($val) if ($val -eq "razorpay") { "RAZORPAY_ENABLED=true" } else { "RAZORPAY_ENABLED=false" } }
    
    # Institution
    "COLLEGE_NAME" = { param($val) "HOSPITAL_NAME=$val" }
    "COLLEGE_CODE" = { param($val) "HOSPITAL_CODE=$val" }
    "COLLEGE_ADDRESS" = { param($val) "HOSPITAL_ADDRESS=$val" }
    "COLLEGE_PHONE" = { param($val) "HOSPITAL_PHONE=$val" }
    "COLLEGE_EMAIL" = { param($val) "HOSPITAL_EMAIL=$val" }
    "GSTIN" = { param($val) "HOSPITAL_GSTIN=$val" }
    "INSTITUTION_NAME" = { param($val) "HOSPITAL_NAME=$val" }
    "INSTITUTION_CODE" = { param($val) "HOSPITAL_CODE=$val" }
}

# Build HMS environment file
$hmsEnv = @()
$hmsEnv += "# ==========================================="
$hmsEnv += "# Hospital Management System"
$hmsEnv += "# Environment Variables (Converted from CMS)"
$hmsEnv += "# ==========================================="
$hmsEnv += "# Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$hmsEnv += ""

# Process mappings
$processedKeys = @()
foreach ($key in $cmsEnv.Keys) {
    $value = $cmsEnv[$key]
    
    if ($mappings.ContainsKey($key)) {
        $result = & $mappings[$key] $value
        if ($result -and -not $result.StartsWith("#")) {
            $hmsEnv += $result
            $processedKeys += $key
        }
    }
}

# Handle DATABASE_URL construction if we have DB_HOST, DB_NAME, DB_USER
if ($cmsEnv.ContainsKey("DB_HOST") -and -not $processedKeys.Contains("DB_HOST")) {
    $dbHost = $cmsEnv["DB_HOST"]
    $dbName = if ($cmsEnv.ContainsKey("DB_NAME")) { $cmsEnv["DB_NAME"] } else { "hms_db" }
    $dbPort = if ($cmsEnv.ContainsKey("DB_PORT")) { $cmsEnv["DB_PORT"] } else { "5432" }
    $hmsEnv += "DATABASE_URL=jdbc:postgresql://${dbHost}:${dbPort}/${dbName}"
}

# Add HMS-specific defaults if not present
$hmsDefaults = @{
    "VITE_APP_NAME" = "Hospital Management System"
    "EMAIL_PREFER_RESEND" = "true"
    "SMS_PROVIDER" = "fast2sms"
    "OTP_EXPIRY_MINUTES" = "10"
    "OTP_COOLDOWN_SECONDS" = "60"
    "OTP_MAX_DAILY_LIMIT" = "10"
}

foreach ($key in $hmsDefaults.Keys) {
    $found = $false
    foreach ($line in $hmsEnv) {
        if ($line -match "^$key=") {
            $found = $true
            break
        }
    }
    if (-not $found) {
        $hmsEnv += "$key=$($hmsDefaults[$key])"
    }
}

# Add unprocessed variables as comments
$unprocessed = $cmsEnv.Keys | Where-Object { -not $processedKeys.Contains($_) }
if ($unprocessed.Count -gt 0) {
    $hmsEnv += ""
    $hmsEnv += "# Unprocessed CMS variables (review manually):"
    foreach ($key in $unprocessed) {
        $hmsEnv += "# $key=$($cmsEnv[$key])"
    }
}

# Write output file
Write-Info "Writing HMS environment file: $OutputFile"
$hmsEnv | Out-File -FilePath $OutputFile -Encoding utf8

Write-Success "Conversion completed!"
Write-Info "Processed: $($processedKeys.Count) variables"
if ($unprocessed.Count -gt 0) {
    Write-Warn "Unprocessed: $($unprocessed.Count) variables (see comments in output file)"
}
Write-Host ""
Write-Info "Please review $OutputFile and update:"
Write-Info "  - Replace 'College' with 'Hospital' in names"
Write-Info "  - Update email domains"
Write-Info "  - Verify database URL format"
Write-Info "  - Add any missing HMS-specific variables"
Write-Host ""
