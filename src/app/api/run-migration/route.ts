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

    // Migration SQL
    const migration = `
      -- Ajouter les colonnes manquantes à la table users si elles n'existent pas
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS full_name TEXT,
      ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'viewer',
      ADD COLUMN IF NOT EXISTS department TEXT,
      ADD COLUMN IF NOT EXISTS phone TEXT,
      ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS avatar TEXT,
      ADD COLUMN IF NOT EXISTS permissions TEXT[];
    `

    // Exécuter la migration
    const { error } = await supabase.rpc('exec_sql', { sql: migration }).single()

    if (error) {
      // Si la fonction RPC n'existe pas, essayons directement
      // Note: Cela ne fonctionnera pas avec l'API REST, mais on peut essayer
      console.log('RPC failed, trying direct approach...')
      
      // Vérifier la structure actuelle
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'users')

      if (columnsError) {
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to check table structure',
          details: columnsError.message
        }, { status: 500 })
      }

      const existingColumns = columns?.map(c => c.column_name) || []
      const requiredColumns = [
        'full_name', 'role', 'department', 'phone', 
        'active', 'email_verified', 'bio', 'avatar', 'permissions'
      ]
      
      const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col))

      return NextResponse.json({
        success: false,
        message: 'Migration could not be executed automatically',
        existingColumns,
        missingColumns,
        instruction: 'Please run the migration manually in Supabase SQL Editor:\n\n' + migration
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Migration executed successfully'
    })

  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}