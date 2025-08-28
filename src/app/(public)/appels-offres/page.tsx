'use client'

import { useState, useEffect, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Calendar, 
  Download, 
  Search,
  Filter,
  Clock,
  DollarSign,
  AlertCircle,
  ChevronRight,
  Building
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'

// Skeleton Loader Component
function TenderSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function AppelsOffresPage() {
  const [tenders, setTenders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('open')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 9

  const supabase = createClient()

  useEffect(() => {
    loadTenders()
  }, [page, typeFilter, statusFilter, searchTerm])

  const loadTenders = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('tenders')
        .select('*', { count: 'exact' })

      // Filtres
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }
      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter)
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

      setTenders(data || [])
      setTotalPages(Math.ceil((count || 0) / itemsPerPage))
    } catch (error) {
      console.error('Error loading tenders:', error)
      setTenders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700'
      case 'closed': return 'bg-red-100 text-red-700'
      case 'awarded': return 'bg-blue-100 text-blue-700'
      case 'cancelled': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Ouvert'
      case 'closed': return 'Fermé'
      case 'awarded': return 'Attribué'
      case 'cancelled': return 'Annulé'
      default: return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'goods': return 'Fournitures'
      case 'services': return 'Services'
      case 'works': return 'Travaux'
      case 'consulting': return 'Consultation'
      default: return type
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return 'Non spécifié'
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} FCFA`
    }
    if (min) return `Min: ${min.toLocaleString()} FCFA`
    if (max) return `Max: ${max.toLocaleString()} FCFA`
  }

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (days < 0) return 'Expiré'
    if (days === 0) return 'Aujourd\'hui'
    if (days === 1) return '1 jour'
    return `${days} jours`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Appels d'Offres
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Consultez les opportunités de marchés publics et participez aux appels d'offres du ministère
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
                  placeholder="Rechercher un appel d'offre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="goods">Fournitures</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="works">Travaux</SelectItem>
                <SelectItem value="consulting">Consultation</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="open">Ouverts</SelectItem>
                <SelectItem value="closed">Fermés</SelectItem>
                <SelectItem value="awarded">Attribués</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Tenders List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Appels ouverts</p>
                    <p className="text-2xl font-bold text-senegal-green-600">
                      {tenders.filter(t => t.status === 'open').length}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-senegal-green-600/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Clôture proche</p>
                    <p className="text-2xl font-bold text-senegal-yellow-600">
                      {tenders.filter(t => {
                        const days = Math.ceil((new Date(t.submission_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                        return days >= 0 && days <= 7
                      }).length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-senegal-yellow-600/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total actif</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {tenders.length}
                    </p>
                  </div>
                  <Building className="h-8 w-8 text-blue-600/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Nouvelles opportunités</p>
                    <p className="text-2xl font-bold text-senegal-red-600">
                      {tenders.filter(t => {
                        const days = Math.ceil((new Date().getTime() - new Date(t.created_at).getTime()) / (1000 * 60 * 60 * 24))
                        return days <= 7
                      }).length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-senegal-red-600/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tenders Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <TenderSkeleton key={i} />
              ))}
            </div>
          ) : tenders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun appel d'offre trouvé</h3>
                <p className="text-gray-600">
                  Modifiez vos critères de recherche ou revenez plus tard
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenders.map((tender) => (
                <Card key={tender.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getStatusColor(tender.status)}>
                        {getStatusLabel(tender.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getTypeLabel(tender.type)}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2">
                      {tender.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Réf: {tender.reference}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {tender.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Date limite: {formatDate(tender.submission_deadline)}</span>
                      </div>
                      
                      {tender.status === 'open' && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span className="text-orange-600 font-medium">
                            {getDaysRemaining(tender.submission_deadline)} restants
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatBudget(tender.budget_min, tender.budget_max)}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <Link href={`/appels-offres/${tender.id}`}>
                        <Button variant="outline" size="sm">
                          Voir détails
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                      {tender.documents && tender.documents.length > 0 && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Précédent
              </Button>
              <div className="flex items-center gap-2">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                {totalPages > 5 && <span>...</span>}
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

      {/* CTA Section */}
      <section className="bg-senegal-yellow-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Besoin d'aide ?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Notre équipe est disponible pour répondre à vos questions concernant les appels d'offres
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button>
                Nous contacter
              </Button>
            </Link>
            <Link href="/services/guides">
              <Button variant="outline">
                Guide de soumission
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}