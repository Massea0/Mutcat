-- Create site_settings table for global configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- General Information
  site_name TEXT DEFAULT 'MUCTAT - Ministère de l''Urbanisme',
  site_description TEXT DEFAULT 'Site officiel du Ministère de l''Urbanisme, du Cadre de vie, des Territoires, de l''Aménagement et du Tourisme',
  site_keywords TEXT DEFAULT 'urbanisme, sénégal, aménagement, territoire, tourisme',
  site_url TEXT DEFAULT 'https://muctat.sn',
  logo_url TEXT DEFAULT '/images/logo.png',
  favicon_url TEXT DEFAULT '/favicon.ico',
  
  -- Contact Information
  contact_email TEXT DEFAULT 'contact@muctat.sn',
  contact_phone TEXT DEFAULT '+221 33 123 45 67',
  contact_address TEXT DEFAULT 'Building Administratif, Dakar, Sénégal',
  contact_hours TEXT DEFAULT 'Lundi - Vendredi: 8h00 - 17h00',
  
  -- Social Media
  social_facebook TEXT DEFAULT 'https://facebook.com/muctat',
  social_twitter TEXT DEFAULT 'https://twitter.com/muctat',
  social_linkedin TEXT DEFAULT 'https://linkedin.com/company/muctat',
  social_youtube TEXT DEFAULT 'https://youtube.com/muctat',
  social_instagram TEXT DEFAULT 'https://instagram.com/muctat',
  
  -- Email/SMTP Configuration
  smtp_host TEXT DEFAULT 'smtp.gmail.com',
  smtp_port INTEGER DEFAULT 587,
  smtp_user TEXT,
  smtp_password TEXT,
  smtp_secure BOOLEAN DEFAULT true,
  email_from TEXT DEFAULT 'noreply@muctat.sn',
  email_from_name TEXT DEFAULT 'MUCTAT',
  
  -- Notifications
  notify_new_user BOOLEAN DEFAULT true,
  notify_new_content BOOLEAN DEFAULT true,
  notify_new_comment BOOLEAN DEFAULT false,
  notify_system_error BOOLEAN DEFAULT true,
  notify_emails JSONB DEFAULT '["admin@muctat.sn"]'::jsonb,
  
  -- Security Settings
  enable_2fa BOOLEAN DEFAULT false,
  password_min_length INTEGER DEFAULT 8,
  password_require_uppercase BOOLEAN DEFAULT true,
  password_require_numbers BOOLEAN DEFAULT true,
  password_require_symbols BOOLEAN DEFAULT false,
  session_timeout INTEGER DEFAULT 30,
  max_login_attempts INTEGER DEFAULT 5,
  
  -- Maintenance
  maintenance_mode BOOLEAN DEFAULT false,
  maintenance_message TEXT DEFAULT 'Le site est actuellement en maintenance. Nous serons de retour bientôt.',
  
  -- Analytics
  google_analytics_id TEXT,
  google_tag_manager_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read settings
CREATE POLICY "Anyone can read site settings" ON site_settings
  FOR SELECT
  USING (true);

-- Only admins can update settings (you'll need to adjust this based on your role system)
CREATE POLICY "Only admins can update settings" ON site_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  ));

-- Insert default settings (only if table is empty)
INSERT INTO site_settings (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- Grant permissions
GRANT SELECT ON site_settings TO anon;
GRANT SELECT, UPDATE ON site_settings TO authenticated;