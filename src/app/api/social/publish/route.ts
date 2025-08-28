import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Types pour les plateformes sociales
interface SocialPost {
  content: string
  platforms: string[]
  mediaUrls?: string[]
  scheduledAt?: string
}

// Fonction pour publier sur Twitter/X
async function publishToTwitter(content: string, mediaUrls?: string[]) {
  const apiKey = process.env.TWITTER_API_KEY
  const apiSecret = process.env.TWITTER_API_SECRET
  const accessToken = process.env.TWITTER_ACCESS_TOKEN
  const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET

  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
    throw new Error('Twitter API credentials not configured')
  }

  // Simulation de publication Twitter - À remplacer par l'API réelle
  // En production, utiliser twitter-api-v2 ou similaire
  console.log('Publishing to Twitter:', { content, mediaUrls })
  
  return {
    success: true,
    platform: 'twitter',
    postId: `tw_${Date.now()}`,
    url: `https://twitter.com/muctat_sn/status/${Date.now()}`
  }
}

// Fonction pour publier sur LinkedIn
async function publishToLinkedIn(content: string, mediaUrls?: string[]) {
  const clientId = process.env.LINKEDIN_CLIENT_ID
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN

  if (!clientId || !clientSecret || !accessToken) {
    throw new Error('LinkedIn API credentials not configured')
  }

  // Simulation de publication LinkedIn - À remplacer par l'API réelle
  console.log('Publishing to LinkedIn:', { content, mediaUrls })
  
  return {
    success: true,
    platform: 'linkedin',
    postId: `li_${Date.now()}`,
    url: `https://linkedin.com/posts/${Date.now()}`
  }
}

// Fonction pour préparer la publication Instagram
async function prepareInstagramPost(content: string, mediaUrls?: string[]) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID

  if (!accessToken || !businessAccountId) {
    throw new Error('Instagram API credentials not configured')
  }

  // Instagram nécessite des images, notification si pas d'image
  if (!mediaUrls || mediaUrls.length === 0) {
    return {
      success: false,
      platform: 'instagram',
      error: 'Instagram requires at least one image',
      notification: 'Please manually post to Instagram with an image'
    }
  }

  // Simulation de préparation Instagram - À remplacer par l'API réelle
  console.log('Preparing Instagram post:', { content, mediaUrls })
  
  return {
    success: true,
    platform: 'instagram',
    postId: `ig_${Date.now()}`,
    notification: 'Instagram post prepared. Manual review required.',
    url: `https://instagram.com/p/${Date.now()}`
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Vérifier le rôle de l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || ((userData as any).role !== 'admin' && (userData as any).role !== 'agent')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Récupérer les données de la requête
    const body: SocialPost = await request.json()
    const { content, platforms, mediaUrls, scheduledAt } = body

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Content and platforms are required' },
        { status: 400 }
      )
    }

    // Si la publication est programmée, l'enregistrer pour traitement ultérieur
    if (scheduledAt && new Date(scheduledAt) > new Date()) {
      const { data: scheduledPost, error: scheduleError } = await supabase
        .from('social_posts')
        .insert({
          content,
          platforms,
          media_urls: mediaUrls || [],
          scheduled_at: scheduledAt,
          status: 'scheduled',
          author_id: user.id
        } as any)
        .select()
        .single()

      if (scheduleError) {
        throw scheduleError
      }

      return NextResponse.json({
        success: true,
        message: 'Post scheduled successfully',
        scheduledPost
      })
    }

    // Publier immédiatement sur les plateformes sélectionnées
    const results = []
    const errors = []

    for (const platform of platforms) {
      try {
        let result
        
        switch (platform.toLowerCase()) {
          case 'twitter':
          case 'x':
            result = await publishToTwitter(content, mediaUrls)
            break
          case 'linkedin':
            result = await publishToLinkedIn(content, mediaUrls)
            break
          case 'instagram':
            result = await prepareInstagramPost(content, mediaUrls)
            break
          default:
            throw new Error(`Unsupported platform: ${platform}`)
        }
        
        results.push(result)
      } catch (error) {
        errors.push({
          platform,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Enregistrer le post dans la base de données
    const { data: savedPost, error: saveError } = await supabase
      .from('social_posts')
      .insert({
        content,
        platforms,
        media_urls: mediaUrls || [],
        published_at: new Date().toISOString(),
        status: errors.length === 0 ? 'published' : 'failed',
        author_id: user.id,
        engagement_stats: { results, errors }
      } as any)
      .select()
      .single()

    if (saveError) {
      console.error('Error saving post:', saveError)
    }

    return NextResponse.json({
      success: errors.length === 0,
      results,
      errors: errors.length > 0 ? errors : undefined,
      savedPost
    })

  } catch (error) {
    console.error('Social publish error:', error)
    return NextResponse.json(
      { error: 'Failed to publish to social media' },
      { status: 500 }
    )
  }
}

// GET pour récupérer l'historique des publications
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Récupérer les posts récents
    const { data: posts, error } = await supabase
      .from('social_posts')
      .select('*, author:users(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    return NextResponse.json({ posts })

  } catch (error) {
    console.error('Error fetching social posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social posts' },
      { status: 500 }
    )
  }
}