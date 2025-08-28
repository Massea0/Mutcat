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

const tables = [
  'users',
  'projects',
  'news',
  'events',
  'tenders',
  'publications',
  'careers',
  'media',
  'hero_sliders',
  'statistics',
  'partners',
  'site_settings',
  'search_analytics',
  'quick_links',
  'faqs',
  'forms',
  'agenda_events',
  'press_articles'
];

async function verifyAllTables() {
  console.log('🔍 Vérification de toutes les tables essentielles\n');
  console.log('==================================================');
  
  let allGood = true;
  const results: { table: string; status: string; count: number }[] = [];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        results.push({ table, status: '❌ Manquante', count: 0 });
        allGood = false;
      } else {
        results.push({ table, status: '✅ Existe', count: count || 0 });
      }
    } catch (err) {
      results.push({ table, status: '❌ Erreur', count: 0 });
      allGood = false;
    }
  }
  
  // Afficher les résultats
  console.log('\nRésultats :\n');
  console.log('Table                  | Statut      | Entrées');
  console.log('----------------------|-------------|--------');
  
  results.forEach(r => {
    const tableName = r.table.padEnd(20);
    const status = r.status.padEnd(11);
    console.log(`${tableName} | ${status} | ${r.count}`);
  });
  
  console.log('\n==================================================');
  
  if (allGood) {
    console.log('\n✨ Toutes les tables existent ! Votre base de données est prête.');
  } else {
    const missing = results.filter(r => r.status.includes('❌'));
    console.log(`\n⚠️  ${missing.length} table(s) manquante(s) ou avec des erreurs :`);
    missing.forEach(m => console.log(`   - ${m.table}`));
    console.log('\nExécutez les migrations SQL correspondantes dans Supabase.');
  }
  
  // Statistiques globales
  const totalEntries = results.reduce((sum, r) => sum + r.count, 0);
  console.log(`\n📊 Total des entrées dans la base : ${totalEntries}`);
}

verifyAllTables();