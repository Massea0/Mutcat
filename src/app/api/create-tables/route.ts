import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
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

    // Vérifier les tables existantes
    const { data: existingTables } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')

    const tableNames = existingTables?.map(t => t.tablename) || []
    
    const tablesToCreate = []

    // Table news
    if (!tableNames.includes('news')) {
      tablesToCreate.push('news')
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS news (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT UNIQUE,
            excerpt TEXT,
            content TEXT,
            category TEXT,
            status TEXT DEFAULT 'draft',
            featured_image TEXT,
            tags TEXT[],
            author_id UUID REFERENCES users(id),
            featured BOOLEAN DEFAULT false,
            published_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            deleted_at TIMESTAMPTZ
          );
        `
      }).single().catch(() => {
        // Ignorer l'erreur si exec_sql n'existe pas
      })
    }

    // Table media
    if (!tableNames.includes('media')) {
      tablesToCreate.push('media')
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS media (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            filename TEXT NOT NULL,
            original_name TEXT,
            mime_type TEXT,
            size INTEGER,
            url TEXT,
            thumbnail_url TEXT,
            alt_text TEXT,
            caption TEXT,
            folder_id UUID,
            tags TEXT[],
            created_by UUID REFERENCES users(id),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      }).single().catch(() => {
        // Ignorer l'erreur
      })
    }

    // Table documents
    if (!tableNames.includes('documents')) {
      tablesToCreate.push('documents')
    }

    // Table publications
    if (!tableNames.includes('publications')) {
      tablesToCreate.push('publications')
    }

    // Table tenders
    if (!tableNames.includes('tenders')) {
      tablesToCreate.push('tenders')
    }

    return NextResponse.json({
      success: true,
      message: 'Tables vérifiées',
      existingTables: tableNames.filter(t => !t.startsWith('supabase_')),
      tablesToCreate,
      note: tablesToCreate.length > 0 
        ? 'Certaines tables doivent être créées manuellement dans Supabase SQL Editor'
        : 'Toutes les tables nécessaires existent'
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}