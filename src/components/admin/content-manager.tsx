"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  Calendar,
  Tag,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

interface ContentItem {
  id: string
  title: string
  type: 'news' | 'project' | 'event' | 'document'
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
  author?: {
    full_name: string
  }
}

export function ContentManager() {
  const [contents, setContents] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  const contentTypes = [
    { id: 'all', label: 'Tous', icon: FileText, color: 'bg-gray-100' },
    { id: 'news', label: 'Actualités', icon: FileText, color: 'bg-senegal-green-100' },
    { id: 'projects', label: 'Projets', icon: FileText, color: 'bg-senegal-yellow-100' },
    { id: 'events', label: 'Événements', icon: Calendar, color: 'bg-senegal-red-100' },
    { id: 'documents', label: 'Documents', icon: FileText, color: 'bg-blue-100' },
  ]

  useEffect(() => {
    fetchContents()
  }, [selectedType])

  const fetchContents = async () => {
    setIsLoading(true)
    try {
      // Fetch news
      const { data: newsData } = await supabase
        .from('news')
        .select('id, title, created_at, updated_at, published')
        .order('created_at', { ascending: false })
        .limit(10)

      // Fetch projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('id, title, created_at, updated_at, status')
        .order('created_at', { ascending: false })
        .limit(10)

      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('id, title, created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(10)

      // Combine and format data
      const allContents: ContentItem[] = [
        ...(newsData?.map(item => ({
          id: item.id,
          title: item.title,
          type: 'news' as const,
          status: item.published ? 'published' as const : 'draft' as const,
          created_at: item.created_at,
          updated_at: item.updated_at
        })) || []),
        ...(projectsData?.map(item => ({
          id: item.id,
          title: item.title,
          type: 'project' as const,
          status: 'published' as const,
          created_at: item.created_at,
          updated_at: item.updated_at
        })) || []),
        ...(eventsData?.map(item => ({
          id: item.id,
          title: item.title,
          type: 'event' as const,
          status: 'published' as const,
          created_at: item.created_at,
          updated_at: item.updated_at
        })) || [])
      ]

      // Filter by type if needed
      if (selectedType !== 'all') {
        setContents(allContents.filter(item => item.type === selectedType))
      } else {
        setContents(allContents)
      }
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) return

    try {
      const table = type === 'news' ? 'news' : 
                   type === 'project' ? 'projects' : 
                   type === 'event' ? 'events' : 'documents'
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (!error) {
        setContents(contents.filter(item => item.id !== id))
      }
    } catch (error) {
      console.error('Error deleting content:', error)
    }
  }

  const filteredContents = contents.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion du Contenu
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez tous les contenus de votre site
          </p>
        </div>
        <Button variant="gradient">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau contenu
        </Button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un contenu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
        <div className="flex gap-2">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedType === type.id
                  ? 'bg-senegal-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: contents.length, color: 'text-gray-600' },
          { label: 'Publiés', value: contents.filter(c => c.status === 'published').length, color: 'text-green-600' },
          { label: 'Brouillons', value: contents.filter(c => c.status === 'draft').length, color: 'text-yellow-600' },
          { label: 'Archivés', value: contents.filter(c => c.status === 'archived').length, color: 'text-red-600' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{stat.label}</span>
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Liste des contenus */}
      <Card>
        <CardHeader>
          <CardTitle>Contenus récents</CardTitle>
          <CardDescription>
            Gérez et modifiez vos contenus publiés
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Chargement...
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun contenu trouvé
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContents.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'news' ? 'bg-senegal-green-100 text-senegal-green-700' :
                        item.type === 'project' ? 'bg-senegal-yellow-100 text-senegal-yellow-700' :
                        item.type === 'event' ? 'bg-senegal-red-100 text-senegal-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.type === 'news' ? 'Actualité' :
                         item.type === 'project' ? 'Projet' :
                         item.type === 'event' ? 'Événement' : 'Document'}
                      </span>
                      {item.status === 'published' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : item.status === 'draft' ? (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(item.created_at)}
                      </span>
                      {item.author && (
                        <span>{item.author.full_name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(item.id, item.type)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}