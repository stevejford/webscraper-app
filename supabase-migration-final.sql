-- Final Migration SQL to update existing Supabase schema for enhanced session management
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/jeymatvbyfaxhxztbjsw/sql/new

-- Step 1: Add new columns to existing scraping_sessions table
ALTER TABLE scraping_sessions 
ADD COLUMN IF NOT EXISTS start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS end_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS target_url TEXT,
ADD COLUMN IF NOT EXISTS progress JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS summary_results JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 2: Update existing records to populate new columns
UPDATE scraping_sessions 
SET 
  start_time = COALESCE(start_time, created_at),
  target_url = COALESCE(target_url, config->>'url', 'https://' || domain),
  last_updated = COALESCE(last_updated, updated_at, created_at)
WHERE start_time IS NULL OR target_url IS NULL OR last_updated IS NULL;

-- Step 3: Update status column to support new states
ALTER TABLE scraping_sessions 
DROP CONSTRAINT IF EXISTS scraping_sessions_status_check;

ALTER TABLE scraping_sessions 
ADD CONSTRAINT scraping_sessions_status_check 
CHECK (status IN ('pending', 'running', 'completed', 'failed', 'paused', 'interrupted'));

-- Step 4: Add new columns to scraped_pages table
ALTER TABLE scraped_pages 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS http_status INTEGER,
ADD COLUMN IF NOT EXISTS content_hash TEXT,
ADD COLUMN IF NOT EXISTS raw_html_storage_path TEXT,
ADD COLUMN IF NOT EXISTS extracted_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS error_details TEXT;

-- Step 5: Add status constraint to scraped_pages (with error handling)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'scraped_pages_status_check'
    ) THEN
        ALTER TABLE scraped_pages
        ADD CONSTRAINT scraped_pages_status_check
        CHECK (status IN ('pending', 'scraping', 'scraped', 'failed'));
    END IF;
END $$;

-- Step 6: Add unique constraint for URL within session (with error handling)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'scraped_pages_session_url_unique'
    ) THEN
        ALTER TABLE scraped_pages
        ADD CONSTRAINT scraped_pages_session_url_unique
        UNIQUE (session_id, url);
    END IF;
EXCEPTION
    WHEN duplicate_table THEN
        -- Constraint already exists, ignore
        NULL;
    WHEN others THEN
        -- Handle any other errors (like duplicate data)
        RAISE NOTICE 'Could not add unique constraint: %', SQLERRM;
END $$;

-- Step 7: Enhance existing stored_files table
ALTER TABLE stored_files 
ADD COLUMN IF NOT EXISTS page_id UUID REFERENCES scraped_pages(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS file_type TEXT,
ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT,
ADD COLUMN IF NOT EXISTS storage_path TEXT,
ADD COLUMN IF NOT EXISTS downloaded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS original_file_id UUID REFERENCES stored_files(id);

-- Step 8: Update existing stored_files records to populate new columns
UPDATE stored_files 
SET 
  file_type = COALESCE(file_type, mime_type),
  file_size_bytes = COALESCE(file_size_bytes, file_size),
  storage_path = COALESCE(storage_path, file_path),
  downloaded_at = COALESCE(downloaded_at, uploaded_at)
WHERE file_type IS NULL OR file_size_bytes IS NULL OR storage_path IS NULL OR downloaded_at IS NULL;

-- Step 9: Create downloaded_content as a view of stored_files for new code compatibility
CREATE OR REPLACE VIEW downloaded_content AS
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

-- Step 10: Enhanced indexes for performance
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_status ON scraping_sessions(status);
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_start_time ON scraping_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_last_updated ON scraping_sessions(last_updated);
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_progress_gin ON scraping_sessions USING GIN (progress);
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_config_gin ON scraping_sessions USING GIN (config);

CREATE INDEX IF NOT EXISTS idx_scraped_pages_status ON scraped_pages(status);
CREATE INDEX IF NOT EXISTS idx_scraped_pages_content_hash ON scraped_pages(content_hash);
CREATE INDEX IF NOT EXISTS idx_scraped_pages_extracted_data_gin ON scraped_pages USING GIN (extracted_data);

-- Indexes for stored_files table (downloaded_content is a view of this table)
CREATE INDEX IF NOT EXISTS idx_stored_files_page_id ON stored_files(page_id);
CREATE INDEX IF NOT EXISTS idx_stored_files_downloaded_at ON stored_files(downloaded_at);

-- Step 11: Session lifecycle management functions
CREATE OR REPLACE FUNCTION update_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS trigger_update_session_timestamp ON scraping_sessions;
CREATE TRIGGER trigger_update_session_timestamp
    BEFORE UPDATE ON scraping_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_session_timestamp();

-- Step 12: Function for validated state transitions
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

-- Step 13: Function for progress checkpointing
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

-- Step 14: Update existing sessions to have proper status
UPDATE scraping_sessions 
SET status = CASE 
    WHEN status = 'running' AND completed_at IS NOT NULL THEN 'completed'
    WHEN status = 'error' THEN 'failed'
    WHEN status = 'stopped' THEN 'failed'
    ELSE status
END
WHERE status NOT IN ('pending', 'running', 'completed', 'failed', 'paused', 'interrupted');

-- Step 15: Populate progress column for existing sessions
UPDATE scraping_sessions 
SET progress = jsonb_build_object(
    'pages_scraped', COALESCE((statistics->>'pages_scraped')::int, 0),
    'files_downloaded', COALESCE((statistics->>'content_downloaded')::int, 0),
    'urls_found', COALESCE((statistics->>'urls_found')::int, 0),
    'external_urls_found', 0,
    'errors_count', 0,
    'last_checkpoint', COALESCE(updated_at, created_at)::text
)
WHERE progress = '{}' OR progress IS NULL;

-- Migration complete!
SELECT 'Enhanced session management schema migration completed successfully!' as result;
