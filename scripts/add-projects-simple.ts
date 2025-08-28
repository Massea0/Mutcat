#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addProjects() {
  console.log('📝 Ajout des projets (version simplifiée)...');
  
  // Projets sans les colonnes potentiellement manquantes
  const projects = [
    {
      title: 'Vision Sénégal 2050',
      slug: 'vision-senegal-2050',
      description: 'Plan stratégique national pour le développement urbain et territorial du Sénégal',
      content: 'La Vision Sénégal 2050 est un plan ambitieux qui vise à transformer le Sénégal en une nation moderne, prospère et inclusive.',
      status: 'planned',
      start_date: '2025-01-01',
      end_date: '2050-12-31',
      budget: 500000000000,
      location: 'National',
      is_featured: true
    },
    {
      title: 'Programme National de Logement Social',
      slug: 'programme-logement-social',
      description: 'Construction de 100 000 logements sociaux accessibles à tous les Sénégalais',
      content: 'Ce programme vise à résoudre la crise du logement en construisant 100 000 unités d habitation abordables.',
      status: 'planned',
      start_date: '2025-01-01',
      end_date: '2030-12-31',
      budget: 200000000000,
      location: 'Dakar, Thiès, Saint-Louis',
      is_featured: true
    },
    {
      title: 'Smart Cities Initiative',
      slug: 'smart-cities-initiative',
      description: 'Transformation numérique des villes sénégalaises pour une meilleure qualité de vie',
      content: 'Intégration des technologies de pointe pour améliorer la gestion urbaine et la qualité de vie.',
      status: 'planned',
      start_date: '2025-03-01',
      end_date: '2028-12-31',
      budget: 50000000000,
      location: 'Diamniadio, Dakar',
      is_featured: true
    },
    {
      title: 'Réhabilitation du Centre-Ville de Dakar',
      slug: 'rehabilitation-centre-ville-dakar',
      description: 'Projet de modernisation et de préservation du patrimoine architectural du Plateau',
      content: 'Réhabilitation complète du centre historique de Dakar tout en préservant son patrimoine architectural unique.',
      status: 'planned',
      start_date: '2025-02-01',
      end_date: '2027-12-31',
      budget: 75000000000,
      location: 'Dakar - Plateau',
      is_featured: false
    },
    {
      title: 'Corridor BRT Dakar',
      slug: 'corridor-brt-dakar',
      description: 'Système de transport rapide par bus pour décongestionner la capitale',
      content: 'Mise en place d un système BRT (Bus Rapid Transit) pour améliorer la mobilité urbaine à Dakar.',
      status: 'planned',
      start_date: '2025-01-15',
      end_date: '2026-12-31',
      budget: 150000000000,
      location: 'Grand Dakar',
      is_featured: false
    },
    {
      title: 'Aménagement de la Corniche Ouest',
      slug: 'amenagement-corniche-ouest',
      description: 'Création d un espace public moderne le long de la côte atlantique',
      content: 'Transformation de la Corniche Ouest en un espace de loisirs et de promenade moderne pour les Dakarois.',
      status: 'planned',
      start_date: '2025-06-01',
      end_date: '2027-12-31',
      budget: 45000000000,
      location: 'Dakar - Corniche',
      is_featured: false
    }
  ];
  
  for (const project of projects) {
    const { data, error } = await supabase.from('projects').insert([project]);
    
    if (error) {
      console.error(`❌ Erreur pour "${project.title}":`, error.message);
    } else {
      console.log(`✅ Ajouté: ${project.title}`);
    }
  }
  
  // Vérifier le résultat
  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\n📊 Total projets dans la base: ${count}`);
}

addProjects().catch(console.error);