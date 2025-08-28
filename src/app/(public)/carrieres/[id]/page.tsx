'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  Calendar,
  Users,
  Building,
  GraduationCap,
  Mail,
  Phone,
  ArrowLeft,
  Share2,
  CheckCircle,
  FileText,
  Heart,
  Send
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function CareerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [career, setCareer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (params.id) {
      loadCareer()
    }
  }, [params.id])

  const loadCareer = async () => {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      
      if (!data) {
        // Utiliser des données par défaut pour la démo
        setCareer(defaultCareer)
      } else {
        setCareer(data)
      }

      // Incrémenter les vues
      if (data) {
        await supabase
          .from('careers')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', params.id)
      }
    } catch (error) {
      console.error('Error loading career:', error)
      setCareer(defaultCareer)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    setApplying(true)
    // Simuler l'envoi
    setTimeout(() => {
      toast.success('Votre candidature a été envoyée avec succès !')
      setApplying(false)
    }, 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: career.title,
        text: career.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Lien copié dans le presse-papiers')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!career) return null

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

  const formatSalary = (min?: number, max?: number, currency: string = 'XOF') => {
    if (!min && !max) return 'À négocier'
    const curr = currency === 'XOF' ? 'FCFA' : currency
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} ${curr}/mois`
    }
    if (min) return `À partir de ${min.toLocaleString()} ${curr}/mois`
    if (max) return `Jusqu'à ${max.toLocaleString()} ${curr}/mois`
  }

  const isDeadlinePassed = career.application_deadline && new Date(career.application_deadline) < new Date()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Accueil
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/carrieres" className="text-gray-600 hover:text-gray-900">
              Carrières
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{career.reference}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/carrieres">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux offres
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getContractTypeColor(career.contract_type)} variant="secondary">
                      {getContractTypeLabel(career.contract_type)}
                    </Badge>
                    {career.level && (
                      <Badge variant="outline">
                        {career.level === 'junior' ? 'Junior' :
                         career.level === 'mid' ? 'Intermédiaire' :
                         career.level === 'senior' ? 'Senior' :
                         'Cadre supérieur'}
                      </Badge>
                    )}
                    {isDeadlinePassed && (
                      <Badge variant="destructive">Expiré</Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-2xl">
                  {career.title}
                </CardTitle>
                <CardDescription>
                  Référence: {career.reference}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="description" className="mt-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="requirements">Exigences</TabsTrigger>
                    <TabsTrigger value="benefits">Avantages</TabsTrigger>
                    <TabsTrigger value="process">Processus</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Description du poste</h3>
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {career.description}
                        </p>
                      </div>

                      {career.responsibilities && career.responsibilities.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Responsabilités</h3>
                          <ul className="space-y-2">
                            {career.responsibilities.map((resp: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="requirements" className="mt-6">
                    <div className="space-y-6">
                      {career.requirements && career.requirements.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Exigences du poste</h3>
                          <ul className="space-y-2">
                            {career.requirements.map((req: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {career.nice_to_have && career.nice_to_have.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Atouts supplémentaires</h3>
                          <ul className="space-y-2">
                            {career.nice_to_have.map((nice: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <Heart className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{nice}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {career.documents_required && career.documents_required.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Documents requis</h3>
                          <ul className="space-y-2">
                            {career.documents_required.map((doc: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <FileText className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="benefits" className="mt-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold mb-3">Avantages et bénéfices</h3>
                      {career.benefits && career.benefits.length > 0 ? (
                        <ul className="space-y-2">
                          {career.benefits.map((benefit: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <Heart className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Heart className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Assurance maladie complète</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Heart className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Formation continue</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Heart className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Environnement de travail stimulant</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Heart className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Évolution de carrière</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="process" className="mt-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold mb-3">Processus de recrutement</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-senegal-green-100 rounded-full flex items-center justify-center text-senegal-green-600 font-semibold">
                            1
                          </div>
                          <div>
                            <h4 className="font-semibold">Candidature</h4>
                            <p className="text-sm text-gray-600">Envoyez votre CV et lettre de motivation</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-senegal-yellow-100 rounded-full flex items-center justify-center text-senegal-yellow-600 font-semibold">
                            2
                          </div>
                          <div>
                            <h4 className="font-semibold">Présélection</h4>
                            <p className="text-sm text-gray-600">Examen des dossiers de candidature</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-senegal-red-100 rounded-full flex items-center justify-center text-senegal-red-600 font-semibold">
                            3
                          </div>
                          <div>
                            <h4 className="font-semibold">Entretien</h4>
                            <p className="text-sm text-gray-600">Entretien avec le responsable du service</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                            4
                          </div>
                          <div>
                            <h4 className="font-semibold">Décision finale</h4>
                            <p className="text-sm text-gray-600">Notification de la décision sous 2 semaines</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {career.department && (
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Département</p>
                      <p className="font-medium">{career.department}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Lieu</p>
                    <p className="font-medium">{career.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Salaire</p>
                    <p className="font-medium">{formatSalary(career.salary_min, career.salary_max, career.currency)}</p>
                  </div>
                </div>

                {career.application_deadline && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Date limite</p>
                      <p className="font-medium">
                        {new Date(career.application_deadline).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {career.start_date && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Date de début</p>
                      <p className="font-medium">
                        {new Date(career.start_date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment postuler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {career.application_email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${career.application_email}`} className="text-sm text-blue-600 hover:underline">
                      {career.application_email}
                    </a>
                  </div>
                )}
                {career.application_link && (
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <a href={career.application_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      Formulaire en ligne
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Apply CTA */}
            {!isDeadlinePassed && (
              <Card className="bg-gradient-to-r from-senegal-green-50 to-senegal-yellow-50 border-senegal-green-200">
                <CardContent className="p-6 text-center">
                  <Briefcase className="h-12 w-12 text-senegal-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Prêt à postuler ?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Envoyez votre candidature avant la date limite
                  </p>
                  <Button 
                    className="w-full bg-senegal-green-600 hover:bg-senegal-green-700"
                    onClick={handleApply}
                    disabled={applying}
                  >
                    {applying ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Postuler maintenant
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {isDeadlinePassed && (
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2 text-red-900">Candidatures fermées</h3>
                  <p className="text-sm text-red-700">
                    La date limite de candidature est dépassée
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Données par défaut pour la démo
const defaultCareer = {
  id: '1',
  reference: 'REF-2024-001',
  title: 'Ingénieur en Génie Civil',
  department: 'Direction de l\'Urbanisme',
  location: 'Dakar, Sénégal',
  contract_type: 'permanent',
  level: 'mid',
  description: `Nous recherchons un ingénieur en génie civil expérimenté pour rejoindre notre équipe de planification urbaine.

Le candidat idéal aura une solide expérience dans la gestion de projets d'infrastructure urbaine et une passion pour le développement durable.

Vous travaillerez sur des projets majeurs de transformation urbaine qui amélioreront directement la qualité de vie des citoyens sénégalais.`,
  responsibilities: [
    'Concevoir et superviser les projets d\'infrastructure urbaine',
    'Effectuer des études de faisabilité technique',
    'Coordonner avec les équipes multidisciplinaires',
    'Assurer le respect des normes de construction',
    'Préparer les rapports techniques détaillés'
  ],
  requirements: [
    'Diplôme d\'ingénieur en génie civil (Bac+5)',
    'Minimum 5 ans d\'expérience dans des projets similaires',
    'Maîtrise des logiciels de conception (AutoCAD, Revit)',
    'Excellentes compétences en communication',
    'Permis de conduire valide'
  ],
  nice_to_have: [
    'Master en urbanisme ou aménagement du territoire',
    'Expérience dans le secteur public',
    'Connaissance des normes internationales',
    'Certification PMP'
  ],
  benefits: [
    'Salaire compétitif selon l\'expérience',
    'Assurance maladie complète',
    'Formation continue et développement professionnel',
    'Environnement de travail stimulant',
    'Opportunités d\'évolution de carrière'
  ],
  documents_required: [
    'CV détaillé',
    'Lettre de motivation',
    'Copies des diplômes',
    'Certificats de travail',
    'Références professionnelles'
  ],
  salary_min: 1500000,
  salary_max: 2500000,
  currency: 'XOF',
  application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  start_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  application_email: 'recrutement@muctat.sn',
  views: 245,
  applications_count: 12
}