#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkPublicData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  console.log('🔍 Vérification des données publiques...\n');
  
  // Actualités
  const { data: news, error: newsError } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });
  
  console.log('📰 Actualités:');
  if (newsError) {
    console.error('  ❌ Erreur:', newsError.message);
  } else {
    console.log(`  ✅ ${news?.length || 0} articles trouvés`);
    news?.slice(0, 3).forEach(n => {
      console.log(`     - ${n.title}`);
    });
  }
  
  // Événements
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true });
  
  console.log('\n📅 Événements:');
  if (eventsError) {
    console.error('  ❌ Erreur:', eventsError.message);
  } else {
    console.log(`  ✅ ${events?.length || 0} événements trouvés`);
    events?.slice(0, 3).forEach(e => {
      console.log(`     - ${e.title} (${new Date(e.start_date).toLocaleDateString()})`);
    });
  }
  
  // Projets
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .eq('is_featured', true);
  
  console.log('\n🏗️ Projets en vedette:');
  if (projectsError) {
    console.error('  ❌ Erreur:', projectsError.message);
  } else {
    console.log(`  ✅ ${projects?.length || 0} projets en vedette`);
    projects?.forEach(p => {
      console.log(`     - ${p.title}`);
    });
  }
  
  // Sliders
  const { data: sliders, error: slidersError } = await supabase
    .from('hero_sliders')
    .select('*')
    .eq('is_active', true)
    .order('order_index');
  
  console.log('\n🖼️ Sliders actifs:');
  if (slidersError) {
    console.error('  ❌ Erreur:', slidersError.message);
  } else {
    console.log(`  ✅ ${sliders?.length || 0} sliders actifs`);
    sliders?.forEach(s => {
      console.log(`     - ${s.title}`);
    });
  }
}

checkPublicData().catch(console.error);