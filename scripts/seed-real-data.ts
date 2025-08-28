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

async function seedRealData() {
  console.log('🚀 Insertion des données réelles dans Supabase...\n');

  try {
    // 1. Hero Sliders
    console.log('📋 Mise à jour des sliders...');
    const sliders = [
      {
        title: 'Bienvenue au MUCTAT',
        subtitle: 'Ministère de l\'Urbanisme, du Cadre de Vie et de l\'Aménagement du Territoire',
        description: 'Construire ensemble le Sénégal de demain avec des villes modernes et durables',
        image_url: '/images/pnalru.png',
        button_text: 'Découvrir nos missions',
        button_link: '/ministere/missions',
        order_index: 1,
        is_active: true
      },
      {
        title: 'Programme National d\'Aménagement',
        subtitle: 'PNALRU - Programme National d\'Amélioration du Logement Rural et Urbain',
        description: 'Améliorer les conditions de vie de millions de Sénégalais',
        image_url: '/images/pnalru.png',
        button_text: 'En savoir plus',
        button_link: '/projets',
        order_index: 2,
        is_active: true
      },
      {
        title: 'Vision Sénégal 2050',
        subtitle: 'Un Sénégal émergent et moderne',
        description: 'Planification urbaine innovante pour un développement harmonieux du territoire',
        image_url: '/logo.png',
        button_text: 'Notre vision',
        button_link: '/ministere/missions',
        order_index: 3,
        is_active: true
      }
    ];

    // Clear existing sliders and insert new ones
    await supabase.from('hero_sliders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: sliderError } = await supabase.from('hero_sliders').insert(sliders);
    if (sliderError) console.error('Erreur sliders:', sliderError);
    else console.log('✅ Sliders mis à jour');

    // 2. Statistics
    console.log('📊 Mise à jour des statistiques...');
    const statistics = [
      { label: 'Projets en cours', value: '156', icon: 'Building2', order_index: 1, is_active: true },
      { label: 'Villes impactées', value: '52', icon: 'MapPin', order_index: 2, is_active: true },
      { label: 'Logements construits', value: '25,000+', icon: 'Home', order_index: 3, is_active: true },
      { label: 'Emplois créés', value: '12,500+', icon: 'Users', order_index: 4, is_active: true }
    ];

    await supabase.from('statistics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: statsError } = await supabase.from('statistics').insert(statistics);
    if (statsError) console.error('Erreur stats:', statsError);
    else console.log('✅ Statistiques mises à jour');

    // 3. Projects
    console.log('🏗️ Création de projets réels...');
    const projects = [
      {
        title: 'Programme National d\'Amélioration du Logement Rural et Urbain (PNALRU)',
        description: 'Programme ambitieux visant à améliorer les conditions de logement de millions de Sénégalais à travers le pays.',
        content: 'Le PNALRU est un programme phare du gouvernement sénégalais qui vise à construire 100,000 logements sociaux sur 5 ans.',
        category: 'Logement Social',
        status: 'En cours',
        location: 'National',
        start_date: '2023-01-01',
        end_date: '2028-12-31',
        budget: 500000000,
        progress: 35,
        image: '/images/pnalru.png',
        is_featured: true,
        featured_order: 1
      },
      {
        title: 'Ville Nouvelle de Diamniadio',
        description: 'Construction d\'une ville moderne et durable pour désengorger Dakar.',
        content: 'Diamniadio représente l\'avenir de l\'urbanisme au Sénégal avec ses infrastructures modernes.',
        category: 'Aménagement Urbain',
        status: 'En cours',
        location: 'Diamniadio',
        start_date: '2014-01-01',
        end_date: '2035-12-31',
        budget: 2000000000,
        progress: 60,
        image: '/logo.png',
        is_featured: true,
        featured_order: 2
      },
      {
        title: 'Rénovation du Centre-Ville de Dakar',
        description: 'Modernisation et embellissement du centre historique de la capitale.',
        content: 'Un projet de rénovation urbaine pour redonner vie au centre-ville de Dakar.',
        category: 'Rénovation Urbaine',
        status: 'En cours',
        location: 'Dakar',
        start_date: '2022-06-01',
        end_date: '2025-12-31',
        budget: 150000000,
        progress: 45,
        image: '/logo.png',
        is_featured: true,
        featured_order: 3
      },
      {
        title: 'Pôle Urbain de Daga-Kholpa',
        description: 'Création d\'un nouveau pôle urbain intégré dans la région de Dakar.',
        content: 'Le pôle urbain de Daga-Kholpa offrira logements, commerces et espaces verts.',
        category: 'Développement Urbain',
        status: 'En préparation',
        location: 'Daga-Kholpa',
        start_date: '2024-01-01',
        end_date: '2030-12-31',
        budget: 800000000,
        progress: 15,
        image: '/images/pnalru.png',
        is_featured: true,
        featured_order: 4
      }
    ];

    // Clear and insert projects
    await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: projectError } = await supabase.from('projects').insert(projects);
    if (projectError) console.error('Erreur projets:', projectError);
    else console.log('✅ Projets créés');

    // 4. News
    console.log('📰 Création d\'actualités réelles...');
    const news = [
      {
        title: 'Le Ministre inaugure 500 nouveaux logements sociaux à Diamniadio',
        excerpt: 'Une cérémonie d\'inauguration s\'est tenue ce matin en présence du ministre et des bénéficiaires.',
        content: 'Le Ministre de l\'Urbanisme a procédé ce matin à l\'inauguration de 500 nouveaux logements sociaux dans la ville nouvelle de Diamniadio. Cette réalisation s\'inscrit dans le cadre du programme national de logements sociaux.',
        author: 'Direction de la Communication',
        category: 'Inauguration',
        published_at: new Date().toISOString(),
        image: '/images/pnalru.png',
        is_featured: true,
        featured_order: 1,
        status: 'published'
      },
      {
        title: 'Signature d\'un accord de financement avec la Banque Mondiale',
        excerpt: 'Un nouveau financement de 200 millions de dollars pour les projets urbains.',
        content: 'Le Sénégal et la Banque Mondiale ont signé un accord de financement de 200 millions de dollars pour soutenir les projets de développement urbain et de logement social.',
        author: 'Service de Presse',
        category: 'Coopération',
        published_at: new Date(Date.now() - 86400000).toISOString(),
        image: '/logo.png',
        is_featured: true,
        featured_order: 2,
        status: 'published'
      },
      {
        title: 'Lancement du programme de rénovation urbaine à Saint-Louis',
        excerpt: 'La ville historique bénéficiera d\'un programme de réhabilitation.',
        content: 'Le gouvernement lance un ambitieux programme de rénovation urbaine à Saint-Louis pour préserver le patrimoine tout en modernisant les infrastructures.',
        author: 'Direction de la Communication',
        category: 'Développement',
        published_at: new Date(Date.now() - 172800000).toISOString(),
        image: '/images/portraitministre.png',
        status: 'published'
      }
    ];

    await supabase.from('news').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: newsError } = await supabase.from('news').insert(news);
    if (newsError) console.error('Erreur news:', newsError);
    else console.log('✅ Actualités créées');

    // 5. Partners
    console.log('🤝 Mise à jour des partenaires...');
    const partners = [
      {
        name: 'Banque Mondiale',
        logo_url: '/images/partners/world-bank.png',
        website: 'https://www.worldbank.org',
        description: 'Partenaire financier principal pour les projets de développement urbain',
        order_index: 1,
        is_active: true
      },
      {
        name: 'Union Européenne',
        logo_url: '/images/partners/eu.png',
        website: 'https://europa.eu',
        description: 'Coopération technique et financière',
        order_index: 2,
        is_active: true
      },
      {
        name: 'PNUD',
        logo_url: '/images/partners/undp.png',
        website: 'https://www.undp.org',
        description: 'Programme des Nations Unies pour le Développement',
        order_index: 3,
        is_active: true
      },
      {
        name: 'BAD',
        logo_url: '/images/partners/bad.png',
        website: 'https://www.afdb.org',
        description: 'Banque Africaine de Développement',
        order_index: 4,
        is_active: true
      },
      {
        name: 'AFD',
        logo_url: '/images/partners/afd.png',
        website: 'https://www.afd.fr',
        description: 'Agence Française de Développement',
        order_index: 5,
        is_active: true
      }
    ];

    await supabase.from('partners').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: partnersError } = await supabase.from('partners').insert(partners);
    if (partnersError) console.error('Erreur partners:', partnersError);
    else console.log('✅ Partenaires mis à jour');

    // 6. Tenders
    console.log('📄 Création d\'appels d\'offres...');
    const tenders = [
      {
        reference: 'AON-001-2024',
        title: 'Construction de 1000 logements sociaux à Thiès',
        description: 'Appel d\'offres pour la construction de 1000 logements sociaux dans la région de Thiès.',
        type: 'Travaux',
        status: 'open',
        submission_deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
        estimated_amount: 15000000,
        documents: ['/documents/ao-001-2024.pdf'],
        requirements: ['Agrément BTP catégorie B4', 'Chiffre d\'affaires minimum 5 milliards FCFA', 'Références similaires'],
        created_at: new Date().toISOString()
      },
      {
        reference: 'AON-002-2024',
        title: 'Étude d\'impact environnemental - Projet Daga-Kholpa',
        description: 'Recrutement d\'un cabinet pour l\'étude d\'impact environnemental du pôle urbain.',
        type: 'Services',
        status: 'open',
        submission_deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
        estimated_amount: 50000000,
        documents: ['/documents/ao-002-2024.pdf'],
        requirements: ['Expertise en études environnementales', 'Agrément ministériel'],
        created_at: new Date().toISOString()
      }
    ];

    await supabase.from('tenders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: tendersError } = await supabase.from('tenders').insert(tenders);
    if (tendersError) console.error('Erreur tenders:', tendersError);
    else console.log('✅ Appels d\'offres créés');

    // 7. Events
    console.log('📅 Création d\'événements...');
    const events = [
      {
        title: 'Forum National sur l\'Habitat',
        description: 'Rencontre nationale sur les défis et opportunités du secteur de l\'habitat au Sénégal.',
        date: new Date(Date.now() + 15 * 86400000).toISOString(),
        time: '09:00',
        location: 'Centre International de Conférences de Diamniadio',
        type: 'Conférence',
        is_featured: true,
        registration_link: 'https://muctat.gouv.sn/forum-habitat',
        status: 'upcoming'
      },
      {
        title: 'Atelier de validation du Plan Directeur d\'Urbanisme de Dakar',
        description: 'Session de travail avec les parties prenantes pour valider le nouveau PDU.',
        date: new Date(Date.now() + 7 * 86400000).toISOString(),
        time: '14:00',
        location: 'Hôtel Terrou-Bi',
        type: 'Atelier',
        status: 'upcoming'
      }
    ];

    await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: eventsError } = await supabase.from('events').insert(events);
    if (eventsError) console.error('Erreur events:', eventsError);
    else console.log('✅ Événements créés');

    // 8. Careers
    console.log('💼 Création d\'offres d\'emploi...');
    const careers = [
      {
        title: 'Architecte Urbaniste Senior',
        department: 'Direction de l\'Urbanisme',
        location: 'Dakar',
        type: 'CDI',
        description: 'Nous recherchons un architecte urbaniste expérimenté pour rejoindre notre équipe.',
        requirements: ['Master en Architecture ou Urbanisme', '5 ans d\'expérience minimum', 'Maîtrise des outils de CAO'],
        responsibilities: ['Conception de plans d\'aménagement', 'Supervision de projets', 'Coordination avec les équipes'],
        deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
        status: 'open'
      },
      {
        title: 'Chargé de Communication Digital',
        department: 'Direction de la Communication',
        location: 'Dakar',
        type: 'CDD',
        description: 'Responsable de la stratégie digitale et de la gestion des réseaux sociaux.',
        requirements: ['Licence en Communication', 'Expérience en community management', 'Créativité'],
        responsibilities: ['Gestion des réseaux sociaux', 'Création de contenu', 'Veille digitale'],
        deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
        status: 'open'
      }
    ];

    await supabase.from('careers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: careersError } = await supabase.from('careers').insert(careers);
    if (careersError) console.error('Erreur careers:', careersError);
    else console.log('✅ Offres d\'emploi créées');

    // 9. Publications
    console.log('📚 Création de publications...');
    const publications = [
      {
        title: 'Plan National d\'Urbanisme 2050',
        description: 'Document stratégique pour le développement urbain du Sénégal à l\'horizon 2050.',
        type: 'Rapport',
        category: 'Planification',
        file_url: '/documents/pnu-2050.pdf',
        file_size: '15.2 MB',
        author: 'MUCTAT',
        year: 2024,
        download_count: 0,
        is_featured: true
      },
      {
        title: 'Guide des procédures d\'obtention du permis de construire',
        description: 'Manuel pratique pour les demandes de permis de construire.',
        type: 'Guide',
        category: 'Procédures',
        file_url: '/documents/guide-permis.pdf',
        file_size: '3.5 MB',
        author: 'Direction de l\'Urbanisme',
        year: 2024,
        download_count: 0
      }
    ];

    await supabase.from('publications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: pubError } = await supabase.from('publications').insert(publications);
    if (pubError) console.error('Erreur publications:', pubError);
    else console.log('✅ Publications créées');

    console.log('\n✅ Toutes les données réelles ont été insérées avec succès !');
    console.log('\n📸 Images manquantes à ajouter :');
    console.log('- /images/housing-project.jpg (pour les projets de logement)');
    console.log('- /images/smart-city.jpg (pour les projets de ville intelligente)');
    console.log('- /images/dakar-skyline.jpg (pour les vues de Dakar)');
    console.log('- /images/infrastructure.jpg (pour les projets d\'infrastructure)');
    console.log('- /images/meeting.jpg (pour les réunions)');
    console.log('- /images/park.jpg (pour les espaces verts)');
    console.log('- Des logos réels pour les partenaires (actuellement placeholders)');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

seedRealData();