#!/bin/bash

echo "🚀 Starting Web Scraper Application..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to kill background processes on exit
cleanup() {
    print_info "Shutting down services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Check if dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    print_info "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend-bun/node_modules" ]; then
    print_info "Installing backend dependencies..."
    cd backend-bun && bun install && cd ..
fi

print_info "Starting backend server..."
cd backend-bun
bun run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

print_info "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 5

print_success "Both services are starting up!"
echo ""
print_info "🌐 Application URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo "   Health:   http://localhost:3001/health"
echo ""
print_info "📋 Quick Tests:"
echo "   1. Open http://localhost:5173 in your browser"
echo "   2. Go to Settings > API Configuration"
echo "   3. Your OpenAI key should validate automatically"
echo "   4. Try different settings tabs"
echo ""
print_warning "Press Ctrl+C to stop both services"
echo ""

# Keep script running and show logs
print_info "Monitoring services... (Press Ctrl+C to stop)"

# Wait for background processes
wait
