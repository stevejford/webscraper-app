@echo off
echo ==========================================
echo   🕷️ Complete Web Scraper Setup
echo ==========================================
echo.

echo This script will set up the entire web scraper application:
echo 1. Install Crawl4AI in the crawler directory
echo 2. Setup the Python backend
echo 3. Setup the React frontend
echo 4. Run tests to verify everything works
echo.

set /p confirm="Continue with setup? (y/n): "
if /i not "%confirm%"=="y" (
    echo Setup cancelled.
    pause
    exit /b 0
)

echo.
echo ==========================================
echo   Step 1: Setting up Crawl4AI
echo ==========================================

cd crawler
if exist "install.bat" (
    call install.bat
    if errorlevel 1 (
        echo ❌ Crawl4AI setup failed
        pause
        exit /b 1
    )
) else (
    echo ❌ install.bat not found in crawler directory
    pause
    exit /b 1
)

cd ..

echo.
echo ==========================================
echo   Step 2: Setting up Backend
echo ==========================================

cd backend

echo 📦 Creating Python virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ❌ Failed to create Python virtual environment
    pause
    exit /b 1
)

echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

echo 📥 Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

echo ✅ Backend setup complete

cd ..

echo.
echo ==========================================
echo   Step 3: Setting up Frontend
echo ==========================================

cd frontend

echo 📦 Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo ✅ Frontend setup complete

cd ..

echo.
echo ==========================================
echo   Step 4: Testing Installation
echo ==========================================

echo 🧪 Testing Crawl4AI...
cd crawler
call crawl4ai_env\Scripts\activate.bat
python test_crawl4ai.py
if errorlevel 1 (
    echo ⚠️ Crawl4AI tests had issues
)

cd ../backend
echo 🧪 Testing Backend...
call venv\Scripts\activate.bat
python -c "import fastapi; import crawl4ai; print('✅ Backend dependencies OK')"
if errorlevel 1 (
    echo ⚠️ Backend test failed
)

cd ../frontend
echo 🧪 Testing Frontend...
npm run build > nul 2>&1
if errorlevel 1 (
    echo ⚠️ Frontend build test failed
) else (
    echo ✅ Frontend test passed
)

cd ..

echo.
echo ==========================================
echo   🎉 Setup Complete!
echo ==========================================
echo.
echo 🚀 To start the application:
echo.
echo   1. Start Backend (in one terminal):
echo      cd backend
echo      venv\Scripts\activate
echo      python main.py
echo.
echo   2. Start Frontend (in another terminal):
echo      cd frontend  
echo      npm run dev
echo.
echo   3. Open your browser:
echo      Frontend: http://localhost:3000
echo      Backend API: http://localhost:8000/docs
echo.
echo 📚 For detailed documentation, see SETUP_GUIDE.md
echo.
pause