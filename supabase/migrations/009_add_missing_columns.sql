-- Add missing columns to existing tables

-- Projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image TEXT;

-- News table  
ALTER TABLE news ADD COLUMN IF NOT EXISTS author VARCHAR(255);
ALTER TABLE news ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE news ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW();

-- Tenders table
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS estimated_amount DECIMAL(15,2);
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS documents TEXT[];
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS requirements TEXT[];
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS reference VARCHAR(100);

-- Events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS date DATE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS time TIME;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE events ADD COLUMN IF NOT EXISTS type VARCHAR(100);
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_link TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS status VARCHAR(50);

-- Publications table
ALTER TABLE publications ADD COLUMN IF NOT EXISTS author VARCHAR(255);
ALTER TABLE publications ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE publications ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE publications ADD COLUMN IF NOT EXISTS file_size VARCHAR(50);
ALTER TABLE publications ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create careers table if it doesn't exist
CREATE TABLE IF NOT EXISTS careers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  location VARCHAR(255),
  type VARCHAR(50),
  description TEXT,
  requirements TEXT[],
  responsibilities TEXT[],
  deadline DATE,
  status VARCHAR(50) DEFAULT 'open',
  views INTEGER DEFAULT 0,
  applications INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on careers
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

-- Create policies for careers
CREATE POLICY "Public can view open careers" ON careers
  FOR SELECT USING (status = 'open');

CREATE POLICY "Admins can manage careers" ON careers
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');