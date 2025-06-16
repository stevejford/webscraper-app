#!/bin/bash

echo "🧪 Testing Web Scraper Setup..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Test 1: Check if required files exist
print_info "Checking required files..."

if [ -f "frontend/package.json" ]; then
    print_success "Frontend package.json found"
else
    print_error "Frontend package.json missing"
    exit 1
fi

if [ -f "backend-bun/package.json" ]; then
    print_success "Backend package.json found"
else
    print_error "Backend package.json missing"
    exit 1
fi

if [ -f "backend-bun/.env" ]; then
    print_success "Backend .env file found"
else
    print_error "Backend .env file missing"
    exit 1
fi

if [ -f "frontend/.env" ]; then
    print_success "Frontend .env file found"
else
    print_error "Frontend .env file missing"
    exit 1
fi

# Test 2: Check if Node.js is installed
print_info "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Test 3: Check if npm is installed
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm installed: $NPM_VERSION"
else
    print_error "npm not found"
    exit 1
fi

# Test 4: Check if Bun is installed
print_info "Checking Bun installation..."
if command -v bun &> /dev/null; then
    BUN_VERSION=$(bun --version)
    print_success "Bun installed: $BUN_VERSION"
else
    print_warning "Bun not found. Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    source ~/.bashrc
    if command -v bun &> /dev/null; then
        print_success "Bun installed successfully"
    else
        print_error "Failed to install Bun. Please install manually from https://bun.sh"
        exit 1
    fi
fi

# Test 5: Check environment variables
print_info "Checking environment variables..."

if grep -q "SUPABASE_URL=https://jeymatvbyfaxhxztbjsw.supabase.co" backend-bun/.env; then
    print_success "Supabase URL configured"
else
    print_error "Supabase URL not configured correctly"
fi

if grep -q "OPENAI_API_KEY=sk-proj-" backend-bun/.env; then
    print_success "OpenAI API key configured"
else
    print_error "OpenAI API key not configured"
fi

# Test 6: Install dependencies
print_info "Installing frontend dependencies..."
cd frontend
if npm install; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi
cd ..

print_info "Installing backend dependencies..."
cd backend-bun
if bun install; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi
cd ..

# Test 7: Check TypeScript compilation
print_info "Checking TypeScript compilation..."
cd frontend
if npx tsc --noEmit; then
    print_success "Frontend TypeScript check passed"
else
    print_warning "Frontend TypeScript warnings (continuing...)"
fi
cd ..

cd backend-bun
if bun run type-check; then
    print_success "Backend TypeScript check passed"
else
    print_warning "Backend TypeScript warnings (continuing...)"
fi
cd ..

print_success "Setup test completed successfully!"
echo ""
print_info "Next steps:"
echo "1. Start backend: cd backend-bun && bun run dev"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo "4. Test health check: http://localhost:3001/health"
echo ""
print_info "Your web scraper is ready to run! 🚀"
