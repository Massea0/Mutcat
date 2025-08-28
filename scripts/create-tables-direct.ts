import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTables() {
  console.log('🚀 Creating missing tables directly via Supabase...\n');

  // Test if tables exist first
  const tablesToCreate = [
    {
      name: 'hero_sliders',
      testData: {
        title: 'Bienvenue au MUCTAT',
        subtitle: 'Ministère de l\'Urbanisme',
        description: 'Construire ensemble le Sénégal de demain',
        button_text: 'En savoir plus',
        button_link: '/ministere/missions',
        order_index: 1,
        is_active: true
      }
    },
    {
      name: 'statistics',
      testData: {
        label: 'Projets en cours',
        value: '127',
        icon: 'Building2',
        order_index: 1,
        is_active: true
      }
    },
    {
      name: 'partners',
      testData: {
        name: 'Banque Mondiale',
        logo_url: '/images/partners/world-bank.png',
        website: 'https://www.worldbank.org',
        order_index: 1,
        is_active: true
      }
    },
    {
      name: 'quick_links',
      testData: {
        title: 'Appels d\'offres',
        url: '/appels-offres',
        icon: 'FileText',
        order_index: 1,
        is_active: true
      }
    },
    {
      name: 'site_settings',
      testData: {
        key: 'site_title',
        value: { fr: 'MUCTAT', en: 'MUCTAT' }
      }
    }
  ];

  for (const table of tablesToCreate) {
    console.log(`📋 Checking table: ${table.name}`);
    
    // Try to select from the table
    const { data: existingData, error: selectError } = await supabase
      .from(table.name)
      .select('*')
      .limit(1);

    if (selectError && selectError.message.includes('not find the table')) {
      console.log(`   ❌ Table doesn't exist. Please create it manually in Supabase Dashboard.`);
    } else if (selectError) {
      console.log(`   ⚠️  Error accessing table: ${selectError.message}`);
    } else {
      console.log(`   ✅ Table exists`);
      
      // If table is empty, add test data
      if (!existingData || existingData.length === 0) {
        console.log(`   📝 Adding sample data...`);
        const { error: insertError } = await supabase
          .from(table.name)
          .insert(table.testData);
        
        if (insertError) {
          console.log(`   ⚠️  Failed to insert data: ${insertError.message}`);
        } else {
          console.log(`   ✅ Sample data added`);
        }
      }
    }
  }

  // Check for is_featured columns
  console.log('\n📋 Checking columns on existing tables...\n');
  
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .limit(1);
  
  if (projectError && projectError.message.includes('is_featured')) {
    console.log('❌ Column is_featured missing on projects table');
  } else {
    console.log('✅ Projects table is accessible');
  }

  const { data: newsData, error: newsError } = await supabase
    .from('news')
    .select('*')
    .limit(1);
  
  if (newsError && newsError.message.includes('is_featured')) {
    console.log('❌ Column is_featured missing on news table');
  } else {
    console.log('✅ News table is accessible');
  }

  console.log('\n' + '='.repeat(60));
  console.log('📌 MANUAL STEPS REQUIRED:');
  console.log('='.repeat(60));
  console.log('\n1. Go to your Supabase Dashboard: https://app.supabase.com');
  console.log('2. Navigate to the SQL Editor');
  console.log('3. Copy and run the SQL from: supabase/migrations/007_fix_missing_tables.sql');
  console.log('\nThis will:');
  console.log('  - Create missing tables (hero_sliders, statistics, partners, etc.)');
  console.log('  - Add is_featured columns to projects and news tables');
  console.log('  - Set up proper RLS policies');
  console.log('  - Insert sample data');
  console.log('\n' + '='.repeat(60));
}

createTables().catch(console.error);