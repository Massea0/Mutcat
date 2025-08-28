/**
 * Script pour réinitialiser le compte admin
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function resetAdmin() {
  console.log('🔧 Réinitialisation du compte admin...\n')

  const adminEmail = 'admin@muctat.sn'
  const adminPassword = 'Admin@2024'

  try {
    // 1. Vérifier si l'utilisateur existe
    console.log('📋 Recherche du compte admin existant...')
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const existingUser = users.find(u => u.email === adminEmail)

    if (existingUser) {
      console.log('✅ Compte trouvé, suppression...')
      
      // Supprimer d'abord de la table users
      await supabase
        .from('users')
        .delete()
        .eq('id', existingUser.id)
      
      // Puis supprimer de Auth
      await supabase.auth.admin.deleteUser(existingUser.id)
      console.log('✅ Ancien compte supprimé')
    } else {
      console.log('ℹ️  Aucun compte existant trouvé')
    }

    // 2. Créer le nouveau compte admin
    console.log('\n📝 Création du nouveau compte admin...')
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Administrateur Principal',
        role: 'admin',
        department: 'Direction Générale'
      }
    })

    if (authError) {
      throw authError
    }

    console.log('✅ Compte Auth créé avec ID:', authUser.user.id)

    // 3. Créer le profil dans la table users
    console.log('📝 Création du profil utilisateur...')
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        email: adminEmail,
        full_name: 'Administrateur Principal',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.log('⚠️  Erreur lors de la création du profil:', profileError.message)
    } else {
      console.log('✅ Profil créé dans la table users')
    }

    // 4. Tester la connexion
    console.log('\n🧪 Test de connexion...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    })

    if (signInError) {
      console.log('❌ Échec du test de connexion:', signInError.message)
    } else {
      console.log('✅ Test de connexion réussi!')
    }

    console.log('\n' + '='.repeat(50))
    console.log('✨ COMPTE ADMIN RÉINITIALISÉ AVEC SUCCÈS!')
    console.log('='.repeat(50))
    console.log('\n📧 Email: admin@muctat.sn')
    console.log('🔑 Mot de passe: Admin@2024')
    console.log('\n🚀 Connectez-vous sur: http://localhost:3000/admin')
    console.log('='.repeat(50))

  } catch (error: any) {
    console.error('\n❌ Erreur:', error.message)
    process.exit(1)
  }
}

// Exécuter le script
resetAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })