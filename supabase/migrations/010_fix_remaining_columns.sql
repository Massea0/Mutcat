-- Fix remaining missing columns

-- Projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS content TEXT;

-- News table - Fix category constraint
ALTER TABLE news DROP CONSTRAINT IF EXISTS news_category_check;

-- Tenders table
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS type VARCHAR(100);

-- Events table - Fix column names
ALTER TABLE events RENAME COLUMN date TO start_date IF EXISTS;
ALTER TABLE events RENAME COLUMN time TO start_time IF EXISTS;
ALTER TABLE events ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS start_time TIME;

-- Publications table
ALTER TABLE publications ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;

-- Make sure all tables have proper timestamps
ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE news ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE news ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();