-- Corriger les politiques RLS pour permettre la lecture publique
-- Date: Janvier 2025

-- 1. News - Permettre la lecture publique
DROP POLICY IF EXISTS "News are viewable by everyone" ON news;
CREATE POLICY "News are viewable by everyone" 
ON news FOR SELECT 
USING (true);

-- 2. Projects - Permettre la lecture publique
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON projects;
CREATE POLICY "Projects are viewable by everyone" 
ON projects FOR SELECT 
USING (true);

-- 3. Events - Permettre la lecture publique  
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
CREATE POLICY "Events are viewable by everyone" 
ON events FOR SELECT 
USING (true);

-- 4. Publications - Permettre la lecture publique
DROP POLICY IF EXISTS "Publications are viewable by everyone" ON publications;
CREATE POLICY "Publications are viewable by everyone" 
ON publications FOR SELECT 
USING (true);

-- 5. Tenders - Permettre la lecture publique
DROP POLICY IF EXISTS "Tenders are viewable by everyone" ON tenders;
CREATE POLICY "Tenders are viewable by everyone" 
ON tenders FOR SELECT 
USING (true);

-- 6. Careers - Permettre la lecture publique
DROP POLICY IF EXISTS "Careers are viewable by everyone" ON careers;
CREATE POLICY "Careers are viewable by everyone" 
ON careers FOR SELECT 
USING (true);

-- 7. Hero Sliders - Permettre la lecture publique
DROP POLICY IF EXISTS "Hero sliders are viewable by everyone" ON hero_sliders;
CREATE POLICY "Hero sliders are viewable by everyone" 
ON hero_sliders FOR SELECT 
USING (true);

-- 8. Statistics - Permettre la lecture publique
DROP POLICY IF EXISTS "Statistics are viewable by everyone" ON statistics;
CREATE POLICY "Statistics are viewable by everyone" 
ON statistics FOR SELECT 
USING (true);

-- 9. Partners - Permettre la lecture publique
DROP POLICY IF EXISTS "Partners are viewable by everyone" ON partners;
CREATE POLICY "Partners are viewable by everyone" 
ON partners FOR SELECT 
USING (true);

-- 10. Media - Permettre la lecture publique
DROP POLICY IF EXISTS "Media are viewable by everyone" ON media;
CREATE POLICY "Media are viewable by everyone" 
ON media FOR SELECT 
USING (true);

-- Assurer que RLS est activé sur toutes les tables
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Pour les opérations d'écriture, seuls les utilisateurs authentifiés peuvent modifier
-- News
DROP POLICY IF EXISTS "Authenticated users can insert news" ON news;
CREATE POLICY "Authenticated users can insert news" 
ON news FOR INSERT 
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update news" ON news;
CREATE POLICY "Authenticated users can update news" 
ON news FOR UPDATE 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete news" ON news;
CREATE POLICY "Authenticated users can delete news" 
ON news FOR DELETE 
TO authenticated
USING (true);

-- Projects
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
CREATE POLICY "Authenticated users can insert projects" 
ON projects FOR INSERT 
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;
CREATE POLICY "Authenticated users can update projects" 
ON projects FOR UPDATE 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete projects" ON projects;
CREATE POLICY "Authenticated users can delete projects" 
ON projects FOR DELETE 
TO authenticated
USING (true);

-- Events
DROP POLICY IF EXISTS "Authenticated users can insert events" ON events;
CREATE POLICY "Authenticated users can insert events" 
ON events FOR INSERT 
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update events" ON events;
CREATE POLICY "Authenticated users can update events" 
ON events FOR UPDATE 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete events" ON events;
CREATE POLICY "Authenticated users can delete events" 
ON events FOR DELETE 
TO authenticated
USING (true);