#!/bin/bash

echo "=========================================="
echo "  🕷️ Crawl4AI Installation Script"
echo "=========================================="
echo

# Check if Python is available
if ! command -v python &> /dev/null; then
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python not found"
        echo "Please install Python 3.8+ and add it to your PATH"
        echo "Download from: https://python.org"
        exit 1
    else
        PYTHON_CMD=python3
    fi
else
    PYTHON_CMD=python
fi

echo "✅ Python found: $($PYTHON_CMD --version)"

echo
echo "🔧 Setting up Crawl4AI environment..."
echo "Current directory: $(pwd)"

# Create virtual environment
echo "📦 Creating virtual environment..."
$PYTHON_CMD -m venv crawl4ai_env
if [ $? -ne 0 ]; then
    echo "❌ Failed to create virtual environment"
    exit 1
fi

echo "✅ Virtual environment created"

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source crawl4ai_env/bin/activate
if [ $? -ne 0 ]; then
    echo "❌ Failed to activate virtual environment"
    exit 1
fi

echo "✅ Virtual environment activated"

# Upgrade pip
echo "📈 Upgrading pip..."
python -m pip install --upgrade pip

# Install Crawl4AI
echo "📥 Installing Crawl4AI..."
pip install -U crawl4ai
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Crawl4AI"
    exit 1
fi

echo "✅ Crawl4AI installed"

# Run post-installation setup
echo "🛠️ Running Crawl4AI setup (this may take a while)..."
crawl4ai-setup
if [ $? -ne 0 ]; then
    echo "❌ Crawl4AI setup failed"
    echo "Try running manually: crawl4ai-setup"
    exit 1
fi

echo "✅ Crawl4AI setup completed"

# Run diagnostics
echo "🔍 Running diagnostics..."
crawl4ai-doctor
if [ $? -ne 0 ]; then
    echo "⚠️ Diagnostics reported issues"
    echo "Check the output above for details"
else
    echo "✅ Diagnostics passed"
fi

# Test installation
echo "🧪 Testing Crawl4AI installation..."
python test_crawl4ai.py
if [ $? -ne 0 ]; then
    echo "⚠️ Test script reported issues"
    echo "Check the output above for details"
else
    echo "✅ Tests passed"
fi

echo
echo "=========================================="
echo "  🎉 Crawl4AI Installation Complete!"
echo "=========================================="
echo
echo "📋 Next steps:"
echo "1. Activate the environment: source crawl4ai_env/bin/activate"
echo "2. Run tests: python test_crawl4ai.py"
echo "3. Check documentation: https://docs.crawl4ai.com/"
echo
echo "💡 To use in your project:"
echo "  - Install additional deps: pip install -r requirements.txt"
echo "  - For advanced features: pip install crawl4ai[all]"
echo