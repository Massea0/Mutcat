import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seedCompleteData() {
  console.log('🚀 Insertion complète des données pour la démo...\n');

  try {
    // 1. Projects avec slug
    console.log('📦 Création de projets...');
    const projects = [
      {
        title: 'Programme National de Logements Sociaux',
        slug: 'programme-national-logements-sociaux',
        description: 'Construction de 100,000 logements sociaux sur 5 ans pour améliorer les conditions de vie',
        status: 'En cours',
        location: 'National',
        budget: 500000000,
        progress: 35,
        image: '/images/pnalru.png',
        category: 'Logement Social',
        is_featured: true,
        featured_order: 1
      },
      {
        title: 'Ville Nouvelle de Diamniadio',
        slug: 'ville-nouvelle-diamniadio',
        description: 'Développement d\'une ville moderne et durable pour désengorger Dakar',
        status: 'En cours',
        location: 'Diamniadio',
        budget: 2000000000,
        progress: 60,
        image: '/logo.png',
        category: 'Aménagement Urbain',
        is_featured: true,
        featured_order: 2
      },
      {
        title: 'Rénovation du Centre-Ville de Dakar',
        slug: 'renovation-centre-ville-dakar',
        description: 'Modernisation et embellissement du centre historique de la capitale',
        status: 'En cours',
        location: 'Dakar',
        budget: 150000000,
        progress: 45,
        image: '/images/dakar-skyline.svg',
        category: 'Rénovation Urbaine',
        is_featured: true,
        featured_order: 3
      },
      {
        title: 'Pôle Urbain de Daga-Kholpa',
        slug: 'pole-urbain-daga-kholpa',
        description: 'Création d\'un nouveau pôle urbain intégré avec logements et commerces',
        status: 'En préparation',
        location: 'Daga-Kholpa',
        budget: 800000000,
        progress: 15,
        image: '/images/smart-city.svg',
        category: 'Développement Urbain'
      }
    ];

    // Supprimer les anciens et insérer les nouveaux
    await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    for (const project of projects) {
      const { error } = await supabase.from('projects').insert(project);
      if (error) console.log('Erreur projet:', error.message);
    }
    console.log('✅ Projets créés');

    // 2. Tenders avec référence
    console.log('📄 Création d\'appels d\'offres...');
    const tenders = [
      {
        reference: 'AON-001-2024',
        title: 'Construction de 1000 logements sociaux à Thiès',
        description: 'Appel d\'offres national pour la construction de 1000 logements sociaux dans la région de Thiès',
        type: 'Travaux',
        status: 'open',
        estimated_amount: 15000000000,
        submission_deadline: new Date(Date.now() + 30 * 86400000).toISOString()
      },
      {
        reference: 'AON-002-2024',
        title: 'Étude d\'impact environnemental - Pôle Daga-Kholpa',
        description: 'Recrutement d\'un cabinet pour réaliser l\'étude d\'impact environnemental et social',
        type: 'Services',
        status: 'open',
        estimated_amount: 50000000,
        submission_deadline: new Date(Date.now() + 20 * 86400000).toISOString()
      },
      {
        reference: 'AOI-003-2024',
        title: 'Fourniture d\'équipements informatiques',
        description: 'Acquisition de matériel informatique pour les services du ministère',
        type: 'Fournitures',
        status: 'open',
        estimated_amount: 25000000,
        submission_deadline: new Date(Date.now() + 15 * 86400000).toISOString()
      }
    ];

    await supabase.from('tenders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    for (const tender of tenders) {
      const { error } = await supabase.from('tenders').insert(tender);
      if (error) console.log('Erreur tender:', error.message);
    }
    console.log('✅ Appels d\'offres créés');

    // 3. Events
    console.log('📅 Création d\'événements...');
    const events = [
      {
        title: 'Forum National sur l\'Habitat',
        description: 'Grande rencontre nationale sur les défis du logement',
        start_date: new Date(Date.now() + 15 * 86400000).toISOString(),
        end_date: new Date(Date.now() + 16 * 86400000).toISOString(),
        location: 'CICAD - Diamniadio',
        type: 'conference',
        status: 'upcoming'
      },
      {
        title: 'Atelier de validation du PDU',
        description: 'Validation du Plan Directeur d\'Urbanisme de Dakar',
        start_date: new Date(Date.now() + 7 * 86400000).toISOString(),
        end_date: new Date(Date.now() + 7 * 86400000).toISOString(),
        location: 'Hôtel Terrou-Bi',
        type: 'workshop',
        status: 'upcoming'
      }
    ];

    await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    for (const event of events) {
      const { error } = await supabase.from('events').insert(event);
      if (error) console.log('Erreur event:', error.message);
    }
    console.log('✅ Événements créés');

    // 4. Careers
    console.log('💼 Vérification des offres d\'emploi...');
    const { count: careersCount } = await supabase
      .from('careers')
      .select('*', { count: 'exact', head: true });
    
    if (!careersCount || careersCount === 0) {
      const careers = [
        {
          title: 'Architecte Urbaniste Senior',
          department: 'Direction de l\'Urbanisme',
          location: 'Dakar',
          type: 'CDI',
          description: 'Nous recherchons un architecte urbaniste expérimenté',
          deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
          status: 'open'
        },
        {
          title: 'Chargé de Communication Digital',
          department: 'Direction de la Communication',
          location: 'Dakar',
          type: 'CDD',
          description: 'Responsable de la stratégie digitale du ministère',
          deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
          status: 'open'
        }
      ];

      for (const career of careers) {
        await supabase.from('careers').insert(career);
      }
      console.log('✅ Offres d\'emploi créées');
    }

    // 5. Résumé final
    console.log('\n📊 Résumé des données insérées :');
    console.log('=' .repeat(40));
    
    const tables = [
      'hero_sliders',
      'statistics',
      'partners',
      'projects',
      'news',
      'tenders',
      'publications',
      'events',
      'careers'
    ];
    
    for (const table of tables) {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      const emoji = count && count > 0 ? '✅' : '⚠️';
      console.log(`${emoji} ${table.padEnd(15)}: ${count || 0} enregistrements`);
    }

    console.log('\n🎉 Site prêt pour la démo !');
    console.log('=' .repeat(40));
    console.log('\n📱 SITE PUBLIC : http://localhost:3000');
    console.log('🔐 ADMIN : http://localhost:3000/admin');
    console.log('   Email : admin@muctat.gov.sn');
    console.log('   Mot de passe : Admin@MUCTAT2024');
    console.log('\n💡 Les données sont maintenant visibles sur le site public');
    console.log('   et modifiables depuis la console d\'administration.');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

seedCompleteData();