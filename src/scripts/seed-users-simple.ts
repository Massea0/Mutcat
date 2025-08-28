/**
 * Script simplifié pour créer des utilisateurs test
 * Adapté à la structure existante de la table users
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Configuration Supabase avec service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes!')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

// Client avec privilèges admin
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Données simplifiées des utilisateurs test (adaptées aux colonnes existantes)
const testUsers = [
  {
    email: 'admin@muctat.sn',
    password: 'Admin@2024',
    metadata: {
      full_name: 'Administrateur Principal',
      role: 'admin',
      department: 'Direction Générale'
    }
  },
  {
    email: 'directeur@muctat.sn',
    password: 'Directeur@2024',
    metadata: {
      full_name: 'Mamadou Diallo',
      role: 'admin',
      department: 'Direction'
    }
  },
  {
    email: 'editeur@muctat.sn',
    password: 'Editeur@2024',
    metadata: {
      full_name: 'Fatou Sow',
      role: 'editor',
      department: 'Communication'
    }
  },
  {
    email: 'auteur@muctat.sn',
    password: 'Auteur@2024',
    metadata: {
      full_name: 'Aïssatou Ndiaye',
      role: 'author',
      department: 'Rédaction'
    }
  },
  {
    email: 'lecteur@muctat.sn',
    password: 'Lecteur@2024',
    metadata: {
      full_name: 'Mariama Ba',
      role: 'viewer',
      department: 'Archives'
    }
  }
]

async function seedUsers() {
  console.log('🚀 Création des utilisateurs test...\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  // D'abord, vérifions la structure de la table users
  console.log('📋 Vérification de la structure de la table users...')
  
  const { data: columns, error: columnsError } = await supabase
    .from('users')
    .select('*')
    .limit(1)

  if (columnsError) {
    console.log('❌ Erreur lors de la vérification:', columnsError.message)
  } else {
    console.log('✅ Table users accessible')
    if (columns && columns.length > 0) {
      console.log('   Colonnes disponibles:', Object.keys(columns[0]).join(', '))
    }
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  let successCount = 0
  let errorCount = 0

  for (const userData of testUsers) {
    try {
      console.log(`📝 Création: ${userData.email}`)
      
      // Créer l'utilisateur dans Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: userData.metadata
      })

      if (authError) {
        if (authError.message.includes('already been registered')) {
          console.log(`   ⚠️  Utilisateur déjà existant`)
          
          // Récupérer l'utilisateur existant et mettre à jour ses métadonnées
          const { data: { users } } = await supabase.auth.admin.listUsers()
          const existingUser = users.find(u => u.email === userData.email)
          
          if (existingUser) {
            // Mettre à jour les métadonnées
            const { error: updateError } = await supabase.auth.admin.updateUserById(
              existingUser.id,
              { user_metadata: userData.metadata }
            )
            
            if (updateError) {
              console.log(`   ❌ Erreur mise à jour: ${updateError.message}`)
              errorCount++
            } else {
              console.log(`   ✅ Métadonnées mises à jour`)
              
              // Créer ou mettre à jour dans la table users
              const { error: upsertError } = await supabase
                .from('users')
                .upsert({
                  id: existingUser.id,
                  email: userData.email,
                  role: userData.metadata.role,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }, { onConflict: 'id' })
              
              if (upsertError) {
                console.log(`   ⚠️  Profil non créé:`, upsertError.message)
              } else {
                console.log(`   ✅ Profil synchronisé`)
              }
              successCount++
            }
          }
        } else {
          throw authError
        }
      } else {
        console.log(`   ✅ Utilisateur créé dans Auth`)
        
        // Créer le profil dans la table users
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authUser.user.id,
            email: userData.email,
            role: userData.metadata.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.log(`   ⚠️  Profil non créé:`, profileError.message)
        } else {
          console.log(`   ✅ Profil créé`)
        }
        
        successCount++
      }

      console.log(`   📧 Email: ${userData.email}`)
      console.log(`   🔑 Mot de passe: ${userData.password}`)
      console.log(`   👤 Rôle: ${userData.metadata.role}`)
      console.log('')

    } catch (error: any) {
      console.log(`   ❌ Erreur: ${error.message}`)
      errorCount++
      console.log('')
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 Résumé:')
  console.log(`   ✅ Succès: ${successCount} utilisateurs`)
  console.log(`   ❌ Erreurs: ${errorCount} utilisateurs`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n🎯 Comptes de test disponibles:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('ADMINISTRATEURS:')
  console.log('  📧 admin@muctat.sn')
  console.log('  🔑 Admin@2024')
  console.log('  ')
  console.log('  📧 directeur@muctat.sn')
  console.log('  🔑 Directeur@2024')
  console.log('')
  console.log('EDITEUR:')
  console.log('  📧 editeur@muctat.sn')
  console.log('  🔑 Editeur@2024')
  console.log('')
  console.log('AUTEUR:')
  console.log('  📧 auteur@muctat.sn')
  console.log('  🔑 Auteur@2024')
  console.log('')
  console.log('LECTEUR:')
  console.log('  📧 lecteur@muctat.sn')
  console.log('  🔑 Lecteur@2024')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  // Afficher les utilisateurs dans la table
  console.log('\n📌 Utilisateurs dans la base de données:')
  const { data: allUsers, error: listError } = await supabase
    .from('users')
    .select('id, email, role')
    .order('created_at', { ascending: false })
  
  if (listError) {
    console.log('❌ Erreur:', listError.message)
  } else if (allUsers && allUsers.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    allUsers.forEach(user => {
      console.log(`  ${user.email} (${user.role || 'no role'})`)
    })
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  } else {
    console.log('   Aucun utilisateur trouvé')
  }
}

// Exécuter le script
seedUsers()
  .then(() => {
    console.log('\n✨ Script terminé!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error)
    process.exit(1)
  })