'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  MapPin, 
  Users, 
  DollarSign, 
  ArrowRight,
  Building,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { cmsService, type Project } from '@/lib/cms/services'

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const featuredProjects = await cmsService.getFeaturedProjects(4)
      
      // Si pas assez de projets featured, compléter avec les derniers
      if (featuredProjects.length < 4) {
        const latestProjects = await cmsService.getLatestProjects(4 - featuredProjects.length)
        setProjects([...featuredProjects, ...latestProjects])
      } else {
        setProjects(featuredProjects)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'in_progress': return 'bg-blue-100 text-blue-700'
      case 'planning': return 'bg-yellow-100 text-yellow-700'
      case 'on_hold': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé'
      case 'in_progress': return 'En cours'
      case 'planning': return 'Planification'
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

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-senegal-green-600 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Projets Phares
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les projets majeurs qui transforment notre territoire et améliorent la vie des citoyens
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-xl transition-shadow">
              {/* Project Image */}
              {project.main_image_url ? (
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${project.main_image_url})` }}
                >
                  {project.is_featured && (
                    <Badge className="absolute top-2 right-2 bg-senegal-yellow-500">
                      Projet phare
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-senegal-green-100 to-senegal-yellow-100 flex items-center justify-center relative">
                  <span className="text-5xl">{getCategoryIcon(project.category)}</span>
                  {project.is_featured && (
                    <Badge className="absolute top-2 right-2 bg-senegal-yellow-500">
                      Projet phare
                    </Badge>
                  )}
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getStatusColor(project.status)} variant="secondary">
                    {getStatusLabel(project.status)}
                  </Badge>
                  {project.progress !== undefined && (
                    <span className="text-sm font-semibold text-senegal-green-600">
                      {project.progress}%
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Progress Bar */}
                {project.progress !== undefined && (
                  <Progress value={project.progress} className="mb-3 h-2" />
                )}

                {/* Project Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{project.location}</span>
                  </div>
                  {project.budget > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="h-3 w-3" />
                      <span>{formatBudget(project.budget)}</span>
                    </div>
                  )}
                  {project.beneficiaries && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-3 w-3" />
                      <span>{project.beneficiaries.toLocaleString()} bénéf.</span>
                    </div>
                  )}
                </div>

                {/* View Details Link */}
                <Link href={`/projets/${project.id}`}>
                  <Button variant="ghost" className="w-full mt-4 group">
                    Voir les détails
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-12 p-6 bg-gradient-to-r from-senegal-green-50 to-senegal-yellow-50 rounded-2xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-senegal-green-600">
              {projects.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Projets terminés</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {projects.filter(p => p.status === 'in_progress').length}
            </div>
            <div className="text-sm text-gray-600">En cours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-senegal-yellow-600">
              {formatBudget(projects.reduce((sum, p) => sum + (p.budget || 0), 0))}
            </div>
            <div className="text-sm text-gray-600">Budget total</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-senegal-red-600">
              {projects.reduce((sum, p) => sum + (p.beneficiaries || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Bénéficiaires</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/projets">
            <Button size="lg">
              Tous nos projets
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}