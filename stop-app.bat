@echo off
echo ==========================================
echo   🛑 Web Scraper Application Shutdown
echo ==========================================
echo.

echo Stopping all application processes...
echo.

REM Kill any process using port 8000 (Backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Stopping backend server on port 8000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
    echo ✅ Backend server terminated
)

REM Kill any process using port 3000 (Frontend - common React port)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Stopping frontend server on port 3000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
    echo ✅ Frontend server (port 3000) terminated
)

REM Kill any process using port 3001 (Frontend - alternative React port)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 ^| findstr LISTENING') do (
    echo Stopping frontend server on port 3001 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
    echo ✅ Frontend server (port 3001) terminated
)

REM Kill any process using port 5173 (Frontend - common Vite port)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo Stopping frontend server on port 5173 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
    echo ✅ Frontend server (port 5173) terminated
)

REM Kill any Node.js processes related to the frontend
echo Checking for any remaining Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ==========================================
echo   ✅ Web Scraper Application Stopped
echo ==========================================
echo.
pause