'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  FileText, 
  Download, 
  HelpCircle, 
  Users, 
  Briefcase,
  FileSignature,
  BookOpen,
  Calculator,
  Calendar,
  Home,
  Building,
  MapPin,
  Shield,
  Award,
  Gavel,
  ChevronRight
} from 'lucide-react'

const services = [
  {
    title: 'Appels d\'offres',
    description: 'Consultez et participez aux marchés publics du ministère',
    icon: FileText,
    href: '/appels-offres',
    color: 'bg-blue-100 text-blue-700',
    stats: 'Nouveaux appels cette semaine'
  },
  {
    title: 'Publications & Documents',
    description: 'Accédez aux rapports, lois, décrets et guides officiels',
    icon: BookOpen,
    href: '/publications',
    color: 'bg-green-100 text-green-700',
    stats: '500+ documents disponibles'
  },
  {
    title: 'Formulaires en ligne',
    description: 'Téléchargez les formulaires administratifs',
    icon: FileSignature,
    href: '/services/formulaires',
    color: 'bg-purple-100 text-purple-700',
    stats: 'Formulaires numériques'
  },
  {
    title: 'Demande de permis',
    description: 'Effectuez vos demandes de permis de construire en ligne',
    icon: Building,
    href: '/services/permis',
    color: 'bg-yellow-100 text-yellow-700',
    stats: 'Service digitalisé'
  },
  {
    title: 'Consultation cadastrale',
    description: 'Consultez les informations cadastrales et foncières',
    icon: MapPin,
    href: '/services/cadastre',
    color: 'bg-pink-100 text-pink-700',
    stats: 'Base de données nationale'
  },
  {
    title: 'Assistance technique',
    description: 'Bénéficiez d\'un accompagnement pour vos projets',
    icon: Users,
    href: '/services/assistance',
    color: 'bg-indigo-100 text-indigo-700',
    stats: 'Experts disponibles'
  },
  {
    title: 'Guides pratiques',
    description: 'Consultez nos guides et tutoriels',
    icon: HelpCircle,
    href: '/services/guides',
    color: 'bg-red-100 text-red-700',
    stats: 'Ressources pratiques'
  },
  {
    title: 'FAQ',
    description: 'Trouvez des réponses à vos questions fréquentes',
    icon: HelpCircle,
    href: '/faq',
    color: 'bg-gray-100 text-gray-700',
    stats: '100+ questions répondues'
  }
]

const quickActions = [
  {
    title: 'Vérifier le statut d\'une demande',
    description: 'Suivez l\'avancement de vos dossiers en cours',
    icon: Shield,
    action: '/services/suivi'
  },
  {
    title: 'Prendre un rendez-vous',
    description: 'Réservez un créneau avec nos services',
    icon: Calendar,
    action: '/services/rendez-vous'
  },
  {
    title: 'Calculateur de taxes',
    description: 'Estimez vos taxes et redevances',
    icon: Calculator,
    action: '/services/calculateur'
  },
  {
    title: 'Certifications',
    description: 'Demandez vos attestations et certificats',
    icon: Award,
    action: '/services/certifications'
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nos Services
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Accédez à l'ensemble des services en ligne du ministère. 
            Simplifiez vos démarches administratives.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-senegal-green-600">24/7</div>
              <div className="text-sm text-gray-600">Services en ligne</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-senegal-yellow-600">500+</div>
              <div className="text-sm text-gray-600">Documents disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-senegal-red-600">48h</div>
              <div className="text-sm text-gray-600">Délai de réponse</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-gray-600">Digitalisé</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Services principaux</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link key={service.title} href={service.href}>
                  <Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                    <CardHeader>
                      <div className={`inline-flex p-3 rounded-lg ${service.color} mb-3`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{service.stats}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Quick Actions */}
          <h2 className="text-2xl font-bold mb-8">Actions rapides</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Card key={action.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                        <p className="text-xs text-gray-600">{action.description}</p>
                        <Link href={action.action}>
                          <Button variant="link" size="sm" className="px-0 h-auto mt-2">
                            Accéder
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Help Section */}
          <Card className="bg-gradient-to-r from-senegal-green-50 to-senegal-yellow-50">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Besoin d'aide ?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Notre équipe est disponible pour vous accompagner dans vos démarches. 
                Consultez notre FAQ ou contactez-nous directement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/faq">
                  <Button size="lg" variant="outline">
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Consulter la FAQ
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg">
                    <Users className="mr-2 h-5 w-5" />
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}