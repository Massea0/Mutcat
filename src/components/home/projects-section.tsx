"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Users, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

const projects = [
  {
    id: '1',
    title: 'Programme National d\'Accès au Logement (PNALRU)',
    description: 'Construction de 500 000 logements sociaux sur 15 ans pour améliorer les conditions de vie des populations.',
    status: 'ongoing',
    progress: 15,
    location: 'National',
    budget: 2500000000000,
    beneficiaries: '500 000 familles',
    startDate: '2025',
    image: '/images/project-1.jpg',
  },
  {
    id: '2',
    title: 'Pôle Urbain de Diamniadio',
    description: 'Développement d\'une ville nouvelle moderne avec infrastructures complètes et espaces verts.',
    status: 'ongoing',
    progress: 65,
    location: 'Diamniadio',
    budget: 850000000000,
    beneficiaries: '350 000 habitants',
    startDate: '2020',
    image: '/images/project-2.jpg',
  },
  {
    id: '3',
    title: 'Smart City de Notto Diobasse',
    description: 'Première ville intelligente du Sénégal avec technologies durables et connectées.',
    status: 'planned',
    progress: 0,
    location: 'Thiès',
    budget: 450000000000,
    beneficiaries: '150 000 habitants',
    startDate: '2026',
    image: '/images/project-3.jpg',
  },
  {
    id: '4',
    title: 'Réhabilitation du Centre-Ville de Dakar',
    description: 'Modernisation et embellissement du centre historique avec préservation du patrimoine.',
    status: 'ongoing',
    progress: 35,
    location: 'Dakar',
    budget: 320000000000,
    beneficiaries: '1.2 millions habitants',
    startDate: '2024',
    image: '/images/project-4.jpg',
  },
]

const statusConfig = {
  planned: { label: 'Planifié', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  ongoing: { label: 'En cours', color: 'bg-senegal-green-100 text-senegal-green-700 dark:bg-senegal-green-900/30 dark:text-senegal-green-400' },
  completed: { label: 'Terminé', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
}

export function ProjectsSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Projets Majeurs
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Découvrez les grands projets d'urbanisme et d'aménagement qui transforment le Sénégal
          </p>
        </div>

        {/* Grille de projets */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Image du projet */}
              <div className="relative h-56 bg-gradient-to-br from-senegal-green-100 via-senegal-yellow-100 to-senegal-red-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Badge de statut */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    statusConfig[project.status as keyof typeof statusConfig].color
                  }`}>
                    {statusConfig[project.status as keyof typeof statusConfig].label}
                  </span>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl group-hover:text-senegal-green-600 transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Barre de progression */}
                {project.status === 'ongoing' && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Progression</span>
                      <span className="font-semibold text-senegal-green-600">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-senegal-green-500 to-senegal-yellow-500 transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Informations du projet */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="mr-2 h-4 w-4 text-senegal-green-500" />
                    {project.location}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="mr-2 h-4 w-4 text-senegal-yellow-500" />
                    Depuis {project.startDate}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <TrendingUp className="mr-2 h-4 w-4 text-senegal-red-500" />
                    {formatCurrency(project.budget)}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Users className="mr-2 h-4 w-4 text-blue-500" />
                    {project.beneficiaries}
                  </div>
                </div>

                {/* Bouton d'action */}
                <Link href={`/projets/${project.id}`} className="block">
                  <Button variant="outline" className="w-full group/btn">
                    Voir les détails
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/projets">
            <Button size="lg" variant="gradient">
              Explorer tous les projets
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}