# Web Scraper Application Startup Script for PowerShell
param(
    [switch]$SkipDependencies
)

Write-Host "🚀 Starting Web Scraper Application..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ ERROR: backend or frontend folder not found!" -ForegroundColor Red
    Write-Host "Make sure you're running this from the web-scraper-app directory" -ForegroundColor Yellow
    Write-Host "Current location: $(Get-Location)" -ForegroundColor Gray
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Found backend and frontend directories" -ForegroundColor Green
Write-Host ""

# Check Python
Write-Host "🔍 Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
    } else {
        throw "Python not found"
    }
} catch {
    Write-Host "❌ Python not found in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.11+ and add it to your PATH" -ForegroundColor Yellow
    Write-Host "Download from: https://python.org" -ForegroundColor Blue
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Node.js
Write-Host "🔍 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "❌ Node.js not found in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ and add it to your PATH" -ForegroundColor Yellow
    Write-Host "Download from: https://nodejs.org" -ForegroundColor Blue
    Read-Host "Press Enter to exit"
    exit 1
}

# Check npm
Write-Host "🔍 Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
    } else {
        throw "npm not found"
    }
} catch {
    Write-Host "❌ npm not found" -ForegroundColor Red
    Write-Host "npm should come with Node.js installation" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   🐍 Setting up Python Backend" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# Navigate to backend
Push-Location "backend"

# Check if requirements.txt exists
if (-not (Test-Path "requirements.txt")) {
    Write-Host "❌ requirements.txt not found in backend directory" -ForegroundColor Red
    Pop-Location
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not $SkipDependencies) {
    Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Python dependencies" -ForegroundColor Red
        Write-Host "Try running: pip install fastapi uvicorn crawl4ai beautifulsoup4" -ForegroundColor Yellow
        Pop-Location
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "✅ Python dependencies installed" -ForegroundColor Green
}

# Check if main.py exists
if (-not (Test-Path "main.py")) {
    Write-Host "❌ main.py not found in backend directory" -ForegroundColor Red
    Pop-Location
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "🚀 Starting backend server..." -ForegroundColor Yellow
# Start backend in new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; python main.py" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep 3

Pop-Location

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   ⚛️ Setting up React Frontend" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# Navigate to frontend
Push-Location "frontend"

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found in frontend directory" -ForegroundColor Red
    Pop-Location
    Read-Host "Press Enter to exit"
    exit 1
}

# Install npm dependencies if needed
if (-not (Test-Path "node_modules") -and -not $SkipDependencies) {
    Write-Host "📦 Installing npm dependencies (this may take a few minutes)..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install npm dependencies" -ForegroundColor Red
        Write-Host "Try running: npm install --force" -ForegroundColor Yellow
        Pop-Location
        Read-Host "Press Enter to exit"
        exit 1
    }
} elseif (Test-Path "node_modules") {
    Write-Host "✅ npm dependencies already installed" -ForegroundColor Green
}

Write-Host "🚀 Starting frontend server..." -ForegroundColor Yellow
# Start frontend in new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal

Pop-Location

Write-Host ""
Write-Host "===========================================" -ForegroundColor Green
Write-Host "   🎉 Application Started Successfully!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend:     http://localhost:3000" -ForegroundColor Blue
Write-Host "🔌 Backend API:  http://localhost:8000" -ForegroundColor Blue
Write-Host "📚 API Docs:     http://localhost:8000/docs" -ForegroundColor Blue
Write-Host ""
Write-Host "ℹ️  Both servers are running in separate windows" -ForegroundColor Gray
Write-Host "ℹ️  Close the PowerShell windows to stop the servers" -ForegroundColor Gray
Write-Host "ℹ️  Wait 10-15 seconds for servers to fully start" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Enter to exit this window..." -ForegroundColor Yellow
Read-Host
