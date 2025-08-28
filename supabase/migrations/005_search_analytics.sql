-- =============================================
-- TABLE POUR LES ANALYTICS DE RECHERCHE
-- =============================================

-- Table pour tracker les recherches
CREATE TABLE IF NOT EXISTS public.search_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query TEXT NOT NULL,
    result_type VARCHAR(50),
    result_id VARCHAR(255),
    clicked BOOLEAN DEFAULT false,
    user_id UUID REFERENCES auth.users(id),
    session_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table pour les recherches populaires (agrégées)
CREATE TABLE IF NOT EXISTS public.popular_searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query TEXT UNIQUE NOT NULL,
    search_count INTEGER DEFAULT 1,
    click_count INTEGER DEFAULT 0,
    last_searched TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes pour les performances
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON public.search_analytics(query);
CREATE INDEX IF NOT EXISTS idx_search_analytics_created ON public.search_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_analytics_user ON public.search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_popular_searches_count ON public.popular_searches(search_count DESC);

-- Trigger pour mettre à jour les recherches populaires
CREATE OR REPLACE FUNCTION update_popular_searches()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.popular_searches (query, search_count, click_count, last_searched)
    VALUES (NEW.query, 1, CASE WHEN NEW.clicked THEN 1 ELSE 0 END, NOW())
    ON CONFLICT (query) DO UPDATE
    SET 
        search_count = popular_searches.search_count + 1,
        click_count = popular_searches.click_count + CASE WHEN NEW.clicked THEN 1 ELSE 0 END,
        last_searched = NOW(),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_popular_searches_trigger
AFTER INSERT ON public.search_analytics
FOR EACH ROW EXECUTE FUNCTION update_popular_searches();

-- RLS Policies
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popular_searches ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique (tracking anonyme)
CREATE POLICY "Public can insert search analytics" ON public.search_analytics
    FOR INSERT WITH CHECK (true);

-- Politique pour la lecture des recherches populaires
CREATE POLICY "Public can read popular searches" ON public.popular_searches
    FOR SELECT USING (true);

-- Politique pour les admins
CREATE POLICY "Admin can manage search analytics" ON public.search_analytics
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

CREATE POLICY "Admin can manage popular searches" ON public.popular_searches
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));