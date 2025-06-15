@echo off
echo ==========================================
echo   Starting Browser WebSocket Server (venv)
echo ==========================================
echo.
echo This script will create a virtual environment,
echo install the required packages, and start a
echo WebSocket server on port 8000.
echo.

REM Kill any process on port 8000
echo Checking if port 8000 is in use...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    echo Terminating process on port 8000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)
echo Port 8000 is now available.
echo.

REM Create virtual environment if it doesn't exist
if not exist "ws_venv" (
    echo Creating virtual environment...
    python -m venv ws_venv
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)
echo.

REM Activate virtual environment and install packages
echo Activating virtual environment and installing packages...
call ws_venv\Scripts\activate.bat
pip install websockets
echo.

REM Run the WebSocket server
echo Starting browser-compatible WebSocket server...
echo.
python browser_websocket_server.py
echo.
