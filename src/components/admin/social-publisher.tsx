"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Twitter, 
  Linkedin, 
  Instagram, 
  Send, 
  Calendar,
  Image,
  Hash,
  Link2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface SocialPost {
  id: string
  content: string
  platforms: string[]
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  published_at?: string
  scheduled_at?: string
  media_urls?: string[]
  author?: {
    full_name: string
    email: string
  }
}

export function SocialPublisher() {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [scheduledAt, setScheduledAt] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [recentPosts, setRecentPosts] = useState<SocialPost[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [publishResult, setPublishResult] = useState<any>(null)

  const platforms = [
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'hover:bg-sky-50 hover:text-sky-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'hover:bg-blue-50 hover:text-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'hover:bg-pink-50 hover:text-pink-600' },
  ]

  useEffect(() => {
    fetchRecentPosts()
  }, [])

  const fetchRecentPosts = async () => {
    try {
      const response = await fetch('/api/social/publish')
      if (response.ok) {
        const data = await response.json()
        setRecentPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoadingPosts(false)
    }
  }

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const handlePublish = async () => {
    if (!content || selectedPlatforms.length === 0) {
      alert('Veuillez saisir du contenu et sélectionner au moins une plateforme')
      return
    }

    setIsPublishing(true)
    setPublishResult(null)

    try {
      const response = await fetch('/api/social/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          platforms: selectedPlatforms,
          mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
          scheduledAt: scheduledAt || undefined,
        }),
      })

      const result = await response.json()
      setPublishResult(result)

      if (result.success) {
        // Réinitialiser le formulaire
        setContent('')
        setSelectedPlatforms([])
        setMediaUrls([])
        setScheduledAt('')
        
        // Rafraîchir la liste des posts
        fetchRecentPosts()
      }
    } catch (error) {
      console.error('Error publishing:', error)
      setPublishResult({ error: 'Erreur lors de la publication' })
    } finally {
      setIsPublishing(false)
    }
  }

  const characterCount = content.length
  const twitterLimit = 280
  const linkedinLimit = 3000

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Console de Publication Sociale
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Publiez simultanément sur tous vos réseaux sociaux
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire de publication */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nouveau Post</CardTitle>
              <CardDescription>
                Créez et publiez votre contenu sur plusieurs plateformes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sélection des plateformes */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Plateformes de publication
                </label>
                <div className="flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => handlePlatformToggle(platform.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? 'border-senegal-green-500 bg-senegal-green-50 text-senegal-green-700'
                          : `border-gray-200 ${platform.color}`
                      }`}
                    >
                      <platform.icon className="h-5 w-5" />
                      <span className="font-medium">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone de texte */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Contenu du post
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Écrivez votre message ici..."
                  className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-senegal-green-500 focus:border-senegal-green-500"
                />
                <div className="mt-2 flex justify-between text-sm">
                  <div className="flex gap-4">
                    <span className={`${characterCount > twitterLimit ? 'text-red-500' : 'text-gray-500'}`}>
                      Twitter: {characterCount}/{twitterLimit}
                    </span>
                    <span className={`${characterCount > linkedinLimit ? 'text-red-500' : 'text-gray-500'}`}>
                      LinkedIn: {characterCount}/{linkedinLimit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Options supplémentaires */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Médias */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Image className="inline h-4 w-4 mr-1" />
                    URLs des médias (optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const input = e.currentTarget
                        if (input.value) {
                          setMediaUrls([...mediaUrls, input.value])
                          input.value = ''
                        }
                      }
                    }}
                  />
                  {mediaUrls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {mediaUrls.map((url, index) => (
                        <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {url.substring(0, 30)}...
                          <button
                            onClick={() => setMediaUrls(mediaUrls.filter((_, i) => i !== index))}
                            className="ml-1 text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Programmation */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Programmer la publication
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                  />
                </div>
              </div>

              {/* Résultat de publication */}
              {publishResult && (
                <div className={`p-4 rounded-xl ${
                  publishResult.success 
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {publishResult.success ? (
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Publication réussie !</p>
                        {publishResult.results?.map((result: any, index: number) => (
                          <p key={index} className="text-sm mt-1">
                            {result.platform}: {result.url || 'Publié avec succès'}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-2">
                      <XCircle className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Erreur de publication</p>
                        <p className="text-sm mt-1">{publishResult.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setContent('')
                    setSelectedPlatforms([])
                    setMediaUrls([])
                    setScheduledAt('')
                  }}
                >
                  Réinitialiser
                </Button>
                <Button
                  variant="gradient"
                  onClick={handlePublish}
                  disabled={isPublishing || !content || selectedPlatforms.length === 0}
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publication...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {scheduledAt ? 'Programmer' : 'Publier maintenant'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historique des publications */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Publications récentes</CardTitle>
              <CardDescription>
                Historique des posts publiés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPosts ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : recentPosts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  Aucune publication récente
                </p>
              ) : (
                <div className="space-y-4">
                  {recentPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="border-b pb-3 last:border-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex gap-2">
                          {post.platforms.map((platform) => {
                            const Icon = platform === 'twitter' ? Twitter :
                                       platform === 'linkedin' ? Linkedin : Instagram
                            return (
                              <Icon key={platform} className="h-4 w-4 text-gray-400" />
                            )
                          })}
                        </div>
                        <StatusBadge status={post.status} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {post.published_at 
                          ? new Date(post.published_at).toLocaleDateString('fr-FR')
                          : 'Non publié'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    published: { icon: CheckCircle, color: 'text-green-500', label: 'Publié' },
    scheduled: { icon: Clock, color: 'text-blue-500', label: 'Programmé' },
    failed: { icon: XCircle, color: 'text-red-500', label: 'Échec' },
    draft: { icon: AlertCircle, color: 'text-gray-500', label: 'Brouillon' },
  }

  const { icon: Icon, color, label } = config[status as keyof typeof config] || config.draft

  return (
    <span className={`flex items-center text-xs ${color}`}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </span>
  )
}