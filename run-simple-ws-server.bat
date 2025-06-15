@echo off
echo ==========================================
echo   Starting Simple WebSocket Server
echo ==========================================
echo.
echo This script will start a WebSocket server on port 8000
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

REM Run the WebSocket server
echo Starting WebSocket server...
echo.
python simple_ws_server.py
echo.
