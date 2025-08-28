/**
 * Script pour créer des utilisateurs test
 * Utilise la clé service_role de Supabase pour créer des utilisateurs
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Configuration Supabase avec service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client avec privilèges admin
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Données des utilisateurs test
const testUsers = [
  {
    email: 'admin@muctat.sn',
    password: 'Admin@2024',
    full_name: 'Administrateur Principal',
    role: 'admin',
    department: 'Direction Générale',
    phone: '+221 77 123 45 67',
    active: true,
    email_verified: true,
    bio: 'Administrateur principal de la plateforme MUCTAT'
  },
  {
    email: 'directeur@muctat.sn',
    password: 'Directeur@2024',
    full_name: 'Mamadou Diallo',
    role: 'admin',
    department: 'Direction',
    phone: '+221 77 234 56 78',
    active: true,
    email_verified: true,
    bio: 'Directeur du Ministère de l\'Urbanisme'
  },
  {
    email: 'editeur1@muctat.sn',
    password: 'Editeur@2024',
    full_name: 'Fatou Sow',
    role: 'editor',
    department: 'Communication',
    phone: '+221 77 345 67 89',
    active: true,
    email_verified: true,
    bio: 'Responsable de la communication digitale'
  },
  {
    email: 'editeur2@muctat.sn',
    password: 'Editeur@2024',
    full_name: 'Ibrahima Fall',
    role: 'editor',
    department: 'Projets',
    phone: '+221 77 456 78 90',
    active: true,
    email_verified: true,
    bio: 'Chef de projet urbanisme'
  },
  {
    email: 'auteur1@muctat.sn',
    password: 'Auteur@2024',
    full_name: 'Aïssatou Ndiaye',
    role: 'author',
    department: 'Rédaction',
    phone: '+221 77 567 89 01',
    active: true,
    email_verified: true,
    bio: 'Rédactrice en chef'
  },
  {
    email: 'auteur2@muctat.sn',
    password: 'Auteur@2024',
    full_name: 'Ousmane Sy',
    role: 'author',
    department: 'Documentation',
    phone: '+221 77 678 90 12',
    active: true,
    email_verified: true,
    bio: 'Responsable documentation'
  },
  {
    email: 'lecteur@muctat.sn',
    password: 'Lecteur@2024',
    full_name: 'Mariama Ba',
    role: 'viewer',
    department: 'Archives',
    phone: '+221 77 789 01 23',
    active: true,
    email_verified: true,
    bio: 'Archiviste'
  },
  {
    email: 'test.inactif@muctat.sn',
    password: 'Test@2024',
    full_name: 'Compte Inactif',
    role: 'viewer',
    department: 'Test',
    phone: '+221 77 890 12 34',
    active: false,
    email_verified: false,
    bio: 'Compte de test inactif'
  },
  {
    email: 'cheikh.diop@muctat.sn',
    password: 'Cheikh@2024',
    full_name: 'Cheikh Diop',
    role: 'editor',
    department: 'Aménagement Territorial',
    phone: '+221 77 901 23 45',
    active: true,
    email_verified: true,
    bio: 'Responsable de l\'aménagement territorial'
  },
  {
    email: 'aminata.kane@muctat.sn',
    password: 'Aminata@2024',
    full_name: 'Aminata Kane',
    role: 'author',
    department: 'Relations Publiques',
    phone: '+221 77 012 34 56',
    active: true,
    email_verified: true,
    bio: 'Chargée des relations publiques'
  }
]

async function seedUsers() {
  console.log('🚀 Début de la création des utilisateurs test...\n')
  
  let successCount = 0
  let errorCount = 0

  for (const userData of testUsers) {
    try {
      console.log(`📝 Création de l'utilisateur: ${userData.email}`)
      
      // 1. Créer l'utilisateur dans Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: userData.email_verified,
        user_metadata: {
          full_name: userData.full_name,
          department: userData.department
        }
      })

      if (authError) {
        // Si l'utilisateur existe déjà, on continue
        if (authError.message.includes('already been registered')) {
          console.log(`   ⚠️  L'utilisateur ${userData.email} existe déjà dans Auth`)
          
          // Récupérer l'ID de l'utilisateur existant
          const { data: existingUsers } = await supabase.auth.admin.listUsers()
          const existingUser = existingUsers?.users?.find(u => u.email === userData.email)
          
          if (existingUser) {
            // Vérifier si le profil existe dans la table users
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', existingUser.id)
              .single()

            if (profileError || !profile) {
              // Créer le profil s'il n'existe pas
              const { error: insertError } = await supabase
                .from('users')
                .insert({
                  id: existingUser.id,
                  email: userData.email,
                  full_name: userData.full_name,
                  role: userData.role,
                  department: userData.department,
                  phone: userData.phone,
                  active: userData.active,
                  email_verified: userData.email_verified,
                  bio: userData.bio,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })

              if (insertError) {
                console.log(`   ❌ Erreur lors de la création du profil: ${insertError.message}`)
                errorCount++
              } else {
                console.log(`   ✅ Profil créé pour l'utilisateur existant`)
                successCount++
              }
            } else {
              // Mettre à jour le profil existant
              const { error: updateError } = await supabase
                .from('users')
                .update({
                  full_name: userData.full_name,
                  role: userData.role,
                  department: userData.department,
                  phone: userData.phone,
                  active: userData.active,
                  email_verified: userData.email_verified,
                  bio: userData.bio,
                  updated_at: new Date().toISOString()
                })
                .eq('id', existingUser.id)

              if (updateError) {
                console.log(`   ❌ Erreur lors de la mise à jour: ${updateError.message}`)
                errorCount++
              } else {
                console.log(`   ✅ Profil mis à jour`)
                successCount++
              }
            }
          }
        } else {
          throw authError
        }
        continue
      }

      // 2. Créer le profil utilisateur dans la table users
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authUser.user.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          department: userData.department,
          phone: userData.phone,
          active: userData.active,
          email_verified: userData.email_verified,
          bio: userData.bio,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.log(`   ❌ Erreur profil: ${profileError.message}`)
        errorCount++
      } else {
        console.log(`   ✅ Utilisateur créé avec succès!`)
        console.log(`      📧 Email: ${userData.email}`)
        console.log(`      🔑 Mot de passe: ${userData.password}`)
        console.log(`      👤 Rôle: ${userData.role}`)
        successCount++
      }

    } catch (error: any) {
      console.log(`   ❌ Erreur: ${error.message}`)
      errorCount++
    }
    
    console.log('') // Ligne vide pour la lisibilité
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 Résumé:')
  console.log(`   ✅ Succès: ${successCount} utilisateurs`)
  console.log(`   ❌ Erreurs: ${errorCount} utilisateurs`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n🎯 Comptes de test créés:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('ADMIN:')
  console.log('  📧 admin@muctat.sn / 🔑 Admin@2024')
  console.log('  📧 directeur@muctat.sn / 🔑 Directeur@2024')
  console.log('\nEDITEURS:')
  console.log('  📧 editeur1@muctat.sn / 🔑 Editeur@2024')
  console.log('  📧 editeur2@muctat.sn / 🔑 Editeur@2024')
  console.log('\nAUTEURS:')
  console.log('  📧 auteur1@muctat.sn / 🔑 Auteur@2024')
  console.log('  📧 auteur2@muctat.sn / 🔑 Auteur@2024')
  console.log('\nLECTEUR:')
  console.log('  📧 lecteur@muctat.sn / 🔑 Lecteur@2024')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
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