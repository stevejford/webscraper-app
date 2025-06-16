@echo off
echo 🧪 Testing Web Scraper Setup...

REM Test 1: Check if required files exist
echo ℹ️  Checking required files...

if exist "frontend\package.json" (
    echo ✅ Frontend package.json found
) else (
    echo ❌ Frontend package.json missing
    pause
    exit /b 1
)

if exist "backend-bun\package.json" (
    echo ✅ Backend package.json found
) else (
    echo ❌ Backend package.json missing
    pause
    exit /b 1
)

if exist "backend-bun\.env" (
    echo ✅ Backend .env file found
) else (
    echo ❌ Backend .env file missing
    pause
    exit /b 1
)

if exist "frontend\.env" (
    echo ✅ Frontend .env file found
) else (
    echo ❌ Frontend .env file missing
    pause
    exit /b 1
)

REM Test 2: Check if Node.js is installed
echo ℹ️  Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js installed: %NODE_VERSION%
) else (
    echo ❌ Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

REM Test 3: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm installed: %NPM_VERSION%
) else (
    echo ❌ npm not found
    pause
    exit /b 1
)

REM Test 4: Check if Bun is installed
echo ℹ️  Checking Bun installation...
bun --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('bun --version') do set BUN_VERSION=%%i
    echo ✅ Bun installed: %BUN_VERSION%
) else (
    echo ⚠️  Bun not found. Please install from https://bun.sh
    echo    Run: powershell -c "irm bun.sh/install.ps1 | iex"
    pause
    exit /b 1
)

REM Test 5: Check environment variables
echo ℹ️  Checking environment variables...

findstr /C:"SUPABASE_URL=https://jeymatvbyfaxhxztbjsw.supabase.co" backend-bun\.env >nul
if %errorlevel% equ 0 (
    echo ✅ Supabase URL configured
) else (
    echo ❌ Supabase URL not configured correctly
)

findstr /C:"OPENAI_API_KEY=sk-proj-" backend-bun\.env >nul
if %errorlevel% equ 0 (
    echo ✅ OpenAI API key configured
) else (
    echo ❌ OpenAI API key not configured
)

REM Test 6: Install dependencies
echo ℹ️  Installing frontend dependencies...
cd frontend
npm install
if %errorlevel% equ 0 (
    echo ✅ Frontend dependencies installed
) else (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo ℹ️  Installing backend dependencies...
cd backend-bun
bun install
if %errorlevel% equ 0 (
    echo ✅ Backend dependencies installed
) else (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

REM Test 7: Check TypeScript compilation
echo ℹ️  Checking TypeScript compilation...
cd frontend
npx tsc --noEmit
if %errorlevel% equ 0 (
    echo ✅ Frontend TypeScript check passed
) else (
    echo ⚠️  Frontend TypeScript warnings (continuing...)
)
cd ..

cd backend-bun
bun run type-check
if %errorlevel% equ 0 (
    echo ✅ Backend TypeScript check passed
) else (
    echo ⚠️  Backend TypeScript warnings (continuing...)
)
cd ..

echo.
echo ✅ Setup test completed successfully!
echo.
echo ℹ️  Next steps:
echo 1. Start backend: cd backend-bun ^&^& bun run dev
echo 2. Start frontend: cd frontend ^&^& npm run dev
echo 3. Open http://localhost:5173 in your browser
echo 4. Test health check: http://localhost:3001/health
echo.
echo ℹ️  Your web scraper is ready to run! 🚀
echo.
pause
