@echo off
echo ========================================================
echo   Launching KrishiSetu Full Stack Application
echo ========================================================
start "KrishiSetu Backend (FastAPI)" cmd /k "%~dp0run-backend.bat"
start "KrishiSetu Frontend (Next.js)" cmd /k "%~dp0run-frontend.bat"
echo.
echo Both servers have been launched in separate terminal windows!
echo   Frontend : http://localhost:3000
echo   Backend  : http://localhost:8000
echo   API Docs : http://localhost:8000/docs
echo ========================================================
