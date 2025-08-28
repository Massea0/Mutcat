'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowRight, Newspaper } from 'lucide-react'
import { cmsService, type NewsArticle } from '@/lib/cms/services'

export function NewsSection() {
  const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([])
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      const [featured, latest] = await Promise.all([
        cmsService.getFeaturedNews(1),
        cmsService.getLatestNews(3)
      ])

      setFeaturedNews(featured)
      setLatestNews(latest)
    } catch (error) {
      console.error('Error loading news:', error)
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

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-senegal-green-600 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  const mainArticle = featuredNews[0] || latestNews[0]
  const sideArticles = featuredNews.length > 0 
    ? latestNews.slice(0, 3)
    : latestNews.slice(1, 4)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Actualités & Événements
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Restez informé des dernières nouvelles du ministère et des projets en cours
          </p>
        </div>

        {/* News Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Featured Article */}
          {mainArticle && (
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              {mainArticle.image_url && (
                <div 
                  className="h-64 bg-cover bg-center"
                  style={{ backgroundImage: `url(${mainArticle.image_url})` }}
                >
                  {!mainArticle.image_url.startsWith('http') && (
                    <div className="h-full bg-gradient-to-br from-senegal-green-100 to-senegal-yellow-100 flex items-center justify-center">
                      <Newspaper className="h-20 w-20 text-senegal-green-600/20" />
                    </div>
                  )}
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getCategoryColor(mainArticle.category)}>
                    {getCategoryLabel(mainArticle.category)}
                  </Badge>
                  {mainArticle.is_featured && (
                    <Badge variant="default">À la une</Badge>
                  )}
                </div>
                <CardTitle className="text-2xl">
                  <Link href={`/actualites/${mainArticle.id}`} className="hover:text-senegal-green-600 transition-colors">
                    {mainArticle.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {mainArticle.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(mainArticle.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>5 min de lecture</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Side Articles */}
          <div className="space-y-4">
            {sideArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {article.image_url ? (
                      <div 
                        className="w-24 h-24 bg-cover bg-center rounded-lg flex-shrink-0"
                        style={{ backgroundImage: `url(${article.image_url})` }}
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-senegal-green-100 to-senegal-yellow-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <Newspaper className="h-8 w-8 text-senegal-green-600/30" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Badge className={`${getCategoryColor(article.category)} mb-2`} variant="secondary">
                        {getCategoryLabel(article.category)}
                      </Badge>
                      <h3 className="font-semibold mb-1 line-clamp-2">
                        <Link href={`/actualites/${article.id}`} className="hover:text-senegal-green-600 transition-colors">
                          {article.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(article.published_at)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/actualites">
            <Button size="lg" variant="outline">
              Toutes les actualités
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}