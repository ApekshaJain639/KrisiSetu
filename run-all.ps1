# KrishiSetu Unified Launcher (1 Terminal Tab)
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Launching KrishiSetu (FastAPI + Next.js) in 1 Terminal" -ForegroundColor Cyan
Write-Host "  Backend  : http://localhost:8000 (Swagger: /docs)" -ForegroundColor Yellow
Write-Host "  Frontend : http://localhost:3000" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green

Set-Location -Path "$PSScriptRoot\apps\web"
npm run dev:all
