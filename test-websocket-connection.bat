@echo off
echo ===================================================
echo WebSocket Connection Test Script
echo ===================================================
echo.

REM Check if backend is running
echo Checking if backend server is running on port 8000...
netstat -ano | findstr :8000 > nul
if %errorlevel% neq 0 (
    echo [ERROR] Backend server is not running on port 8000!
    echo Starting backend server...
    
    cd backend
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to activate virtual environment.
        exit /b 1
    )
    
    echo Starting backend server in a new window...
    start cmd /k "cd %cd% && python main.py"
    echo Waiting for backend server to start...
    timeout /t 5
) else (
    echo [OK] Backend server is running on port 8000.
)

echo.
echo ===================================================
echo Running WebSocket Test...
echo ===================================================

cd backend
call venv\Scripts\activate.bat
python test_websocket.py

echo.
echo ===================================================
echo Test Complete
echo ===================================================

echo.
echo If the WebSocket test failed, try the following:
echo 1. Make sure both backend and frontend are running
echo 2. Check the CORS settings in backend/main.py
echo 3. Verify WebSocket endpoint implementation
echo 4. Check browser console for errors
echo.
echo Press any key to exit...
pause > nul
