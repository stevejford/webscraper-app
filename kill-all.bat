@echo off
echo ==========================================
echo   🔥 Web Scraper - Kill All Processes
echo ==========================================
echo.

echo This script will aggressively terminate all processes related to the web scraper application.
echo.

echo Killing all processes on application ports...
echo.

REM Define all ports used by the application
set PORTS=8000 3000 3001 3002 3003 3004 3005 5173 5174 5175

REM Kill processes on each port
for %%p in (%PORTS%) do (
    echo Checking port %%p...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p ^| findstr LISTENING') do (
        echo Terminating process on port %%p (PID: %%a)
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo.
echo Killing all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Killing all Python processes that might be related...
for /f "tokens=2" %%a in ('tasklist /fi "imagename eq python.exe" /fo csv ^| findstr /i "python"') do (
    echo Checking Python process (PID: %%~a)
    taskkill /F /PID %%~a >nul 2>&1
)

for /f "tokens=2" %%a in ('tasklist /fi "imagename eq pythonw.exe" /fo csv ^| findstr /i "python"') do (
    echo Checking Python process (PID: %%~a)
    taskkill /F /PID %%~a >nul 2>&1
)

echo.
echo Killing any remaining Playwright browser processes...
taskkill /F /IM playwright.exe >nul 2>&1
taskkill /F /IM msedge.exe >nul 2>&1
taskkill /F /IM chrome.exe >nul 2>&1
taskkill /F /IM firefox.exe >nul 2>&1

echo.
echo ==========================================
echo   ✅ Process Cleanup Complete
echo ==========================================
echo.
echo All processes related to the web scraper application should now be terminated.
echo You can now start the application fresh with start-app.bat
echo.
pause