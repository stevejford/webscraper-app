@echo off
echo 🚀 Starting Web Scraper Frontend...

REM Check if we're in the right directory
if not exist "frontend\package.json" (
    echo ❌ Please run this script from the project root directory
    pause
    exit /b 1
)

REM Navigate to frontend directory
cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
) else (
    echo ✅ Dependencies already installed
)

REM Check for any TypeScript errors
echo 🔍 Checking TypeScript...
npx tsc --noEmit

if %errorlevel% equ 0 (
    echo ✅ TypeScript check passed
) else (
    echo ⚠️  TypeScript warnings found, but continuing...
)

REM Start development server
echo 🌐 Starting development server...
echo.
echo 📋 Testing Checklist:
echo   1. Navigate to Settings page
echo   2. Configure API key (use format: sk-test123...)
echo   3. Test chat preferences
echo   4. Try theme switching
echo   5. Check storage settings
echo   6. Test export functionality
echo.
echo 🔗 App will open at: http://localhost:5173
echo.

npm run dev
