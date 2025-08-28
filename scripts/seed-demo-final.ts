import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDemoData() {
  console.log('🚀 Insertion finale des données de démo...\n');

  try {
    // 1. Projects avec les bonnes valeurs de status
    console.log('📦 Création de projets...');
    const projects = [
      {
        title: 'Programme National de Logements Sociaux',
        slug: 'programme-national-logements',
        description: 'Construction de 100,000 logements sociaux sur 5 ans',
        status: 'in_progress', // Utiliser les valeurs exactes de la contrainte
        location: 'National',
        budget: 500000000,
        progress: 35
      },
      {
        title: 'Ville Nouvelle de Diamniadio',
        slug: 'ville-nouvelle-diamniadio',
        description: 'Développement urbain moderne et durable',
        status: 'in_progress',
        location: 'Diamniadio',
        budget: 2000000000,
        progress: 60
      },
      {
        title: 'Rénovation Centre-Ville Dakar',
        slug: 'renovation-dakar',
        description: 'Modernisation du centre historique',
        status: 'in_progress',
        location: 'Dakar',
        budget: 150000000,
        progress: 45
      },
      {
        title: 'Pôle Urbain Daga-Kholpa',
        slug: 'pole-daga-kholpa',
        description: 'Nouveau pôle urbain intégré',
        status: 'planned',
        location: 'Daga-Kholpa',
        budget: 800000000,
        progress: 15
      }
    ];

    await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    for (const project of projects) {
      const { data, error } = await supabase.from('projects').insert(project).select();
      if (error) {
        console.log(`❌ Projet "${project.title}":`, error.message);
      } else {
        console.log(`✅ Projet créé: ${project.title}`);
      }
    }

    // 2. Tenders sans la colonne type si elle n'existe pas
    console.log('\n📄 Création d\'appels d\'offres...');
    const tenders = [
      {
        reference: 'AON-001-2024',
        title: 'Construction 1000 logements Thiès',
        description: 'Construction de logements sociaux',
        status: 'open'
      },
      {
        reference: 'AON-002-2024',
        title: 'Étude environnementale',
        description: 'Étude d\'impact pour Daga-Kholpa',
        status: 'open'
      }
    ];

    await supabase.from('tenders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    for (const tender of tenders) {
      const { data, error } = await supabase.from('tenders').insert(tender).select();
      if (error) {
        console.log(`❌ Appel d'offres:`, error.message);
      } else {
        console.log(`✅ Appel d'offres créé: ${tender.title}`);
      }
    }

    // 3. Events avec event_type au lieu de type
    console.log('\n📅 Création d\'événements...');
    const events = [
      {
        title: 'Forum National Habitat',
        description: 'Rencontre sur le logement',
        start_date: new Date(Date.now() + 15 * 86400000).toISOString(),
        end_date: new Date(Date.now() + 16 * 86400000).toISOString(),
        location: 'CICAD Diamniadio',
        event_type: 'conference', // Utiliser event_type
        status: 'upcoming'
      },
      {
        title: 'Atelier PDU Dakar',
        description: 'Validation du plan directeur',
        start_date: new Date(Date.now() + 7 * 86400000).toISOString(),
        end_date: new Date(Date.now() + 7 * 86400000).toISOString(),
        location: 'Hôtel Terrou-Bi',
        event_type: 'workshop',
        status: 'upcoming'
      }
    ];

    await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    for (const event of events) {
      const { data, error } = await supabase.from('events').insert(event).select();
      if (error) {
        console.log(`❌ Événement:`, error.message);
      } else {
        console.log(`✅ Événement créé: ${event.title}`);
      }
    }

    // 4. Résumé final avec compte exact
    console.log('\n' + '='.repeat(50));
    console.log('📊 RÉSUMÉ FINAL DES DONNÉES');
    console.log('='.repeat(50));
    
    const summaryTables = [
      { name: 'hero_sliders', label: 'Sliders page d\'accueil' },
      { name: 'statistics', label: 'Statistiques' },
      { name: 'partners', label: 'Partenaires' },
      { name: 'projects', label: 'Projets' },
      { name: 'news', label: 'Actualités' },
      { name: 'tenders', label: 'Appels d\'offres' },
      { name: 'publications', label: 'Publications' },
      { name: 'events', label: 'Événements' },
      { name: 'careers', label: 'Offres d\'emploi' },
      { name: 'users', label: 'Utilisateurs' }
    ];
    
    for (const table of summaryTables) {
      const { count } = await supabase.from(table.name).select('*', { count: 'exact', head: true });
      const status = count && count > 0 ? '✅' : '⚠️';
      console.log(`${status} ${table.label.padEnd(25)}: ${count || 0}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 SITE PRÊT POUR LA DÉMO !');
    console.log('='.repeat(50));
    console.log('\n🌐 Accès au site :');
    console.log('   Site public : http://localhost:3000');
    console.log('   Administration : http://localhost:3000/admin');
    console.log('\n🔐 Identifiants admin :');
    console.log('   Email : admin@muctat.gov.sn');
    console.log('   Mot de passe : Admin@MUCTAT2024');
    console.log('\n✨ Fonctionnalités disponibles :');
    console.log('   ✓ Navigation complète du site public');
    console.log('   ✓ Visualisation des projets et actualités');
    console.log('   ✓ Console d\'admin pour gérer le contenu');
    console.log('   ✓ Upload d\'images et documents');
    console.log('   ✓ Gestion des utilisateurs');
    console.log('\n' + '='.repeat(50));

  } catch (error) {
    console.error('❌ Erreur globale:', error);
  }
}

seedDemoData();