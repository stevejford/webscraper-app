@echo off
echo 🔧 Backend Setup with Crawl4AI Integration
echo.

cd /d D:\webscraper_project\web-scraper-app\backend

echo 🔄 Activating backend virtual environment...
call venv\Scripts\activate.bat

echo 📥 Installing backend dependencies (without Crawl4AI)...
pip install --upgrade pip
pip install fastapi==0.104.1
pip install uvicorn[standard]==0.24.0
pip install websockets==12.0
pip install pydantic==2.5.0
pip install python-multipart==0.0.6
pip install python-dotenv==1.0.0
pip install beautifulsoup4==4.12.2
pip install aiohttp==3.9.1
pip install aiosqlite==0.20.0
pip install aiofiles==23.2.1
pip install requests==2.31.0

echo.
echo 🔗 Setting up Crawl4AI integration...

REM Add path to Crawl4AI environment
set CRAWL4AI_PATH=D:\webscraper_project\web-scraper-app\crawler\crawl4ai_env\Lib\site-packages
echo Adding Crawl4AI path: %CRAWL4AI_PATH%

REM Install crawl4ai in backend environment
pip install crawl4ai>=0.6.0
crawl4ai-setup

echo.
echo ✅ Setup complete!
echo.
echo 🧪 Testing integration...
python -c "
import sys
import os
sys.path.insert(0, r'D:\webscraper_project\web-scraper-app\crawler\crawl4ai_env\Lib\site-packages')
try:
    import fastapi
    print('✅ FastAPI imported')
    import crawl4ai
    print('✅ Crawl4AI imported')
    import uvicorn
    print('✅ Uvicorn imported')
    print('🎉 All dependencies ready!')
except ImportError as e:
    print(f'❌ Import error: {e}')
"

echo.
echo 🚀 Backend is ready! Start with:
echo    python main.py
echo.
pause
