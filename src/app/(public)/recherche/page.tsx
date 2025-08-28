'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  FileText,
  Calendar,
  Briefcase,
  Building,
  Newspaper,
  Book,
  Filter,
  ChevronRight,
  Clock,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const type = searchParams.get('type') || 'all'
  
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(type)
  const [searchTerm, setSearchTerm] = useState(query)
  
  const supabase = createClient()

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query, type])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    try {
      const allResults: any[] = []
      
      if (type === 'all' || type === 'projects') {
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .limit(10)
        
        projects?.forEach(item => {
          allResults.push({ ...(item as any), type: 'project' })
        })
      }

      if (type === 'all' || type === 'news') {
        const { data: news } = await supabase
          .from('news')
          .select('*')
          .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
          .limit(10)
        
        news?.forEach(item => {
          allResults.push({ ...(item as any), type: 'news' })
        })
      }

      if (type === 'all' || type === 'tenders') {
        const { data: tenders } = await supabase
          .from('tenders')
          .select('*')
          .eq('status', 'open')
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .limit(10)
        
        tenders?.forEach(item => {
          allResults.push({ ...(item as any), type: 'tender' })
        })
      }

      if (type === 'all' || type === 'publications') {
        const { data: publications } = await supabase
          .from('publications')
          .select('*')
          .eq('status', 'published')
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .limit(10)
        
        publications?.forEach(item => {
          allResults.push({ ...(item as any), type: 'publication' })
        })
      }

      if (type === 'all' || type === 'events') {
        const { data: events } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'published')
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .limit(10)
        
        events?.forEach(item => {
          allResults.push({ ...(item as any), type: 'event' })
        })
      }

      if (type === 'all' || type === 'careers') {
        const { data: careers } = await supabase
          .from('careers')
          .select('*')
          .eq('status', 'open')
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .limit(10)
        
        careers?.forEach(item => {
          allResults.push({ ...(item as any), type: 'career' })
        })
      }

      setResults(allResults)
      
      // Track search
      await supabase.from('search_analytics').insert({
        query: searchQuery,
        result_type: type,
        clicked: false
      } as any)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewSearch = () => {
    if (searchTerm) {
      window.location.href = `/recherche?q=${encodeURIComponent(searchTerm)}&type=${activeTab}`
    }
  }

  const getTypeIcon = (itemType: string) => {
    switch (itemType) {
      case 'project': return Building
      case 'news': return Newspaper
      case 'tender': return FileText
      case 'publication': return Book
      case 'event': return Calendar
      case 'career': return Briefcase
      default: return FileText
    }
  }

  const getTypeLabel = (itemType: string) => {
    switch (itemType) {
      case 'project': return 'Projet'
      case 'news': return 'Actualité'
      case 'tender': return 'Appel d\'offre'
      case 'publication': return 'Publication'
      case 'event': return 'Événement'
      case 'career': return 'Emploi'
      default: return itemType
    }
  }

  const getTypeColor = (itemType: string) => {
    switch (itemType) {
      case 'project': return 'bg-blue-100 text-blue-700'
      case 'news': return 'bg-green-100 text-green-700'
      case 'tender': return 'bg-yellow-100 text-yellow-700'
      case 'publication': return 'bg-purple-100 text-purple-700'
      case 'event': return 'bg-pink-100 text-pink-700'
      case 'career': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getItemUrl = (item: any) => {
    switch (item.type) {
      case 'project': return `/projets/${item.id}`
      case 'news': return `/actualites/${item.id}`
      case 'tender': return `/appels-offres/${item.id}`
      case 'publication': return `/publications/${item.id}`
      case 'event': return `/evenements/${item.id}`
      case 'career': return `/carrieres/${item.id}`
      default: return '#'
    }
  }

  const filteredResults = activeTab === 'all' 
    ? results 
    : results.filter(r => r.type === activeTab.slice(0, -1)) // Remove 's' from plural

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Résultats de recherche
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-3xl">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNewSearch()}
                  className="pl-10 h-12 bg-white text-gray-900"
                />
              </div>
              <Button 
                onClick={handleNewSearch}
                className="bg-senegal-yellow-500 hover:bg-senegal-yellow-600 text-black h-12 px-6"
              >
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {query && (
            <div className="mb-6">
              <p className="text-gray-600">
                Résultats pour "<span className="font-semibold text-gray-900">{query}</span>"
                {!loading && ` (${filteredResults.length} résultat${filteredResults.length > 1 ? 's' : ''})`}
              </p>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="all">
                Tout ({results.length})
              </TabsTrigger>
              <TabsTrigger value="projects">
                Projets ({results.filter(r => r.type === 'project').length})
              </TabsTrigger>
              <TabsTrigger value="news">
                Actualités ({results.filter(r => r.type === 'news').length})
              </TabsTrigger>
              <TabsTrigger value="tenders">
                Appels d'offres ({results.filter(r => r.type === 'tender').length})
              </TabsTrigger>
              <TabsTrigger value="publications">
                Publications ({results.filter(r => r.type === 'publication').length})
              </TabsTrigger>
              <TabsTrigger value="events">
                Événements ({results.filter(r => r.type === 'event').length})
              </TabsTrigger>
              <TabsTrigger value="careers">
                Emplois ({results.filter(r => r.type === 'career').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Results Grid */}
          {loading ? (
            <div className="grid gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-8 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredResults.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-600">
                  Essayez avec d'autres mots-clés ou élargissez votre recherche
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredResults.map((item) => {
                const Icon = getTypeIcon(item.type)
                return (
                  <Link key={`${item.type}-${item.id}`} href={getItemUrl(item)}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="h-5 w-5 text-gray-400" />
                              <Badge className={cn('text-xs', getTypeColor(item.type))}>
                                {getTypeLabel(item.type)}
                              </Badge>
                              {item.is_featured && (
                                <Badge variant="default">À la une</Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl hover:text-senegal-green-600 transition-colors">
                              {item.title}
                            </CardTitle>
                            {item.reference && (
                              <CardDescription>
                                Référence: {item.reference}
                              </CardDescription>
                            )}
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 line-clamp-3 mb-3">
                          {item.description || item.excerpt || item.content}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {item.category && (
                            <span>{item.category}</span>
                          )}
                          {item.location && (
                            <span>{item.location}</span>
                          )}
                          {item.submission_deadline && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(item.submission_deadline).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                          {item.start_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.start_date).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}

          {/* No query message */}
          {!query && !loading && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Commencez votre recherche</h3>
                <p className="text-gray-600 mb-6">
                  Entrez des mots-clés pour rechercher dans tout le site
                </p>
                
                {/* Popular searches */}
                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Recherches populaires
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['permis de construire', 'appels d\'offres', 'logement social', 'vision 2050'].map((term) => (
                      <Link
                        key={term}
                        href={`/recherche?q=${encodeURIComponent(term)}`}
                        className="px-3 py-1 bg-senegal-green-50 hover:bg-senegal-green-100 text-senegal-green-700 rounded-full text-sm transition-colors"
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-senegal-green-600"></div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}