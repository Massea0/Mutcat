"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink, FileText, Building, Users, Map, Shield } from 'lucide-react'
import Link from 'next/link'

const quickLinks = [
  {
    title: 'Vision Sénégal 2050',
    description: 'Découvrez la stratégie de développement à long terme',
    icon: Shield,
    href: '/projets/vision-2050',
    external: false,
  },
  {
    title: 'DGPU Diamniadio',
    description: 'Délégation générale à la Promotion des Pôles urbains',
    icon: Building,
    href: 'https://dgpu.gouv.sn',
    external: true,
  },
  {
    title: 'ANAT',
    description: 'Agence Nationale de l\'Aménagement du Territoire',
    icon: Map,
    href: 'https://anat.sn',
    external: true,
  },
  {
    title: 'ADM',
    description: 'Agence de Développement Municipal',
    icon: Users,
    href: 'https://adm.sn',
    external: true,
  },
  {
    title: 'Géo Sénégal',
    description: 'Portail géospatial national',
    icon: Map,
    href: 'https://geosenegal.gouv.sn',
    external: true,
  },
  {
    title: 'Documentation',
    description: 'Centre de ressources et archives',
    icon: FileText,
    href: '/services/publications',
    external: false,
  },
]

export function QuickLinksSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Liens Utiles
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Accès rapide aux plateformes et services partenaires
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="group"
            >
              <div className="flex items-start space-x-4 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 transition-all hover:border-senegal-green-500 hover:shadow-lg">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-senegal-green-100 to-senegal-yellow-100 dark:from-senegal-green-900/30 dark:to-senegal-yellow-900/30">
                    <link.icon className="h-6 w-6 text-senegal-green-600 dark:text-senegal-green-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-senegal-green-600 dark:group-hover:text-senegal-green-400 transition-colors">
                    {link.title}
                    {link.external && (
                      <ExternalLink className="ml-2 inline-block h-4 w-4" />
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500 p-1">
          <div className="rounded-[calc(1.5rem-1px)] bg-white dark:bg-gray-900 p-8 md:p-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Besoin d'assistance ?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Notre équipe est à votre disposition pour répondre à toutes vos questions concernant l'urbanisme et l'aménagement du territoire.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="gradient">
                    Nous contacter
                  </Button>
                </Link>
                <Link href="/services/faq">
                  <Button size="lg" variant="outline">
                    Consulter la FAQ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}