'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  ArrowLeft,
  Play,
  Image as ImageIcon,
  FileText,
  TrendingUp,
  Target,
  Award
} from "lucide-react"
import { createClient } from '@/lib/supabase/client'

interface Project {
  id: string
  title: string
  description: string
  full_description?: string
  status: string
  budget: number
  spent_amount?: number
  start_date: string
  end_date: string
  location: string
  category: string
  image_url?: string
  gallery?: string[]
  documents?: any[]
  progress?: number
  beneficiaries?: number
  contractor?: string
  supervisor?: string
  objectives?: string[]
  milestones?: any[]
  impacts?: string[]
  partners?: string[]
}

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (id: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setProject(data)
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
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

  const formatBudget = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} Milliards FCFA`
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} Millions FCFA`
    } else {
      return `${amount.toLocaleString()} FCFA`
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth())
    
    if (months >= 12) {
      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      return remainingMonths > 0 ? `${years} an${years > 1 ? 's' : ''} et ${remainingMonths} mois` : `${years} an${years > 1 ? 's' : ''}`
    }
    return `${months} mois`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-senegal-green-600"></div>
          <p className="mt-4 text-gray-600">Chargement du projet...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Projet non trouvé</p>
          <Button className="mt-4" asChild>
            <Link href="/projets">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux projets
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const mockMilestones = [
    { date: '2024-01', title: 'Études préliminaires', status: 'completed' },
    { date: '2024-03', title: 'Appel d\'offres', status: 'completed' },
    { date: '2024-06', title: 'Début des travaux', status: 'completed' },
    { date: '2024-12', title: 'Phase 1 complétée', status: 'in_progress' },
    { date: '2025-06', title: 'Livraison finale', status: 'pending' }
  ]

  const mockObjectives = [
    'Améliorer les conditions de vie de 10 000 familles',
    'Créer 500 emplois directs et 2000 emplois indirects',
    'Réduire le déficit de logements de 20%',
    'Promouvoir le développement durable'
  ]

  const mockImpacts = [
    { label: 'Familles bénéficiaires', value: '10 000+' },
    { label: 'Emplois créés', value: '2 500' },
    { label: 'Investissement local', value: '60%' },
    { label: 'Réduction CO2', value: '30%' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section avec Image */}
      <section className="relative h-[400px] bg-gradient-to-r from-senegal-green-600 to-senegal-green-700">
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4">
          <div className="container mx-auto">
            <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
              <Link href="/projets">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux projets
              </Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-8">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <Badge className={`${getStatusColor(project.status)} mb-4`}>
                {getStatusLabel(project.status)}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {project.title}
              </h1>
              <p className="text-xl text-white/90 mb-6">
                {project.description}
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 text-white">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span>{formatBudget(project.budget)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDate(project.start_date)}</span>
                </div>
                {project.beneficiaries && (
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>{project.beneficiaries.toLocaleString()} bénéficiaires</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      {project.progress !== undefined && (
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progression du projet</span>
              <span className="text-sm font-bold text-senegal-green-600">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-3" />
          </div>
        </section>
      )}

      {/* Tabs Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="timeline">Chronologie</TabsTrigger>
              <TabsTrigger value="gallery">Galerie</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Description détaillée */}
                  <Card>
                    <CardHeader>
                      <CardTitle>À propos du projet</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <p className="text-gray-600 leading-relaxed">
                        {project.full_description || project.description}
                      </p>
                      <p className="text-gray-600 leading-relaxed mt-4">
                        Ce projet s'inscrit dans le cadre de la Vision Sénégal 2050 et vise à transformer 
                        durablement les conditions de vie des populations. Il représente un investissement 
                        majeur dans le développement territorial et l'amélioration du cadre de vie urbain.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Objectifs */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-senegal-green-600" />
                        Objectifs du projet
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {mockObjectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-senegal-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Impacts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-senegal-green-600" />
                        Impacts attendus
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {mockImpacts.map((impact, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="text-2xl font-bold text-senegal-green-600">{impact.value}</div>
                            <div className="text-sm text-gray-600">{impact.label}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Informations clés */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations clés</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Budget total</div>
                        <div className="font-semibold">{formatBudget(project.budget)}</div>
                      </div>
                      {project.spent_amount && (
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Montant dépensé</div>
                          <div className="font-semibold">{formatBudget(project.spent_amount)}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Date de début</div>
                        <div className="font-semibold">{formatDate(project.start_date)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Date de fin prévue</div>
                        <div className="font-semibold">{formatDate(project.end_date)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Durée du projet</div>
                        <div className="font-semibold">{calculateDuration(project.start_date, project.end_date)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Localisation</div>
                        <div className="font-semibold">{project.location}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <Card>
                    <CardContent className="pt-6 space-y-3">
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger la fiche projet
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Share2 className="h-4 w-4 mr-2" />
                        Partager le projet
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Contact */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact projet</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500">Direction responsable</div>
                        <div className="font-medium">Direction de l'Habitat</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Chef de projet</div>
                        <div className="font-medium">M. Amadou DIALLO</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium text-senegal-green-600">projet@muctat.sn</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Chronologie du projet</CardTitle>
                  <CardDescription>
                    Suivez l'évolution du projet étape par étape
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    {mockMilestones.map((milestone, index) => (
                      <div key={index} className="relative flex items-start mb-8">
                        <div className={`absolute left-8 w-4 h-4 rounded-full -translate-x-1/2 ${
                          milestone.status === 'completed' ? 'bg-green-500' :
                          milestone.status === 'in_progress' ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`}>
                          {milestone.status === 'completed' && (
                            <CheckCircle className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className="ml-16">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm text-gray-500">{milestone.date}</span>
                            {milestone.status === 'in_progress' && (
                              <Badge className="bg-blue-100 text-blue-700">En cours</Badge>
                            )}
                          </div>
                          <h4 className="font-semibold">{milestone.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery">
              <Card>
                <CardHeader>
                  <CardTitle>Galerie photos & vidéos</CardTitle>
                  <CardDescription>
                    Visualisez l'avancement du projet en images
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div key={item} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group cursor-pointer">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {item === 1 ? (
                            <Play className="h-12 w-12 text-gray-400" />
                          ) : (
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white">Voir</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents du projet</CardTitle>
                  <CardDescription>
                    Téléchargez les documents officiels du projet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Étude de faisabilité', type: 'PDF', size: '2.4 MB' },
                      { name: 'Plan d\'exécution', type: 'PDF', size: '5.1 MB' },
                      { name: 'Rapport d\'impact environnemental', type: 'PDF', size: '1.8 MB' },
                      { name: 'Budget détaillé', type: 'XLSX', size: '450 KB' }
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-gray-400" />
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-gray-500">{doc.type} • {doc.size}</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Projets similaires */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Projets similaires</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Badge className="w-fit mb-2">Infrastructure</Badge>
                  <CardTitle>Projet de développement urbain</CardTitle>
                  <CardDescription>
                    Amélioration des infrastructures urbaines dans la région de Dakar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Voir le projet
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}