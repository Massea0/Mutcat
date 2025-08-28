-- =============================================
-- TABLES CMS POUR LE SITE PUBLIC
-- =============================================

-- Table pour le slider de la page d'accueil
CREATE TABLE IF NOT EXISTS public.hero_sliders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    button_text VARCHAR(100),
    button_link VARCHAR(255),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Table pour les statistiques affichées
CREATE TABLE IF NOT EXISTS public.statistics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    value VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table pour les partenaires
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT NOT NULL,
    website_url VARCHAR(255),
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table pour les services/liens rapides
CREATE TABLE IF NOT EXISTS public.quick_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    link_url VARCHAR(255),
    category VARCHAR(50), -- 'service', 'resource', 'tool'
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Ajouter des colonnes manquantes aux tables existantes
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS video_url TEXT;

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS main_image_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Table pour les configurations du site
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insérer les configurations par défaut
INSERT INTO public.site_settings (key, value, description) VALUES
    ('home_hero_title', '"Ministère de l''Urbanisme du Sénégal"', 'Titre principal de la page d''accueil'),
    ('home_hero_subtitle', '"Bâtir ensemble le Sénégal de demain"', 'Sous-titre de la page d''accueil'),
    ('featured_news_count', '3', 'Nombre d''actualités à afficher sur la page d''accueil'),
    ('featured_projects_count', '4', 'Nombre de projets à afficher sur la page d''accueil'),
    ('social_links', '{
        "facebook": "https://facebook.com/muctat",
        "twitter": "https://twitter.com/muctat",
        "linkedin": "https://linkedin.com/company/muctat",
        "youtube": "https://youtube.com/muctat"
    }', 'Liens vers les réseaux sociaux')
ON CONFLICT (key) DO NOTHING;

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hero_sliders_updated_at BEFORE UPDATE ON public.hero_sliders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON public.statistics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quick_links_updated_at BEFORE UPDATE ON public.quick_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE public.hero_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Public read access" ON public.hero_sliders FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON public.statistics FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON public.partners FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON public.quick_links FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON public.site_settings FOR SELECT USING (true);

-- Politique d'écriture pour les admins
CREATE POLICY "Admin full access" ON public.hero_sliders FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Admin full access" ON public.statistics FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Admin full access" ON public.partners FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Admin full access" ON public.quick_links FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'editor'))
);
CREATE POLICY "Admin full access" ON public.site_settings FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
);

-- Indexes pour les performances
CREATE INDEX idx_hero_sliders_active_order ON public.hero_sliders(is_active, order_index);
CREATE INDEX idx_statistics_active_order ON public.statistics(is_active, order_index);
CREATE INDEX idx_partners_active_order ON public.partners(is_active, order_index);
CREATE INDEX idx_quick_links_active_order ON public.quick_links(is_active, order_index);
CREATE INDEX idx_news_featured ON public.news(is_featured, featured_order);
CREATE INDEX idx_projects_featured ON public.projects(is_featured, featured_order);
CREATE INDEX idx_events_featured ON public.events(is_featured, featured_order);