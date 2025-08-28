'use client'

import { useState, useEffect } from 'react'
import { Building, Users, MapPin, TrendingUp } from 'lucide-react'
import { cmsService, type Statistic } from '@/lib/cms/services'

export function StatsSection() {
  const [stats, setStats] = useState<Statistic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await cmsService.getStatistics()
      
      // Si pas de stats dans la DB, utiliser les stats par défaut
      if (!data || data.length === 0) {
        setStats(defaultStats)
      } else {
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading statistics:', error)
      setStats(defaultStats)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName?: string) => {
    const icons: Record<string, any> = {
      'building': Building,
      'users': Users,
      'map-pin': MapPin,
      'trending-up': TrendingUp
    }
    
    const Icon = iconName ? icons[iconName] : Building
    return Icon || Building
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-senegal-green-600 to-senegal-green-700">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-r from-senegal-green-600 to-senegal-green-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = getIcon(stat.icon)
            return (
              <div key={stat.id} className="text-center text-white">
                <Icon className="h-12 w-12 mx-auto mb-4 opacity-80" />
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base opacity-90">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Stats par défaut si aucune donnée dans la DB
const defaultStats: Statistic[] = [
  {
    id: '1',
    label: 'Projets en cours',
    value: '127',
    icon: 'building',
    order_index: 0
  },
  {
    id: '2',
    label: 'Communes appuyées',
    value: '557',
    icon: 'map-pin',
    order_index: 1
  },
  {
    id: '3',
    label: 'Emplois créés',
    value: '15K+',
    icon: 'users',
    order_index: 2
  },
  {
    id: '4',
    label: 'Investissements',
    value: '850 Mds',
    icon: 'trending-up',
    order_index: 3
  }
]