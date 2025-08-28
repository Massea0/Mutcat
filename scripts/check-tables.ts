import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkTables() {
  console.log('🔍 Vérification des tables Supabase...\n');

  const tables = [
    'projects',
    'news', 
    'tenders',
    'events',
    'careers',
    'publications',
    'hero_sliders',
    'statistics',
    'partners',
    'users'
  ];

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Table existe (${count || 0} enregistrements)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: Erreur inconnue`);
    }
  }

  console.log('\n📊 Vérification des colonnes importantes...\n');

  // Vérifier les colonnes de projects
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, category, image, is_featured')
      .limit(1);
    
    if (error) {
      console.log('❌ Projects - Colonnes manquantes:', error.message);
    } else {
      console.log('✅ Projects - Toutes les colonnes nécessaires existent');
    }
  } catch (err) {
    console.log('❌ Projects - Erreur:', err);
  }

  // Vérifier les colonnes de news
  try {
    const { data, error } = await supabase
      .from('news')
      .select('id, title, author, category, excerpt, image, is_featured')
      .limit(1);
    
    if (error) {
      console.log('❌ News - Colonnes manquantes:', error.message);
    } else {
      console.log('✅ News - Toutes les colonnes nécessaires existent');
    }
  } catch (err) {
    console.log('❌ News - Erreur:', err);
  }
}

checkTables();