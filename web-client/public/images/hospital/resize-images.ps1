# Image Resize Script for Hospital Showcase
# Resizes and crops images to a consistent banner size (1920x600)

Add-Type -AssemblyName System.Drawing

$targetWidth = 1920
$targetHeight = 600
$quality = 90

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$outputFolder = Join-Path $scriptPath "resized"

# Create output folder
if (-not (Test-Path $outputFolder)) {
    New-Item -ItemType Directory -Path $outputFolder | Out-Null
}

function Resize-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Width,
        [int]$Height
    )
    
    try {
        $image = [System.Drawing.Image]::FromFile($InputPath)
        
        # Calculate crop area (center-top crop to preserve faces)
        $sourceRatio = $image.Width / $image.Height
        $targetRatio = $Width / $Height
        
        $srcX = 0
        $srcY = 0
        $srcWidth = $image.Width
        $srcHeight = $image.Height
        
        if ($sourceRatio -gt $targetRatio) {
            # Image is wider - crop sides
            $srcWidth = [int]($image.Height * $targetRatio)
            $srcX = [int](($image.Width - $srcWidth) / 2)
        } else {
            # Image is taller - crop from bottom (keep top for faces)
            $srcHeight = [int]($image.Width / $targetRatio)
            $srcY = 0  # Start from top to keep faces visible
        }
        
        # Create new bitmap
        $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        $destRect = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)
        $srcRect = New-Object System.Drawing.Rectangle($srcX, $srcY, $srcWidth, $srcHeight)
        
        $graphics.DrawImage($image, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
        
        # Save as JPEG with quality
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)
        
        $bitmap.Save($OutputPath, $jpegCodec, $encoderParams)
        
        $graphics.Dispose()
        $bitmap.Dispose()
        $image.Dispose()
        
        Write-Host "Resized: $InputPath -> $OutputPath" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Error processing $InputPath : $_" -ForegroundColor Red
        return $false
    }
}

# Process all images
$images = @(
    "doctor_clinic_1.jpg",
    "doctor_clinic_2.jpg", 
    "doctor_icu.jpg",
    "clinic_banner.jpg"
)

Write-Host "`nResizing images to ${targetWidth}x${targetHeight}..." -ForegroundColor Cyan
Write-Host "Output folder: $outputFolder`n"

foreach ($img in $images) {
    $inputPath = Join-Path $scriptPath $img
    $outputPath = Join-Path $outputFolder $img
    
    if (Test-Path $inputPath) {
        Resize-Image -InputPath $inputPath -OutputPath $outputPath -Width $targetWidth -Height $targetHeight
    } else {
        Write-Host "Not found: $inputPath" -ForegroundColor Yellow
    }
}

Write-Host "`nDone! Resized images are in: $outputFolder" -ForegroundColor Cyan
Write-Host "Copy them back to replace originals if satisfied.`n"
