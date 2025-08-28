'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Video,
  Share2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Globe,
  Building,
  CheckCircle,
  AlertCircle,
  Mic,
  Monitor,
  Coffee,
  Award,
  PartyPopper,
  ExternalLink,
  UserPlus,
  FileText,
  Download
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { LazyImage } from '@/components/ui/lazy-image'
import { toast } from 'sonner'

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (params.id) {
      loadEvent()
    }
  }, [params.id])

  const loadEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id as string)
        .single()

      if (error) throw error
      
      if (!data) {
        // Utiliser des données par défaut pour la démo
        setEvent(defaultEvent)
      } else {
        setEvent(data)
        
        // Incrémenter les vues
        // TODO: Fix TypeScript error with Supabase update
        // await supabase
        //   .from('events')
        //   .update({ views: (data.views || 0) + 1 })
        //   .eq('id', params.id as string)
      }
    } catch (error) {
      console.error('Error loading event:', error)
      setEvent(defaultEvent)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = () => {
    setRegistering(true)
    // Simuler l'inscription
    setTimeout(() => {
      toast.success('Votre inscription a été confirmée ! Vous recevrez un email de confirmation.')
      setRegistering(false)
      setEvent({
        ...event,
        current_participants: (event.current_participants || 0) + 1
      })
    }, 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Lien copié dans le presse-papiers')
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'conference': return Monitor
      case 'workshop': return Coffee
      case 'seminar': return Mic
      case 'meeting': return Users
      case 'ceremony': return Award
      default: return CalendarDays
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'conference': return 'Conférence'
      case 'workshop': return 'Atelier'
      case 'seminar': return 'Séminaire'
      case 'meeting': return 'Réunion'
      case 'ceremony': return 'Cérémonie'
      default: return 'Événement'
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'conference': return 'bg-blue-100 text-blue-700'
      case 'workshop': return 'bg-green-100 text-green-700'
      case 'seminar': return 'bg-purple-100 text-purple-700'
      case 'meeting': return 'bg-yellow-100 text-yellow-700'
      case 'ceremony': return 'bg-pink-100 text-pink-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isEventLive = (startDate: string, endDate: string) => {
    const now = new Date()
    return new Date(startDate) <= now && new Date(endDate) >= now
  }

  const isEventPast = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  const isEventFull = () => {
    return event.max_participants && event.current_participants >= event.max_participants
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

  if (!event) return null

  const Icon = getEventTypeIcon(event.event_type)
  const isLive = isEventLive(event.start_date, event.end_date)
  const isPast = isEventPast(event.end_date)
  const isFull = isEventFull()

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
            <Link href="/evenements" className="text-gray-600 hover:text-gray-900">
              Événements
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 truncate">{event.title}</span>
          </div>
        </div>
      </div>

      {/* Live Banner */}
      {isLive && event.live_stream_url && (
        <div className="bg-red-600 text-white py-2">
          <div className="container mx-auto px-4 flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="font-semibold">EN DIRECT</span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => window.open(event.live_stream_url, '_blank')}
            >
              <Video className="mr-2 h-4 w-4" />
              Regarder le live
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/evenements">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux événements
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            {event.image_url ? (
              <LazyImage
                src={event.image_url}
                alt={event.title}
                width={800}
                height={400}
                className="h-96 w-full rounded-lg overflow-hidden mb-6"
              />
            ) : (
              <div className="h-96 bg-gradient-to-br from-senegal-green-100 to-senegal-yellow-100 rounded-lg flex items-center justify-center mb-6">
                <Icon className="h-32 w-32 text-senegal-green-600/30" />
              </div>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getEventTypeColor(event.event_type)} variant="secondary">
                      {getEventTypeLabel(event.event_type)}
                    </Badge>
                    {event.is_featured && (
                      <Badge variant="default">En vedette</Badge>
                    )}
                    {isLive && (
                      <Badge className="bg-red-600 text-white">En cours</Badge>
                    )}
                    {isPast && (
                      <Badge variant="secondary">Terminé</Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-2xl">
                  {event.title}
                </CardTitle>
                {event.organizer && (
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Building className="h-4 w-4" />
                    Organisé par {event.organizer}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="description" className="mt-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="programme">Programme</TabsTrigger>
                    <TabsTrigger value="speakers">Intervenants</TabsTrigger>
                    <TabsTrigger value="infos">Infos pratiques</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="mt-6">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold mb-3">À propos de l'événement</h3>
                      <p className="text-gray-600 whitespace-pre-wrap mb-6">
                        {event.description}
                      </p>

                      {event.category && (
                        <>
                          <h3 className="text-lg font-semibold mb-3">Catégorie</h3>
                          <p className="text-gray-600">{event.category}</p>
                        </>
                      )}

                      {event.tags && event.tags.length > 0 && (
                        <>
                          <h3 className="text-lg font-semibold mb-3 mt-6">Thématiques</h3>
                          <div className="flex flex-wrap gap-2">
                            {event.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="programme" className="mt-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold mb-3">Programme détaillé</h3>
                      {event.agenda && event.agenda.length > 0 ? (
                        <div className="space-y-4">
                          {event.agenda.map((item: any, index: number) => (
                            <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                              <div className="flex-shrink-0">
                                <div className="w-16 text-center">
                                  <p className="text-lg font-bold text-senegal-green-600">
                                    {item.time}
                                  </p>
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{item.title}</h4>
                                {item.description && (
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                )}
                                {item.speaker && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    <User className="inline h-3 w-3 mr-1" />
                                    {item.speaker}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          Le programme détaillé sera communiqué prochainement.
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="speakers" className="mt-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold mb-3">Intervenants</h3>
                      {event.speakers && event.speakers.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                          {event.speakers.map((speaker: any, index: number) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  {speaker.photo ? (
                                    <img 
                                      src={speaker.photo}
                                      alt={speaker.name}
                                      className="w-16 h-16 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                      <User className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <h4 className="font-semibold">{speaker.name}</h4>
                                    <p className="text-sm text-gray-600">{speaker.title}</p>
                                    {speaker.bio && (
                                      <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                                        {speaker.bio}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          Les intervenants seront annoncés prochainement.
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="infos" className="mt-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold mb-3">Informations pratiques</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CalendarDays className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium">Date</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(event.start_date)}
                              {event.end_date && event.end_date !== event.start_date && 
                                ` au ${formatDate(event.end_date)}`
                              }
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium">Horaires</p>
                            <p className="text-sm text-gray-600">
                              {formatTime(event.start_date)} - {formatTime(event.end_date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium">Lieu</p>
                            <p className="text-sm text-gray-600">{event.venue}</p>
                            {event.venue_address && (
                              <p className="text-sm text-gray-500 mt-1">{event.venue_address}</p>
                            )}
                            {event.venue_map_url && (
                              <a 
                                href={event.venue_map_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline mt-1 inline-flex items-center gap-1"
                              >
                                Voir sur la carte
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>

                        {event.partners && event.partners.length > 0 && (
                          <div className="flex items-start gap-3">
                            <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="font-medium">Partenaires</p>
                              <p className="text-sm text-gray-600">
                                {event.partners.join(', ')}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Documents */}
                {event.documents && event.documents.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Documents</h3>
                    <div className="space-y-2">
                      {event.documents.map((doc: any, index: number) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-senegal-green-600" />
                                <div>
                                  <p className="font-medium">{doc.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {doc.size ? `${(doc.size / 1024).toFixed(2)} KB` : 'Taille inconnue'}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(doc.url, '_blank')}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recording */}
                {isPast && event.recording_url && (
                  <Card className="mt-8 bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold mb-1">Enregistrement disponible</h3>
                          <p className="text-sm text-gray-600">
                            Revivez cet événement en replay
                          </p>
                        </div>
                        <Button 
                          onClick={() => window.open(event.recording_url, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Voir le replay
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration */}
            {event.registration_required && !isPast && (
              <Card className={isFull ? 'bg-red-50 border-red-200' : 'bg-gradient-to-r from-senegal-green-50 to-senegal-yellow-50 border-senegal-green-200'}>
                <CardHeader>
                  <CardTitle className="text-lg">Inscription</CardTitle>
                </CardHeader>
                <CardContent>
                  {event.max_participants && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Places disponibles</span>
                        <span className="font-medium">
                          {event.current_participants || 0}/{event.max_participants}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${isFull ? 'bg-red-600' : 'bg-senegal-green-600'}`}
                          style={{ width: `${((event.current_participants || 0) / event.max_participants) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isFull ? (
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-2" />
                      <p className="text-red-700 font-medium">Complet</p>
                      <p className="text-sm text-red-600 mt-1">
                        Toutes les places sont réservées
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-4">
                        Inscription gratuite mais obligatoire
                      </p>
                      {event.registration_link ? (
                        <Button 
                          className="w-full bg-senegal-green-600 hover:bg-senegal-green-700"
                          onClick={() => window.open(event.registration_link, '_blank')}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          S'inscrire
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-senegal-green-600 hover:bg-senegal-green-700"
                          onClick={handleRegister}
                          disabled={registering}
                        >
                          {registering ? (
                            <>
                              <Clock className="mr-2 h-4 w-4 animate-spin" />
                              Inscription...
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              S'inscrire
                            </>
                          )}
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Event Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statut</CardTitle>
              </CardHeader>
              <CardContent>
                {isLive ? (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-3">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                    </div>
                    <p className="font-semibold text-red-600">En cours</p>
                    <p className="text-sm text-gray-600 mt-1">
                      L'événement est actuellement en cours
                    </p>
                  </div>
                ) : isPast ? (
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                    <p className="font-semibold text-gray-600">Terminé</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Cet événement est terminé
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Clock className="h-16 w-16 text-senegal-green-600 mx-auto mb-3" />
                    <p className="font-semibold text-senegal-green-600">À venir</p>
                    <p className="text-sm text-gray-600 mt-1">
                      L'événement n'a pas encore commencé
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Share */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Partager</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Copier le lien
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Envoyer par email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Ajouter au calendrier
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Données par défaut pour la démo
const defaultEvent = {
  id: '1',
  title: 'Conférence Nationale sur l\'Urbanisme Durable',
  slug: 'conference-urbanisme-durable-2024',
  description: `Cette conférence rassemble les experts nationaux et internationaux pour discuter des défis et opportunités de l'urbanisme durable au Sénégal.

Les thématiques abordées incluent :
- La planification urbaine intelligente
- Les transports durables
- L'efficacité énergétique dans les bâtiments
- La gestion des déchets urbains
- Les espaces verts et la biodiversité urbaine

Une occasion unique d'échanger avec les acteurs clés du secteur et de découvrir les dernières innovations en matière d'aménagement urbain.`,
  event_type: 'conference',
  category: 'Urbanisme durable',
  start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
  venue: 'Centre International de Conférences Abdou Diouf',
  venue_address: 'Diamniadio, Sénégal',
  venue_map_url: 'https://maps.google.com',
  organizer: 'MUCTAT',
  partners: ['Banque Mondiale', 'UN-Habitat', 'AFD'],
  registration_required: true,
  max_participants: 500,
  current_participants: 342,
  speakers: [
    {
      name: 'Dr. Amadou Diallo',
      title: 'Expert en Urbanisme Durable',
      bio: 'Plus de 20 ans d\'expérience dans la planification urbaine en Afrique de l\'Ouest.',
      photo: null
    },
    {
      name: 'Mme Fatou Sow',
      title: 'Architecte Urbaniste',
      bio: 'Spécialiste des villes intelligentes et de la mobilité durable.',
      photo: null
    }
  ],
  agenda: [
    {
      time: '08:30',
      title: 'Accueil et enregistrement',
      description: 'Café de bienvenue et remise des badges'
    },
    {
      time: '09:00',
      title: 'Cérémonie d\'ouverture',
      description: 'Allocutions officielles',
      speaker: 'Ministre de l\'Urbanisme'
    },
    {
      time: '10:00',
      title: 'Keynote: Vision 2050 pour les villes sénégalaises',
      speaker: 'Dr. Amadou Diallo'
    },
    {
      time: '11:00',
      title: 'Panel: Défis de l\'urbanisation rapide',
      description: 'Discussion avec les experts internationaux'
    },
    {
      time: '12:30',
      title: 'Pause déjeuner'
    },
    {
      time: '14:00',
      title: 'Ateliers thématiques',
      description: 'Sessions parallèles sur différents sujets'
    },
    {
      time: '16:00',
      title: 'Synthèse et recommandations'
    },
    {
      time: '17:00',
      title: 'Clôture'
    }
  ],
  documents: [],
  gallery_images: [],
  tags: ['urbanisme', 'développement durable', 'smart cities', 'innovation'],
  is_featured: true,
  status: 'published',
  views: 1234
}