-- =============================================
-- TABLES COMPLÈTES POUR LE CMS
-- =============================================

-- Table pour les appels d'offres
CREATE TABLE IF NOT EXISTS public.tenders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reference VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'goods', 'services', 'works', 'consulting'
    category VARCHAR(100),
    budget_min DECIMAL(15,2),
    budget_max DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'XOF',
    submission_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    opening_date TIMESTAMP WITH TIME ZONE,
    documents JSONB DEFAULT '[]'::jsonb, -- [{name, url, size}]
    requirements TEXT[],
    evaluation_criteria TEXT,
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'open', -- 'draft', 'open', 'closed', 'awarded', 'cancelled'
    winner_company VARCHAR(255),
    award_date DATE,
    award_amount DECIMAL(15,2),
    is_featured BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    published_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Table pour les publications/documents officiels
CREATE TABLE IF NOT EXISTS public.publications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'report', 'law', 'decree', 'circular', 'guide', 'form'
    category VARCHAR(100),
    file_url TEXT NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(50),
    cover_image_url TEXT,
    language VARCHAR(10) DEFAULT 'fr',
    tags TEXT[],
    year INTEGER,
    author VARCHAR(255),
    department VARCHAR(255),
    is_featured BOOLEAN DEFAULT false,
    is_downloadable BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'published', -- 'draft', 'published', 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    published_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Table pour les événements (déjà créée mais à améliorer)
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS registration_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS registration_link VARCHAR(255),
ADD COLUMN IF NOT EXISTS max_participants INTEGER,
ADD COLUMN IF NOT EXISTS current_participants INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS event_type VARCHAR(50), -- 'conference', 'workshop', 'seminar', 'meeting', 'ceremony'
ADD COLUMN IF NOT EXISTS venue VARCHAR(255),
ADD COLUMN IF NOT EXISTS venue_address TEXT,
ADD COLUMN IF NOT EXISTS venue_map_url TEXT,
ADD COLUMN IF NOT EXISTS organizer VARCHAR(255),
ADD COLUMN IF NOT EXISTS partners TEXT[],
ADD COLUMN IF NOT EXISTS speakers JSONB DEFAULT '[]'::jsonb, -- [{name, title, bio, photo}]
ADD COLUMN IF NOT EXISTS agenda JSONB DEFAULT '[]'::jsonb, -- [{time, title, description}]
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS live_stream_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS recording_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Table pour les carrières/offres d'emploi
CREATE TABLE IF NOT EXISTS public.careers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reference VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    location VARCHAR(255),
    contract_type VARCHAR(50), -- 'permanent', 'temporary', 'internship', 'consultant'
    level VARCHAR(50), -- 'junior', 'mid', 'senior', 'executive'
    description TEXT NOT NULL,
    responsibilities TEXT[],
    requirements TEXT[],
    nice_to_have TEXT[],
    benefits TEXT[],
    salary_min DECIMAL(15,2),
    salary_max DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'XOF',
    application_deadline DATE,
    start_date DATE,
    documents_required TEXT[],
    application_email VARCHAR(255),
    application_link VARCHAR(255),
    status VARCHAR(50) DEFAULT 'open', -- 'draft', 'open', 'closed', 'filled'
    views INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    published_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Table pour les formulaires/services en ligne
CREATE TABLE IF NOT EXISTS public.forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    form_url TEXT,
    pdf_url TEXT,
    online_available BOOLEAN DEFAULT false,
    requirements TEXT[],
    processing_time VARCHAR(100),
    fees DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'XOF',
    department VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    downloads INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Table pour les FAQ
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT[],
    order_index INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    helpful_yes INTEGER DEFAULT 0,
    helpful_no INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Table pour les directions et agences
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    acronym VARCHAR(50),
    type VARCHAR(50), -- 'direction', 'agency', 'service', 'division'
    parent_id UUID REFERENCES public.departments(id),
    description TEXT,
    mission TEXT,
    head_name VARCHAR(255),
    head_title VARCHAR(255),
    head_photo_url TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    website_url VARCHAR(255),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table pour les contacts/messages
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    type VARCHAR(50), -- 'general', 'complaint', 'suggestion', 'partnership', 'media'
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
    reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    replied_by UUID REFERENCES auth.users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table pour les abonnés newsletter
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    preferences JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    unsubscribe_token UUID DEFAULT gen_random_uuid(),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    ip_address INET
);

-- Indexes pour les performances
CREATE INDEX IF NOT EXISTS idx_tenders_status_deadline ON public.tenders(status, submission_deadline);
CREATE INDEX IF NOT EXISTS idx_tenders_featured ON public.tenders(is_featured, status);
CREATE INDEX IF NOT EXISTS idx_publications_type_status ON public.publications(type, status);
CREATE INDEX IF NOT EXISTS idx_publications_featured ON public.publications(is_featured, status);
CREATE INDEX IF NOT EXISTS idx_events_date_status ON public.events(start_date, status);
CREATE INDEX IF NOT EXISTS idx_careers_status_deadline ON public.careers(status, application_deadline);
CREATE INDEX IF NOT EXISTS idx_forms_active_category ON public.forms(is_active, category);
CREATE INDEX IF NOT EXISTS idx_faqs_active_category ON public.faqs(is_active, category);
CREATE INDEX IF NOT EXISTS idx_departments_type_active ON public.departments(type, is_active);
CREATE INDEX IF NOT EXISTS idx_contacts_status_created ON public.contacts(status, created_at);

-- Triggers pour updated_at
CREATE TRIGGER update_tenders_updated_at BEFORE UPDATE ON public.tenders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_publications_updated_at BEFORE UPDATE ON public.publications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON public.careers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON public.forms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Public read access" ON public.tenders 
    FOR SELECT USING (status IN ('open', 'closed', 'awarded'));

CREATE POLICY "Public read access" ON public.publications 
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public read access" ON public.careers 
    FOR SELECT USING (status IN ('open', 'closed'));

CREATE POLICY "Public read access" ON public.forms 
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access" ON public.faqs 
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access" ON public.departments 
    FOR SELECT USING (is_active = true);

-- Politique pour les contacts (insertion publique)
CREATE POLICY "Public can insert contacts" ON public.contacts 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers 
    FOR INSERT WITH CHECK (true);

-- Politique d'écriture pour les admins
CREATE POLICY "Admin full access" ON public.tenders 
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'editor')));

CREATE POLICY "Admin full access" ON public.publications 
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'editor')));

CREATE POLICY "Admin full access" ON public.careers 
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'editor')));

CREATE POLICY "Admin full access" ON public.forms 
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'editor')));

CREATE POLICY "Admin full access" ON public.faqs 
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'editor')));

CREATE POLICY "Admin full access" ON public.departments 
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')));

CREATE POLICY "Admin can manage contacts" ON public.contacts 
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'editor')));

CREATE POLICY "Admin can manage subscribers" ON public.newsletter_subscribers 
    FOR ALL USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'editor')));