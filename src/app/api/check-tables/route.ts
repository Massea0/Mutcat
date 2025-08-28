import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Utiliser une requête RPC ou une méthode alternative
    // Pour l'instant, testons directement chaque table
    const checkTable = async (tableName: string) => {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
        return !error
      } catch {
        return false
      }
    }

    const requiredTables = [
      'users',
      'projects', 
      'events',
      'news',
      'media',
      'documents',
      'publications',
      'tenders',
      'media_folders',
      'audit_logs'
    ]

    const tableChecks = await Promise.all(
      requiredTables.map(async (table) => ({
        name: table,
        exists: await checkTable(table)
      }))
    )

    const existingTables = tableChecks.filter(t => t.exists).map(t => t.name)
    const missingTables = tableChecks.filter(t => !t.exists).map(t => t.name)

    return NextResponse.json({
      success: true,
      existingTables,
      missingTables,
      message: missingTables.length > 0 
        ? `${missingTables.length} tables manquantes. Copiez le script SQL depuis /workspace/supabase/create-missing-tables.sql et exécutez-le dans Supabase SQL Editor.`
        : 'Toutes les tables requises sont présentes.'
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}