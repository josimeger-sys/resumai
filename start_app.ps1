Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
Write-Host "Installing dependencies..."
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Starting application..."
    npm run dev
} else {
    Write-Host "Installation failed. Please try running 'npm install' manually."
}
