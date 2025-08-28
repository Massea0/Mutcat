'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface Publication {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  category?: string
  tags?: string[]
  is_published: boolean
  published_at?: string
  author_id?: string
  views: number
  created_at: string
  updated_at: string
}

export function usePublications(limit = 12) {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    async function fetchPublications() {
      try {
        setLoading(true)
        setError(null)
        
        // First check if table exists
        const { data: tableCheck, error: checkError } = await supabase
          .from('publications')
          .select('id')
          .limit(1)
        
        if (checkError) {
          // If table doesn't exist, try to use news table instead
          const { data: newsData, error: newsError } = await supabase
            .from('news')
            .select('*')
            .eq('published', true)
            .order('published_at', { ascending: false })
            .limit(limit)
          
          if (newsError) {
            throw newsError
          }
          
          // Map news to publications format
          const mappedPublications: Publication[] = (newsData || []).map(news => ({
            id: news.id,
            title: news.title,
            slug: news.slug,
            content: news.content,
            excerpt: news.excerpt,
            featured_image: news.featured_image,
            category: news.category,
            tags: [],
            is_published: news.published,
            published_at: news.published_at,
            author_id: news.author_id,
            views: news.views || 0,
            created_at: news.created_at,
            updated_at: news.updated_at
          }))
          
          setPublications(mappedPublications)
        } else {
          // Publications table exists, use it
          const { data, error: fetchError } = await supabase
            .from('publications')
            .select('*')
            .eq('is_published', true)
            .order('published_at', { ascending: false })
            .limit(limit)
          
          if (fetchError) {
            throw fetchError
          }
          
          setPublications(data || [])
        }
      } catch (err) {
        console.error('Error loading publications:', err)
        setError(err instanceof Error ? err.message : 'Failed to load publications')
        setPublications([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchPublications()
  }, [limit])
  
  return { publications, loading, error }
}