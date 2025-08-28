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

async function createSearchAnalyticsTable() {
  console.log('📊 Creating search_analytics table...\n');
  
  try {
    // Test if table exists by trying to query it
    const { data: existing, error: existingError } = await supabase
      .from('search_analytics')
      .select('*')
      .limit(1);
    
    if (!existingError) {
      console.log('✅ Table search_analytics already exists');
      
      // Get count
      const { count } = await supabase
        .from('search_analytics')
        .select('*', { count: 'exact', head: true });
      
      console.log(`📊 Current entries: ${count}`);
      return;
    }
    
    console.log('⚠️  Table search_analytics does not exist');
    console.log('\n📝 Please run the following SQL in your Supabase Dashboard:\n');
    console.log('========================================');
    console.log(`
-- Create search_analytics table
CREATE TABLE IF NOT EXISTS search_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  last_searched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on query
CREATE UNIQUE INDEX idx_search_analytics_query ON search_analytics(query);

-- Create index for ordering
CREATE INDEX idx_search_analytics_count ON search_analytics(count DESC);

-- Enable RLS
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "auth_read" ON search_analytics
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert
CREATE POLICY "auth_insert" ON search_analytics
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "auth_update" ON search_analytics
  FOR UPDATE TO authenticated USING (true);

-- Insert sample data
INSERT INTO search_analytics (query, count) VALUES
  ('projet urbain', 15),
  ('appel offre', 12),
  ('logement social', 10),
  ('aménagement territoire', 8),
  ('permis construire', 7),
  ('plan urbanisme', 6),
  ('développement durable', 5),
  ('tourisme dakar', 4),
  ('contact ministère', 3),
  ('actualités muctat', 2)
ON CONFLICT (query) DO UPDATE
SET count = EXCLUDED.count;
    `);
    console.log('========================================\n');
    console.log('Steps:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Paste and run the SQL above');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createSearchAnalyticsTable();