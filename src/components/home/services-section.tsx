"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Download, 
  Briefcase, 
  HelpCircle, 
  Calendar,
  Mail,
  Building,
  Map,
  Users,
  Shield,
  Globe,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    icon: FileText,
    title: 'Publications & Rapports',
    description: 'Accédez aux documents officiels, rapports d\'études et plans d\'aménagement.',
    href: '/services/publications',
    color: 'text-senegal-green-500',
    bgColor: 'bg-senegal-green-50 dark:bg-senegal-green-900/20',
  },
  {
    icon: Briefcase,
    title: 'Appels d\'Offres',
    description: 'Consultez les appels d\'offres en cours et les opportunités de marché.',
    href: '/services/appels-offres',
    color: 'text-senegal-yellow-500',
    bgColor: 'bg-senegal-yellow-50 dark:bg-senegal-yellow-900/20',
  },
  {
    icon: Building,
    title: 'Permis de Construire',
    description: 'Déposez et suivez vos demandes de permis de construire en ligne.',
    href: '/services/permis',
    color: 'text-senegal-red-500',
    bgColor: 'bg-senegal-red-50 dark:bg-senegal-red-900/20',
  },
  {
    icon: Users,
    title: 'Carrières',
    description: 'Découvrez les opportunités de carrière au sein du ministère.',
    href: '/services/carrieres',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Map,
    title: 'Géoportail',
    description: 'Explorez les cartes interactives et données géospatiales du Sénégal.',
    href: '/services/geoportail',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: HelpCircle,
    title: 'FAQ & Support',
    description: 'Trouvez des réponses à vos questions fréquentes.',
    href: '/services/faq',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
]

const quickActions = [
  {
    icon: Download,
    label: 'Télécharger un formulaire',
    href: '/services/formulaires',
  },
  {
    icon: Calendar,
    label: 'Prendre un rendez-vous',
    href: '/services/rendez-vous',
  },
  {
    icon: Mail,
    label: 'Newsletter',
    href: '/services/newsletter',
  },
  {
    icon: Shield,
    label: 'Déclarations',
    href: '/services/declarations',
  },
]

export function ServicesSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Services en Ligne
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Accédez facilement à tous nos services numériques disponibles 24h/24
          </p>
        </div>

        {/* Grille de services */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link key={service.title} href={service.href}>
              <Card className="h-full group hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${service.bgColor} mb-4`}>
                    <service.icon className={`h-7 w-7 ${service.color}`} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-senegal-green-600 transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription>
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500 p-1">
          <div className="rounded-xl bg-white dark:bg-gray-800 p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Actions Rapides
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <action.icon className="h-8 w-8 text-gray-600 dark:text-gray-400 group-hover:text-senegal-green-500 transition-colors mb-2" />
                  <span className="text-sm text-center text-gray-700 dark:text-gray-300">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Statistiques de services */}
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-senegal-green-600">1,250+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Documents disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-senegal-yellow-600">85%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Services digitalisés</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-senegal-red-600">24/7</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Disponibilité</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">15K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Utilisateurs actifs</div>
          </div>
        </div>
      </div>
    </section>
  )
}