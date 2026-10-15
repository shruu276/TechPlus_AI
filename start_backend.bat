@echo off
title TechPulse AI - FastAPI Backend
echo Starting TechPulse AI Backend on http://localhost:8000 ...
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
pause
