#!/bin/bash

echo "🚀 Starting Web Scraper Frontend..."

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check for any TypeScript errors
echo "🔍 Checking TypeScript..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript check passed"
else
    echo "⚠️  TypeScript warnings found, but continuing..."
fi

# Start development server
echo "🌐 Starting development server..."
echo ""
echo "📋 Testing Checklist:"
echo "  1. Navigate to Settings page"
echo "  2. Configure API key (use format: sk-test123...)"
echo "  3. Test chat preferences"
echo "  4. Try theme switching"
echo "  5. Check storage settings"
echo "  6. Test export functionality"
echo ""
echo "🔗 App will open at: http://localhost:5173"
echo ""

npm run dev
