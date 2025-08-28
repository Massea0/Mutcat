'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Download, 
  Eye,
  Calendar,
  User,
  Globe,
  Tag,
  Share2,
  ArrowLeft,
  FileDown,
  BookOpen,
  Gavel,
  ScrollText,
  FileSignature,
  Book,
  Building
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function PublicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [publication, setPublication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [relatedPublications, setRelatedPublications] = useState<any[]>([])

  const supabase = createClient()

  useEffect(() => {
    if (params.id) {
      loadPublication()
    }
  }, [params.id])

  const loadPublication = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('id', params.id as string)
        .single()

      if (error) throw error
      
      if (!data) {
        // Utiliser des données par défaut pour la démo
        setPublication(defaultPublication)
        loadRelatedPublications('report')
      } else {
        setPublication(data)
        loadRelatedPublications((data as any).type)
        
        // Incrémenter les vues
        // TODO: Fix TypeScript error with Supabase update
        // await supabase
        //   .from('publications')
        //   .update({ views: (data.views || 0) + 1 })
        //   .eq('id', params.id as string)
      }
    } catch (error) {
      console.error('Error loading publication:', error)
      setPublication(defaultPublication)
      loadRelatedPublications('report')
    } finally {
      setLoading(false)
    }
  }

  const loadRelatedPublications = async (type: string) => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('type', type)
        .neq('id', params.id)
        .limit(3)

      if (error) throw error
      setRelatedPublications(data || [])
    } catch (error) {
      console.error('Error loading related publications:', error)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // Incrémenter le compteur de téléchargements
      // TODO: Fix TypeScript error with Supabase update
      // await supabase
      //   .from('publications')
      //   .update({ download_count: (publication.download_count || 0) + 1 })
      //   .eq('id', publication.id)

      // Simuler le téléchargement
      window.open(publication.file_url, '_blank')
      toast.success('Téléchargement démarré')
      
      // Mettre à jour localement
      setPublication({
        ...publication,
        download_count: (publication.download_count || 0) + 1
      })
    } catch (error) {
      toast.error('Erreur lors du téléchargement')
    } finally {
      setDownloading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: publication.title,
        text: publication.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Lien copié dans le presse-papiers')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'report': return BookOpen
      case 'law': return Gavel
      case 'decree': return ScrollText
      case 'circular': return FileSignature
      case 'guide': return Book
      case 'form': return FileText
      default: return FileText
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'report': return 'Rapport'
      case 'law': return 'Loi'
      case 'decree': return 'Décret'
      case 'circular': return 'Circulaire'
      case 'guide': return 'Guide'
      case 'form': return 'Formulaire'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'report': return 'bg-blue-100 text-blue-700'
      case 'law': return 'bg-purple-100 text-purple-700'
      case 'decree': return 'bg-green-100 text-green-700'
      case 'circular': return 'bg-yellow-100 text-yellow-700'
      case 'guide': return 'bg-pink-100 text-pink-700'
      case 'form': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Taille inconnue'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!publication) return null

  const Icon = getTypeIcon(publication.type)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Accueil
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/publications" className="text-gray-600 hover:text-gray-900">
              Publications
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 truncate">{publication.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/publications">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux publications
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(publication.type)} variant="secondary">
                      {getTypeLabel(publication.type)}
                    </Badge>
                    {publication.is_featured && (
                      <Badge variant="default">À la une</Badge>
                    )}
                    {publication.language && (
                      <Badge variant="outline">
                        {publication.language === 'fr' ? 'Français' :
                         publication.language === 'en' ? 'English' :
                         'Wolof'}
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-2xl">
                  {publication.title}
                </CardTitle>
                {publication.author && (
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <User className="h-4 w-4" />
                    {publication.author}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {/* Cover Image */}
                {publication.cover_image_url ? (
                  <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                    <Image
                      src={publication.cover_image_url}
                      alt={publication.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-64 mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <Icon className="h-24 w-24 text-gray-400" />
                  </div>
                )}

                {/* Description */}
                <div className="prose max-w-none mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {publication.description || 'Ce document présente des informations importantes concernant les activités et projets du ministère.'}
                  </p>
                </div>

                {/* Metadata */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {publication.year && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Année : {publication.year}</span>
                    </div>
                  )}
                  {publication.department && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{publication.department}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="h-4 w-4" />
                    <span>{publication.views || 0} vues</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Download className="h-4 w-4" />
                    <span>{publication.download_count || 0} téléchargements</span>
                  </div>
                </div>

                {/* Tags */}
                {publication.tags && publication.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Mots-clés</h3>
                    <div className="flex flex-wrap gap-2">
                      {publication.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Download Section */}
                {publication.is_downloadable !== false && (
                  <Card className="bg-gradient-to-r from-senegal-green-50 to-senegal-yellow-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold mb-1">Télécharger le document</h3>
                          <p className="text-sm text-gray-600">
                            Format : {publication.file_type || 'PDF'} • 
                            Taille : {formatFileSize(publication.file_size)}
                          </p>
                        </div>
                        <Button 
                          onClick={handleDownload}
                          disabled={downloading}
                          className="bg-senegal-green-600 hover:bg-senegal-green-700"
                        >
                          {downloading ? (
                            <>
                              <FileDown className="mr-2 h-4 w-4 animate-bounce" />
                              Téléchargement...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Related Publications */}
            {relatedPublications.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Publications similaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatedPublications.map((pub) => (
                      <Link key={pub.id} href={`/publications/${pub.id}`}>
                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <FileText className="h-8 w-8 text-gray-400" />
                          <div className="flex-1">
                            <h4 className="font-medium hover:text-senegal-green-600 transition-colors">
                              {pub.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {pub.year} • {pub.download_count || 0} téléchargements
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations du document</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Type de document</p>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">{getTypeLabel(publication.type)}</span>
                  </div>
                </div>

                {publication.category && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Catégorie</p>
                    <p className="font-medium">{publication.category}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 mb-1">Langue</p>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">
                      {publication.language === 'fr' ? 'Français' :
                       publication.language === 'en' ? 'English' :
                       publication.language === 'wo' ? 'Wolof' :
                       'Français'}
                    </span>
                  </div>
                </div>

                {publication.created_at && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date de publication</p>
                    <p className="font-medium">
                      {new Date(publication.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Partager
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Citer ce document
                </Button>
                <Link href="/contact">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Contacter l'auteur
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Si vous avez des questions sur ce document, n'hésitez pas à nous contacter.
                </p>
                <Link href="/faq">
                  <Button variant="outline" size="sm">
                    Consulter la FAQ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Données par défaut pour la démo
const defaultPublication = {
  id: '1',
  title: 'Rapport Annuel 2024 - Bilan et Perspectives',
  slug: 'rapport-annuel-2024',
  description: `Ce rapport présente un bilan complet des activités du Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires pour l'année 2024.

Il détaille les principales réalisations, les défis rencontrés et les perspectives pour l'année à venir. Le document inclut également une analyse approfondie des projets d'infrastructure urbaine, des initiatives de développement durable et des programmes de logement social mis en œuvre.

Les données présentées dans ce rapport sont basées sur des études rigoureuses et des évaluations de terrain menées par nos équipes techniques.`,
  type: 'report',
  category: 'Rapports annuels',
  file_url: '/documents/rapport-annuel-2024.pdf',
  file_size: 5242880, // 5 MB
  file_type: 'PDF',
  cover_image_url: null,
  language: 'fr',
  tags: ['rapport annuel', 'bilan', '2024', 'urbanisme', 'développement'],
  year: 2024,
  author: 'Direction de la Planification',
  department: 'MUCTAT',
  is_featured: true,
  is_downloadable: true,
  download_count: 342,
  views: 1256,
  status: 'published',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}