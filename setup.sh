#!/bin/bash

# Web Scraper Application Setup Script
echo "🚀 Setting up Web Scraper Application Environment"
echo "=================================================="

# Update system packages
echo "📦 Updating system packages..."
sudo apt-get update -y
sudo apt-get install -y python3 python3-pip python3-venv nodejs npm curl wget git

# Install latest Node.js (v18+) for better compatibility
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installations
echo "✅ Verifying installations..."
python3 --version
node --version
npm --version

# Set up Python backend environment
echo "🐍 Setting up Python backend environment..."
cd backend
python3 -m venv venv
source venv/bin/activate

# Add virtual environment activation to profile with correct path
echo "source /mnt/persist/workspace/backend/venv/bin/activate" >> $HOME/.profile

# Upgrade pip and install backend dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Install additional dependencies that might be missing
pip install pytest requests aiohttp websockets

echo "✅ Backend dependencies installed"

# Set up Crawl4AI environment
echo "🕷️ Setting up Crawl4AI environment..."
cd ../crawler
python3 -m venv crawl4ai_env
source crawl4ai_env/bin/activate

# Install Crawl4AI and dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Install Playwright and browsers using python -m playwright
echo "🌐 Installing Playwright browsers..."
pip install playwright
python -m playwright install

echo "✅ Crawl4AI environment ready"

# Set up frontend environment
echo "⚛️ Setting up frontend environment..."
cd ../frontend

# Install frontend dependencies
npm install

echo "✅ Frontend dependencies installed"

# Create downloads directory
echo "📁 Creating downloads directory..."
cd ..
mkdir -p downloads

# Set permissions
chmod 755 downloads

# Start backend server in background
echo "🚀 Starting backend server..."
cd backend
source venv/bin/activate
nohup python main.py > backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Start frontend server in background
echo "🚀 Starting frontend server..."
cd ../frontend
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > frontend.pid

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 15

# Check if servers are running
echo "🔍 Checking server status..."
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend server is running on port 8000"
else
    echo "❌ Backend server failed to start"
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend server is running on port 3000"
else
    echo "❌ Frontend server failed to start"
fi

# Fix the profile path issue by creating a proper activation script
echo "🔧 Creating proper environment activation..."
cat > $HOME/.profile << 'EOF'
# ~/.profile: executed by the command interpreter for login shells.
# This file is not read by bash(1), if ~/.bash_profile or ~/.bash_login
# exists.

# if running bash
if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
        . "$HOME/.bashrc"
    fi
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/bin" ] ; then
    PATH="$HOME/bin:$PATH"
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/.local/bin" ] ; then
    PATH="$HOME/.local/bin:$PATH"
fi

# Activate web scraper backend environment
if [ -f "/mnt/persist/workspace/backend/venv/bin/activate" ]; then
    source /mnt/persist/workspace/backend/venv/bin/activate
fi
EOF

echo "🎉 Setup complete!"
echo "Environment is ready for testing."