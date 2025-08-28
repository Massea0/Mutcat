-- =============================================
-- TABLE POUR LA GESTION DES MÉDIAS
-- =============================================

-- Table pour les médias (images, documents, vidéos)
CREATE TABLE IF NOT EXISTS public.media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    url TEXT NOT NULL,
    folder_id VARCHAR(255),
    alt_text TEXT,
    description TEXT,
    tags TEXT[],
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes pour les performances
CREATE INDEX IF NOT EXISTS idx_media_folder ON public.media(folder_id);
CREATE INDEX IF NOT EXISTS idx_media_created_by ON public.media(created_by);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON public.media(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON public.media(created_at DESC);

-- RLS Policies
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture publique des médias
CREATE POLICY "Public can read media" ON public.media
    FOR SELECT USING (true);

-- Politique pour les utilisateurs authentifiés (création)
CREATE POLICY "Authenticated users can create media" ON public.media
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Politique pour les utilisateurs (mise à jour de leurs propres médias)
CREATE POLICY "Users can update own media" ON public.media
    FOR UPDATE USING (auth.uid() = created_by);

-- Politique pour les utilisateurs (suppression de leurs propres médias)
CREATE POLICY "Users can delete own media" ON public.media
    FOR DELETE USING (auth.uid() = created_by);

-- Politique pour les admins (tout)
CREATE POLICY "Admin can manage all media" ON public.media
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));