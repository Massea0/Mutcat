-- Fix missing tables and columns

-- Add submission_deadline column to tenders if it doesn't exist
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS submission_deadline DATE;

-- Update existing tenders to have a submission_deadline
UPDATE tenders 
SET submission_deadline = CURRENT_DATE + INTERVAL '30 days'
WHERE submission_deadline IS NULL;

-- Create forms table for downloadable forms
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  file_url TEXT,
  file_size VARCHAR(50),
  download_count INTEGER DEFAULT 0,
  required_documents TEXT[],
  processing_time VARCHAR(100),
  department VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create agenda_events table for minister's agenda
CREATE TABLE IF NOT EXISTS agenda_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(255),
  type VARCHAR(50) CHECK (type IN ('meeting', 'ceremony', 'visit', 'conference', 'international')),
  participants TEXT[],
  is_public BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  online_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create press_articles table
CREATE TABLE IF NOT EXISTS press_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  source VARCHAR(255),
  source_logo TEXT,
  url TEXT,
  date DATE,
  category VARCHAR(100),
  featured_quote TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view active forms" ON forms
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view public agenda events" ON agenda_events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active press articles" ON press_articles
  FOR SELECT USING (is_active = true);

-- Admin policies
CREATE POLICY "Admins can manage forms" ON forms
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage agenda events" ON agenda_events
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage press articles" ON press_articles
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insert sample forms
INSERT INTO forms (title, description, category, file_url, file_size, download_count, processing_time, department)
VALUES 
  ('Demande de permis de construire', 'Formulaire pour obtenir un permis de construire', 'urbanisme', '/forms/permis-construire.pdf', '2.3 MB', 0, '30 jours', 'Direction de l''Urbanisme'),
  ('Demande d''attribution de logement social', 'Formulaire de candidature pour logement social', 'logement', '/forms/logement-social.pdf', '1.8 MB', 0, '45 jours', 'Direction du Logement')
ON CONFLICT DO NOTHING;

-- Insert sample agenda events
INSERT INTO agenda_events (title, description, date, time, location, type, is_public)
VALUES 
  ('Conseil des Ministres', 'Réunion hebdomadaire', CURRENT_DATE + 1, '10:00', 'Palais de la République', 'meeting', false),
  ('Inauguration nouveau quartier', 'Cérémonie d''inauguration', CURRENT_DATE + 2, '09:00', 'Diamniadio', 'ceremony', true)
ON CONFLICT DO NOTHING;

-- Fix duplicate key issue: Remove duplicates from projects
DELETE FROM projects a USING projects b
WHERE a.id > b.id AND a.title = b.title;

-- Add unique constraint on title to prevent future duplicates
ALTER TABLE projects ADD CONSTRAINT unique_project_title UNIQUE (title);