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

async function testSearchAnalytics() {
  console.log('🔍 Testing search_analytics table...\n');
  
  try {
    // Get top search terms
    const { data, error, count } = await supabase
      .from('search_analytics')
      .select('*', { count: 'exact' })
      .order('count', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Error querying search_analytics:', error);
      return;
    }
    
    console.log('✅ Search Analytics Table Status:');
    console.log('==================================');
    console.log(`📊 Total entries: ${count}`);
    console.log('\n🔝 Top Search Terms:');
    console.log('--------------------');
    
    if (data && data.length > 0) {
      data.forEach((item, index) => {
        console.log(`${index + 1}. "${item.query}" - ${item.count} searches`);
      });
    } else {
      console.log('No search data available');
    }
    
    console.log('\n✨ Everything is working correctly!');
    console.log('The Analytics page should now display search terms properly.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testSearchAnalytics();