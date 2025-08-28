-- Fix critical missing columns reported by user
-- Date: January 2025

-- 1. Add status column to publications if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'publications' AND column_name = 'status'
  ) THEN
    ALTER TABLE publications 
    ADD COLUMN status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));
  END IF;
END $$;

-- 2. Add type column to media if it doesn't exist  
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'media' AND column_name = 'type'
  ) THEN
    ALTER TABLE media 
    ADD COLUMN type text DEFAULT 'image' CHECK (type IN ('image', 'video', 'photo', 'document'));
  END IF;
END $$;

-- 3. Ensure all other critical columns exist
DO $$ 
BEGIN
  -- projects.content
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'content'
  ) THEN
    ALTER TABLE projects ADD COLUMN content text;
  END IF;

  -- projects.slug
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'slug'
  ) THEN
    ALTER TABLE projects ADD COLUMN slug text UNIQUE;
  END IF;

  -- projects.status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'status'
  ) THEN
    ALTER TABLE projects ADD COLUMN status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'planned', 'on_hold'));
  END IF;

  -- news.content
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'content'
  ) THEN
    ALTER TABLE news ADD COLUMN content text;
  END IF;

  -- news.slug
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'slug'
  ) THEN
    ALTER TABLE news ADD COLUMN slug text UNIQUE;
  END IF;

  -- tenders.type
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tenders' AND column_name = 'type'
  ) THEN
    ALTER TABLE tenders ADD COLUMN type text DEFAULT 'open' CHECK (type IN ('open', 'restricted', 'negotiated'));
  END IF;

  -- tenders.submission_deadline
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tenders' AND column_name = 'submission_deadline'
  ) THEN
    ALTER TABLE tenders ADD COLUMN submission_deadline timestamptz;
  END IF;

  -- events.start_date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'start_date'
  ) THEN
    ALTER TABLE events ADD COLUMN start_date timestamptz;
  END IF;

  -- events.end_date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'end_date'
  ) THEN
    ALTER TABLE events ADD COLUMN end_date timestamptz;
  END IF;

  -- events.event_type
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'event_type'
  ) THEN
    ALTER TABLE events ADD COLUMN event_type text DEFAULT 'conference' CHECK (event_type IN ('conference', 'workshop', 'meeting', 'ceremony', 'other'));
  END IF;

  -- publications.download_count
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'publications' AND column_name = 'download_count'
  ) THEN
    ALTER TABLE publications ADD COLUMN download_count integer DEFAULT 0;
  END IF;

  -- publications.is_featured
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'publications' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE publications ADD COLUMN is_featured boolean DEFAULT false;
  END IF;

  -- events.is_featured
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE events ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
END $$;

-- 4. Update existing records with default values where needed
UPDATE projects SET content = description WHERE content IS NULL;
UPDATE projects SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;
UPDATE projects SET status = 'active' WHERE status IS NULL;

UPDATE news SET content = excerpt WHERE content IS NULL;
UPDATE news SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;

UPDATE tenders SET type = 'open' WHERE type IS NULL;
UPDATE tenders SET submission_deadline = created_at + INTERVAL '30 days' WHERE submission_deadline IS NULL;

UPDATE events SET start_date = created_at WHERE start_date IS NULL;
UPDATE events SET end_date = start_date + INTERVAL '1 day' WHERE end_date IS NULL;
UPDATE events SET event_type = 'conference' WHERE event_type IS NULL;

UPDATE publications SET status = 'published' WHERE status IS NULL;
UPDATE publications SET download_count = 0 WHERE download_count IS NULL;

UPDATE media SET type = 'image' WHERE type IS NULL;

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_publications_status ON publications(status);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_tenders_submission_deadline ON tenders(submission_deadline);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);

-- Grant permissions
GRANT ALL ON publications TO authenticated;
GRANT ALL ON media TO authenticated;
GRANT ALL ON projects TO authenticated;
GRANT ALL ON news TO authenticated;
GRANT ALL ON tenders TO authenticated;
GRANT ALL ON events TO authenticated;