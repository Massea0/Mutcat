'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, Calendar, Eye, Download, Search, Filter } from 'lucide-react'
import { usePublications } from '@/hooks/usePublications'

export default function PublicationsPage() {
  const { publications, loading, error } = usePublications(50)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'Toutes les publications' },
    { id: 'reports', label: 'Rapports' },
    { id: 'studies', label: 'Études' },
    { id: 'guides', label: 'Guides' },
    { id: 'policies', label: 'Politiques' }
  ]

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pub.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || pub.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Aucune publication disponible pour le moment. Les publications seront bientôt ajoutées.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Generate placeholder publications if none exist
  const displayPublications = filteredPublications.length > 0 ? filteredPublications : 
    Array.from({ length: 6 }, (_, i) => ({
      id: `placeholder-${i}`,
      title: `Publication ${i + 1}`,
      slug: `publication-${i + 1}`,
      content: `Contenu de la publication ${i + 1}`,
      excerpt: `Résumé de la publication ${i + 1}. Cette publication traite de sujets importants pour notre ministère.`,
      featured_image: `https://picsum.photos/seed/pub${i}/600/400`,
      category: categories[i % categories.length].id,
      tags: ['officiel', 'rapport'],
      is_published: true,
      published_at: new Date().toISOString(),
      views: Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-4xl font-bold mb-4">Publications</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Consultez nos rapports, études et documents officiels
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une publication..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Publications Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPublications.map((publication) => (
            <div
              key={publication.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              {publication.featured_image && (
                <div className="relative h-48">
                  <Image
                    src={publication.featured_image}
                    alt={publication.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs">
                    {publication.category || 'Document'}
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {publication.title}
                </h3>
                
                {publication.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {publication.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(publication.published_at || publication.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {publication.views} vues
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    href={`/publications/${publication.slug}`}
                    className="flex-1 bg-primary text-white text-center py-2 px-4 rounded hover:bg-primary-dark transition-colors"
                  >
                    Lire
                  </Link>
                  <button
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    title="Télécharger"
                  >
                    <Download className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayPublications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune publication trouvée
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}