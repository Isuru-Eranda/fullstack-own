# Build the frontend and copy the generated `dist` into backend/frontend/dist
try {
  $scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
  $frontendDir = Resolve-Path (Join-Path $scriptRoot '..\frontend')
  $backendDest = Resolve-Path (Join-Path $scriptRoot '..\backend')
} catch {
  Write-Error "Unable to resolve paths. Run this script from the repository root or the scripts folder."
  exit 1
}

Write-Host "Frontend dir: $frontendDir"
Set-Location $frontendDir

Write-Host "Installing frontend dependencies..."
npm ci

Write-Host "Building frontend..."
npm run build

$srcDist = Join-Path $frontendDir 'dist'
$destDist = Join-Path $backendDest 'frontend\dist'

if (Test-Path $destDist) {
  Write-Host "Removing existing destination: $destDist"
  Remove-Item -Recurse -Force $destDist
}

Write-Host "Copying built files to backend: $srcDist -> $destDist"
New-Item -ItemType Directory -Force -Path $destDist | Out-Null
Copy-Item -Path (Join-Path $srcDist '*') -Destination $destDist -Recurse -Force

Write-Host "Done. Backend will serve the frontend from backend/frontend/dist"