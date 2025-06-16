-- Web Scraper Database Schema for Supabase
-- Run this in your Supabase SQL Editor

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

-- Enhanced scraping sessions table following realtime.md recommendations
CREATE TABLE IF NOT EXISTS scraping_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'paused', 'interrupted')),
    target_url TEXT NOT NULL,
    config JSONB NOT NULL, -- Scraping parameters (depth, concurrency, selectors)
    progress JSONB DEFAULT '{}', -- Real-time metrics (pages_scraped, files_downloaded, current_url, errors_count)
    summary_results JSONB DEFAULT '{}', -- Aggregated results at session completion
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Legacy compatibility fields
    domain VARCHAR(255) GENERATED ALWAYS AS (
        CASE
            WHEN target_url ~ '^https?://' THEN
                regexp_replace(target_url, '^https?://([^/]+).*', '\1')
            ELSE target_url
        END
    ) STORED,
    statistics JSONB DEFAULT '{}', -- For backward compatibility
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enhanced scraped pages table following realtime.md recommendations
CREATE TABLE IF NOT EXISTS scraped_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES scraping_sessions(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'scraping', 'scraped', 'failed')),
    http_status INTEGER,
    content_hash TEXT, -- Hash of the page's raw HTML content for deduplication
    scraped_at TIMESTAMP WITH TIME ZONE,
    raw_html_storage_path TEXT, -- Reference to Supabase Storage location
    extracted_data JSONB DEFAULT '{}', -- Structured data extracted from page
    error_details TEXT,
    -- Legacy compatibility fields
    title TEXT,
    text_content TEXT,
    html_content TEXT,
    metadata JSONB DEFAULT '{}',
    -- Constraints
    UNIQUE(session_id, url) -- Ensure uniqueness within a session
);

-- Enhanced stored files table (renamed to downloaded_content) following realtime.md recommendations
CREATE TABLE IF NOT EXISTS downloaded_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES scraped_pages(id) ON DELETE CASCADE,
    session_id UUID REFERENCES scraping_sessions(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL, -- MIME type or detected file type
    file_size_bytes BIGINT NOT NULL,
    storage_path TEXT NOT NULL, -- Reference to Supabase Storage location
    content_hash TEXT NOT NULL, -- Hash of file's binary content for deduplication
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}', -- Additional file-specific details
    -- Legacy compatibility fields
    original_url TEXT,
    mime_type VARCHAR(100) GENERATED ALWAYS AS (file_type) STORED,
    file_path TEXT GENERATED ALWAYS AS (storage_path) STORED,
    text_content TEXT,
    is_deduped BOOLEAN DEFAULT FALSE,
    original_file_id UUID REFERENCES downloaded_content(id),
    uploaded_at TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (downloaded_at) STORED,
    public_url TEXT -- For backward compatibility
);

-- Keep stored_files as a view for backward compatibility
CREATE OR REPLACE VIEW stored_files AS
SELECT
    id,
    session_id,
    original_url,
    file_name,
    file_path,
    file_size_bytes as file_size,
    mime_type,
    content_hash,
    text_content,
    metadata,
    is_deduped,
    original_file_id,
    uploaded_at,
    public_url
FROM downloaded_content;

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

-- Enhanced indexes following realtime.md recommendations
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_user_id ON scraping_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_status ON scraping_sessions(status);
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_start_time ON scraping_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_last_updated ON scraping_sessions(last_updated);

-- JSONB indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_progress_gin ON scraping_sessions USING GIN (progress);
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_config_gin ON scraping_sessions USING GIN (config);

CREATE INDEX IF NOT EXISTS idx_scraped_pages_session_id ON scraped_pages(session_id);
CREATE INDEX IF NOT EXISTS idx_scraped_pages_status ON scraped_pages(status);
CREATE INDEX IF NOT EXISTS idx_scraped_pages_content_hash ON scraped_pages(content_hash);
CREATE INDEX IF NOT EXISTS idx_scraped_pages_scraped_at ON scraped_pages(scraped_at);
CREATE INDEX IF NOT EXISTS idx_scraped_pages_extracted_data_gin ON scraped_pages USING GIN (extracted_data);

CREATE INDEX IF NOT EXISTS idx_downloaded_content_session_id ON downloaded_content(session_id);
CREATE INDEX IF NOT EXISTS idx_downloaded_content_page_id ON downloaded_content(page_id);
CREATE INDEX IF NOT EXISTS idx_downloaded_content_content_hash ON downloaded_content(content_hash);
CREATE INDEX IF NOT EXISTS idx_downloaded_content_downloaded_at ON downloaded_content(downloaded_at);

-- Legacy compatibility indexes
CREATE INDEX IF NOT EXISTS idx_stored_files_session_id ON stored_files(session_id);
CREATE INDEX IF NOT EXISTS idx_stored_files_content_hash ON stored_files(content_hash);

CREATE INDEX IF NOT EXISTS idx_content_chunks_session_id ON content_chunks(session_id);
CREATE INDEX IF NOT EXISTS idx_content_chunks_embedding ON content_chunks USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);

-- Session lifecycle management functions following realtime.md recommendations

-- Function to update session last_updated timestamp
CREATE OR REPLACE FUNCTION update_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update last_updated on session changes
CREATE TRIGGER trigger_update_session_timestamp
    BEFORE UPDATE ON scraping_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_session_timestamp();

-- Function to handle session state transitions
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
    -- Get current status
    SELECT status INTO current_status FROM scraping_sessions WHERE id = session_id;

    IF current_status IS NULL THEN
        RAISE EXCEPTION 'Session not found: %', session_id;
    END IF;

    -- Validate state transitions
    CASE current_status
        WHEN 'pending' THEN
            valid_transition := new_status IN ('running', 'failed');
        WHEN 'running' THEN
            valid_transition := new_status IN ('completed', 'failed', 'paused', 'interrupted');
        WHEN 'paused' THEN
            valid_transition := new_status IN ('running', 'failed', 'completed');
        WHEN 'interrupted' THEN
            valid_transition := new_status IN ('running', 'failed');
        WHEN 'completed' THEN
            valid_transition := FALSE; -- Completed sessions cannot transition
        WHEN 'failed' THEN
            valid_transition := new_status IN ('running'); -- Allow retry
    END CASE;

    IF NOT valid_transition THEN
        RAISE EXCEPTION 'Invalid state transition from % to %', current_status, new_status;
    END IF;

    -- Update session
    UPDATE scraping_sessions
    SET
        status = new_status,
        progress = COALESCE(progress_update, progress),
        end_time = CASE WHEN new_status IN ('completed', 'failed') THEN NOW() ELSE end_time END
    WHERE id = session_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to checkpoint session progress
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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloaded_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE stored_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Enhanced RLS policies following realtime.md recommendations
CREATE POLICY "Users can view own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own sessions" ON scraping_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view session pages" ON scraped_pages FOR ALL USING (
    EXISTS (SELECT 1 FROM scraping_sessions WHERE id = session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view downloaded content" ON downloaded_content FOR ALL USING (
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

-- Helper functions for hybrid search
CREATE OR REPLACE FUNCTION hybrid_content_search(
    query_embedding vector(1536),
    query_text text,
    target_session_id uuid DEFAULT NULL,
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id uuid,
    content text,
    metadata jsonb,
    source_type text,
    vector_similarity float,
    fts_rank float,
    combined_score float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH vector_search AS (
        SELECT
            cc.id,
            cc.content,
            cc.metadata,
            cc.source_type,
            1 - (cc.embedding <=> query_embedding) AS vector_similarity,
            0::float AS fts_rank
        FROM content_chunks cc
        WHERE 1 - (cc.embedding <=> query_embedding) > match_threshold
            AND (target_session_id IS NULL OR cc.session_id = target_session_id)
        ORDER BY cc.embedding <=> query_embedding
        LIMIT match_count
    ),
    fts_search AS (
        SELECT
            cc.id,
            cc.content,
            cc.metadata,
            cc.source_type,
            0::float AS vector_similarity,
            ts_rank(to_tsvector('english', cc.content), plainto_tsquery('english', query_text)) AS fts_rank
        FROM content_chunks cc
        WHERE to_tsvector('english', cc.content) @@ plainto_tsquery('english', query_text)
            AND (target_session_id IS NULL OR cc.session_id = target_session_id)
        ORDER BY fts_rank DESC
        LIMIT match_count
    ),
    combined_results AS (
        SELECT * FROM vector_search
        UNION
        SELECT * FROM fts_search
    )
    SELECT
        cr.id,
        cr.content,
        cr.metadata,
        cr.source_type,
        cr.vector_similarity,
        cr.fts_rank,
        (cr.vector_similarity * 0.7 + cr.fts_rank * 0.3) AS combined_score
    FROM combined_results cr
    ORDER BY combined_score DESC
    LIMIT match_count;
END;
$$;

-- Function to calculate content similarity for deduplication
CREATE OR REPLACE FUNCTION calculate_content_similarity(content_hash1 text, content_hash2 text)
RETURNS float
LANGUAGE plpgsql
AS $$
BEGIN
    -- Simple hash comparison for exact duplicates
    IF content_hash1 = content_hash2 THEN
        RETURN 1.0;
    ELSE
        RETURN 0.0;
    END IF;
END;
$$;

-- Function to get session statistics
CREATE OR REPLACE FUNCTION get_session_statistics(target_session_id uuid)
RETURNS TABLE (
    total_pages bigint,
    total_files bigint,
    total_size bigint,
    unique_domains bigint,
    processing_time interval
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM scraped_pages WHERE session_id = target_session_id),
        (SELECT COUNT(*) FROM stored_files WHERE session_id = target_session_id),
        (SELECT COALESCE(SUM(file_size), 0) FROM stored_files WHERE session_id = target_session_id),
        (SELECT COUNT(DISTINCT SUBSTRING(url FROM 'https?://([^/]+)')) FROM scraped_pages WHERE session_id = target_session_id),
        (SELECT completed_at - created_at FROM scraping_sessions WHERE id = target_session_id)
    ;
END;
$$;

-- Insert some sample data for testing (optional)
-- Uncomment the following lines if you want sample data

/*
-- Sample user
INSERT INTO users (id, email, name) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', 'Test User')
ON CONFLICT (email) DO NOTHING;

-- Sample session
INSERT INTO scraping_sessions (id, user_id, domain, status, config) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'example.com', 'completed', '{"maxPages": 10, "includeImages": true}')
ON CONFLICT (id) DO NOTHING;

-- Sample page
INSERT INTO scraped_pages (session_id, url, title, text_content) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'https://example.com', 'Example Page', 'This is sample content for testing the web scraper application.')
ON CONFLICT DO NOTHING;
*/
