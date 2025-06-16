-- Web Scraper Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create scraping_sessions table
CREATE TABLE IF NOT EXISTS scraping_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT DEFAULT 'anonymous',
    domain TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'running',
    config JSONB NOT NULL,
    statistics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scraped_pages table
CREATE TABLE IF NOT EXISTS scraped_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES scraping_sessions(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    html_content TEXT,
    metadata JSONB DEFAULT '{}',
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stored_files table
CREATE TABLE IF NOT EXISTS stored_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES scraping_sessions(id) ON DELETE CASCADE,
    original_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    content_hash TEXT,
    public_url TEXT,
    is_deduped BOOLEAN DEFAULT FALSE,
    text_content TEXT,
    metadata JSONB DEFAULT '{}',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_user_id ON scraping_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_status ON scraping_sessions(status);
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_created_at ON scraping_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_scraped_pages_session_id ON scraped_pages(session_id);
CREATE INDEX IF NOT EXISTS idx_scraped_pages_url ON scraped_pages(url);

CREATE INDEX IF NOT EXISTS idx_stored_files_session_id ON stored_files(session_id);
CREATE INDEX IF NOT EXISTS idx_stored_files_content_hash ON stored_files(content_hash);
CREATE INDEX IF NOT EXISTS idx_stored_files_mime_type ON stored_files(mime_type);

-- Create storage bucket for scraped content
INSERT INTO storage.buckets (id, name, public) 
VALUES ('scraped-content', 'scraped-content', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) policies
ALTER TABLE scraping_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE stored_files ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on scraping_sessions" ON scraping_sessions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on scraped_pages" ON scraped_pages
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on stored_files" ON stored_files
    FOR ALL USING (true) WITH CHECK (true);

-- Storage policies
CREATE POLICY "Allow all operations on scraped-content bucket" ON storage.objects
    FOR ALL USING (bucket_id = 'scraped-content') WITH CHECK (bucket_id = 'scraped-content');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_scraping_sessions_updated_at 
    BEFORE UPDATE ON scraping_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional)
-- INSERT INTO scraping_sessions (id, domain, status, config) VALUES 
-- ('550e8400-e29b-41d4-a716-446655440000', 'example.com', 'completed', '{"url": "https://example.com", "max_pages": 10}');

-- Verify tables were created
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('scraping_sessions', 'scraped_pages', 'stored_files')
ORDER BY table_name, ordinal_position;
