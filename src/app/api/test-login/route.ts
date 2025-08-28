import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    const supabase = await createClient()
    
    // Tenter la connexion
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 401 })
    }

    // Récupérer le profil utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: userData?.role || 'viewer',
        full_name: data.user.user_metadata?.full_name || userData?.full_name,
        department: data.user.user_metadata?.department
      }
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}