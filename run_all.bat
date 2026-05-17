@echo off
echo ========================================================
echo Starting Medical Imaging Diagnosis Platform
echo ========================================================

echo --- Starting Python AI Service (Port 8000)...
start "AI Service" cmd /k "cd /d %~dp0\ai-service && uvicorn app:app --reload --port 8000"

echo --- Starting Node.js Backend (Port 5000)...
start "Node Backend" cmd /k "cd /d %~dp0\backend && npm run dev"

echo --- Starting React Frontend (Port 5173)...
start "React Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"

echo.
echo All services are starting up in separate windows!
echo Please wait a few seconds, then view your frontend at: http://localhost:5173
echo.
pause
