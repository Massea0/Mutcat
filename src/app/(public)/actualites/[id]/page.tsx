'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar,
  Clock,
  User,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ArrowLeft,
  Eye,
  MessageCircle
} from "lucide-react"
import { createClient } from '@/lib/supabase/client'

interface NewsArticle {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  author: string
  published_at: string
  image_url?: string
  tags?: string[]
  views?: number
}

export default function NewsDetailPage() {
  const params = useParams()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string)
    }
  }, [params.id])

  const fetchArticle = async (id: string) => {
    try {
      const supabase = createClient()
      
      // Récupérer l'article
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setArticle(data)

      // Récupérer les articles similaires
      if (data) {
        const { data: related } = await supabase
          .from('news')
          .select('*')
          .eq('category', data.category)
          .neq('id', id)
          .limit(3)
          .order('published_at', { ascending: false })

        setRelatedArticles(related || [])
      }
    } catch (error) {
      console.error('Error fetching article:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(' ').length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min de lecture`
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'announcement': 'bg-blue-100 text-blue-700',
      'event': 'bg-purple-100 text-purple-700',
      'press': 'bg-green-100 text-green-700',
      'project': 'bg-yellow-100 text-yellow-700',
      'partnership': 'bg-pink-100 text-pink-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'announcement': 'Annonce',
      'event': 'Événement',
      'press': 'Presse',
      'project': 'Projet',
      'partnership': 'Partenariat'
    }
    return labels[category] || category
  }

  const shareOnSocial = (platform: string) => {
    if (!article) return
    
    const url = window.location.href
    const title = article.title
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-senegal-green-600"></div>
          <p className="mt-4 text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Article non trouvé</p>
          <Button asChild>
            <Link href="/actualites">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux actualités
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section avec Image */}
      <section className="relative h-[500px] bg-gradient-to-r from-senegal-green-600 to-senegal-green-700">
        {article.image_url && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <div className="w-full h-full bg-gray-200"></div>
          </div>
        )}
        
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <Button variant="ghost" className="text-white mb-6" asChild>
              <Link href="/actualites">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux actualités
              </Link>
            </Button>
            
            <div className="max-w-4xl">
              <Badge className={`${getCategoryColor(article.category)} mb-4`}>
                {getCategoryLabel(article.category)}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.published_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{calculateReadTime(article.content)}</span>
                </div>
                {article.views && (
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{article.views} vues</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Article Content */}
              <div className="lg:col-span-2">
                {/* Excerpt */}
                <div className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                  {article.excerpt}
                </div>

                {/* Main Content */}
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Section */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-sm font-semibold text-gray-600 mb-4">Partager cet article</h3>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareOnSocial('facebook')}
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareOnSocial('twitter')}
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareOnSocial('linkedin')}
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Author Card */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">À propos de l'auteur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                      <div>
                        <p className="font-semibold">{article.author}</p>
                        <p className="text-sm text-gray-600">Rédacteur MUCTAT</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="mb-6 bg-gradient-to-br from-senegal-green-50 to-senegal-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Newsletter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Recevez nos dernières actualités directement dans votre boîte mail
                    </p>
                    <Button className="w-full">
                      S'abonner
                    </Button>
                  </CardContent>
                </Card>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Articles similaires</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {relatedArticles.map((related) => (
                        <Link
                          key={related.id}
                          href={`/actualites/${related.id}`}
                          className="block group"
                        >
                          <div className="space-y-2">
                            <Badge className={`${getCategoryColor(related.category)} text-xs`}>
                              {getCategoryLabel(related.category)}
                            </Badge>
                            <h4 className="font-medium text-sm group-hover:text-senegal-green-600 transition-colors line-clamp-2">
                              {related.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {formatDate(related.published_at)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Commentaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center py-8">
                  Les commentaires sont temporairement désactivés
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}