@echo off
echo 🚀 Setting up Full Stack Web Scraper Application...

REM Check if we're in the right directory
if not exist "frontend\package.json" (
    echo ❌ Please run this script from the project root directory
    pause
    exit /b 1
)

echo ℹ️  Setting up frontend...
cd frontend

echo 📦 Installing frontend dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Frontend dependency installation failed
    pause
    exit /b 1
)

echo ✅ Frontend setup complete
cd ..

REM Check if backend directory exists
if exist "backend-bun" (
    echo ℹ️  Setting up Bun backend...
    cd backend-bun
    
    REM Check if Bun is installed
    bun --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ⚠️  Bun not found. Please install Bun first:
        echo    Visit https://bun.sh and follow installation instructions
        echo    Or run: powershell -c "irm bun.sh/install.ps1 | iex"
        pause
        exit /b 1
    )
    
    echo 📦 Installing backend dependencies...
    bun install
    
    if %errorlevel% neq 0 (
        echo ❌ Backend dependency installation failed
        pause
        exit /b 1
    )
    
    echo ✅ Backend setup complete
    cd ..
) else (
    echo ⚠️  Backend directory not found, skipping backend setup
)

echo.
echo ✅ Full stack setup complete!
echo.
echo ℹ️  Next steps:
echo 1. Add your OpenAI API key to backend-bun\.env
echo 2. Add your Supabase database password to backend-bun\.env
echo 3. Set up database schema in Supabase SQL editor
echo 4. Run the application:
echo    - Backend: cd backend-bun ^&^& bun run dev
echo    - Frontend: cd frontend ^&^& npm run dev
echo.
echo ℹ️  Testing URLs:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:3001
echo - Backend Health: http://localhost:3001/health
echo.
echo ⚠️  Don't forget to configure your OpenAI API key in the frontend settings!
echo.
pause
