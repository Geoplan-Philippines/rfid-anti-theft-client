#Requires -Version 5.1
<#
.SYNOPSIS
  Build and deploy the rfid-anti-theft frontend (static Angular SPA) on the mini PC.

.DESCRIPTION
  Installs dependencies (Bun) and compiles the production bundle to
  dist\rfid-anti-theft-client\browser, then restarts the Windows service if it exists.
  The production bundle dynamically resolves window.location.hostname on port 8001.

.PARAMETER ServiceName
  Name of the NSSM Windows service that serves dist/. Default: rfid-anti-theft-frontend.

.PARAMETER SkipInstall
  Skip 'bun install' (use when dependencies are unchanged).

.EXAMPLE
  .\deploy.ps1
  .\deploy.ps1 -SkipInstall
#>
param(
  [string]$ServiceName = "rfid-anti-theft-frontend",
  [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
  throw "bun not found on PATH. Install Bun: powershell -c `"irm bun.sh/install.ps1 | iex`""
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "node not found on PATH. Install Node.js LTS (v20+)."
}

if (-not $SkipInstall) {
  Write-Host "[frontend] Installing dependencies..." -ForegroundColor Cyan
  bun install
  if ($LASTEXITCODE -ne 0) {
    throw "bun install failed with exit code $LASTEXITCODE."
  }
}

Write-Host "[frontend] Building production bundle (ng build)..." -ForegroundColor Cyan
node ./node_modules/@angular/cli/bin/ng.js build
if ($LASTEXITCODE -ne 0) {
  throw "Frontend build failed with exit code $LASTEXITCODE."
}

$distIndex = "dist\rfid-anti-theft-client\browser\index.html"
if (-not (Test-Path $distIndex)) {
  throw "Build did not produce $distIndex. Check the build output above."
}

if (Get-Service -Name $ServiceName -ErrorAction SilentlyContinue) {
  Write-Host "[frontend] Restarting service '$ServiceName'..." -ForegroundColor Cyan
  Restart-Service -Name $ServiceName
  Write-Host "[frontend] Deployed. Service '$ServiceName' restarted." -ForegroundColor Green
} else {
  Write-Host "[frontend] Built to dist\rfid-anti-theft-client\browser\. Service '$ServiceName' not installed yet -" -ForegroundColor Yellow
  Write-Host "           run ..\setup-services.ps1 (elevated) to register it." -ForegroundColor Yellow
}
