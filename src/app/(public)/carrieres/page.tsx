'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  Calendar,
  Users,
  Search,
  Filter,
  ChevronRight,
  Building,
  GraduationCap,
  Heart,
  Shield,
  Award
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'

function CareerSkeleton() {
  return (
    <Card>
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
        </div>
      </CardContent>
    </Card>
  )
}

export default function CarrieresPage() {
  const [careers, setCareers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  const supabase = createClient()

  useEffect(() => {
    loadCareers()
  }, [searchTerm, typeFilter, levelFilter, departmentFilter])

  const loadCareers = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('careers')
        .select('*')
        .eq('status', 'open')

      if (typeFilter !== 'all') {
        query = query.eq('contract_type', typeFilter)
      }
      if (levelFilter !== 'all') {
        query = query.eq('level', levelFilter)
      }
      if (departmentFilter !== 'all') {
        query = query.eq('department', departmentFilter)
      }
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })

      if (error) throw error
      setCareers(data || [])
    } catch (error) {
      console.error('Error loading careers:', error)
      // Utiliser des données par défaut
      setCareers(defaultCareers)
    } finally {
      setLoading(false)
    }
  }

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case 'permanent': return 'CDI'
      case 'temporary': return 'CDD'
      case 'internship': return 'Stage'
      case 'consultant': return 'Consultant'
      default: return type
    }
  }

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'permanent': return 'bg-green-100 text-green-700'
      case 'temporary': return 'bg-blue-100 text-blue-700'
      case 'internship': return 'bg-purple-100 text-purple-700'
      case 'consultant': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'junior': return 'Junior'
      case 'mid': return 'Intermédiaire'
      case 'senior': return 'Senior'
      case 'executive': return 'Cadre supérieur'
      default: return level
    }
  }

  const formatSalary = (min?: number, max?: number, currency: string = 'XOF') => {
    if (!min && !max) return 'À négocier'
    const curr = currency === 'XOF' ? 'FCFA' : currency
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} ${curr}`
    }
    if (min) return `À partir de ${min.toLocaleString()} ${curr}`
    if (max) return `Jusqu'à ${max.toLocaleString()} ${curr}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Rejoignez Notre Équipe
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Participez à la transformation urbaine du Sénégal. 
            Découvrez nos opportunités de carrière et construisons ensemble l'avenir.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Pourquoi nous rejoindre ?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex p-3 bg-senegal-green-100 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-senegal-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Mission d'Impact</h3>
                <p className="text-sm text-gray-600">
                  Contribuez directement au développement du Sénégal
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex p-3 bg-senegal-yellow-100 rounded-full mb-4">
                  <GraduationCap className="h-8 w-8 text-senegal-yellow-600" />
                </div>
                <h3 className="font-semibold mb-2">Formation Continue</h3>
                <p className="text-sm text-gray-600">
                  Développez vos compétences avec nos programmes
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex p-3 bg-senegal-red-100 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-senegal-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Stabilité</h3>
                <p className="text-sm text-gray-600">
                  Sécurité de l'emploi dans la fonction publique
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Évolution</h3>
                <p className="text-sm text-gray-600">
                  Opportunités de progression de carrière
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un poste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type de contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="permanent">CDI</SelectItem>
                <SelectItem value="temporary">CDD</SelectItem>
                <SelectItem value="internship">Stage</SelectItem>
                <SelectItem value="consultant">Consultant</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="mid">Intermédiaire</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="executive">Cadre supérieur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CareerSkeleton key={i} />
              ))}
            </div>
          ) : careers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune offre disponible</h3>
                <p className="text-gray-600">
                  Revenez régulièrement pour découvrir de nouvelles opportunités
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careers.map((career) => (
                <Card key={career.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getContractTypeColor(career.contract_type)}>
                        {getContractTypeLabel(career.contract_type)}
                      </Badge>
                      {career.level && (
                        <Badge variant="outline">
                          {getLevelLabel(career.level)}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">
                      {career.title}
                    </CardTitle>
                    {career.department && (
                      <CardDescription>
                        <Building className="inline h-3 w-3 mr-1" />
                        {career.department}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {career.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{career.location}</span>
                      </div>
                      
                      {career.application_deadline && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Jusqu'au {new Date(career.application_deadline).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">
                          {formatSalary(career.salary_min, career.salary_max, career.currency)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Link href={`/carrieres/${career.id}`}>
                        <Button className="w-full">
                          Voir l'offre
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-senegal-green-50 to-senegal-yellow-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Candidature spontanée</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Vous ne trouvez pas d'offre correspondant à votre profil ? 
            Envoyez-nous votre candidature spontanée, nous la conserverons dans notre base de données.
          </p>
          <Link href="/contact">
            <Button size="lg">
              Envoyer ma candidature
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

// Données par défaut
const defaultCareers = [
  {
    id: '1',
    reference: 'REF-2024-001',
    title: 'Ingénieur en Génie Civil',
    department: 'Direction de l\'Urbanisme',
    location: 'Dakar',
    contract_type: 'permanent',
    level: 'mid',
    description: 'Nous recherchons un ingénieur en génie civil expérimenté pour rejoindre notre équipe de planification urbaine.',
    salary_min: 1500000,
    salary_max: 2500000,
    currency: 'XOF',
    application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    reference: 'REF-2024-002',
    title: 'Urbaniste Junior',
    department: 'Direction de l\'Aménagement',
    location: 'Thiès',
    contract_type: 'temporary',
    level: 'junior',
    description: 'Poste d\'urbaniste junior pour participer aux projets d\'aménagement territorial de la région de Thiès.',
    salary_min: 800000,
    salary_max: 1200000,
    currency: 'XOF',
    application_deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    reference: 'REF-2024-003',
    title: 'Stage - Assistant(e) de Projet',
    department: 'Service des Projets',
    location: 'Dakar',
    contract_type: 'internship',
    level: 'junior',
    description: 'Stage de 6 mois pour assister l\'équipe projet dans la gestion et le suivi des projets urbains.',
    salary_min: 150000,
    salary_max: 150000,
    currency: 'XOF',
    application_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }
]