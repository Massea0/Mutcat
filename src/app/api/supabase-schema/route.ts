import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Analyser les tables existantes
    const tableAnalysis: any = {}
    
    // 1. Table users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (!usersError && users) {
      tableAnalysis.users = {
        exists: true,
        columns: users.length > 0 ? Object.keys(users[0]) : [],
        sampleCount: users.length
      }
    }
    
    // 2. Table projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
    
    if (!projectsError && projects) {
      tableAnalysis.projects = {
        exists: true,
        columns: projects.length > 0 ? Object.keys(projects[0]) : [],
        count: projects.length,
        sample: projects.slice(0, 2)
      }
    }
    
    // 3. Table events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(5)
    
    if (!eventsError && events) {
      tableAnalysis.events = {
        exists: true,
        columns: events.length > 0 ? Object.keys(events[0]) : [],
        count: events.length
      }
    }
    
    // 4. Table documents
    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .select('*')
      .limit(5)
    
    if (!documentsError && documents) {
      tableAnalysis.documents = {
        exists: true,
        columns: documents.length > 0 ? Object.keys(documents[0]) : [],
        count: documents.length
      }
    }
    
    // 5. Table publications
    const { data: publications, error: publicationsError } = await supabase
      .from('publications')
      .select('*')
      .limit(5)
    
    if (!publicationsError && publications) {
      tableAnalysis.publications = {
        exists: true,
        columns: publications.length > 0 ? Object.keys(publications[0]) : [],
        count: publications.length
      }
    }
    
    // 6. Table media
    const { data: media, error: mediaError } = await supabase
      .from('media')
      .select('*')
      .limit(5)
    
    if (!mediaError && media) {
      tableAnalysis.media = {
        exists: true,
        columns: media.length > 0 ? Object.keys(media[0]) : [],
        count: media.length
      }
    }
    
    // 7. Table tenders (appels d'offres)
    const { data: tenders, error: tendersError } = await supabase
      .from('tenders')
      .select('*')
      .limit(5)
    
    if (!tendersError && tenders) {
      tableAnalysis.tenders = {
        exists: true,
        columns: tenders.length > 0 ? Object.keys(tenders[0]) : [],
        count: tenders.length
      }
    }
    
    // 8. Table careers
    const { data: careers, error: careersError } = await supabase
      .from('careers')
      .select('*')
      .limit(5)
    
    if (!careersError && careers) {
      tableAnalysis.careers = {
        exists: true,
        columns: careers.length > 0 ? Object.keys(careers[0]) : [],
        count: careers.length
      }
    }
    
    // 9. Table social_posts
    const { data: socialPosts, error: socialPostsError } = await supabase
      .from('social_posts')
      .select('*')
      .limit(5)
    
    if (!socialPostsError && socialPosts) {
      tableAnalysis.social_posts = {
        exists: true,
        columns: socialPosts.length > 0 ? Object.keys(socialPosts[0]) : [],
        count: socialPosts.length
      }
    }
    
    // 10. Table chatbot_interactions
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbot_interactions')
      .select('*')
      .limit(5)
    
    if (!chatbotError && chatbot) {
      tableAnalysis.chatbot_interactions = {
        exists: true,
        columns: chatbot.length > 0 ? Object.keys(chatbot[0]) : [],
        count: chatbot.length
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Schema analysis complete',
      tables: tableAnalysis,
      summary: {
        totalTables: Object.keys(tableAnalysis).length,
        tablesWithData: Object.keys(tableAnalysis).filter(t => 
          tableAnalysis[t].count > 0 || tableAnalysis[t].sampleCount > 0
        ),
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Schema analysis error:', error)
    return NextResponse.json({
      success: false,
      error: 'Schema analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}