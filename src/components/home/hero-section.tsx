'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Play, ArrowRight } from 'lucide-react'
import { cmsService, type HeroSlide } from '@/lib/cms/services'

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSlides()
  }, [])

  useEffect(() => {
    if (slides.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const loadSlides = async () => {
    try {
      const data = await cmsService.getHeroSliders()
      
      // Si pas de slides dans la DB, utiliser les slides par défaut
      if (!data || data.length === 0) {
        setSlides(defaultSlides)
      } else {
        setSlides(data)
      }
    } catch (error) {
      console.error('Error loading slides:', error)
      setSlides(defaultSlides)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (loading) {
    return (
      <section className="relative h-[600px] bg-gradient-to-br from-senegal-green-600 to-senegal-green-700">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </section>
    )
  }

  if (slides.length === 0) return null

  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          {slide.image_url ? (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image_url})` }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-senegal-green-600 to-senegal-green-700"></div>
          )}

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <h2 className="text-xl md:text-2xl text-white/90 mb-6 animate-fade-in-up animation-delay-200">
                    {slide.subtitle}
                  </h2>
                )}
                {slide.description && (
                  <p className="text-lg text-white/80 mb-8 animate-fade-in-up animation-delay-400">
                    {slide.description}
                  </p>
                )}
                {slide.button_text && slide.button_link && (
                  <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-600">
                    <Link href={slide.button_link}>
                      <Button size="lg" className="bg-white text-senegal-green-600 hover:bg-gray-100">
                        {slide.button_text}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            aria-label="Slide précédent"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            aria-label="Slide suivant"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

// Slides par défaut si aucune donnée dans la DB
const defaultSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'Bâtir le Sénégal de demain',
    subtitle: 'Vision 2050',
    description: 'Un développement urbain durable et inclusif pour tous les Sénégalais',
    image_url: '/images/dakar-skyline.jpg',
    button_text: 'Découvrir nos projets',
    button_link: '/projets',
    order_index: 0
  },
  {
    id: '2',
    title: 'Programme National de Logements Sociaux',
    subtitle: '100 000 logements',
    description: 'Accès au logement décent pour tous les citoyens',
    image_url: '/images/housing-project.jpg',
    button_text: 'En savoir plus',
    button_link: '/projets/logements-sociaux',
    order_index: 1
  },
  {
    id: '3',
    title: 'Smart Cities Sénégal',
    subtitle: 'Innovation urbaine',
    description: 'Des villes intelligentes pour un avenir connecté',
    image_url: '/images/smart-city.jpg',
    button_text: 'Explorer',
    button_link: '/projets/smart-cities',
    order_index: 2
  }
]