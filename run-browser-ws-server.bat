@echo off
echo ==========================================
echo   Starting Browser WebSocket Server
echo ==========================================
echo.
echo This script will start a WebSocket server on port 8000
echo with proper browser compatibility and CORS support.
echo.

REM Kill any process on port 8000
echo Checking if port 8000 is in use...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    echo Terminating process on port 8000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)
echo Port 8000 is now available.
echo.

REM Install the required package
echo Installing websockets package...
pip install websockets
echo.

REM Run the WebSocket server
echo Starting browser-compatible WebSocket server...
echo.
python browser_websocket_server.py
echo.
