@echo off
echo Starting NagrikAI Backend and Frontend...

start cmd /k "cd backend && call venv\Scripts\activate.bat && uvicorn main:app --reload"
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting in new windows!
echo Frontend will be available at: http://localhost:5173
echo Backend will be available at: http://127.0.0.1:8000
