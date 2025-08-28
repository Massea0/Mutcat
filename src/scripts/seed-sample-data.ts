/**
 * Script pour créer des données de test
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

async function seedSampleData() {
  console.log('🚀 Création des données de test...\n')

  try {
    // Récupérer un user admin pour l'auteur
    const { data: users } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
    
    const authorId = users?.[0]?.id

    // Créer des actualités
    console.log('📰 Création des actualités...')
    const newsData = [
      {
        title: 'Inauguration du nouveau pont de l\'émergence',
        slug: 'inauguration-pont-emergence',
        excerpt: 'Le Ministre inaugure le nouveau pont reliant Dakar à Rufisque',
        content: 'Le Ministère de l\'Urbanisme a procédé ce jour à l\'inauguration du nouveau pont...',
        category: 'announcement',
        status: 'published',
        featured: true,
        author_id: authorId,
        published_at: new Date().toISOString()
      },
      {
        title: 'Conférence sur l\'urbanisme durable',
        slug: 'conference-urbanisme-durable',
        excerpt: 'Une conférence internationale sur l\'urbanisme durable se tiendra à Dakar',
        content: 'Le MUCTAT organise une conférence internationale...',
        category: 'event',
        status: 'published',
        author_id: authorId,
        published_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        title: 'Nouveau programme de logements sociaux',
        slug: 'programme-logements-sociaux',
        excerpt: 'Lancement d\'un programme ambitieux de 100 000 logements',
        content: 'Le gouvernement annonce un nouveau programme...',
        category: 'project',
        status: 'draft',
        author_id: authorId
      }
    ]

    for (const news of newsData) {
      const { error } = await supabase
        .from('news')
        .upsert(news, { onConflict: 'slug' })
      
      if (error) {
        console.log(`  ⚠️ Erreur actualité "${news.title}":`, error.message)
      } else {
        console.log(`  ✅ Actualité créée: ${news.title}`)
      }
    }

    // Créer des documents
    console.log('\n📄 Création des documents...')
    const documentsData = [
      {
        title: 'Rapport annuel 2024',
        description: 'Rapport d\'activités du ministère pour l\'année 2024',
        category: 'rapport',
        file_type: 'application/pdf',
        created_by: authorId
      },
      {
        title: 'Guide de l\'urbanisme',
        description: 'Guide pratique pour les procédures d\'urbanisme',
        category: 'guide',
        file_type: 'application/pdf',
        created_by: authorId
      }
    ]

    for (const doc of documentsData) {
      const { error } = await supabase
        .from('documents')
        .insert(doc)
      
      if (error) {
        console.log(`  ⚠️ Erreur document "${doc.title}":`, error.message)
      } else {
        console.log(`  ✅ Document créé: ${doc.title}`)
      }
    }

    // Créer des appels d'offres
    console.log('\n📋 Création des appels d\'offres...')
    const tendersData = [
      {
        reference: 'MUCTAT-2024-001',
        title: 'Construction de logements sociaux à Diamniadio',
        description: 'Appel d\'offres pour la construction de 500 logements',
        category: 'construction',
        budget_min: 5000000000,
        budget_max: 7000000000,
        deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
        status: 'open'
      },
      {
        reference: 'MUCTAT-2024-002',
        title: 'Étude d\'aménagement urbain de Thiès',
        description: 'Consultation pour une étude d\'aménagement',
        category: 'etude',
        budget_min: 50000000,
        budget_max: 100000000,
        deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
        status: 'open'
      }
    ]

    for (const tender of tendersData) {
      const { error } = await supabase
        .from('tenders')
        .upsert(tender, { onConflict: 'reference' })
      
      if (error) {
        console.log(`  ⚠️ Erreur appel d\'offres "${tender.title}":`, error.message)
      } else {
        console.log(`  ✅ Appel d\'offres créé: ${tender.title}`)
      }
    }

    console.log('\n✨ Données de test créées avec succès!')
    
  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

// Exécuter le script
seedSampleData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })