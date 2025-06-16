#!/bin/bash

echo "🚀 Setting up Full Stack Web Scraper Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_info "Setting up Supabase database..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_warning "Supabase CLI not found. Installing..."
    
    # Install Supabase CLI
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install supabase/tap/supabase
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://supabase.com/install.sh | sh
    else
        print_error "Please install Supabase CLI manually: https://supabase.com/docs/guides/cli"
        exit 1
    fi
fi

# Set up database schema
print_info "Setting up database schema..."

# Create a temporary SQL file with our schema
cat > temp_schema.sql << 'EOF'
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    openai_api_key TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scraping sessions table
CREATE TABLE IF NOT EXISTS scraping_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'running',
    config JSONB NOT NULL,
    statistics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Scraped pages table
CREATE TABLE IF NOT EXISTS scraped_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES scraping_sessions(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    text_content TEXT,
    html_content TEXT,
    metadata JSONB DEFAULT '{}',
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stored files table
CREATE TABLE IF NOT EXISTS stored_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES scraping_sessions(id) ON DELETE CASCADE,
    original_url TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    content_hash VARCHAR(64) NOT NULL,
    text_content TEXT,
    metadata JSONB DEFAULT '{}',
    is_deduped BOOLEAN DEFAULT FALSE,
    original_file_id UUID REFERENCES stored_files(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content chunks table for vector search
CREATE TABLE IF NOT EXISTS content_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES scraping_sessions(id) ON DELETE CASCADE,
    source_id UUID,
    source_type VARCHAR(10) CHECK (source_type IN ('page', 'file')),
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES scraping_sessions(id) ON DELETE SET NULL,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    sources JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_user_id ON scraping_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_scraped_pages_session_id ON scraped_pages(session_id);
CREATE INDEX IF NOT EXISTS idx_stored_files_session_id ON stored_files(session_id);
CREATE INDEX IF NOT EXISTS idx_stored_files_content_hash ON stored_files(content_hash);
CREATE INDEX IF NOT EXISTS idx_content_chunks_session_id ON content_chunks(session_id);
CREATE INDEX IF NOT EXISTS idx_content_chunks_embedding ON content_chunks USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE stored_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies for testing)
CREATE POLICY "Users can view own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own sessions" ON scraping_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view session pages" ON scraped_pages FOR ALL USING (
    EXISTS (SELECT 1 FROM scraping_sessions WHERE id = session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view session files" ON stored_files FOR ALL USING (
    EXISTS (SELECT 1 FROM scraping_sessions WHERE id = session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view session content" ON content_chunks FOR ALL USING (
    EXISTS (SELECT 1 FROM scraping_sessions WHERE id = session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage own conversations" ON chat_conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view conversation messages" ON chat_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM chat_conversations WHERE id = conversation_id AND user_id = auth.uid())
);
EOF

# Apply schema to Supabase
print_info "Applying database schema to Supabase..."
if command -v psql &> /dev/null; then
    # If psql is available, use direct connection
    print_warning "You'll need to provide your Supabase database password"
    psql "postgresql://postgres@db.jeymatvbyfaxhxztbjsw.supabase.co:5432/postgres" -f temp_schema.sql
else
    print_warning "psql not found. Please run the schema manually in Supabase SQL editor"
    print_info "Schema file created: temp_schema.sql"
fi

# Clean up
rm -f temp_schema.sql

# Set up backend
print_info "Setting up Bun backend..."
if [ -d "backend-bun" ]; then
    cd backend-bun
    
    # Check if Bun is installed
    if ! command -v bun &> /dev/null; then
        print_warning "Bun not found. Installing..."
        curl -fsSL https://bun.sh/install | bash
        source ~/.bashrc
    fi
    
    print_status "Installing backend dependencies..."
    bun install
    
    print_status "Backend setup complete"
    cd ..
else
    print_warning "Backend directory not found, skipping backend setup"
fi

# Set up frontend
print_info "Setting up React frontend..."
if [ -d "frontend" ]; then
    cd frontend
    
    print_status "Installing frontend dependencies..."
    npm install
    
    print_status "Frontend setup complete"
    cd ..
else
    print_error "Frontend directory not found"
    exit 1
fi

print_status "Full stack setup complete!"
echo ""
print_info "Next steps:"
echo "1. Add your OpenAI API key to backend-bun/.env"
echo "2. Add your Supabase database password to backend-bun/.env"
echo "3. Run the application:"
echo "   - Backend: cd backend-bun && bun run dev"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
print_info "Testing URLs:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:3001"
echo "- Backend Health: http://localhost:3001/health"
echo ""
print_warning "Don't forget to configure your OpenAI API key in the frontend settings!"
