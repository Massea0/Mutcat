"use client"

import React from 'react'

const partners = [
  { name: 'Banque Mondiale', logo: '/logos/world-bank.png' },
  { name: 'BAD', logo: '/logos/bad.png' },
  { name: 'Union Européenne', logo: '/logos/eu.png' },
  { name: 'ONU-Habitat', logo: '/logos/un-habitat.png' },
  { name: 'AFD', logo: '/logos/afd.png' },
  { name: 'BOAD', logo: '/logos/boad.png' },
]

export function PartnersSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Nos Partenaires
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Ils nous accompagnent dans la transformation urbaine du Sénégal
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-sm transition-all hover:shadow-lg hover:scale-105"
            >
              <div className="h-16 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}