@echo off
echo ===========================================
echo   🔍 Web Scraper Setup Diagnostic
echo ===========================================
echo.

echo Current directory: %CD%
echo.

echo 📁 Checking directories...
if exist "backend" (
    echo ✅ backend directory found
) else (
    echo ❌ backend directory NOT found
)

if exist "frontend" (
    echo ✅ frontend directory found  
) else (
    echo ❌ frontend directory NOT found
)

if exist "backend\main.py" (
    echo ✅ backend\main.py found
) else (
    echo ❌ backend\main.py NOT found
)

if exist "frontend\package.json" (
    echo ✅ frontend\package.json found
) else (
    echo ❌ frontend\package.json NOT found
)

echo.
echo 🐍 Checking Python...
python --version 2>nul
if errorlevel 1 (
    echo ❌ Python not found or not in PATH
    echo.
    echo To fix this:
    echo 1. Install Python from https://python.org
    echo 2. Make sure to check "Add Python to PATH" during installation
    echo 3. Restart your command prompt
) else (
    echo ✅ Python is available
    python -c "print('Python working correctly')"
)

echo.
echo 📦 Checking Node.js...
node --version 2>nul
if errorlevel 1 (
    echo ❌ Node.js not found or not in PATH
    echo.
    echo To fix this:
    echo 1. Install Node.js from https://nodejs.org
    echo 2. Choose the LTS version
    echo 3. Restart your command prompt
) else (
    echo ✅ Node.js is available
)

npm --version 2>nul
if errorlevel 1 (
    echo ❌ npm not found
) else (
    echo ✅ npm is available
)

echo.
echo 🌐 Checking network ports...
netstat -an | findstr ":3000" >nul
if errorlevel 1 (
    echo ✅ Port 3000 is available
) else (
    echo ⚠️  Port 3000 is in use
)

netstat -an | findstr ":8000" >nul  
if errorlevel 1 (
    echo ✅ Port 8000 is available
) else (
    echo ⚠️  Port 8000 is in use
)

echo.
echo ===========================================
echo   📋 Diagnostic Complete
echo ===========================================
echo.

if not exist "backend" (
    echo ❌ MAIN ISSUE: You're not in the correct directory!
    echo.
    echo Please navigate to: d:\webscraper_project\web-scraper-app
    echo Then run this diagnostic again.
)

echo Press any key to continue...
pause >nul
