# 🔧 Manual Startup Guide

If the automated startup scripts don't work, follow these manual steps:

## Prerequisites Check

1. **Python 3.11+** installed and in PATH
   ```cmd
   python --version
   ```

2. **Node.js 18+** installed and in PATH
   ```cmd
   node --version
   npm --version
   ```

## Step-by-Step Manual Startup

### 1. Start the Backend (Terminal 1)

```cmd
# Navigate to the project
cd d:\webscraper_project\web-scraper-app

# Go to backend directory
cd backend

# Install Python dependencies
pip install fastapi uvicorn crawl4ai beautifulsoup4 websockets pydantic python-multipart aiosqlite

# Start the backend server
python main.py
```

**Expected output:**
```
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 2. Start the Frontend (Terminal 2)

Open a **new terminal window**:

```cmd
# Navigate to the project
cd d:\webscraper_project\web-scraper-app

# Go to frontend directory  
cd frontend

# Install npm dependencies (first time only)
npm install

# Start the frontend server
npm run dev
```

**Expected output:**
```
  VITE v4.5.0  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 3. Access the Application

- **Frontend UI:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## Troubleshooting Common Issues

### Backend Issues

**"No module named 'fastapi'"**
```cmd
pip install fastapi uvicorn
```

**"No module named 'crawl4ai'"**
```cmd
pip install crawl4ai
```

**Port 8000 in use:**
- Close other applications using port 8000
- Or modify `backend/main.py` to use a different port

### Frontend Issues

**"command not found: npm"**
- Install Node.js from https://nodejs.org
- Restart your terminal

**"Cannot resolve dependency"**
```cmd
npm install --force
```

**Port 3000 in use:**
- The Vite dev server will automatically try port 3001, 3002, etc.

### Both Not Working?

1. **Check your PATH variables** for Python and Node.js
2. **Run as Administrator** if you get permission errors
3. **Disable antivirus** temporarily (some block web server creation)
4. **Check Windows Firewall** settings

## Quick Test Commands

Test if everything is working:

```cmd
# Test backend API
curl http://localhost:8000/health

# Test frontend (should show HTML)
curl http://localhost:3000
```

## Environment Variables (Optional)

Create a `.env` file in the backend directory:

```env
# backend/.env
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
```

## Success Indicators

✅ **Backend working:** Visit http://localhost:8000/docs - you should see API documentation

✅ **Frontend working:** Visit http://localhost:3000 - you should see the Web Scraper interface

✅ **Both connected:** The frontend should show "connected" status and you can start scraping
