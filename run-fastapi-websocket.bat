@echo off
echo ==========================================
echo   Starting FastAPI WebSocket Test Server
echo ==========================================
echo.
echo This script will start a FastAPI WebSocket server on port 8000
echo for testing the WebSocket connection with the frontend.
echo.

REM Kill any process on port 8000
echo Checking if port 8000 is in use...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    echo Terminating process on port 8000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)
echo Port 8000 is now available.
echo.

REM Run the FastAPI WebSocket server
echo Starting FastAPI WebSocket server...
echo.
python fastapi_websocket_server.py
echo.
