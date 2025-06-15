@echo off
echo 📦 Installing Backend Dependencies...
echo.

cd /d D:\webscraper_project\web-scraper-app\backend

echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

echo 📥 Installing Python packages...
pip install --upgrade pip
pip install fastapi==0.104.1
pip install uvicorn[standard]==0.24.0
pip install websockets==12.0
pip install pydantic==2.5.0
pip install python-multipart==0.0.6
pip install python-dotenv==1.0.0
pip install crawl4ai>=0.6.0
pip install beautifulsoup4==4.12.2
pip install aiohttp==3.9.1
pip install aiosqlite==0.20.0
pip install aiofiles==23.2.1
pip install requests==2.31.0

echo.
echo ✅ Backend dependencies installed!
echo.
echo 🧪 Testing imports...
python -c "import fastapi; import crawl4ai; import uvicorn; print('✅ All imports successful')"

if errorlevel 1 (
    echo ❌ Import test failed
    echo.
    echo 🔧 Trying alternative Crawl4AI installation...
    pip install --upgrade crawl4ai
    crawl4ai-setup
) else (
    echo ✅ Backend is ready to start!
)

echo.
echo 🚀 To start the backend:
echo    python main.py
echo.
pause
