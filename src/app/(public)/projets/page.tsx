'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  Users,
  ArrowRight,
  Filter,
  Grid,
  List
} from "lucide-react"
import { createClient } from '@/lib/supabase/client'

interface Project {
  id: string
  title: string
  description: string
  status: string
  budget: number
  start_date: string
  end_date: string
  location: string
  category: string
  image_url?: string
  progress?: number
  beneficiaries?: number
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'housing', label: 'Logement Social' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'urban_planning', label: 'Urbanisme' },
    { value: 'smart_city', label: 'Ville Intelligente' },
    { value: 'environment', label: 'Environnement' }
  ]

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'planned', label: 'Planifié' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'on_hold', label: 'En attente' }
  ]

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [searchTerm, categoryFilter, statusFilter, projects])

  const fetchProjects = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = () => {
    let filtered = [...projects]

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.category === categoryFilter)
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    setFilteredProjects(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'in_progress': return 'bg-blue-100 text-blue-700'
      case 'planned': return 'bg-yellow-100 text-yellow-700'
      case 'on_hold': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé'
      case 'in_progress': return 'En cours'
      case 'planned': return 'Planifié'
      case 'on_hold': return 'En attente'
      default: return status
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'housing': return '🏠'
      case 'infrastructure': return '🛣️'
      case 'urban_planning': return '🏙️'
      case 'smart_city': return '💡'
      case 'environment': return '🌳'
      default: return '📋'
    }
  }

  const formatBudget = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} Mds FCFA`
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} M FCFA`
    } else {
      return `${amount.toLocaleString()} FCFA`
    }
  }

  const stats = {
    total: projects.length,
    enCours: projects.filter(p => p.status === 'in_progress').length,
    termines: projects.filter(p => p.status === 'completed').length,
    budget: projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nos Projets
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Des projets ambitieux pour transformer le Sénégal et améliorer le cadre de vie des citoyens
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-sm opacity-80">Projets totaux</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">{stats.enCours}</div>
                <div className="text-sm opacity-80">En cours</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">{stats.termines}</div>
                <div className="text-sm opacity-80">Terminés</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">{formatBudget(stats.budget)}</div>
                <div className="text-sm opacity-80">Budget total</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres Section */}
      <section className="py-8 bg-white shadow-sm sticky top-20 z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 flex-1">
              {/* Recherche */}
              <div className="relative flex-1 min-w-[200px] max-w-[400px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un projet..."
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

              {/* Filtre par statut */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Toggle View */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Résultats */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Projets Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-senegal-green-600"></div>
              <p className="mt-4 text-gray-600">Chargement des projets...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun projet trouvé</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Link key={project.id} href={`/projets/${project.id}`}>
                  <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-senegal-green-100 to-senegal-yellow-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">{getCategoryIcon(project.category)}</span>
                      </div>
                      {project.progress && (
                        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow">
                          <span className="text-sm font-semibold">{project.progress}%</span>
                        </div>
                      )}
                    </div>

                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusLabel(project.status)}
                        </Badge>
                        <Badge variant="outline">{project.category}</Badge>
                      </div>
                      <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {project.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatBudget(project.budget)}</span>
                        </div>
                        {project.beneficiaries && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{project.beneficiaries.toLocaleString()} bénéficiaires</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center text-senegal-green-600 font-medium">
                        Voir les détails
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Link key={project.id} href={`/projets/${project.id}`}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-senegal-green-100 to-senegal-yellow-100 rounded-lg flex items-center justify-center">
                          <span className="text-3xl">{getCategoryIcon(project.category)}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                              <p className="text-gray-600 line-clamp-2">{project.description}</p>
                            </div>
                            <Badge className={getStatusColor(project.status)}>
                              {getStatusLabel(project.status)}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {project.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {formatBudget(project.budget)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(project.start_date).getFullYear()}
                            </div>
                            {project.beneficiaries && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {project.beneficiaries.toLocaleString()} bénéficiaires
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}