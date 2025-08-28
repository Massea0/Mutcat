#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedSiteSettings() {
  console.log('⚙️  Seeding site_settings table...\n');
  
  try {
    // Check if settings already exist
    const { data: existing, error: checkError } = await supabase
      .from('site_settings')
      .select('id')
      .single();
    
    if (existing) {
      console.log('✅ Site settings already exist');
      return;
    }
    
    // Insert default settings
    const defaultSettings = {
      site_name: 'MUCTAT - Ministère de l\'Urbanisme',
      site_description: 'Site officiel du Ministère de l\'Urbanisme, du Cadre de vie, des Territoires, de l\'Aménagement et du Tourisme',
      site_keywords: 'urbanisme, sénégal, aménagement, territoire, tourisme',
      site_url: 'https://muctat.sn',
      logo_url: '/images/logo.png',
      favicon_url: '/favicon.ico',
      contact_email: 'contact@muctat.sn',
      contact_phone: '+221 33 123 45 67',
      contact_address: 'Building Administratif, Dakar, Sénégal',
      contact_hours: 'Lundi - Vendredi: 8h00 - 17h00',
      social_facebook: 'https://facebook.com/muctat',
      social_twitter: 'https://twitter.com/muctat',
      social_linkedin: 'https://linkedin.com/company/muctat',
      social_youtube: 'https://youtube.com/muctat',
      social_instagram: 'https://instagram.com/muctat',
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_secure: true,
      email_from: 'noreply@muctat.sn',
      email_from_name: 'MUCTAT',
      notify_new_user: true,
      notify_new_content: true,
      notify_new_comment: false,
      notify_system_error: true,
      notify_emails: ['admin@muctat.sn'],
      enable_2fa: false,
      password_min_length: 8,
      password_require_uppercase: true,
      password_require_numbers: true,
      password_require_symbols: false,
      session_timeout: 30,
      max_login_attempts: 5,
      maintenance_mode: false,
      maintenance_message: 'Le site est actuellement en maintenance. Nous serons de retour bientôt.'
    };
    
    const { data, error } = await supabase
      .from('site_settings')
      .insert([defaultSettings])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error inserting settings:', error);
      return;
    }
    
    console.log('✅ Default site settings inserted successfully!');
    console.log('\n📊 Settings created:');
    console.log('-------------------');
    console.log(`Site Name: ${data.site_name}`);
    console.log(`Contact Email: ${data.contact_email}`);
    console.log(`Contact Phone: ${data.contact_phone}`);
    console.log(`Social Media: Facebook, Twitter, LinkedIn, YouTube, Instagram`);
    console.log(`Security: Password min length ${data.password_min_length}, 2FA ${data.enable_2fa ? 'enabled' : 'disabled'}`);
    console.log(`Maintenance Mode: ${data.maintenance_mode ? 'ON' : 'OFF'}`);
    console.log('\n✨ The Settings page should now work correctly!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

seedSiteSettings();