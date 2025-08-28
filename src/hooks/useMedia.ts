'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface Media {
  id: string
  title: string
  description?: string
  file_url: string
  file_type?: string
  media_type?: string
  size?: number
  width?: number
  height?: number
  duration?: number
  tags?: string[]
  is_featured: boolean
  is_published: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export function useMedia(mediaType?: 'photo' | 'video' | 'audio', limit = 20) {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true)
        setError(null)
        
        // First check if media table exists
        const { data: tableCheck, error: checkError } = await supabase
          .from('media')
          .select('id')
          .limit(1)
        
        if (checkError) {
          // If media table doesn't exist, try to use documents table
          const { data: docsData, error: docsError } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit)
          
          if (docsError) {
            throw docsError
          }
          
          // Map documents to media format
          const mappedMedia: Media[] = (docsData || []).map(doc => ({
            id: doc.id,
            title: doc.title,
            description: doc.description,
            file_url: doc.file_url,
            file_type: doc.file_type,
            media_type: doc.file_type?.startsWith('image') ? 'photo' : 
                       doc.file_type?.startsWith('video') ? 'video' : 
                       doc.file_type?.startsWith('audio') ? 'audio' : undefined,
            size: doc.file_size,
            width: undefined,
            height: undefined,
            duration: undefined,
            tags: [],
            is_featured: false,
            is_published: true,
            created_by: doc.uploaded_by,
            created_at: doc.created_at,
            updated_at: doc.updated_at
          }))
          
          // Filter by media type if specified
          const filtered = mediaType 
            ? mappedMedia.filter(m => m.media_type === mediaType)
            : mappedMedia
          
          setMedia(filtered)
        } else {
          // Media table exists, use it
          let query = supabase
            .from('media')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(limit)
          
          if (mediaType) {
            query = query.eq('media_type', mediaType)
          }
          
          const { data, error: fetchError } = await query
          
          if (fetchError) {
            throw fetchError
          }
          
          setMedia(data || [])
        }
      } catch (err) {
        console.error('Error loading media:', err)
        setError(err instanceof Error ? err.message : 'Failed to load media')
        setMedia([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchMedia()
  }, [mediaType, limit])
  
  return { media, loading, error }
}