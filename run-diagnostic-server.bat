@echo off
echo ==========================================
echo   Starting WebSocket Diagnostic Server
echo ==========================================
echo.
echo This script will start a diagnostic HTTP server on port 8080
echo that can be used to test WebSocket connections to the backend.
echo.

REM Kill any process on port 8080
echo Checking if port 8080 is in use...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    echo Terminating process on port 8080 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)
echo Port 8080 is now available.
echo.

REM Run the diagnostic server
echo Starting diagnostic server...
echo.
python simple_websocket_server.py
echo.
