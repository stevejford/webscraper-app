@echo off
REM Web Scraper Application Startup Script for Windows

echo 🚀 Starting Web Scraper Application...

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.11+
    pause
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

REM Start backend
echo 🐍 Starting Python backend...
cd backend

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install Python dependencies
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

REM Start backend server in new window
start "Backend Server" cmd /k "python main.py"
echo ✅ Backend started

cd ..

REM Start frontend
echo ⚛️ Starting React frontend...
cd frontend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing npm dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install npm dependencies
        echo Please check your internet connection and try again
        pause
        exit /b 1
    )
)

REM Start frontend server in new window
start "Frontend Server" cmd /k "npm run dev"
echo ✅ Frontend started

echo.
echo 🎉 Application is starting up!
echo 📱 Frontend: http://localhost:3000
echo 🔌 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Both servers are running in separate windows.
echo Close the command windows to stop the servers.
pause
