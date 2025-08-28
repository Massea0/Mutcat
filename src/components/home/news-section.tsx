"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

// Données de démonstration - à remplacer par des données de Supabase
const newsItems = [
  {
    id: '1',
    title: 'Lancement du Programme PNALRU : 500 000 logements sur 15 ans',
    excerpt: 'Le Ministre Balla Moussa Fofana présente le nouveau programme national d\'accès au logement et de rénovation urbaine.',
    category: 'Logement',
    image: '/images/news-1.jpg',
    author: 'Direction Communication',
    publishedAt: new Date('2025-04-15'),
    readTime: 5,
  },
  {
    id: '2',
    title: 'Réforme Foncière : Nouveau Projet de Loi Transmis à l\'Assemblée',
    excerpt: 'Un cadre juridique plus strict et équitable pour garantir une gestion transparente et rationnelle des terres au Sénégal.',
    category: 'Législation',
    image: '/images/news-2.jpg',
    author: 'Service Juridique',
    publishedAt: new Date('2025-08-25'),
    readTime: 3,
  },
  {
    id: '3',
    title: 'Vision Sénégal 2050 : Les Pôles Territoriaux en Action',
    excerpt: 'Huit axes de croissance répartis sur l\'ensemble du territoire pour corriger les disparités territoriales.',
    category: 'Développement',
    image: '/images/news-3.jpg',
    author: 'ANAT',
    publishedAt: new Date('2025-07-07'),
    readTime: 4,
  },
]

const categoryColors: Record<string, string> = {
  'Logement': 'bg-senegal-green-100 text-senegal-green-700 dark:bg-senegal-green-900/30 dark:text-senegal-green-400',
  'Législation': 'bg-senegal-yellow-100 text-senegal-yellow-700 dark:bg-senegal-yellow-900/30 dark:text-senegal-yellow-400',
  'Développement': 'bg-senegal-red-100 text-senegal-red-700 dark:bg-senegal-red-900/30 dark:text-senegal-red-400',
}

export function NewsSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Actualités Récentes
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Restez informé des dernières nouvelles du ministère
            </p>
          </div>
          <Link href="/actualites">
            <Button variant="outline" className="group">
              Toutes les actualités
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Grille d'actualités */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item, index) => (
            <Card
              key={item.id}
              className={`group overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              {/* Image de couverture */}
              <div className="relative h-48 lg:h-64 overflow-hidden bg-gradient-to-br from-senegal-green-100 to-senegal-yellow-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                {index === 0 && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center rounded-full bg-senegal-red-500 px-3 py-1 text-xs font-semibold text-white">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      À la Une
                    </span>
                  </div>
                )}
              </div>

              <CardHeader>
                {/* Catégorie */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    categoryColors[item.category] || 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.category}
                  </span>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="mr-1 h-3 w-3" />
                    {item.readTime} min
                  </div>
                </div>

                {/* Titre */}
                <CardTitle className={`${
                  index === 0 ? 'text-2xl' : 'text-xl'
                } line-clamp-2 group-hover:text-senegal-green-600 transition-colors`}>
                  <Link href={`/actualites/${item.id}`}>
                    {item.title}
                  </Link>
                </CardTitle>

                {/* Description */}
                <CardDescription className="line-clamp-2 mt-2">
                  {item.excerpt}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Métadonnées */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {formatDate(item.publishedAt)}
                  </div>
                  <span className="text-xs">{item.author}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Barre d'actualités défilante */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500 p-1">
          <div className="rounded-xl bg-white dark:bg-gray-800 p-4">
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center rounded-full bg-senegal-red-100 px-3 py-1 text-sm font-semibold text-senegal-red-700 dark:bg-senegal-red-900/30 dark:text-senegal-red-400">
                Flash Info
              </span>
              <div className="flex-1 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    📢 Ouverture des inscriptions pour le programme de logements sociaux 2025 • 
                    🏗️ Début des travaux du pôle urbain de Diamniadio phase 2 • 
                    📅 Conférence nationale sur l'urbanisme durable le 15 septembre 2025
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}