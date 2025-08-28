import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Utiliser la clé service_role pour avoir les privilèges admin
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const adminEmail = 'admin@muctat.sn'
    const adminPassword = 'Admin@2024'

    // Essayer de créer l'utilisateur
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

    if (authError && !authError.message.includes('already been registered')) {
      throw authError
    }

    let userId = authUser?.user?.id

    // Si l'utilisateur existe déjà, récupérer son ID
    if (!userId) {
      const { data: { users } } = await supabase.auth.admin.listUsers()
      const existingUser = users.find(u => u.email === adminEmail)
      if (existingUser) {
        userId = existingUser.id
        
        // Mettre à jour le mot de passe
        await supabase.auth.admin.updateUserById(userId, {
          password: adminPassword,
          email_confirm: true,
          user_metadata: {
            full_name: 'Administrateur Principal',
            role: 'admin',
            department: 'Direction Générale'
          }
        })
      }
    }

    if (!userId) {
      throw new Error('Impossible de créer ou trouver l\'utilisateur')
    }

    // Créer ou mettre à jour le profil dans la table users
    await supabase
      .from('users')
      .upsert({
        id: userId,
        email: adminEmail,
        full_name: 'Administrateur Principal',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })

    return NextResponse.json({
      success: true,
      message: 'Compte admin créé/mis à jour avec succès',
      credentials: {
        email: adminEmail,
        password: adminPassword,
        loginUrl: 'http://localhost:3000/admin'
      }
    })

  } catch (error: any) {
    console.error('Erreur:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}