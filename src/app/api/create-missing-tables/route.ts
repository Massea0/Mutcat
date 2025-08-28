import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Create publications table
    const publicationsQuery = `
      CREATE TABLE IF NOT EXISTS publications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image TEXT,
        category VARCHAR(100),
        tags TEXT[],
        is_published BOOLEAN DEFAULT false,
        published_at TIMESTAMP WITH TIME ZONE,
        author_id UUID,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    // Create media table
    const mediaQuery = `
      CREATE TABLE IF NOT EXISTS media (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_url TEXT NOT NULL,
        file_type VARCHAR(50),
        media_type VARCHAR(50), -- photo, video, audio
        size INTEGER,
        width INTEGER,
        height INTEGER,
        duration INTEGER, -- for video/audio in seconds
        tags TEXT[],
        is_featured BOOLEAN DEFAULT false,
        is_published BOOLEAN DEFAULT true,
        created_by UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    // Execute queries
    const { error: pubError } = await supabase.rpc('exec_sql', { 
      sql: publicationsQuery 
    }).single()
    
    if (pubError) {
      // Try direct execution if RPC doesn't exist
      const { error: directPubError } = await supabase
        .from('publications')
        .select('id')
        .limit(1)
      
      if (directPubError?.code === '42P01') {
        // Table doesn't exist, we need to create it via SQL
        console.log('Publications table needs to be created manually')
      }
    }
    
    const { error: mediaError } = await supabase.rpc('exec_sql', { 
      sql: mediaQuery 
    }).single()
    
    if (mediaError) {
      // Try direct execution if RPC doesn't exist
      const { error: directMediaError } = await supabase
        .from('media')
        .select('id')
        .limit(1)
      
      if (directMediaError?.code === '42P01') {
        // Table doesn't exist, we need to create it via SQL
        console.log('Media table needs to be created manually')
      }
    }
    
    // Check if tables exist
    const { data: pubCheck } = await supabase
      .from('publications')
      .select('count')
      .limit(1)
    
    const { data: mediaCheck } = await supabase
      .from('media')
      .select('count')
      .limit(1)
    
    return NextResponse.json({
      success: true,
      message: 'Tables creation attempted',
      tables: {
        publications: pubCheck ? 'exists' : 'not found',
        media: mediaCheck ? 'exists' : 'not found'
      }
    })
    
  } catch (error) {
    console.error('Error creating tables:', error)
    return NextResponse.json(
      { error: 'Failed to create tables' },
      { status: 500 }
    )
  }
}