@echo off
title KrishiSetu FastAPI Backend Engine
cd /d "%~dp0apps\api"
echo ========================================================
echo   Starting KrishiSetu Backend Engine on port 8000
echo ========================================================
python -X utf8 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
