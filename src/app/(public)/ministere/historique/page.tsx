'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Building, 
  Users, 
  Target,
  Award,
  ChevronRight,
  History
} from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: 'creation' | 'reform' | 'achievement' | 'partnership';
  minister?: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '1960',
    title: 'Création du Ministère de l\'Urbanisme',
    description: 'Établissement du premier ministère dédié à l\'urbanisme au lendemain de l\'indépendance du Sénégal.',
    type: 'creation',
    minister: 'Mamadou Dia'
  },
  {
    year: '1972',
    title: 'Première réforme urbaine majeure',
    description: 'Adoption du Code de l\'Urbanisme et mise en place des premiers plans directeurs d\'urbanisme pour Dakar.',
    type: 'reform'
  },
  {
    year: '1985',
    title: 'Programme national de logements sociaux',
    description: 'Lancement du premier grand programme de construction de logements sociaux avec l\'appui de la Banque Mondiale.',
    type: 'achievement'
  },
  {
    year: '1996',
    title: 'Création de la Direction de l\'Habitat',
    description: 'Restructuration du ministère avec la création d\'une direction spécifiquement dédiée aux questions d\'habitat.',
    type: 'reform'
  },
  {
    year: '2000',
    title: 'Partenariat avec l\'Union Européenne',
    description: 'Signature d\'accords de coopération majeurs pour le développement urbain durable.',
    type: 'partnership'
  },
  {
    year: '2008',
    title: 'Plan Jaxaay',
    description: 'Lancement du programme Jaxaay pour la reconstruction de Dakar après les inondations, avec la construction de 3000 logements.',
    type: 'achievement'
  },
  {
    year: '2014',
    title: 'Ville de Diamniadio',
    description: 'Début de la construction de la nouvelle ville de Diamniadio, projet phare de l\'urbanisme moderne au Sénégal.',
    type: 'achievement'
  },
  {
    year: '2018',
    title: 'Programme 100.000 logements',
    description: 'Annonce du programme ambitieux de construction de 100.000 logements sociaux sur 5 ans.',
    type: 'achievement'
  },
  {
    year: '2020',
    title: 'Réforme institutionnelle',
    description: 'Fusion et restructuration créant le Ministère de l\'Urbanisme, du Cadre de Vie et de l\'Aménagement du Territoire (MUCTAT).',
    type: 'reform',
    minister: 'Abdoulaye Seydou Sow'
  },
  {
    year: '2023',
    title: 'Plan National d\'Urbanisme 2050',
    description: 'Adoption du plan stratégique pour un développement urbain durable à l\'horizon 2050.',
    type: 'achievement'
  }
];

const typeColors = {
  creation: 'bg-green-100 text-green-800',
  reform: 'bg-blue-100 text-blue-800',
  achievement: 'bg-purple-100 text-purple-800',
  partnership: 'bg-orange-100 text-orange-800'
};

const typeIcons = {
  creation: Building,
  reform: Target,
  achievement: Award,
  partnership: Users
};

export default function HistoriquePage() {
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
              <History className="h-10 w-10" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Notre Histoire
              </h1>
            </div>
            <p className="text-xl opacity-90">
              Plus de 60 ans au service du développement urbain du Sénégal
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Depuis l'indépendance du Sénégal en 1960, le ministère chargé de l'urbanisme a connu 
                plusieurs évolutions institutionnelles, reflétant l'importance croissante accordée aux 
                questions d'aménagement du territoire et de développement urbain.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                De la création des premières structures administratives dédiées à l'urbanisme jusqu'à 
                l'actuel Ministère de l'Urbanisme, du Cadre de Vie et de l'Aménagement du Territoire 
                (MUCTAT), notre institution a été au cœur de la transformation du Sénégal moderne.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Chronologie des événements majeurs</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />
              
              {/* Timeline events */}
              {timelineEvents.map((event, index) => {
                const Icon = typeIcons[event.type];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-start mb-8"
                  >
                    {/* Year bubble */}
                    <div className="absolute left-0 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                      {event.year}
                    </div>
                    
                    {/* Content card */}
                    <Card className="ml-24 flex-1 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="h-5 w-5 text-primary" />
                              <Badge className={typeColors[event.type]}>
                                {event.type === 'creation' ? 'Création' :
                                 event.type === 'reform' ? 'Réforme' :
                                 event.type === 'achievement' ? 'Réalisation' :
                                 'Partenariat'}
                              </Badge>
                              {event.minister && (
                                <span className="text-sm text-gray-500">
                                  Ministre: {event.minister}
                                </span>
                              )}
                            </div>
                            <CardTitle className="text-xl">{event.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{event.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Réalisations majeures</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <Building className="h-12 w-12 text-primary mb-4" />
                <CardTitle>250 000+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Logements construits depuis 1960</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>2 millions+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Sénégalais bénéficiaires des programmes d'habitat</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Target className="h-12 w-12 text-primary mb-4" />
                <CardTitle>45 villes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Dotées de plans directeurs d'urbanisme</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vision for the Future */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl">Notre vision pour l'avenir</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 mb-4">
                Fort de cette riche histoire, le MUCTAT poursuit sa mission de transformation du Sénégal 
                à travers une vision ambitieuse pour 2050. Notre objectif est de faire du Sénégal un 
                modèle de développement urbain durable en Afrique de l'Ouest.
              </p>
              <div className="flex items-center text-primary font-semibold">
                <span>En savoir plus sur notre vision</span>
                <ChevronRight className="h-5 w-5 ml-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}