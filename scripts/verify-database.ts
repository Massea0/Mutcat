#!/usr/bin/env tsx
/**
 * Script pour vérifier l'état de la base de données
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyTables() {
  console.log('🔍 Vérification des tables...\n');
  
  const tables = [
    'projects',
    'news',
    'tenders',
    'publications',
    'events',
    'careers',
    'media',
    'hero_sliders',
    'statistics',
    'partners',
    'site_settings',
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
        console.log(`✅ ${table}: ${count || 0} enregistrements`);
      }
    } catch (err) {
      console.log(`❌ ${table}: Erreur inconnue`);
    }
  }
}

async function verifyColumns() {
  console.log('\n🔍 Vérification des colonnes critiques...\n');
  
  const columnsToCheck = [
    { table: 'publications', column: 'status' },
    { table: 'media', column: 'type' },
    { table: 'projects', column: 'content' },
    { table: 'projects', column: 'slug' },
    { table: 'projects', column: 'status' },
    { table: 'news', column: 'content' },
    { table: 'news', column: 'slug' },
    { table: 'tenders', column: 'type' },
    { table: 'tenders', column: 'submission_deadline' },
    { table: 'events', column: 'start_date' },
    { table: 'events', column: 'end_date' },
    { table: 'events', column: 'event_type' },
    { table: 'publications', column: 'download_count' },
    { table: 'publications', column: 'is_featured' },
    { table: 'events', column: 'is_featured' }
  ];
  
  for (const { table, column } of columnsToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select(column)
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}.${column}: ${error.message}`);
      } else {
        console.log(`✅ ${table}.${column}: OK`);
      }
    } catch (err) {
      console.log(`❌ ${table}.${column}: Erreur`);
    }
  }
}

async function checkFeaturedContent() {
  console.log('\n🔍 Vérification du contenu mis en avant...\n');
  
  // Projets en vedette
  const { data: featuredProjects, error: projectsError } = await supabase
    .from('projects')
    .select('title, is_featured')
    .eq('is_featured', true);
  
  if (projectsError) {
    console.log(`❌ Projets en vedette: ${projectsError.message}`);
  } else {
    console.log(`✅ Projets en vedette: ${featuredProjects?.length || 0}`);
    featuredProjects?.forEach(p => console.log(`   - ${p.title}`));
  }
  
  // Actualités en vedette
  const { data: featuredNews, error: newsError } = await supabase
    .from('news')
    .select('title, is_featured')
    .eq('is_featured', true);
  
  if (newsError) {
    console.log(`❌ Actualités en vedette: ${newsError.message}`);
  } else {
    console.log(`✅ Actualités en vedette: ${featuredNews?.length || 0}`);
    featuredNews?.forEach(n => console.log(`   - ${n.title}`));
  }
  
  // Sliders actifs
  const { data: activeSliders, error: slidersError } = await supabase
    .from('hero_sliders')
    .select('title, is_active')
    .eq('is_active', true)
    .order('order_index');
  
  if (slidersError) {
    console.log(`❌ Sliders actifs: ${slidersError.message}`);
  } else {
    console.log(`✅ Sliders actifs: ${activeSliders?.length || 0}`);
    activeSliders?.forEach(s => console.log(`   - ${s.title}`));
  }
}

async function main() {
  console.log('🚀 Vérification de la base de données...\n');
  
  await verifyTables();
  await verifyColumns();
  await checkFeaturedContent();
  
  console.log('\n✨ Vérification terminée!');
  console.log('\n📌 Si vous voyez des erreurs ci-dessus, exécutez le fichier SQL suivant dans Supabase:');
  console.log('   supabase/migrations/012_fix_critical_columns.sql');
  console.log('\nPuis exécutez: npm run seed:fix');
}

main().catch(console.error);