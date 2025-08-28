#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixColumns() {
  console.log('🔧 Ajout des colonnes manquantes...');
  
  // D'abord, vérifier que les colonnes existent
  const testQuery = await supabase.from('projects').select('id').limit(1);
  console.log('Test de connexion:', testQuery.error ? '❌ Erreur' : '✅ OK');
}

async function addProjects() {
  console.log('📝 Ajout des projets...');
  
  const { data, error } = await supabase.from('projects').insert([
    {
      title: 'Vision Sénégal 2050',
      slug: 'vision-senegal-2050',
      description: 'Plan stratégique national pour le développement urbain et territorial du Sénégal',
      content: `<h2>Objectifs principaux</h2>
<p>La Vision Sénégal 2050 est un plan ambitieux qui vise à transformer le Sénégal en une nation moderne, prospère et inclusive.</p>
<h3>Axes stratégiques</h3>
<ul>
  <li>Développement urbain durable</li>
  <li>Modernisation des infrastructures</li>
  <li>Inclusion sociale et économique</li>
  <li>Protection de l'environnement</li>
</ul>`,
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
      description: 'Construction de 100 000 logements sociaux accessibles à tous les Sénégalais',
      content: `<h2>Programme ambitieux</h2>
<p>Ce programme vise à résoudre la crise du logement en construisant 100 000 unités d'habitation abordables.</p>
<h3>Bénéficiaires</h3>
<ul>
  <li>Familles à revenus modestes</li>
  <li>Jeunes professionnels</li>
  <li>Personnel de l'administration publique</li>
</ul>`,
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
      description: 'Transformation numérique des villes sénégalaises pour une meilleure qualité de vie',
      content: `<h2>Villes intelligentes</h2>
<p>Intégration des technologies de pointe pour améliorer la gestion urbaine et la qualité de vie.</p>
<h3>Technologies déployées</h3>
<ul>
  <li>IoT pour la gestion du trafic</li>
  <li>Éclairage public intelligent</li>
  <li>Gestion optimisée des déchets</li>
  <li>Services publics numériques</li>
</ul>`,
      status: 'active',
      start_date: '2025-03-01',
      end_date: '2028-12-31',
      budget: 50000000000,
      location: 'Diamniadio, Dakar',
      featured_image: '/images/smart-city.svg',
      is_featured: true,
      featured_order: 3
    },
    {
      title: 'Réhabilitation du Centre-Ville de Dakar',
      slug: 'rehabilitation-centre-ville-dakar',
      description: 'Projet de modernisation et de préservation du patrimoine architectural du Plateau',
      content: `<h2>Renouveau urbain</h2>
<p>Réhabilitation complète du centre historique de Dakar tout en préservant son patrimoine architectural unique.</p>`,
      status: 'active',
      start_date: '2025-02-01',
      end_date: '2027-12-31',
      budget: 75000000000,
      location: 'Dakar - Plateau',
      featured_image: '/images/dakar-skyline.svg',
      is_featured: false
    },
    {
      title: 'Corridor BRT Dakar',
      slug: 'corridor-brt-dakar',
      description: 'Système de transport rapide par bus pour décongestionner la capitale',
      content: `<h2>Transport moderne</h2>
<p>Mise en place d'un système BRT (Bus Rapid Transit) pour améliorer la mobilité urbaine à Dakar.</p>`,
      status: 'active',
      start_date: '2025-01-15',
      end_date: '2026-12-31',
      budget: 150000000000,
      location: 'Grand Dakar',
      featured_image: '/images/smart-city.svg',
      is_featured: false
    }
  ]);
  
  if (error) {
    console.error('❌ Erreur:', error);
  } else {
    console.log('✅ Projets ajoutés avec succès:', data?.length);
  }
  
  // Vérifier le résultat
  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });
  
  console.log(`📊 Total projets dans la base: ${count}`);
}

async function main() {
  await fixColumns();
  await addProjects();
}

main().catch(console.error);