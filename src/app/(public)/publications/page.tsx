'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Download, 
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  BookOpen,
  FileDown,
  Gavel,
  ScrollText,
  FileSignature,
  Book
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

// Lazy load heavy components (à implémenter plus tard)
// const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
//   ssr: false,
//   loading: () => <Skeleton className="h-96 w-full" />
// })

function PublicationSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-32 w-full mb-4" />
        <div className="flex justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState('all')
  const itemsPerPage = 12

  const supabase = createClient()

  useEffect(() => {
    loadPublications()
  }, [page, typeFilter, yearFilter, languageFilter, searchTerm, activeTab])

  const loadPublications = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('publications')
        .select('*', { count: 'exact' })
        .eq('status', 'published')

      // Filtres
      if (activeTab !== 'all' && activeTab !== 'featured') {
        query = query.eq('type', activeTab)
      }
      if (activeTab === 'featured') {
        query = query.eq('is_featured', true)
      }
      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter)
      }
      if (yearFilter !== 'all') {
        query = query.eq('year', parseInt(yearFilter))
      }
      if (languageFilter !== 'all') {
        query = query.eq('language', languageFilter)
      }
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      // Pagination
      const from = (page - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      query = query.range(from, to)
      query = query.order('created_at', { ascending: false })

      const { data, count, error } = await query

      if (error) throw error

      setPublications(data || [])
      setTotalPages(Math.ceil((count || 0) / itemsPerPage))
    } catch (error) {
      console.error('Error loading publications:', error)
      setPublications([])
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (publication: any) => {
    try {
      // Incrémenter le compteur de téléchargements
      // TODO: Fix TypeScript error with Supabase update
      // await supabase
      //   .from('publications')
      //   .update({ download_count: (publication.download_count || 0) + 1 })
      //   .eq('id', publication.id)

      // Ouvrir le fichier
      window.open(publication.file_url, '_blank')
      toast.success('Téléchargement démarré')
    } catch (error) {
      toast.error('Erreur lors du téléchargement')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'report': return BookOpen
      case 'law': return Gavel
      case 'decree': return ScrollText
      case 'circular': return FileSignature
      case 'guide': return Book
      case 'form': return FileText
      default: return FileText
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'report': return 'Rapport'
      case 'law': return 'Loi'
      case 'decree': return 'Décret'
      case 'circular': return 'Circulaire'
      case 'guide': return 'Guide'
      case 'form': return 'Formulaire'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'report': return 'bg-blue-100 text-blue-700'
      case 'law': return 'bg-purple-100 text-purple-700'
      case 'decree': return 'bg-green-100 text-green-700'
      case 'circular': return 'bg-yellow-100 text-yellow-700'
      case 'guide': return 'bg-pink-100 text-pink-700'
      case 'form': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Générer les années pour le filtre
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Publications & Documents
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Accédez à tous les documents officiels, rapports, guides et formulaires du ministère
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">Anglais</SelectItem>
                <SelectItem value="wo">Wolof</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="featured">À la une</TabsTrigger>
              <TabsTrigger value="report">Rapports</TabsTrigger>
              <TabsTrigger value="law">Lois</TabsTrigger>
              <TabsTrigger value="decree">Décrets</TabsTrigger>
              <TabsTrigger value="circular">Circulaires</TabsTrigger>
              <TabsTrigger value="guide">Guides</TabsTrigger>
              <TabsTrigger value="form">Formulaires</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Publications Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <PublicationSkeleton key={i} />
              ))}
            </div>
          ) : publications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun document trouvé</h3>
                <p className="text-gray-600">
                  Modifiez vos critères de recherche ou revenez plus tard
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {publications.map((pub) => {
                const Icon = getTypeIcon(pub.type)
                return (
                  <Card key={pub.id} className="hover:shadow-lg transition-shadow group">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getTypeColor(pub.type)} variant="secondary">
                          {getTypeLabel(pub.type)}
                        </Badge>
                        {pub.is_featured && (
                          <Badge variant="default">À la une</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-senegal-green-600 transition-colors">
                        {pub.title}
                      </CardTitle>
                      {pub.author && (
                        <CardDescription className="text-sm">
                          Par {pub.author}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {pub.cover_image_url ? (
                        <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                          <Image
                            src={pub.cover_image_url}
                            alt={pub.title}
                            fill
                            className="object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="h-32 mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <Icon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {pub.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{pub.year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{pub.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          <span>{pub.download_count || 0}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/publications/${pub.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            Voir détails
                          </Button>
                        </Link>
                        {pub.is_downloadable && (
                          <Button 
                            size="sm"
                            onClick={() => handleDownload(pub)}
                            className="bg-senegal-green-600 hover:bg-senegal-green-700"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Précédent
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page {page} sur {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Suivant
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}