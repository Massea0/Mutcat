/**
 * Script pour créer des projets de test
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedProjects() {
  console.log('🚀 Création des projets de test...\n')

  try {
    const projectsData = [
      {
        title: 'Pont de l\'Émergence',
        slug: 'pont-emergence',
        description: 'Construction d\'un nouveau pont reliant Dakar à Rufisque pour désengorger la circulation',
        objectives: ['Réduire les embouteillages', 'Améliorer la mobilité', 'Développer l\'économie locale'],
        status: 'ongoing',
        progress: 75,
        budget: 150000000000,
        start_date: '2023-01-15',
        end_date: '2025-06-30',
        location: 'Dakar - Rufisque',
        partners: ['BAD', 'Banque Mondiale', 'JICA']
      },
      {
        title: 'Ville Nouvelle de Diamniadio',
        slug: 'ville-nouvelle-diamniadio',
        description: 'Développement d\'une ville moderne et durable pour décongestionner Dakar',
        objectives: ['Créer 100 000 logements', 'Développer des zones d\'activités', 'Infrastructures modernes'],
        status: 'ongoing',
        progress: 60,
        budget: 500000000000,
        start_date: '2020-03-01',
        end_date: '2030-12-31',
        location: 'Diamniadio',
        partners: ['Chine', 'BAD', 'BID'],

      },
      {
        title: 'Réhabilitation du Centre-ville de Saint-Louis',
        slug: 'rehabilitation-saint-louis',
        description: 'Programme de restauration et de préservation du patrimoine historique de Saint-Louis',
        objectives: ['Préserver le patrimoine UNESCO', 'Améliorer l\'habitat', 'Développer le tourisme'],
        status: 'ongoing',
        progress: 45,
        budget: 75000000000,
        start_date: '2022-06-01',
        end_date: '2026-12-31',
        location: 'Saint-Louis',
        partners: ['UNESCO', 'France', 'Union Européenne'],

      },
      {
        title: 'Programme 100 000 Logements',
        slug: 'programme-100000-logements',
        description: 'Programme national de construction de logements sociaux abordables',
        objectives: ['Réduire le déficit de logements', 'Améliorer les conditions de vie', 'Créer des emplois'],
        status: 'planning',
        progress: 15,
        budget: 1000000000000,
        start_date: '2024-01-01',
        end_date: '2029-12-31',
        location: 'National',
        partners: ['BHS', 'SICAP', 'SN-HLM'],

      },
      {
        title: 'Modernisation des Marchés de Dakar',
        slug: 'modernisation-marches-dakar',
        description: 'Reconstruction et modernisation des principaux marchés de la capitale',
        objectives: ['Améliorer les conditions de commerce', 'Sécurité incendie', 'Hygiène et salubrité'],
        status: 'ongoing',
        progress: 30,
        budget: 45000000000,
        start_date: '2023-09-01',
        end_date: '2025-12-31',
        location: 'Dakar',
        partners: ['Mairie de Dakar', 'AGETIP'],

      },
      {
        title: 'Aménagement de la Corniche Ouest',
        slug: 'amenagement-corniche-ouest',
        description: 'Projet d\'embellissement et de protection du littoral de la Corniche Ouest',
        objectives: ['Protection côtière', 'Espaces publics', 'Développement touristique'],
        status: 'completed',
        progress: 100,
        budget: 25000000000,
        start_date: '2021-01-01',
        end_date: '2023-12-31',
        location: 'Dakar - Corniche Ouest',
        partners: ['AFD', 'Mairie de Dakar'],

      },
      {
        title: 'Smart City Lac Rose',
        slug: 'smart-city-lac-rose',
        description: 'Développement d\'une ville intelligente et écologique près du Lac Rose',
        objectives: ['Technologies intelligentes', 'Énergie renouvelable', 'Développement durable'],
        status: 'planning',
        progress: 5,
        budget: 300000000000,
        start_date: '2025-01-01',
        end_date: '2035-12-31',
        location: 'Lac Rose',
        partners: ['Dubaï', 'Singapour', 'Corée du Sud'],

      },
      {
        title: 'Rénovation Urbaine de Pikine',
        slug: 'renovation-urbaine-pikine',
        description: 'Programme de restructuration et d\'amélioration urbaine de Pikine',
        objectives: ['Assainissement', 'Voirie', 'Équipements publics'],
        status: 'ongoing',
        progress: 55,
        budget: 60000000000,
        start_date: '2022-01-01',
        end_date: '2025-06-30',
        location: 'Pikine',
        partners: ['Banque Mondiale', 'AFD'],

      }
    ]

    console.log('📊 Suppression des anciens projets...')
    await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    for (const project of projectsData) {
      const { error } = await supabase
        .from('projects')
        .insert(project)
      
      if (error) {
        console.log(`  ⚠️ Erreur projet "${project.title}":`, error.message)
      } else {
        console.log(`  ✅ Projet créé: ${project.title}`)
      }
    }

    // Vérifier le nombre total
    const { count } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })

    console.log(`\n📈 Total: ${count} projets dans la base de données`)
    console.log('✨ Projets créés avec succès!')
    
  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

// Exécuter le script
seedProjects()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })