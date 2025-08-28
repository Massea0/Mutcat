'use client'

import { useState, useEffect } from 'react'
import { cmsService, type Partner } from '@/lib/cms/services'

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPartners()
  }, [])

  const loadPartners = async () => {
    try {
      const data = await cmsService.getPartners()
      
      // Si pas de partenaires dans la DB, utiliser les partenaires par défaut
      if (!data || data.length === 0) {
        setPartners(defaultPartners)
      } else {
        setPartners(data)
      }
    } catch (error) {
      console.error('Error loading partners:', error)
      setPartners(defaultPartners)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-senegal-green-600 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (partners.length === 0) return null

  // Dupliquer les partenaires pour l'animation infinie
  const duplicatedPartners = [...partners, ...partners]

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Partenaires</h2>
        
        <div className="relative">
          <div className="flex animate-marquee">
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 mx-8"
              >
                {partner.website_url ? (
                  <a 
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:opacity-80 transition-opacity"
                    title={partner.name}
                  >
                    <img 
                      src={partner.logo_url} 
                      alt={partner.name}
                      className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.svg'
                      }}
                    />
                  </a>
                ) : (
                  <div className="hover:opacity-80 transition-opacity">
                    <img 
                      src={partner.logo_url} 
                      alt={partner.name}
                      className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.svg'
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Partenaires par défaut si aucune donnée dans la DB
const defaultPartners: Partner[] = [
  {
    id: '1',
    name: 'Banque Mondiale',
    logo_url: '/images/partners/world-bank.png',
    website_url: 'https://www.worldbank.org',
    order_index: 0
  },
  {
    id: '2',
    name: 'Union Européenne',
    logo_url: '/images/partners/eu.png',
    website_url: 'https://europa.eu',
    order_index: 1
  },
  {
    id: '3',
    name: 'AFD',
    logo_url: '/images/partners/afd.png',
    website_url: 'https://www.afd.fr',
    order_index: 2
  },
  {
    id: '4',
    name: 'BAD',
    logo_url: '/images/partners/bad.png',
    website_url: 'https://www.afdb.org',
    order_index: 3
  },
  {
    id: '5',
    name: 'PNUD',
    logo_url: '/images/partners/undp.png',
    website_url: 'https://www.undp.org',
    order_index: 4
  }
]