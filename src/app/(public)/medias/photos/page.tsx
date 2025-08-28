'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Camera, X, Download, Share2, Calendar } from 'lucide-react'
import { useMedia } from '@/hooks/useMedia'

export default function PhotosPage() {
  const { media: photos, loading, error } = useMedia('photo', 50)
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null)
  const [filter, setFilter] = useState('all')

  const categories = [
    { id: 'all', label: 'Toutes les photos' },
    { id: 'events', label: 'Événements' },
    { id: 'projects', label: 'Projets' },
    { id: 'ceremonies', label: 'Cérémonies' },
    { id: 'visits', label: 'Visites officielles' }
  ]

  const handleDownload = async (url: string, title: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  const handleShare = async (url: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Photo: ${title}`,
          url: url
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      alert('Lien copié dans le presse-papiers!')
    }
  }

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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Erreur lors du chargement des photos: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Generate placeholder photos if no photos available
  const displayPhotos = photos.length > 0 ? photos : Array.from({ length: 12 }, (_, i) => ({
    id: `placeholder-${i}`,
    title: `Photo ${i + 1}`,
    description: `Description de la photo ${i + 1}`,
    file_url: `https://picsum.photos/seed/${i}/400/300`,
    created_at: new Date().toISOString(),
    tags: ['événement', 'officiel'],
    is_featured: i < 3,
    is_published: true,
    media_type: 'photo'
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Camera className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-4xl font-bold mb-4">Galerie Photos</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Découvrez les moments marquants de notre ministère à travers notre collection de photos
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filter === category.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-w-4 aspect-h-3 relative h-64">
                <Image
                  src={photo.file_url}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {photo.is_featured && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded text-xs font-semibold">
                    À la une
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {photo.title}
                </h3>
                {photo.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {photo.description}
                  </p>
                )}
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(photo.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
            </div>
          ))}
        </div>

        {displayPhotos.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune photo disponible
            </h3>
            <p className="text-gray-500">
              Les photos seront bientôt disponibles.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="relative h-[70vh]">
                <Image
                  src={selectedPhoto.file_url}
                  alt={selectedPhoto.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              
              <div className="p-6 bg-white">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedPhoto.title}
                </h2>
                {selectedPhoto.description && (
                  <p className="text-gray-600 mb-4">
                    {selectedPhoto.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(selectedPhoto.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(selectedPhoto.file_url, selectedPhoto.title)
                      }}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      title="Télécharger"
                    >
                      <Download className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShare(selectedPhoto.file_url, selectedPhoto.title)
                      }}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      title="Partager"
                    >
                      <Share2 className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}