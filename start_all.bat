@echo off
title TechPulse AI Launcher
echo ========================================================
echo         Launching TechPulse AI Application...
echo ========================================================
echo.

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "TechPulse AI - Backend (Port 8000)" cmd /k "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
start "TechPulse AI - Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo Both servers have been launched!
echo Access the application at: http://localhost:5173
echo Backend API documentation at: http://localhost:8000/docs
echo ========================================================
pause
