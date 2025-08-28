"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Building2, Users, Map, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const slides = [
  {
    title: "Vision Sénégal 2050",
    subtitle: "Bâtir l'avenir urbain du Sénégal",
    description: "Un développement territorial équilibré et durable pour tous les Sénégalais",
    image: "/images/hero-1.jpg",
    cta: { text: "Découvrir la Vision", href: "/projets/vision-2050" }
  },
  {
    title: "Programme PNALRU",
    subtitle: "500 000 logements sur 15 ans",
    description: "Accès au logement décent et rénovation urbaine pour tous",
    image: "/images/hero-2.jpg",
    cta: { text: "En savoir plus", href: "/projets/pnalru" }
  },
  {
    title: "Pôles Territoriaux",
    subtitle: "8 axes de croissance nationale",
    description: "Décentralisation et développement économique équilibré",
    image: "/images/hero-3.jpg",
    cta: { text: "Explorer les pôles", href: "/projets/poles" }
  }
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[600px] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Image de fond avec overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />
        <div 
          className="h-full w-full bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url('/images/placeholder.svg')`,
          }}
        />
      </div>

      {/* Contenu */}
      <div className="relative z-20 flex h-full items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center rounded-full bg-senegal-green-500/20 px-4 py-2 backdrop-blur-sm">
                <span className="text-sm font-semibold text-senegal-green-400">
                  République du Sénégal
                </span>
              </div>

              {/* Titre principal animé */}
              <div className="space-y-4">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-500 ${
                      index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4 absolute'
                    }`}
                  >
                    <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="text-xl text-senegal-yellow-400 font-semibold mt-2">
                      {slide.subtitle}
                    </p>
                    <p className="text-lg text-gray-300 mt-4">
                      {slide.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-wrap gap-4 pt-8">
                <Link href={slides[currentSlide].cta.href}>
                  <Button size="lg" variant="gradient" className="group">
                    {slides[currentSlide].cta.text}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                    Nous Contacter
                  </Button>
                </Link>
              </div>

              {/* Indicateurs de slide */}
              <div className="flex space-x-2 pt-4">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-8 bg-senegal-yellow-500'
                        : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Aller au slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Carte des statistiques rapides */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="group rounded-2xl bg-white/10 backdrop-blur-md p-6 transition-all hover:bg-white/20 hover:scale-105">
                  <Building2 className="h-10 w-10 text-senegal-yellow-400 mb-3" />
                  <div className="text-3xl font-bold text-white">39K+</div>
                  <div className="text-sm text-gray-300">Logements construits</div>
                </div>
                <div className="group rounded-2xl bg-white/10 backdrop-blur-md p-6 transition-all hover:bg-white/20 hover:scale-105">
                  <Users className="h-10 w-10 text-senegal-green-400 mb-3" />
                  <div className="text-3xl font-bold text-white">552</div>
                  <div className="text-sm text-gray-300">Collectivités territoriales</div>
                </div>
                <div className="group rounded-2xl bg-white/10 backdrop-blur-md p-6 transition-all hover:bg-white/20 hover:scale-105">
                  <Map className="h-10 w-10 text-senegal-red-400 mb-3" />
                  <div className="text-3xl font-bold text-white">14</div>
                  <div className="text-sm text-gray-300">Régions couvertes</div>
                </div>
                <div className="group rounded-2xl bg-white/10 backdrop-blur-md p-6 transition-all hover:bg-white/20 hover:scale-105">
                  <ChevronRight className="h-10 w-10 text-blue-400 mb-3" />
                  <div className="text-3xl font-bold text-white">8</div>
                  <div className="text-sm text-gray-300">Pôles territoriaux</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dégradé décoratif en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
    </section>
  )
}