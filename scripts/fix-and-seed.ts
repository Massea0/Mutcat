#!/usr/bin/env tsx
/**
 * Script pour corriger les colonnes manquantes et seeder les données
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQLFile(filename: string) {
  try {
    console.log(`\n📄 Exécution de ${filename}...`);
    const sql = readFileSync(join(__dirname, '..', 'supabase', 'migrations', filename), 'utf-8');
    
    // Exécuter le SQL via RPC ou directement
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();
    
    if (error) {
      // Si la fonction RPC n'existe pas, essayer une approche différente
      console.log('⚠️  Fonction RPC non disponible, veuillez exécuter le SQL manuellement dans Supabase Dashboard');
      console.log(`📋 Fichier SQL: supabase/migrations/${filename}`);
      return false;
    }
    
    console.log(`✅ ${filename} exécuté avec succès`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de l'exécution de ${filename}:`, error);
    return false;
  }
}

async function seedData() {
  console.log('\n🌱 Seeding des données...');
  
  try {
    // 1. Vérifier et créer les sliders
    const { data: sliders } = await supabase.from('hero_sliders').select('*');
    if (!sliders || sliders.length === 0) {
      console.log('📝 Création des sliders...');
      await supabase.from('hero_sliders').insert([
        {
          title: 'Vision Sénégal 2050',
          subtitle: 'Construire ensemble le Sénégal de demain',
          description: 'Un plan ambitieux pour transformer notre nation en un modèle de développement durable et inclusif',
          image_url: '/images/dakar-skyline.svg',
          button_text: 'Découvrir la Vision',
          button_link: '/projets/vision-2050',
          order_index: 1,
          is_active: true
        },
        {
          title: 'Programme National de Logement Social',
          subtitle: '100 000 logements d\'ici 2030',
          description: 'Garantir un logement décent et abordable pour chaque famille sénégalaise',
          image_url: '/images/housing-project.svg',
          button_text: 'En savoir plus',
          button_link: '/projets/logement-social',
          order_index: 2,
          is_active: true
        },
        {
          title: 'Smart Cities Initiative',
          subtitle: 'Des villes intelligentes pour l\'Afrique',
          description: 'Intégrer les technologies numériques pour améliorer la qualité de vie urbaine',
          image_url: '/images/smart-city.svg',
          button_text: 'Explorer',
          button_link: '/projets/smart-cities',
          order_index: 3,
          is_active: true
        }
      ]);
    }

    // 2. Vérifier et créer les projets
    const { data: projects } = await supabase.from('projects').select('*');
    if (!projects || projects.length === 0) {
      console.log('📝 Création des projets...');
      await supabase.from('projects').insert([
        {
          title: 'Vision Sénégal 2050',
          slug: 'vision-senegal-2050',
          description: 'Plan stratégique national pour le développement urbain et territorial',
          content: `
            <h2>Objectifs principaux</h2>
            <p>La Vision Sénégal 2050 est un plan ambitieux qui vise à transformer le Sénégal en une nation moderne, prospère et inclusive.</p>
            <h3>Axes stratégiques</h3>
            <ul>
              <li>Développement urbain durable</li>
              <li>Modernisation des infrastructures</li>
              <li>Inclusion sociale et économique</li>
              <li>Protection de l'environnement</li>
            </ul>
          `,
          status: 'active',
          start_date: '2025-01-01',
          end_date: '2050-12-31',
          budget: 500000000000,
          location: 'National',
          featured_image: '/images/dakar-skyline.svg',
          is_featured: true,
          featured_order: 1
        },
        {
          title: 'Programme National de Logement Social',
          slug: 'programme-logement-social',
          description: 'Construction de 100 000 logements sociaux accessibles',
          content: `
            <h2>Programme ambitieux</h2>
            <p>Ce programme vise à résoudre la crise du logement en construisant 100 000 unités d'habitation abordables.</p>
            <h3>Bénéficiaires</h3>
            <ul>
              <li>Familles à revenus modestes</li>
              <li>Jeunes professionnels</li>
              <li>Personnel de l'administration publique</li>
            </ul>
          `,
          status: 'active',
          start_date: '2025-01-01',
          end_date: '2030-12-31',
          budget: 200000000000,
          location: 'Dakar, Thiès, Saint-Louis',
          featured_image: '/images/housing-project.svg',
          is_featured: true,
          featured_order: 2
        },
        {
          title: 'Smart Cities Initiative',
          slug: 'smart-cities-initiative',
          description: 'Transformation numérique des villes sénégalaises',
          content: `
            <h2>Villes intelligentes</h2>
            <p>Intégration des technologies de pointe pour améliorer la gestion urbaine et la qualité de vie.</p>
            <h3>Technologies déployées</h3>
            <ul>
              <li>IoT pour la gestion du trafic</li>
              <li>Éclairage public intelligent</li>
              <li>Gestion optimisée des déchets</li>
              <li>Services publics numériques</li>
            </ul>
          `,
          status: 'active',
          start_date: '2025-03-01',
          end_date: '2028-12-31',
          budget: 50000000000,
          location: 'Diamniadio, Dakar',
          featured_image: '/images/smart-city.svg',
          is_featured: true,
          featured_order: 3
        }
      ]);
    }

    // 3. Vérifier et créer les actualités
    const { data: news } = await supabase.from('news').select('*');
    if (!news || news.length === 0) {
      console.log('📝 Création des actualités...');
      await supabase.from('news').insert([
        {
          title: 'Lancement officiel de la Vision Sénégal 2050',
          slug: 'lancement-vision-senegal-2050',
          excerpt: 'Le Président de la République a officiellement lancé la Vision Sénégal 2050 lors d\'une cérémonie au Grand Théâtre National.',
          content: `
            <p>Le Président de la République a présidé ce matin la cérémonie de lancement officiel de la Vision Sénégal 2050, 
            un plan stratégique ambitieux pour transformer le pays en une nation moderne et prospère.</p>
            <p>Cette vision, fruit de plusieurs mois de consultations nationales, définit les grandes orientations 
            du développement urbain et territorial pour les 25 prochaines années.</p>
          `,
          category: 'announcement',
          author: 'Direction de la Communication',
          published_at: new Date('2025-01-15'),
          featured_image: '/images/dakar-skyline.svg',
          is_featured: true,
          featured_order: 1
        },
        {
          title: 'Signature d\'un partenariat avec la Banque Mondiale',
          slug: 'partenariat-banque-mondiale',
          excerpt: 'Le Ministère signe un accord de financement de 500 millions USD avec la Banque Mondiale pour le programme de logement social.',
          content: `
            <p>Un accord historique a été signé aujourd'hui entre le Ministère et la Banque Mondiale pour le financement 
            du Programme National de Logement Social à hauteur de 500 millions de dollars américains.</p>
            <p>Ce financement permettra la construction de 50 000 logements sociaux dans les principales villes du pays 
            au cours des trois prochaines années.</p>
          `,
          category: 'partnership',
          author: 'Service de Presse',
          published_at: new Date('2025-01-10'),
          featured_image: '/images/housing-project.svg',
          is_featured: true,
          featured_order: 2
        },
        {
          title: 'Forum International sur les Villes Durables',
          slug: 'forum-villes-durables',
          excerpt: 'Dakar accueillera le Forum International sur les Villes Durables du 15 au 17 mars 2025.',
          content: `
            <p>Le Sénégal a l'honneur d'accueillir le Forum International sur les Villes Durables, 
            qui réunira plus de 500 experts internationaux de l'urbanisme et du développement durable.</p>
            <p>Cet événement majeur sera l'occasion de présenter les projets innovants du Sénégal 
            et d'échanger sur les meilleures pratiques mondiales.</p>
          `,
          category: 'event',
          author: 'Relations Internationales',
          published_at: new Date('2025-01-05'),
          featured_image: '/images/smart-city.svg',
          is_featured: false
        }
      ]);
    }

    // 4. Vérifier et créer les statistiques
    const { data: stats } = await supabase.from('statistics').select('*');
    if (!stats || stats.length === 0) {
      console.log('📝 Création des statistiques...');
      await supabase.from('statistics').insert([
        {
          label: 'Projets en cours',
          value: '127',
          icon: 'building',
          order_index: 1,
          is_active: true
        },
        {
          label: 'Logements construits',
          value: '15,420',
          icon: 'home',
          order_index: 2,
          is_active: true
        },
        {
          label: 'Emplois créés',
          value: '45,000+',
          icon: 'users',
          order_index: 3,
          is_active: true
        },
        {
          label: 'Investissements',
          value: '850 Mds FCFA',
          icon: 'trending-up',
          order_index: 4,
          is_active: true
        }
      ]);
    }

    // 5. Vérifier et créer les partenaires
    const { data: partners } = await supabase.from('partners').select('*');
    if (!partners || partners.length === 0) {
      console.log('📝 Création des partenaires...');
      await supabase.from('partners').insert([
        {
          name: 'Banque Mondiale',
          logo_url: '/images/partners/placeholder.svg',
          website_url: 'https://www.worldbank.org',
          order_index: 1,
          is_active: true
        },
        {
          name: 'Union Européenne',
          logo_url: '/images/partners/placeholder.svg',
          website_url: 'https://europa.eu',
          order_index: 2,
          is_active: true
        },
        {
          name: 'PNUD',
          logo_url: '/images/partners/placeholder.svg',
          website_url: 'https://www.undp.org',
          order_index: 3,
          is_active: true
        },
        {
          name: 'BAD',
          logo_url: '/images/partners/placeholder.svg',
          website_url: 'https://www.afdb.org',
          order_index: 4,
          is_active: true
        },
        {
          name: 'AFD',
          logo_url: '/images/partners/placeholder.svg',
          website_url: 'https://www.afd.fr',
          order_index: 5,
          is_active: true
        }
      ]);
    }

    console.log('✅ Seeding terminé avec succès');
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  }
}

async function main() {
  console.log('🚀 Début de la correction et du seeding...\n');
  
  // Note: Les migrations SQL doivent être exécutées manuellement dans Supabase
  console.log('📌 IMPORTANT: Veuillez d\'abord exécuter le fichier SQL suivant dans votre Supabase Dashboard:');
  console.log('   supabase/migrations/012_fix_critical_columns.sql\n');
  
  console.log('Appuyez sur Entrée une fois le SQL exécuté...');
  await new Promise(resolve => process.stdin.once('data', resolve));
  
  // Seeder les données
  await seedData();
  
  console.log('\n✨ Processus terminé!');
  process.exit(0);
}

main().catch(console.error);