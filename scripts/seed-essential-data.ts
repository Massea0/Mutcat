import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedEssentialData() {
  console.log('🚀 Insertion des données essentielles...\n');

  try {
    // 1. Projects simples
    console.log('📦 Création de projets...');
    const projects = [
      {
        title: 'Programme National de Logements Sociaux',
        description: 'Construction de 100,000 logements sur 5 ans',
        status: 'En cours',
        location: 'National',
        budget: 500000000,
        progress: 35
      },
      {
        title: 'Ville Nouvelle de Diamniadio',
        description: 'Développement urbain moderne',
        status: 'En cours',
        location: 'Diamniadio',
        budget: 2000000000,
        progress: 60
      },
      {
        title: 'Rénovation Centre-Ville Dakar',
        description: 'Modernisation du centre historique',
        status: 'En cours',
        location: 'Dakar',
        budget: 150000000,
        progress: 45
      }
    ];

    for (const project of projects) {
      const { error } = await supabase.from('projects').insert(project);
      if (error) console.log('Projet:', error.message);
    }
    console.log('✅ Projets créés');

    // 2. News simples
    console.log('📰 Création d\'actualités...');
    const news = [
      {
        title: 'Inauguration de 500 logements à Diamniadio',
        content: 'Le ministre a inauguré 500 nouveaux logements sociaux.',
        status: 'published'
      },
      {
        title: 'Accord avec la Banque Mondiale',
        content: 'Signature d\'un financement de 200 millions de dollars.',
        status: 'published'
      },
      {
        title: 'Lancement du programme Saint-Louis',
        content: 'Programme de rénovation urbaine lancé à Saint-Louis.',
        status: 'published'
      }
    ];

    for (const article of news) {
      const { error } = await supabase.from('news').insert(article);
      if (error) console.log('News:', error.message);
    }
    console.log('✅ Actualités créées');

    // 3. Tenders simples
    console.log('📄 Création d\'appels d\'offres...');
    const tenders = [
      {
        title: 'Construction 1000 logements Thiès',
        description: 'Appel d\'offres pour construction de logements',
        status: 'open'
      },
      {
        title: 'Étude environnementale Daga-Kholpa',
        description: 'Recrutement cabinet d\'études',
        status: 'open'
      }
    ];

    for (const tender of tenders) {
      const { error } = await supabase.from('tenders').insert(tender);
      if (error) console.log('Tender:', error.message);
    }
    console.log('✅ Appels d\'offres créés');

    // 4. Publications simples
    console.log('📚 Création de publications...');
    const publications = [
      {
        title: 'Plan National d\'Urbanisme 2050',
        description: 'Document stratégique pour le développement urbain',
        file_url: '/documents/pnu-2050.pdf'
      },
      {
        title: 'Guide du permis de construire',
        description: 'Manuel pratique pour les demandes',
        file_url: '/documents/guide-permis.pdf'
      }
    ];

    for (const pub of publications) {
      const { error } = await supabase.from('publications').insert(pub);
      if (error) console.log('Publication:', error.message);
    }
    console.log('✅ Publications créées');

    // 5. Vérifier les comptes
    console.log('\n📊 Résumé des données :');
    
    const tables = ['projects', 'news', 'tenders', 'publications', 'hero_sliders', 'statistics', 'partners'];
    
    for (const table of tables) {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      console.log(`- ${table}: ${count || 0} enregistrements`);
    }

    console.log('\n✅ Données essentielles insérées !');
    console.log('\n🔑 Pour tester la console admin :');
    console.log('URL: http://localhost:3000/admin');
    console.log('Email: admin@muctat.gov.sn');
    console.log('Mot de passe: Admin@MUCTAT2024');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

seedEssentialData();