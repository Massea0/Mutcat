'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Eye
} from "lucide-react"
import { createClient } from '@/lib/supabase/client'

interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  published_at: string
  image_url?: string
  tags?: string[]
  views?: number
}

export default function ActualitesPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'announcement', label: 'Annonces' },
    { value: 'event', label: 'Événements' },
    { value: 'press', label: 'Presse' },
    { value: 'project', label: 'Projets' },
    { value: 'partnership', label: 'Partenariats' }
  ]

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    filterAndSortArticles()
  }, [searchTerm, categoryFilter, sortBy, articles])

  const fetchArticles = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortArticles = () => {
    let filtered = [...articles]

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(article => article.category === categoryFilter)
    }

    // Tri
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
        break
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredArticles(filtered)
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

  // Article à la une (le plus récent)
  const featuredArticle = filteredArticles[0]
  const otherArticles = filteredArticles.slice(1)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-senegal-green-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Actualités & Événements
            </h1>
            <p className="text-xl opacity-90">
              Restez informé des dernières nouvelles du ministère et des projets en cours
            </p>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-8 bg-white shadow-sm sticky top-20 z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 flex-1">
              {/* Recherche */}
              <div className="relative flex-1 min-w-[200px] max-w-[400px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtre par catégorie */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Tri */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Plus récents</SelectItem>
                  <SelectItem value="popular">Plus populaires</SelectItem>
                  <SelectItem value="alphabetical">Alphabétique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600">
              {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-senegal-green-600"></div>
              <p className="mt-4 text-gray-600">Chargement des actualités...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun article trouvé</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Article à la une */}
              {featuredArticle && (
                <Link href={`/actualites/${featuredArticle.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="grid md:grid-cols-2">
                      <div className="h-64 md:h-auto bg-gradient-to-br from-senegal-green-100 to-senegal-yellow-100"></div>
                      <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={getCategoryColor(featuredArticle.category)}>
                            {getCategoryLabel(featuredArticle.category)}
                          </Badge>
                          <Badge variant="outline">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            À la une
                          </Badge>
                        </div>
                        <h2 className="text-2xl font-bold mb-3 hover:text-senegal-green-600 transition-colors">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {featuredArticle.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(featuredArticle.published_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {featuredArticle.author}
                          </div>
                          {featuredArticle.views && (
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {featuredArticle.views} vues
                            </div>
                          )}
                        </div>
                        <div className="mt-6 flex items-center text-senegal-green-600 font-medium">
                          Lire l'article
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              )}

              {/* Autres articles */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherArticles.map((article) => (
                  <Link key={article.id} href={`/actualites/${article.id}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="h-48 bg-gradient-to-br from-senegal-green-100 to-senegal-yellow-100"></div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getCategoryColor(article.category)}>
                            {getCategoryLabel(article.category)}
                          </Badge>
                          {article.views && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.views}
                            </span>
                          )}
                        </div>
                        <CardTitle className="line-clamp-2 hover:text-senegal-green-600 transition-colors">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {article.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(article.published_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {article.author}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Restez informé
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Abonnez-vous à notre newsletter pour recevoir les dernières actualités
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Votre email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button size="lg" className="bg-white text-senegal-green-600 hover:bg-gray-100">
                S'abonner
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}