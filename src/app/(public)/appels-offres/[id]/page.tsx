'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Calendar, 
  Download, 
  Clock,
  DollarSign,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Share2,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  FileDown
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function TenderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [tender, setTender] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (params.id) {
      loadTender()
    }
  }, [params.id])

  const loadTender = async () => {
    try {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setTender(data)

      // Incrémenter les vues
      await supabase
        .from('tenders')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', params.id)
    } catch (error) {
      console.error('Error loading tender:', error)
      toast.error('Erreur lors du chargement de l\'appel d\'offre')
      router.push('/appels-offres')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (doc: any) => {
    setDownloading(true)
    try {
      // Simuler le téléchargement
      window.open(doc.url, '_blank')
      toast.success('Téléchargement démarré')
    } catch (error) {
      toast.error('Erreur lors du téléchargement')
    } finally {
      setDownloading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tender.title,
        text: tender.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Lien copié dans le presse-papiers')
    }
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

  if (!tender) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700'
      case 'closed': return 'bg-red-100 text-red-700'
      case 'awarded': return 'bg-blue-100 text-blue-700'
      case 'cancelled': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Ouvert'
      case 'closed': return 'Fermé'
      case 'awarded': return 'Attribué'
      case 'cancelled': return 'Annulé'
      default: return status
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (days < 0) return { text: 'Expiré', urgent: false }
    if (days === 0) return { text: 'Aujourd\'hui', urgent: true }
    if (days === 1) return { text: '1 jour restant', urgent: true }
    if (days <= 7) return { text: `${days} jours restants`, urgent: true }
    return { text: `${days} jours restants`, urgent: false }
  }

  const deadline = getDaysRemaining(tender.submission_deadline)

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
            <Link href="/appels-offres" className="text-gray-600 hover:text-gray-900">
              Appels d'offres
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{tender.reference}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/appels-offres">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux appels d'offres
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className={getStatusColor(tender.status)} variant="secondary">
                    {getStatusLabel(tender.status)}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-2xl">
                  {tender.title}
                </CardTitle>
                <CardDescription>
                  Référence: {tender.reference}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="description" className="mt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="requirements">Exigences</TabsTrigger>
                    <TabsTrigger value="evaluation">Évaluation</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="mt-6">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold mb-4">Description détaillée</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">
                        {tender.description}
                      </p>
                      
                      {tender.category && (
                        <>
                          <h3 className="text-lg font-semibold mt-6 mb-4">Catégorie</h3>
                          <p className="text-gray-600">{tender.category}</p>
                        </>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="requirements" className="mt-6">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold mb-4">Exigences techniques</h3>
                      {tender.requirements && tender.requirements.length > 0 ? (
                        <ul className="space-y-2">
                          {tender.requirements.map((req: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{req}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Aucune exigence spécifique mentionnée</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="evaluation" className="mt-6">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold mb-4">Critères d'évaluation</h3>
                      {tender.evaluation_criteria ? (
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {tender.evaluation_criteria}
                        </p>
                      ) : (
                        <p className="text-gray-500">Les critères d'évaluation seront communiqués ultérieurement</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Documents */}
                {tender.documents && tender.documents.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Documents à télécharger</h3>
                    <div className="space-y-2">
                      {tender.documents.map((doc: any, index: number) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-senegal-green-600" />
                                <div>
                                  <p className="font-medium">{doc.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {doc.size ? `${(doc.size / 1024).toFixed(2)} KB` : 'Taille inconnue'}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(doc)}
                                disabled={downloading}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attribution Info */}
                {tender.status === 'awarded' && tender.winner_company && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-blue-900">
                      Marché attribué
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-blue-700">
                        <span className="font-medium">Entreprise:</span> {tender.winner_company}
                      </p>
                      {tender.award_date && (
                        <p className="text-blue-700">
                          <span className="font-medium">Date d'attribution:</span> {formatDate(tender.award_date)}
                        </p>
                      )}
                      {tender.award_amount && (
                        <p className="text-blue-700">
                          <span className="font-medium">Montant:</span> {tender.award_amount.toLocaleString()} FCFA
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Deadline */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">Date limite</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(tender.submission_deadline)}
                  </p>
                  {tender.status === 'open' && (
                    <div className={`mt-2 flex items-center gap-2 ${deadline.urgent ? 'text-red-600' : 'text-green-600'}`}>
                      {deadline.urgent ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">{deadline.text}</span>
                    </div>
                  )}
                </div>

                {/* Budget */}
                {(tender.budget_min || tender.budget_max) && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">Budget estimé</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {tender.budget_min && tender.budget_max ? (
                        <>
                          {tender.budget_min.toLocaleString()} - {tender.budget_max.toLocaleString()} {tender.currency || 'FCFA'}
                        </>
                      ) : tender.budget_min ? (
                        <>Min: {tender.budget_min.toLocaleString()} {tender.currency || 'FCFA'}</>
                      ) : tender.budget_max ? (
                        <>Max: {tender.budget_max.toLocaleString()} {tender.currency || 'FCFA'}</>
                      ) : (
                        'Non spécifié'
                      )}
                    </p>
                  </div>
                )}

                {/* Opening Date */}
                {tender.opening_date && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileDown className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">Ouverture des plis</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(tender.opening_date)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tender.contact_person && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{tender.contact_person}</span>
                  </div>
                )}
                {tender.contact_email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${tender.contact_email}`} className="text-sm text-blue-600 hover:underline">
                      {tender.contact_email}
                    </a>
                  </div>
                )}
                {tender.contact_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${tender.contact_phone}`} className="text-sm text-blue-600 hover:underline">
                      {tender.contact_phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Apply CTA */}
            {tender.status === 'open' && (
              <Card className="bg-senegal-green-50 border-senegal-green-200">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Intéressé par cet appel d'offre ?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Préparez votre dossier de candidature avant la date limite
                  </p>
                  <Button className="w-full bg-senegal-green-600 hover:bg-senegal-green-700">
                    Guide de soumission
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}