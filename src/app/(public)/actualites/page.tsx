"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Tag, Search, Filter, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  featured_image: string | null
  published_at: string
  author: {
    full_name: string
  } | null
  views: number
}

const categories = [
  { id: 'all', label: 'Toutes', color: 'bg-gray-100' },
  { id: 'announcements', label: 'Annonces', color: 'bg-senegal-green-100' },
  { id: 'projects', label: 'Projets', color: 'bg-senegal-yellow-100' },
  { id: 'events', label: 'Événements', color: 'bg-senegal-red-100' },
  { id: 'reforms', label: 'Réformes', color: 'bg-blue-100' },
]

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchNews()
  }, [])

  useEffect(() => {
    filterNews()
  }, [news, selectedCategory, searchQuery])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          author:users(full_name)
        `)
        .eq('published', true)
        .order('published_at', { ascending: false })

      if (error) throw error

      // Données de démonstration si la base est vide
      const demoNews: NewsItem[] = data?.length ? data : [
        {
          id: '1',
          title: 'Lancement du Programme National d\'Accès au Logement et de Rénovation Urbaine',
          slug: 'lancement-pnalru',
          excerpt: 'Le Ministre Balla Moussa Fofana présente le nouveau programme ambitieux visant à construire 500 000 logements sur 15 ans.',
          content: 'Contenu complet de l\'article...',
          category: 'announcements',
          featured_image: null,
          published_at: '2025-04-15T10:00:00',
          author: { full_name: 'Direction Communication' },
          views: 1250
        },
        {
          id: '2',
          title: 'Réforme Foncière : Un Nouveau Cadre Juridique pour le Sénégal',
          slug: 'reforme-fonciere',
          excerpt: 'L\'Assemblée nationale examine le projet de loi visant à garantir une gestion transparente et rationnelle des terres.',
          content: 'Contenu complet de l\'article...',
          category: 'reforms',
          featured_image: null,
          published_at: '2025-08-25T14:30:00',
          author: { full_name: 'Service Juridique' },
          views: 890
        },
        {
          id: '3',
          title: 'Vision Sénégal 2050 : Les 8 Pôles Territoriaux en Action',
          slug: 'vision-senegal-2050',
          excerpt: 'Présentation détaillée de la stratégie de développement territorial équilibré sur l\'ensemble du pays.',
          content: 'Contenu complet de l\'article...',
          category: 'projects',
          featured_image: null,
          published_at: '2025-07-07T09:00:00',
          author: { full_name: 'ANAT' },
          views: 2100
        },
        {
          id: '4',
          title: 'Conférence Nationale sur l\'Urbanisme Durable',
          slug: 'conference-urbanisme',
          excerpt: 'Le MUCTAT organise une grande conférence réunissant experts nationaux et internationaux.',
          content: 'Contenu complet de l\'article...',
          category: 'events',
          featured_image: null,
          published_at: '2025-09-15T16:00:00',
          author: { full_name: 'Organisation Événements' },
          views: 567
        }
      ]

      setNews(demoNews)
    } catch (error) {
      console.error('Error fetching news:', error)
      // Utiliser les données de démonstration en cas d'erreur
      setNews([])
    } finally {
      setIsLoading(false)
    }
  }

  const filterNews = () => {
    let filtered = [...news]

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredNews(filtered)
  }

  const getCategoryStyle = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat?.color || 'bg-gray-100'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Actualités & Informations
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Restez informé des dernières nouvelles, annonces et événements du ministère
            </p>
          </div>
        </div>
      </section>

      {/* Filtres et Recherche */}
      <section className="py-8 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une actualité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>

            {/* Catégories */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-senegal-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Liste des actualités */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-senegal-green-500 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Chargement des actualités...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucune actualité trouvée.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item, index) => (
                <Card key={item.id} className={`group hover:shadow-2xl transition-all duration-300 ${
                  index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}>
                  {/* Image */}
                  <div className={`relative ${index === 0 ? 'h-64' : 'h-48'} bg-gradient-to-br from-senegal-green-100 to-senegal-yellow-100 rounded-t-2xl overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div className="absolute top-4 left-4 z-20">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getCategoryStyle(item.category)}`}>
                        {categories.find(c => c.id === item.category)?.label || item.category}
                      </span>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className={`${index === 0 ? 'text-2xl' : 'text-xl'} line-clamp-2 group-hover:text-senegal-green-600 transition-colors`}>
                      <Link href={`/actualites/${item.slug}`}>
                        {item.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className={`${index === 0 ? 'line-clamp-3' : 'line-clamp-2'} mt-2`}>
                      {item.excerpt}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(item.published_at)}
                        </span>
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {item.author?.full_name || 'MUCTAT'}
                        </span>
                      </div>
                      <Link 
                        href={`/actualites/${item.slug}`}
                        className="text-senegal-green-600 hover:text-senegal-green-700 font-medium flex items-center group"
                      >
                        Lire plus
                        <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredNews.length > 0 && (
            <div className="mt-12 flex justify-center">
              <div className="flex gap-2">
                <Button variant="outline" disabled>
                  Précédent
                </Button>
                <Button variant="gradient">
                  1
                </Button>
                <Button variant="outline">
                  2
                </Button>
                <Button variant="outline">
                  3
                </Button>
                <Button variant="outline">
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Restez informé
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Inscrivez-vous à notre newsletter pour recevoir les dernières actualités directement dans votre boîte mail
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-xl text-gray-900"
            />
            <Button size="lg" className="bg-white text-senegal-green-600 hover:bg-gray-100">
              S'inscrire
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}