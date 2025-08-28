-- Fix missing tables and columns for CMS functionality

-- Add is_featured columns to existing tables if they don't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;

ALTER TABLE news ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE news ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;

-- Create hero_sliders table if it doesn't exist
CREATE TABLE IF NOT EXISTS hero_sliders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create statistics table if it doesn't exist
CREATE TABLE IF NOT EXISTS statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(100) NOT NULL,
  value VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create partners table if it doesn't exist
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website VARCHAR(255),
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quick_links table if it doesn't exist
CREATE TABLE IF NOT EXISTS quick_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,
  icon VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create site_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE hero_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view active sliders" ON hero_sliders
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active statistics" ON statistics
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active partners" ON partners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active quick links" ON quick_links
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view site settings" ON site_settings
  FOR SELECT USING (true);

-- Admin policies for full access
CREATE POLICY "Admins can manage sliders" ON hero_sliders
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage statistics" ON statistics
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage partners" ON partners
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage quick links" ON quick_links
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage site settings" ON site_settings
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insert some default data for testing
INSERT INTO hero_sliders (title, subtitle, description, button_text, button_link, order_index, is_active)
VALUES 
  ('Bienvenue au MUCTAT', 'Ministère de l''Urbanisme, du Cadre de Vie et de l''Aménagement du Territoire', 'Construire ensemble le Sénégal de demain', 'En savoir plus', '/ministere/missions', 1, true),
  ('Vision 2050', 'Un Sénégal moderne et durable', 'Planification urbaine innovante pour un développement harmonieux', 'Découvrir', '/projets', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO statistics (label, value, icon, order_index, is_active)
VALUES 
  ('Projets en cours', '127', 'Building2', 1, true),
  ('Villes impactées', '45', 'MapPin', 2, true),
  ('Logements construits', '15000+', 'Home', 3, true),
  ('Emplois créés', '8500+', 'Users', 4, true)
ON CONFLICT DO NOTHING;

INSERT INTO partners (name, logo_url, website, order_index, is_active)
VALUES 
  ('Banque Mondiale', '/images/partners/world-bank.png', 'https://www.worldbank.org', 1, true),
  ('Union Européenne', '/images/partners/eu.png', 'https://europa.eu', 2, true),
  ('PNUD', '/images/partners/undp.png', 'https://www.undp.org', 3, true),
  ('BAD', '/images/partners/bad.png', 'https://www.afdb.org', 4, true),
  ('AFD', '/images/partners/afd.png', 'https://www.afd.fr', 5, true)
ON CONFLICT DO NOTHING;

-- Add some sample featured news and projects
UPDATE news SET is_featured = true, featured_order = 1 WHERE id = (SELECT id FROM news ORDER BY created_at DESC LIMIT 1);
UPDATE projects SET is_featured = true, featured_order = 1 WHERE id = (SELECT id FROM projects ORDER BY created_at DESC LIMIT 1);