import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test de connexion
    const { data: testConnection, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (connectionError && !connectionError.message.includes('permission')) {
      return NextResponse.json({
        success: false,
        error: 'Connection failed',
        details: connectionError.message
      }, { status: 500 })
    }
    
    // Récupérer la liste des tables
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables_info')
      .select('*')
    
    // Si la fonction n'existe pas, essayons une autre approche
    let tablesList = []
    if (tablesError) {
      // Essayer de récupérer les infos via pg_catalog
      const { data: schemaInfo } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
      
      if (schemaInfo) {
        tablesList = schemaInfo
      } else {
        // Liste manuelle des tables qu'on connaît
        tablesList = [
          'users', 'news', 'projects', 'documents', 'events',
          'publications', 'media', 'tenders', 'careers',
          'social_posts', 'chatbot_interactions', 'analytics_reports',
          'citizen_interactions', 'tender_analysis'
        ]
      }
    } else {
      tablesList = tables
    }
    
    // Tester quelques requêtes sur les tables principales
    const results: any = {}
    
    // Test sur la table users
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5)
    
    results['users'] = {
      success: !usersError,
      count: usersData?.length || 0,
      error: usersError?.message
    }
    
    // Test sur la table news
    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .select('*')
      .limit(5)
    
    results['news'] = {
      success: !newsError,
      count: newsData?.length || 0,
      error: newsError?.message
    }
    
    // Test sur la table projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(5)
    
    results['projects'] = {
      success: !projectsError,
      count: projectsData?.length || 0,
      error: projectsError?.message
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      tables: tablesList,
      testResults: results,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Supabase test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}