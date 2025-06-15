@echo off
echo ==========================================
echo   🕷️ Crawl4AI Installation Script
echo ==========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found in PATH
    echo Please install Python 3.8+ and add it to your PATH
    echo Download from: https://python.org
    pause
    exit /b 1
) else (
    echo ✅ Python found
)

echo.
echo 🔧 Setting up Crawl4AI environment...
echo Current directory: %CD%

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv crawl4ai_env
if errorlevel 1 (
    echo ❌ Failed to create virtual environment
    pause
    exit /b 1
)

echo ✅ Virtual environment created

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call crawl4ai_env\Scripts\activate.bat
if errorlevel 1 (
    echo ❌ Failed to activate virtual environment
    pause
    exit /b 1
)

echo ✅ Virtual environment activated

REM Upgrade pip
echo 📈 Upgrading pip...
python -m pip install --upgrade pip

REM Install Crawl4AI
echo 📥 Installing Crawl4AI...
pip install -U crawl4ai
if errorlevel 1 (
    echo ❌ Failed to install Crawl4AI
    pause
    exit /b 1
)

echo ✅ Crawl4AI installed

REM Run post-installation setup
echo 🛠️ Running Crawl4AI setup (this may take a while)...
crawl4ai-setup
if errorlevel 1 (
    echo ❌ Crawl4AI setup failed
    echo Try running manually: crawl4ai-setup
    pause
    exit /b 1
)

echo ✅ Crawl4AI setup completed

REM Run diagnostics
echo 🔍 Running diagnostics...
crawl4ai-doctor
if errorlevel 1 (
    echo ⚠️ Diagnostics reported issues
    echo Check the output above for details
) else (
    echo ✅ Diagnostics passed
)

REM Test installation
echo 🧪 Testing Crawl4AI installation...
python test_crawl4ai.py
if errorlevel 1 (
    echo ⚠️ Test script reported issues
    echo Check the output above for details
) else (
    echo ✅ Tests passed
)

echo.
echo ==========================================
echo   🎉 Crawl4AI Installation Complete!
echo ==========================================
echo.
echo 📋 Next steps:
echo 1. Activate the environment: crawl4ai_env\Scripts\activate
echo 2. Run tests: python test_crawl4ai.py
echo 3. Check documentation: https://docs.crawl4ai.com/
echo.
echo 💡 To use in your project:
echo   - Install additional deps: pip install -r requirements.txt
echo   - For advanced features: pip install crawl4ai[all]
echo.
pause