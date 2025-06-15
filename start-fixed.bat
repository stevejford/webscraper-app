@echo off
echo ==========================================
echo   Web Scraper Application Startup
echo ==========================================
echo.
echo This script will start both the backend and frontend components.
echo.
echo 1. Backend: FastAPI server with Crawl4AI integration (Port 8000)
echo 2. Frontend: React/Vite application (Port 3001)
echo.

REM Clean up any existing processes on required ports
echo Cleaning up any existing processes on required ports...
echo.

REM Kill processes on backend port (8000)
echo Checking port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Terminating process on port 8000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

REM Kill processes on frontend ports
for %%p in (3000 3001 3002 3003 3004 3005 5173 5174 5175) do (
    echo Checking port %%p...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p ^| findstr LISTENING') do (
        echo Terminating process on port %%p (PID: %%a)
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo.
echo Killing any Node.js processes that might be related to the frontend...
taskkill /F /IM node.exe >nul 2>&1
echo.

REM Start backend server
echo Starting backend server...
echo.

cd backend
start cmd /k "title Backend Server && cd %cd% && call venv\Scripts\activate.bat && uvicorn main_simple:app --host 0.0.0.0 --port 8000 --reload"
cd ..

echo Waiting for backend to initialize (5 seconds)...
timeout /t 5 >nul

REM Start frontend development server
echo Starting frontend development server...
echo.

cd frontend
start cmd /k "title Frontend Server && cd %cd% && npm run dev -- --port 3001"
cd ..

echo.
echo ==========================================
echo   Web Scraper Application Started!
echo ==========================================
echo.
echo Backend API:  http://localhost:8000
echo API Docs:     http://localhost:8000/docs
echo Frontend:     http://localhost:3001
echo.
echo To stop the application, close the terminal windows
echo    or run stop-app.bat
echo.
echo To test the application:
echo    1. Open the frontend URL in your browser
echo    2. Enter a URL to scrape (e.g., https://example.com)
echo    3. Configure scraping options
echo    4. Click "Start Scraping"
echo.
pause
