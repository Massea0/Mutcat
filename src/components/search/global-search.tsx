'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  X,
  FileText,
  Calendar,
  Briefcase,
  Building,
  Newspaper,
  Book,
  Users,
  Loader2,
  Clock,
  TrendingUp,
  ArrowRight,
  Filter
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'

interface SearchResult {
  id: string
  title: string
  description?: string
  type: 'project' | 'news' | 'tender' | 'publication' | 'event' | 'career' | 'page'
  url: string
  date?: string
  category?: string
  icon?: any
  highlight?: string
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches] = useState([
    'permis de construire',
    'appels d\'offres',
    'logement social',
    'vision 2050',
    'smart cities'
  ])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([])
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Perform search
  useEffect(() => {
    if (debouncedSearchTerm.length < 2) {
      setResults([])
      return
    }

    performSearch(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  // Filter results by tab
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredResults(results)
    } else {
      setFilteredResults(results.filter(r => r.type === activeTab))
    }
  }, [activeTab, results])

  const performSearch = async (query: string) => {
    setLoading(true)
    try {
      const searchResults: SearchResult[] = []
      
      // Search Projects
      const { data: projects } = await supabase
        .from('projects')
        .select('id, title, description, category')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(5)
      
      projects?.forEach(item => {
        searchResults.push({
          id: item.id,
          title: item.title,
          description: item.description,
          type: 'project',
          url: `/projets/${item.id}`,
          category: item.category,
          icon: Building
        })
      })

      // Search News
      const { data: news } = await supabase
        .from('news')
        .select('id, title, excerpt, category, published_at')
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(5)
      
      news?.forEach(item => {
        searchResults.push({
          id: item.id,
          title: item.title,
          description: item.excerpt,
          type: 'news',
          url: `/actualites/${item.id}`,
          date: item.published_at,
          category: item.category,
          icon: Newspaper
        })
      })

      // Search Tenders
      const { data: tenders } = await supabase
        .from('tenders')
        .select('id, title, description, reference, submission_deadline')
        .eq('status', 'open')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,reference.ilike.%${query}%`)
        .limit(5)
      
      tenders?.forEach(item => {
        searchResults.push({
          id: item.id,
          title: item.title,
          description: item.description,
          type: 'tender',
          url: `/appels-offres/${item.id}`,
          date: item.submission_deadline,
          highlight: `Réf: ${item.reference}`,
          icon: FileText
        })
      })

      // Search Publications
      const { data: publications } = await supabase
        .from('publications')
        .select('id, title, description, type, year')
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(5)
      
      publications?.forEach(item => {
        searchResults.push({
          id: item.id,
          title: item.title,
          description: item.description,
          type: 'publication',
          url: `/publications/${item.id}`,
          category: item.type,
          highlight: `${item.year}`,
          icon: Book
        })
      })

      // Search Events
      const { data: events } = await supabase
        .from('events')
        .select('id, title, description, start_date, event_type')
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(5)
      
      events?.forEach(item => {
        searchResults.push({
          id: item.id,
          title: item.title,
          description: item.description,
          type: 'event',
          url: `/evenements/${item.id}`,
          date: item.start_date,
          category: item.event_type,
          icon: Calendar
        })
      })

      // Search Careers
      const { data: careers } = await supabase
        .from('careers')
        .select('id, title, description, reference, department')
        .eq('status', 'open')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(5)
      
      careers?.forEach(item => {
        searchResults.push({
          id: item.id,
          title: item.title,
          description: item.description,
          type: 'career',
          url: `/carrieres/${item.id}`,
          category: item.department,
          highlight: `Réf: ${item.reference}`,
          icon: Briefcase
        })
      })

      // Add static pages
      const staticPages = [
        { title: 'Missions du Ministère', url: '/ministere/missions', keywords: ['mission', 'ministère', 'objectifs'] },
        { title: 'Le Ministre', url: '/ministere/ministre', keywords: ['ministre', 'cabinet', 'direction'] },
        { title: 'Organigramme', url: '/ministere/organigramme', keywords: ['organigramme', 'structure', 'organisation'] },
        { title: 'Services', url: '/services', keywords: ['services', 'démarches', 'formulaires'] },
        { title: 'FAQ', url: '/faq', keywords: ['faq', 'questions', 'aide', 'support'] },
        { title: 'Contact', url: '/contact', keywords: ['contact', 'adresse', 'téléphone', 'email'] }
      ]

      staticPages.forEach(page => {
        if (page.keywords.some(keyword => keyword.includes(query.toLowerCase()) || query.toLowerCase().includes(keyword))) {
          searchResults.push({
            id: page.url,
            title: page.title,
            type: 'page',
            url: page.url,
            icon: FileText
          })
        }
      })

      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    
    // Save to recent searches
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url)
    onClose()
    
    // Track search analytics
    trackSearch(searchTerm, result)
  }

  const trackSearch = async (query: string, result: SearchResult) => {
    try {
      await supabase.from('search_analytics').insert({
        query,
        result_type: result.type,
        result_id: result.id,
        clicked: true
      })
    } catch (error) {
      console.error('Error tracking search:', error)
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project': return 'Projet'
      case 'news': return 'Actualité'
      case 'tender': return 'Appel d\'offre'
      case 'publication': return 'Publication'
      case 'event': return 'Événement'
      case 'career': return 'Emploi'
      case 'page': return 'Page'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-700'
      case 'news': return 'bg-green-100 text-green-700'
      case 'tender': return 'bg-yellow-100 text-yellow-700'
      case 'publication': return 'bg-purple-100 text-purple-700'
      case 'event': return 'bg-pink-100 text-pink-700'
      case 'career': return 'bg-orange-100 text-orange-700'
      case 'page': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const resultCounts = {
    all: results.length,
    project: results.filter(r => r.type === 'project').length,
    news: results.filter(r => r.type === 'news').length,
    tender: results.filter(r => r.type === 'tender').length,
    publication: results.filter(r => r.type === 'publication').length,
    event: results.filter(r => r.type === 'event').length,
    career: results.filter(r => r.type === 'career').length
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Search Header */}
          <div className="p-6 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Rechercher sur tout le site..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 text-lg h-12"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            {results.length > 0 && (
              <div className="mt-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="all">
                      Tout ({resultCounts.all})
                    </TabsTrigger>
                    <TabsTrigger value="project" disabled={resultCounts.project === 0}>
                      Projets ({resultCounts.project})
                    </TabsTrigger>
                    <TabsTrigger value="news" disabled={resultCounts.news === 0}>
                      Actualités ({resultCounts.news})
                    </TabsTrigger>
                    <TabsTrigger value="tender" disabled={resultCounts.tender === 0}>
                      Appels ({resultCounts.tender})
                    </TabsTrigger>
                    <TabsTrigger value="publication" disabled={resultCounts.publication === 0}>
                      Docs ({resultCounts.publication})
                    </TabsTrigger>
                    <TabsTrigger value="event" disabled={resultCounts.event === 0}>
                      Events ({resultCounts.event})
                    </TabsTrigger>
                    <TabsTrigger value="career" disabled={resultCounts.career === 0}>
                      Emplois ({resultCounts.career})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-senegal-green-600" />
              </div>
            ) : searchTerm && filteredResults.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''} trouvé{filteredResults.length > 1 ? 's' : ''}
                </p>
                {filteredResults.map((result) => {
                  const Icon = result.icon || FileText
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left group"
                    >
                      <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 mt-1">
                          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-senegal-green-100 transition-colors">
                            <Icon className="h-5 w-5 text-gray-600 group-hover:text-senegal-green-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-senegal-green-600 transition-colors">
                              {result.title}
                            </h3>
                            <Badge className={cn('text-xs', getTypeColor(result.type))}>
                              {getTypeLabel(result.type)}
                            </Badge>
                          </div>
                          {result.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                              {result.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {result.category && (
                              <span>{result.category}</span>
                            )}
                            {result.date && (
                              <span>
                                {new Date(result.date).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                            {result.highlight && (
                              <span className="font-medium">{result.highlight}</span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-senegal-green-600 transition-colors" />
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : searchTerm && !loading ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-600">
                  Essayez avec d'autres mots-clés ou explorez les suggestions ci-dessous
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Recherches récentes
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Effacer
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Recherches populaires
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-3 py-1 bg-senegal-green-50 hover:bg-senegal-green-100 text-senegal-green-700 rounded-full text-sm transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Accès rapide
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => {
                        router.push('/appels-offres')
                        onClose()
                      }}
                      className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FileText className="h-5 w-5 text-gray-600" />
                      <span className="text-sm">Appels d'offres</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push('/projets')
                        onClose()
                      }}
                      className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Building className="h-5 w-5 text-gray-600" />
                      <span className="text-sm">Projets</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push('/evenements')
                        onClose()
                      }}
                      className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <span className="text-sm">Événements</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push('/services')
                        onClose()
                      }}
                      className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Users className="h-5 w-5 text-gray-600" />
                      <span className="text-sm">Services</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer with shortcuts */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">↵</kbd>
                  Sélectionner
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Tab</kbd>
                  Naviguer
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Esc</kbd>
                  Fermer
                </span>
              </div>
              <span>
                Recherche avancée avec <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">K</kbd>
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}