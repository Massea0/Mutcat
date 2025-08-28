'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Video,
  ChevronRight,
  Filter,
  Search,
  Mic,
  Monitor,
  Coffee,
  Award,
  PartyPopper
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { LazyImage } from '@/components/ui/lazy-image'
import { cn } from '@/lib/utils'

function EventSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function EvenementsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const supabase = createClient()

  useEffect(() => {
    loadEvents()
  }, [activeTab, selectedDate, searchTerm, typeFilter])

  const loadEvents = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('events')
        .select('*')

      // Filtres par onglet
      const now = new Date().toISOString()
      if (activeTab === 'upcoming') {
        query = query.gte('start_date', now)
        query = query.order('start_date', { ascending: true })
      } else if (activeTab === 'past') {
        query = query.lt('start_date', now)
        query = query.order('start_date', { ascending: false })
      } else if (activeTab === 'featured') {
        query = query.eq('is_featured', true)
        query = query.order('start_date', { ascending: true })
      }

      // Filtre par type
      if (typeFilter !== 'all') {
        query = query.eq('event_type', typeFilter)
      }

      // Filtre par recherche
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      // Filtre par date sélectionnée
      if (selectedDate) {
        const startOfDay = new Date(selectedDate)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(selectedDate)
        endOfDay.setHours(23, 59, 59, 999)
        
        query = query.gte('start_date', startOfDay.toISOString())
        query = query.lte('start_date', endOfDay.toISOString())
      }

      const { data, error } = await query.limit(20)

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error loading events:', error)
      setEvents([])
    } finally {
      setLoading(false)
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

  const getEventStatus = (event: any) => {
    if (event.status === 'cancelled') return { label: 'Annulé', color: 'bg-red-100 text-red-700' }
    if (event.status === 'postponed') return { label: 'Reporté', color: 'bg-orange-100 text-orange-700' }
    if (isEventLive(event.start_date, event.end_date)) return { label: 'En cours', color: 'bg-green-100 text-green-700' }
    if (new Date(event.start_date) > new Date()) return { label: 'À venir', color: 'bg-blue-100 text-blue-700' }
    return { label: 'Terminé', color: 'bg-gray-100 text-gray-700' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Événements & Manifestations
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Participez aux conférences, ateliers et cérémonies organisés par le ministère
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Calendar */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Calendrier</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                />
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type d'événement</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="all">Tous</option>
                    <option value="conference">Conférences</option>
                    <option value="workshop">Ateliers</option>
                    <option value="seminar">Séminaires</option>
                    <option value="meeting">Réunions</option>
                    <option value="ceremony">Cérémonies</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Rechercher</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                {selectedDate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(undefined)}
                    className="w-full"
                  >
                    Réinitialiser la date
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Events List */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="upcoming">À venir</TabsTrigger>
                <TabsTrigger value="featured">En vedette</TabsTrigger>
                <TabsTrigger value="past">Passés</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {loading ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <EventSkeleton key={i} />
                    ))}
                  </div>
                ) : events.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aucun événement trouvé</h3>
                      <p className="text-gray-600">
                        {activeTab === 'upcoming' 
                          ? 'Aucun événement à venir pour le moment'
                          : activeTab === 'featured'
                          ? 'Aucun événement en vedette'
                          : 'Aucun événement passé'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {events.map((event) => {
                      const Icon = getEventTypeIcon(event.event_type)
                      const status = getEventStatus(event)
                      
                      return (
                        <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          {/* Event Image */}
                          {event.image_url ? (
                            <LazyImage
                              src={event.image_url}
                              alt={event.title}
                              width={600}
                              height={200}
                              className="h-48 w-full"
                            />
                          ) : (
                            <div className="h-48 bg-gradient-to-br from-senegal-green-100 to-senegal-yellow-100 flex items-center justify-center">
                              <Icon className="h-20 w-20 text-senegal-green-600/30" />
                            </div>
                          )}

                          <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={getEventTypeColor(event.event_type)} variant="secondary">
                                {getEventTypeLabel(event.event_type)}
                              </Badge>
                              <Badge className={status.color}>
                                {status.label}
                              </Badge>
                            </div>
                            <CardTitle className="line-clamp-2">
                              {event.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {event.description}
                            </CardDescription>
                          </CardHeader>

                          <CardContent>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                <span>{formatDate(event.start_date)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{formatTime(event.start_date)} - {formatTime(event.end_date)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate">{event.venue || 'Lieu à confirmer'}</span>
                              </div>
                              {event.max_participants && (
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  <span>{event.current_participants || 0}/{event.max_participants} participants</span>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Link href={`/evenements/${event.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                  Voir détails
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                              </Link>
                              {event.live_stream_url && isEventLive(event.start_date, event.end_date) && (
                                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                  <Video className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}