-- Clean Reset and Setup for Enhanced Session Management
-- Run this in your Supabase SQL Editor to start fresh

-- Step 1: Drop existing tables and views (in correct order to handle dependencies)
DROP VIEW IF EXISTS downloaded_content CASCADE;
DROP TABLE IF EXISTS stored_files CASCADE;
DROP TABLE IF EXISTS scraped_pages CASCADE;
DROP TABLE IF EXISTS scraping_sessions CASCADE;
DROP TABLE IF EXISTS content_chunks CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_conversations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Step 2: Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Step 3: Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    openai_api_key TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create enhanced scraping_sessions table
CREATE TABLE scraping_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE DEFAULT uuid_generate_v4(),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'paused', 'interrupted')),
    target_url TEXT NOT NULL,
    config JSONB NOT NULL,
    progress JSONB DEFAULT '{}',
    summary_results JSONB DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Legacy compatibility fields
    domain VARCHAR(255) GENERATED ALWAYS AS (
        CASE 
            WHEN target_url ~ '^https?://' THEN 
                regexp_replace(target_url, '^https?://([^/]+).*', '\1')
            ELSE target_url
        END
    ) STORED,
    statistics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create enhanced scraped_pages table
CREATE TABLE scraped_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES scraping_sessions(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'scraping', 'scraped', 'failed')),
    http_status INTEGER,
    content_hash TEXT,
    scraped_at TIMESTAMP WITH TIME ZONE,
    raw_html_storage_path TEXT,
    extracted_data JSONB DEFAULT '{}',
    error_details TEXT,
    -- Legacy compatibility fields
    title TEXT,
    text_content TEXT,
    html_content TEXT,
    content TEXT, -- For backward compatibility
    metadata JSONB DEFAULT '{}',
    -- Constraints
    UNIQUE(session_id, url)
);

-- Step 6: Create enhanced stored_files table
CREATE TABLE stored_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES scraping_sessions(id) ON DELETE CASCADE,
    page_id UUID REFERENCES scraped_pages(id) ON DELETE CASCADE,
    original_url TEXT,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    content_hash TEXT,
    public_url TEXT,
    is_deduped BOOLEAN DEFAULT FALSE,
    text_content TEXT,
    metadata JSONB DEFAULT '{}',
    original_file_id UUID REFERENCES stored_files(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Enhanced fields
    file_type TEXT GENERATED ALWAYS AS (mime_type) STORED,
    file_size_bytes BIGINT GENERATED ALWAYS AS (file_size) STORED,
    storage_path TEXT GENERATED ALWAYS AS (file_path) STORED,
    downloaded_at TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (uploaded_at) STORED
);

-- Step 7: Create downloaded_content view for new code compatibility
CREATE VIEW downloaded_content AS
SELECT 
    id,
    page_id,
    session_id,
    file_name,
    file_type,
    file_size_bytes,
    storage_path,
    content_hash,
    downloaded_at,
    metadata,
    original_url,
    mime_type,
    file_path,
    text_content,
    is_deduped,
    original_file_id,
    uploaded_at,
    public_url
FROM stored_files;

-- Step 8: Create content_chunks table for vector search
CREATE TABLE content_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES scraping_sessions(id) ON DELETE CASCADE,
    source_id UUID,
    source_type VARCHAR(10) CHECK (source_type IN ('page', 'file')),
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 9: Create chat tables
CREATE TABLE chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES scraping_sessions(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    sources JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 10: Create indexes for performance
CREATE INDEX idx_scraping_sessions_user_id ON scraping_sessions(user_id);
CREATE INDEX idx_scraping_sessions_status ON scraping_sessions(status);
CREATE INDEX idx_scraping_sessions_start_time ON scraping_sessions(start_time);
CREATE INDEX idx_scraping_sessions_last_updated ON scraping_sessions(last_updated);
CREATE INDEX idx_scraping_sessions_progress_gin ON scraping_sessions USING GIN (progress);
CREATE INDEX idx_scraping_sessions_config_gin ON scraping_sessions USING GIN (config);

CREATE INDEX idx_scraped_pages_session_id ON scraped_pages(session_id);
CREATE INDEX idx_scraped_pages_status ON scraped_pages(status);
CREATE INDEX idx_scraped_pages_content_hash ON scraped_pages(content_hash);
CREATE INDEX idx_scraped_pages_scraped_at ON scraped_pages(scraped_at);
CREATE INDEX idx_scraped_pages_extracted_data_gin ON scraped_pages USING GIN (extracted_data);

CREATE INDEX idx_stored_files_session_id ON stored_files(session_id);
CREATE INDEX idx_stored_files_page_id ON stored_files(page_id);
CREATE INDEX idx_stored_files_content_hash ON stored_files(content_hash);
CREATE INDEX idx_stored_files_uploaded_at ON stored_files(uploaded_at);

CREATE INDEX idx_content_chunks_session_id ON content_chunks(session_id);
CREATE INDEX idx_content_chunks_embedding ON content_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);

-- Step 11: Session lifecycle management functions
CREATE OR REPLACE FUNCTION update_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_timestamp
    BEFORE UPDATE ON scraping_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_session_timestamp();

-- Step 12: State transition function
CREATE OR REPLACE FUNCTION transition_session_state(
    session_id UUID,
    new_status VARCHAR(50),
    progress_update JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    current_status VARCHAR(50);
    valid_transition BOOLEAN := FALSE;
BEGIN
    SELECT status INTO current_status FROM scraping_sessions WHERE id = session_id;
    
    IF current_status IS NULL THEN
        RAISE EXCEPTION 'Session not found: %', session_id;
    END IF;
    
    CASE current_status
        WHEN 'pending' THEN valid_transition := new_status IN ('running', 'failed');
        WHEN 'running' THEN valid_transition := new_status IN ('completed', 'failed', 'paused', 'interrupted');
        WHEN 'paused' THEN valid_transition := new_status IN ('running', 'failed', 'completed');
        WHEN 'interrupted' THEN valid_transition := new_status IN ('running', 'failed');
        WHEN 'completed' THEN valid_transition := FALSE;
        WHEN 'failed' THEN valid_transition := new_status IN ('running');
    END CASE;
    
    IF NOT valid_transition THEN
        RAISE EXCEPTION 'Invalid state transition from % to %', current_status, new_status;
    END IF;
    
    UPDATE scraping_sessions 
    SET 
        status = new_status,
        progress = COALESCE(progress_update, progress),
        end_time = CASE WHEN new_status IN ('completed', 'failed') THEN NOW() ELSE end_time END
    WHERE id = session_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Step 13: Progress checkpointing function
CREATE OR REPLACE FUNCTION checkpoint_session_progress(
    session_id UUID,
    progress_data JSONB
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE scraping_sessions 
    SET progress = progress || progress_data
    WHERE id = session_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Step 14: Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE stored_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Step 15: Create RLS policies
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

-- Reset complete!
SELECT 'Clean schema reset and enhanced session management setup completed successfully!' as result;
