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

async function checkSiteSettings() {
  console.log('⚙️  Checking site_settings table...\n');
  
  try {
    // Test if table exists
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    
    if (!error && data) {
      console.log('✅ Table site_settings exists and has data');
      console.log('\n📊 Current settings:');
      console.log('-------------------');
      console.log(`Site Name: ${data.site_name}`);
      console.log(`Contact Email: ${data.contact_email}`);
      console.log(`Maintenance Mode: ${data.maintenance_mode ? 'ON' : 'OFF'}`);
      return;
    }
    
    if (error?.code === 'PGRST116') {
      console.log('⚠️  Table site_settings exists but is empty');
      console.log('Run the INSERT statement in the migration to add default settings');
    } else {
      console.log('❌ Table site_settings does not exist');
      console.log('\n📝 Please run the following SQL in your Supabase Dashboard:\n');
      console.log('========================================');
      console.log('File: supabase/migrations/016_create_site_settings.sql');
      console.log('========================================\n');
      console.log('Steps:');
      console.log('1. Go to https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to SQL Editor');
      console.log('4. Copy the content from the migration file above');
      console.log('5. Paste and run the SQL');
      console.log('\nThe migration will:');
      console.log('- Create the site_settings table');
      console.log('- Add all configuration columns');
      console.log('- Set up RLS policies');
      console.log('- Insert default settings');
    }
    
  } catch (error) {
    console.error('❌ Error checking site_settings:', error);
  }
}

checkSiteSettings();