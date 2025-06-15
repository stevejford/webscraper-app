# 🕷️ Complete Setup Guide for Web Scraper with Crawl4AI

This guide will walk you through setting up the entire web scraper application with Crawl4AI integration.

## 📋 Prerequisites

- **Python 3.8+** (Python 3.10+ recommended)
- **Node.js 18+** 
- **npm or yarn**
- **Git** (optional)

## 🚀 Quick Setup (Automated)

### Option 1: Complete Auto-Setup

**Windows:**
```bash
cd D:\webscraper_project\web-scraper-app
setup-complete.bat
```

**macOS/Linux:**
```bash
cd /path/to/web-scraper-app
chmod +x setup-complete.sh
./setup-complete.sh
```

### Option 2: Manual Step-by-Step Setup

## 📦 Step 1: Install Crawl4AI

First, we need to set up Crawl4AI in its dedicated directory:

**Windows:**
```bash
cd D:\webscraper_project\web-scraper-app\crawler
install.bat
```

**macOS/Linux:**
```bash
cd crawler
chmod +x install.sh
./install.sh
```

This will:
- Create a virtual environment for Crawl4AI
- Install Crawl4AI and its dependencies
- Set up Playwright browsers
- Run diagnostics and tests

## 🐍 Step 2: Setup Backend

```bash
cd ../backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Test the backend
python main.py
```

The backend should start on http://localhost:8000

## ⚛️ Step 3: Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend should start on http://localhost:3000 or http://localhost:5173

## 🔗 Step 4: Verify Integration

1. **Backend**: Visit http://localhost:8000/docs to see the API documentation
2. **Frontend**: Visit http://localhost:3000 to see the web interface
3. **Test scraping**: Try scraping a simple website like https://example.com

## 🛠️ Advanced Setup Options

### Install Crawl4AI with Advanced Features

If you need advanced AI features:

```bash
cd crawler
crawl4ai_env\Scripts\activate  # Windows
# or: source crawl4ai_env/bin/activate  # macOS/Linux

# Install with all features
pip install crawl4ai[all]

# Download pre-trained models
crawl4ai-download-models
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Backend Configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

# Crawl4AI Settings
CRAWL4AI_HEADLESS=true
CRAWL4AI_TIMEOUT=30000

# File Storage
DOWNLOADS_DIR=downloads
MAX_FILE_SIZE=50MB

# Rate Limiting
DEFAULT_DELAY=1.0
MAX_CONCURRENT_REQUESTS=5
```

## 🧪 Testing the Setup

### Test Crawl4AI
```bash
cd crawler
crawl4ai_env\Scripts\activate  # Windows
python test_crawl4ai.py
```

### Test Backend API
```bash
cd backend
python -c "
import requests
response = requests.get('http://localhost:8000/health')
print(f'Backend status: {response.status_code}')
"
```

### Test Full Integration
1. Start both backend and frontend
2. Go to http://localhost:3000
3. Enter URL: https://example.com
4. Enable "Download Content" 
5. Select content types (Images, PDFs)
6. Click "Start Scraping"
7. Verify results appear in real-time

## 🔧 Troubleshooting

### Common Issues

**1. Crawl4AI Installation Fails**
```bash
# Try manual Playwright installation
python -m playwright install chromium
python -m playwright install --with-deps chromium

# For Linux, install system dependencies
sudo apt-get update
sudo apt-get install -y libwoff1 libopus0 libwebp7
```

**2. Backend Won't Start**
```bash
# Check if port 8000 is in use
netstat -an | findstr ":8000"  # Windows
lsof -i :8000  # macOS/Linux

# Try different port
uvicorn main:app --port 8001
```

**3. Frontend Won't Start**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. WebSocket Connection Fails**
- Ensure both backend and frontend are running
- Check firewall settings
- Verify proxy configuration in vite.config.ts

**5. Content Download Fails**
- Check download directory permissions
- Verify content types are enabled
- Ensure target website allows scraping

## 📚 Documentation Links

- [Crawl4AI Documentation](https://docs.crawl4ai.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)