<#
  generate-icons.ps1
  Generates placeholder PWA icons for "Your Career System" using GDI+ (System.Drawing).
  Design: navy field (#1B3A5C) with three stacked yellow (#FFE599) rounded bars of
  descending width — a simple "system / checklist" mark. No proprietary assets.

  Run from the project root:  powershell -ExecutionPolicy Bypass -File scripts/generate-icons.ps1
#>

Add-Type -AssemblyName System.Drawing

$OutDir = Join-Path $PSScriptRoot "..\public"
$OutDir = [System.IO.Path]::GetFullPath($OutDir)
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Force -Path $OutDir | Out-Null }

$Navy   = [System.Drawing.ColorTranslator]::FromHtml("#1B3A5C")
$Yellow = [System.Drawing.ColorTranslator]::FromHtml("#FFE599")

function New-RoundedPath([single]$x, [single]$y, [single]$w, [single]$h, [single]$r) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-Icon([int]$size, [string]$file, [double]$pad, [bool]$roundField) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::Transparent)

  $navyBrush = New-Object System.Drawing.SolidBrush($Navy)
  if ($roundField) {
    $fieldR = $size * 0.22
    $fp = New-RoundedPath 0 0 $size $size $fieldR
    $g.FillPath($navyBrush, $fp)
    $fp.Dispose()
  } else {
    $g.FillRectangle($navyBrush, 0, 0, $size, $size)
  }

  # Safe-zone inset (pad is a fraction of the icon on each side)
  $inset = $size * $pad
  $inner = $size - (2 * $inset)

  $yellowBrush = New-Object System.Drawing.SolidBrush($Yellow)
  $barH = $inner * 0.165
  $gap  = $inner * 0.135
  $radius = $barH / 2
  $widths = @(1.0, 0.72, 0.44)
  $totalH = ($barH * 3) + ($gap * 2)
  $startY = $inset + (($inner - $totalH) / 2)

  for ($i = 0; $i -lt 3; $i++) {
    $w = $inner * $widths[$i]
    $x = $inset
    $y = $startY + ($i * ($barH + $gap))
    $bp = New-RoundedPath $x $y $w $barH $radius
    $g.FillPath($yellowBrush, $bp)
    $bp.Dispose()
  }

  $navyBrush.Dispose(); $yellowBrush.Dispose(); $g.Dispose()
  $target = Join-Path $OutDir $file
  $bmp.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "  wrote $target"
}

Write-Host "Generating icons into $OutDir"
New-Icon 64   "pwa-64x64.png"              0.16 $false
New-Icon 192  "pwa-192x192.png"            0.16 $false
New-Icon 512  "pwa-512x512.png"            0.16 $false
New-Icon 512  "maskable-icon-512x512.png"  0.28 $false
New-Icon 180  "apple-touch-icon.png"       0.16 $false
New-Icon 32   "favicon-32x32.png"          0.14 $false
New-Icon 16   "favicon-16x16.png"          0.12 $false
Write-Host "Done."
