-- Instructions pour créer la table site_settings
-- Copiez et exécutez ce SQL dans Supabase SQL Editor

-- 1. Supprimer la table existante si elle est incomplète
DROP TABLE IF EXISTS site_settings CASCADE;

-- 2. Créer la table avec toutes les colonnes
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'MUCTAT',
  site_description TEXT,
  site_keywords TEXT,
  site_url TEXT DEFAULT 'https://muctat.sn',
  logo_url TEXT DEFAULT '/images/logo.png',
  favicon_url TEXT DEFAULT '/favicon.ico',
  contact_email TEXT DEFAULT 'contact@muctat.sn',
  contact_phone TEXT DEFAULT '+221 33 123 45 67',
  contact_address TEXT DEFAULT 'Dakar, Sénégal',
  contact_hours TEXT DEFAULT 'Lundi - Vendredi: 8h00 - 17h00',
  social_facebook TEXT,
  social_twitter TEXT,
  social_linkedin TEXT,
  social_youtube TEXT,
  social_instagram TEXT,
  smtp_host TEXT DEFAULT 'smtp.gmail.com',
  smtp_port INTEGER DEFAULT 587,
  smtp_user TEXT,
  smtp_password TEXT,
  smtp_secure BOOLEAN DEFAULT true,
  email_from TEXT DEFAULT 'noreply@muctat.sn',
  email_from_name TEXT DEFAULT 'MUCTAT',
  notify_new_user BOOLEAN DEFAULT true,
  notify_new_content BOOLEAN DEFAULT true,
  notify_new_comment BOOLEAN DEFAULT false,
  notify_system_error BOOLEAN DEFAULT true,
  notify_emails JSONB DEFAULT '["admin@muctat.sn"]'::jsonb,
  enable_2fa BOOLEAN DEFAULT false,
  password_min_length INTEGER DEFAULT 8,
  password_require_uppercase BOOLEAN DEFAULT true,
  password_require_numbers BOOLEAN DEFAULT true,
  password_require_symbols BOOLEAN DEFAULT false,
  session_timeout INTEGER DEFAULT 30,
  max_login_attempts INTEGER DEFAULT 5,
  maintenance_mode BOOLEAN DEFAULT false,
  maintenance_message TEXT DEFAULT 'Le site est en maintenance.',
  google_analytics_id TEXT,
  google_tag_manager_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Activer RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 4. Créer les politiques
CREATE POLICY "Public read access" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin update access" ON site_settings
  FOR UPDATE TO authenticated USING (true);

-- 5. Insérer les données par défaut
INSERT INTO site_settings (id) VALUES (gen_random_uuid());

-- 6. Vérifier que tout fonctionne
SELECT 
  site_name,
  contact_email,
  contact_phone,
  maintenance_mode
FROM site_settings;