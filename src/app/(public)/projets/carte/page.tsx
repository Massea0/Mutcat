'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  MapPin, 
  Building, 
  Users, 
  DollarSign,
  Calendar,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize,
  Info
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n/context'

// Régions du Sénégal avec leurs coordonnées approximatives
const regions = [
  { name: 'Dakar', lat: 14.6937, lng: -17.4441, projects: 0 },
  { name: 'Thiès', lat: 14.7886, lng: -16.9260, projects: 0 },
  { name: 'Saint-Louis', lat: 16.0326, lng: -16.4818, projects: 0 },
  { name: 'Ziguinchor', lat: 12.5833, lng: -16.2719, projects: 0 },
  { name: 'Kaolack', lat: 14.1652, lng: -16.0758, projects: 0 },
  { name: 'Matam', lat: 15.6555, lng: -13.2554, projects: 0 },
  { name: 'Fatick', lat: 14.3344, lng: -16.4111, projects: 0 },
  { name: 'Kolda', lat: 12.8939, lng: -14.9406, projects: 0 },
  { name: 'Louga', lat: 15.6173, lng: -16.2285, projects: 0 },
  { name: 'Tambacounda', lat: 13.7709, lng: -13.6673, projects: 0 },
  { name: 'Kédougou', lat: 12.5605, lng: -12.1747, projects: 0 },
  { name: 'Sédhiou', lat: 12.7081, lng: -15.5569, projects: 0 },
  { name: 'Kaffrine', lat: 14.1059, lng: -15.5508, projects: 0 },
  { name: 'Diourbel', lat: 14.6597, lng: -16.2314, projects: 0 },
]

export default function ProjectMapPage() {
  const { t } = useI18n()
  const [projects, setProjects] = useState<any[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [projectsByRegion, setProjectsByRegion] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [mapZoom, setMapZoom] = useState(1)

  const supabase = createClient()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'in_progress')

      if (error) throw error

      // Simuler des données pour la démo
      const mockProjects = regions.map((region, index) => ({
        id: `mock-${index}`,
        title: `Projet ${region.name}`,
        location: region.name,
        budget: Math.floor(Math.random() * 10 + 1),
        beneficiaries: Math.floor(Math.random() * 100000 + 10000),
        status: 'in_progress',
        category: ['infrastructure', 'logement', 'transport'][Math.floor(Math.random() * 3)],
        description: `Projet de développement urbain dans la région de ${region.name}`,
        progress: Math.floor(Math.random() * 100),
        lat: region.lat + (Math.random() - 0.5) * 0.5,
        lng: region.lng + (Math.random() - 0.5) * 0.5,
      }))

      const allProjects = [...(data || []), ...mockProjects]
      setProjects(allProjects)

      // Grouper par région
      const grouped: any = {}
      allProjects.forEach(project => {
        const region = project.location || 'Autre'
        if (!grouped[region]) grouped[region] = []
        grouped[region].push(project)
      })
      setProjectsByRegion(grouped)

      // Mettre à jour le compte des projets par région
      regions.forEach(region => {
        region.projects = grouped[region.name]?.length || 0
      })
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'infrastructure': return 'bg-blue-500'
      case 'logement': return 'bg-green-500'
      case 'transport': return 'bg-yellow-500'
      case 'environnement': return 'bg-emerald-500'
      default: return 'bg-gray-500'
    }
  }

  const handleZoomIn = () => setMapZoom(prev => Math.min(prev + 0.2, 2))
  const handleZoomOut = () => setMapZoom(prev => Math.max(prev - 0.2, 0.5))
  const handleFullscreen = () => {
    document.getElementById('map-container')?.requestFullscreen()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Carte Interactive des Projets
          </h1>
          <p className="text-lg opacity-90">
            Explorez nos projets à travers le territoire national
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Filtrer par :</span>
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Toutes les régions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les régions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region.name} value={region.name}>
                    {region.name} ({region.projects})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleFullscreen}>
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Container */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card id="map-container" className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-[600px] bg-gradient-to-b from-blue-50 to-blue-100">
                    {/* SVG Map of Senegal (simplified) */}
                    <svg
                      viewBox="0 0 800 600"
                      className="absolute inset-0 w-full h-full"
                      style={{ transform: `scale(${mapZoom})` }}
                    >
                      {/* Fond de carte simplifié */}
                      <path
                        d="M 100 200 Q 200 150 400 180 T 600 200 L 650 300 Q 600 400 500 450 L 400 500 Q 300 480 200 400 L 100 300 Z"
                        fill="#f0f9ff"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                      
                      {/* Points pour chaque région */}
                      {regions.map((region) => {
                        const x = ((region.lng + 18) / 8) * 800
                        const y = ((17 - region.lat) / 8) * 600
                        const hasProjects = region.projects > 0
                        
                        return (
                          <g key={region.name}>
                            <circle
                              cx={x}
                              cy={y}
                              r={hasProjects ? 8 + region.projects * 2 : 6}
                              fill={hasProjects ? '#16a34a' : '#9ca3af'}
                              className="cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => setSelectedRegion(region.name)}
                            />
                            <text
                              x={x}
                              y={y - 15}
                              textAnchor="middle"
                              className="text-xs font-medium fill-gray-700"
                            >
                              {region.name}
                            </text>
                            {hasProjects && (
                              <text
                                x={x}
                                y={y + 4}
                                textAnchor="middle"
                                className="text-xs font-bold fill-white"
                              >
                                {region.projects}
                              </text>
                            )}
                          </g>
                        )
                      })}
                    </svg>

                    {/* Légende */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Légende</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span>Régions avec projets</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                          <span>Régions sans projets</span>
                        </div>
                      </div>
                    </div>

                    {/* Statistiques */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div>
                          <p className="text-2xl font-bold text-senegal-green-600">
                            {projects.length}
                          </p>
                          <p className="text-xs text-gray-600">Projets</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-senegal-yellow-600">
                            14
                          </p>
                          <p className="text-xs text-gray-600">Régions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects List */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedRegion === 'all' ? 'Tous les projets' : `Projets - ${selectedRegion}`}
                  </CardTitle>
                  <CardDescription>
                    {selectedRegion === 'all' 
                      ? `${projects.length} projets au total`
                      : `${projectsByRegion[selectedRegion]?.length || 0} projet(s) dans cette région`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[450px] overflow-y-auto">
                    {(selectedRegion === 'all' ? projects : projectsByRegion[selectedRegion] || [])
                      .slice(0, 10)
                      .map((project: any) => (
                        <div
                          key={project.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm line-clamp-2">
                              {project.title}
                            </h4>
                            <Badge className={cn('text-xs', getCategoryColor(project.category))}>
                              {project.category}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {project.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {(project.beneficiaries / 1000).toFixed(0)}k
                            </div>
                          </div>
                          {project.progress && (
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-senegal-green-600 h-1.5 rounded-full"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                  {(selectedRegion === 'all' ? projects : projectsByRegion[selectedRegion] || []).length > 10 && (
                    <Link href={`/projets?region=${selectedRegion}`}>
                      <Button variant="outline" className="w-full mt-3">
                        Voir tous les projets
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>

              {/* Selected Project Details */}
              {selectedProject && (
                <Card className="border-senegal-green-200 bg-senegal-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Détails du projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium mb-2">{selectedProject.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {selectedProject.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget :</span>
                        <span className="font-medium">{selectedProject.budget} Mds FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bénéficiaires :</span>
                        <span className="font-medium">{selectedProject.beneficiaries?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avancement :</span>
                        <span className="font-medium">{selectedProject.progress}%</span>
                      </div>
                    </div>
                    <Link href={`/projets/${selectedProject.id}`}>
                      <Button className="w-full mt-4 bg-senegal-green-600 hover:bg-senegal-green-700">
                        Voir les détails
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}