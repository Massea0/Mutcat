"use client"

import React from 'react'
import { Building2, Users, MapPin, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'

const stats = [
  {
    icon: Building2,
    value: '39,190',
    label: 'Logements construits',
    change: '+12%',
    color: 'text-senegal-green-500',
    bgColor: 'bg-senegal-green-50 dark:bg-senegal-green-900/20',
  },
  {
    icon: Users,
    value: '552',
    label: 'Collectivités territoriales',
    change: '+8',
    color: 'text-senegal-yellow-500',
    bgColor: 'bg-senegal-yellow-50 dark:bg-senegal-yellow-900/20',
  },
  {
    icon: MapPin,
    value: '14',
    label: 'Régions couvertes',
    change: '100%',
    color: 'text-senegal-red-500',
    bgColor: 'bg-senegal-red-50 dark:bg-senegal-red-900/20',
  },
  {
    icon: TrendingUp,
    value: '302 Mds',
    label: 'Budget 2025 (FCFA)',
    change: '+15%',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="relative overflow-hidden p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor} mb-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </div>
                <span className={`text-sm font-semibold ${stat.color}`}>
                  {stat.change}
                </span>
              </div>
              {/* Élément décoratif */}
              <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full ${stat.bgColor} opacity-20`} />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}