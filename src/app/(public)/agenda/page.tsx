'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  Video,
  Globe,
  Building,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isPast, isFuture, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AgendaEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'meeting' | 'ceremony' | 'visit' | 'conference' | 'international';
  participants?: string[];
  is_public: boolean;
  is_online?: boolean;
  online_link?: string;
}

const typeIcons = {
  meeting: Users,
  ceremony: Building,
  visit: MapPin,
  conference: Globe,
  international: Globe
};

const typeColors = {
  meeting: 'bg-blue-100 text-blue-800',
  ceremony: 'bg-purple-100 text-purple-800',
  visit: 'bg-green-100 text-green-800',
  conference: 'bg-orange-100 text-orange-800',
  international: 'bg-red-100 text-red-800'
};

export default function AgendaPage() {
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'upcoming' | 'calendar' | 'past'>('upcoming');
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('agenda_events')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;

      // Mock data for demonstration
      const mockEvents: AgendaEvent[] = [
        {
          id: '1',
          title: 'Conseil des Ministres',
          description: 'Réunion hebdomadaire du Conseil des Ministres',
          date: '2024-01-24',
          time: '10:00',
          location: 'Palais de la République',
          type: 'meeting',
          participants: ['Président de la République', 'Premier Ministre', 'Ministres'],
          is_public: false
        },
        {
          id: '2',
          title: 'Inauguration du nouveau quartier résidentiel',
          description: 'Cérémonie d\'inauguration des 500 logements sociaux de Diamniadio',
          date: '2024-01-25',
          time: '09:00',
          location: 'Diamniadio',
          type: 'ceremony',
          is_public: true
        },
        {
          id: '3',
          title: 'Visite de terrain - Projet Smart City',
          description: 'Inspection de l\'avancement des travaux du projet Smart City',
          date: '2024-01-26',
          time: '14:00',
          location: 'Lac Rose',
          type: 'visit',
          is_public: true
        },
        {
          id: '4',
          title: 'Conférence sur l\'urbanisme durable',
          description: 'Participation à la conférence internationale sur les villes durables',
          date: '2024-01-28',
          time: '09:30',
          location: 'Centre International de Conférences',
          type: 'conference',
          is_public: true,
          is_online: true,
          online_link: 'https://conference.example.com'
        },
        {
          id: '5',
          title: 'Réunion avec la Banque Mondiale',
          description: 'Discussion sur le financement des projets d\'infrastructure',
          date: '2024-01-30',
          time: '11:00',
          location: 'Ministère',
          type: 'international',
          participants: ['Représentants Banque Mondiale', 'Direction Générale'],
          is_public: false
        },
        {
          id: '6',
          title: 'Atelier de travail sur le Plan National d\'Urbanisme',
          description: 'Session de travail avec les experts et partenaires',
          date: '2024-02-02',
          time: '08:30',
          location: 'Salle de conférence MUCTAT',
          type: 'meeting',
          participants: ['Experts nationaux', 'Partenaires techniques'],
          is_public: false
        },
        {
          id: '7',
          title: 'Visite ministérielle à Saint-Louis',
          description: 'Tournée d\'inspection des projets de rénovation urbaine',
          date: '2024-02-05',
          time: '08:00',
          location: 'Saint-Louis',
          type: 'visit',
          is_public: true
        },
        {
          id: '8',
          title: 'Forum des maires',
          description: 'Rencontre avec les maires des grandes villes sur les questions d\'urbanisme',
          date: '2024-02-08',
          time: '10:00',
          location: 'Hôtel King Fahd Palace',
          type: 'conference',
          participants: ['Maires', 'Présidents de conseil départemental'],
          is_public: true
        }
      ];

      setEvents(data && data.length > 0 ? data : mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = events.filter(event => isFuture(new Date(event.date)) || isToday(new Date(event.date)));
  const pastEvents = events.filter(event => isPast(new Date(event.date)) && !isToday(new Date(event.date)));

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr);
  };

  const EventCard = ({ event }: { event: AgendaEvent }) => {
    const Icon = typeIcons[event.type];
    const eventDate = new Date(event.date);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={typeColors[event.type]}>
                    <Icon className="h-3 w-3 mr-1" />
                    {event.type === 'meeting' ? 'Réunion' :
                     event.type === 'ceremony' ? 'Cérémonie' :
                     event.type === 'visit' ? 'Visite' :
                     event.type === 'conference' ? 'Conférence' :
                     'International'}
                  </Badge>
                  {event.is_public && (
                    <Badge variant="outline" className="bg-green-50">
                      Public
                    </Badge>
                  )}
                  {event.is_online && (
                    <Badge variant="outline" className="bg-blue-50">
                      <Video className="h-3 w-3 mr-1" />
                      En ligne
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <CardDescription className="mt-2">
                  {event.description}
                </CardDescription>
              </div>
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-primary">
                  {format(eventDate, 'dd', { locale: fr })}
                </div>
                <div className="text-sm text-gray-500">
                  {format(eventDate, 'MMM', { locale: fr })}
                </div>
                {isToday(eventDate) && (
                  <Badge className="mt-1" variant="default">
                    Aujourd'hui
                  </Badge>
                )}
                {isTomorrow(eventDate) && (
                  <Badge className="mt-1" variant="secondary">
                    Demain
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                {event.time}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location}
              </div>
              {event.participants && event.participants.length > 0 && (
                <div className="flex items-start text-gray-600">
                  <Users className="h-4 w-4 mr-2 mt-0.5" />
                  <div className="flex-1">
                    {event.participants.slice(0, 2).join(', ')}
                    {event.participants.length > 2 && (
                      <span className="text-primary"> +{event.participants.length - 2} autres</span>
                    )}
                  </div>
                </div>
              )}
              {event.is_online && event.online_link && (
                <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                  <a href={event.online_link} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4 mr-2" />
                    Rejoindre en ligne
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <CalendarDays className="h-10 w-10" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Agenda du Ministre
              </h1>
            </div>
            <p className="text-xl opacity-90">
              Suivez les activités et événements officiels du ministère
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="upcoming">À venir</TabsTrigger>
              <TabsTrigger value="calendar">Calendrier</TabsTrigger>
              <TabsTrigger value="past">Passés</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">Aucun événement à venir</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="calendar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Card>
                    <CardContent className="p-4">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={fr}
                        className="rounded-md"
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-2">
                  {selectedDate && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        Événements du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
                      </h3>
                      <div className="space-y-4">
                        {getEventsForDate(selectedDate).length > 0 ? (
                          getEventsForDate(selectedDate).map((event) => (
                            <EventCard key={event.id} event={event} />
                          ))
                        ) : (
                          <Card>
                            <CardContent className="text-center py-8">
                              <p className="text-gray-500">Aucun événement prévu ce jour</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastEvents.length > 0 ? (
                pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">Aucun événement passé</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}