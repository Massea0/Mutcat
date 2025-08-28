'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Search,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  FileText,
  Building,
  Users,
  Shield,
  CreditCard,
  MapPin,
  Clock,
  Phone,
  Mail
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const categories = [
  { id: 'general', label: 'Général', icon: HelpCircle },
  { id: 'services', label: 'Services', icon: FileText },
  { id: 'projets', label: 'Projets', icon: Building },
  { id: 'procedures', label: 'Procédures', icon: Shield },
  { id: 'paiements', label: 'Paiements', icon: CreditCard },
  { id: 'contact', label: 'Contact', icon: Phone }
]

// FAQs par défaut si pas de données dans la DB
const defaultFaqs = {
  general: [
    {
      question: "Quelles sont les missions du MUCTAT ?",
      answer: "Le Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires a pour mission principale de concevoir et mettre en œuvre la politique nationale en matière d'urbanisme, d'aménagement du territoire et de développement des collectivités territoriales."
    },
    {
      question: "Comment puis-je accéder aux services en ligne ?",
      answer: "Tous nos services en ligne sont accessibles depuis la section 'Services' de notre site web. Vous pouvez y effectuer vos demandes, télécharger des formulaires et suivre l'état de vos dossiers 24h/24 et 7j/7."
    },
    {
      question: "Quels sont les horaires d'ouverture du ministère ?",
      answer: "Le ministère est ouvert du lundi au vendredi de 8h00 à 17h00. Les services en ligne sont disponibles 24h/24 et 7j/7."
    }
  ],
  services: [
    {
      question: "Comment obtenir un permis de construire ?",
      answer: "Pour obtenir un permis de construire, vous devez : 1) Constituer un dossier avec les plans et documents requis, 2) Déposer votre demande en ligne ou au guichet, 3) Payer les frais de dossier, 4) Attendre l'instruction (délai moyen: 30 jours), 5) Récupérer votre permis une fois approuvé."
    },
    {
      question: "Où puis-je télécharger les formulaires administratifs ?",
      answer: "Tous les formulaires sont disponibles dans la section 'Publications' de notre site. Vous pouvez les télécharger gratuitement au format PDF. Certains formulaires peuvent également être remplis en ligne."
    },
    {
      question: "Comment suivre l'état de ma demande ?",
      answer: "Vous pouvez suivre l'état de votre demande en ligne avec votre numéro de dossier. Connectez-vous à votre espace personnel ou utilisez le service de suivi rapide disponible sur notre site."
    }
  ],
  projets: [
    {
      question: "Comment participer aux appels d'offres ?",
      answer: "Pour participer aux appels d'offres : 1) Consultez régulièrement la section 'Appels d'offres', 2) Téléchargez le dossier d'appel d'offres, 3) Préparez votre dossier de candidature selon les exigences, 4) Déposez votre offre avant la date limite, 5) Suivez les résultats de l'évaluation."
    },
    {
      question: "Quels sont les critères de sélection des projets ?",
      answer: "Les critères incluent : la conformité technique, la capacité financière, l'expérience dans des projets similaires, le respect des normes environnementales, et le rapport qualité-prix. Les critères spécifiques sont détaillés dans chaque appel d'offres."
    },
    {
      question: "Comment proposer un projet au ministère ?",
      answer: "Vous pouvez soumettre vos propositions de projets via le formulaire de contact ou lors des consultations publiques. Assurez-vous que votre projet s'aligne avec les priorités nationales et incluez une étude de faisabilité."
    }
  ],
  procedures: [
    {
      question: "Quels documents sont nécessaires pour une demande de certificat d'urbanisme ?",
      answer: "Les documents requis sont : 1) Formulaire de demande rempli, 2) Plan de situation, 3) Plan cadastral, 4) Titre de propriété ou attestation, 5) Quittance de paiement des frais, 6) Photocopie de la pièce d'identité."
    },
    {
      question: "Quel est le délai de traitement des demandes ?",
      answer: "Les délais varient selon le type de demande : Certificat d'urbanisme (15 jours), Permis de construire (30 jours), Autorisation de lotir (45 jours), Certificat de conformité (20 jours). Ces délais peuvent varier selon la complexité du dossier."
    },
    {
      question: "Comment faire une réclamation ?",
      answer: "Pour faire une réclamation : 1) Utilisez le formulaire de réclamation en ligne, 2) Ou envoyez un courrier au service concerné, 3) Ou prenez rendez-vous pour un entretien. Conservez votre numéro de réclamation pour le suivi."
    }
  ],
  paiements: [
    {
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons : les paiements en espèces au guichet, les virements bancaires, les chèques certifiés, et prochainement les paiements mobiles (Orange Money, Wave). Les détails bancaires sont fournis lors de la validation de votre demande."
    },
    {
      question: "Comment obtenir une quittance de paiement ?",
      answer: "La quittance est délivrée immédiatement pour les paiements au guichet. Pour les virements, elle est disponible sous 48h après confirmation du paiement. Vous pouvez la télécharger depuis votre espace personnel."
    },
    {
      question: "Quels sont les tarifs des différents services ?",
      answer: "Les tarifs varient selon les services : Certificat d'urbanisme (10.000 FCFA), Permis de construire (selon la surface), Autorisation de lotir (selon la superficie). Une grille tarifaire complète est disponible dans la section 'Services'."
    }
  ],
  contact: [
    {
      question: "Comment contacter le ministère ?",
      answer: "Vous pouvez nous contacter par : Téléphone (+221 33 889 00 00), Email (contact@muctat.sn), Courrier (Avenue Léopold Sédar Senghor, Dakar), ou via le formulaire de contact sur notre site web."
    },
    {
      question: "Où sont situés les bureaux régionaux ?",
      answer: "Nous avons des représentations dans toutes les régions du Sénégal. Les adresses complètes sont disponibles dans la section 'Contact' de notre site, avec les horaires et contacts spécifiques de chaque bureau."
    },
    {
      question: "Comment prendre rendez-vous avec un responsable ?",
      answer: "Les rendez-vous peuvent être pris en ligne via notre système de réservation, par téléphone au secrétariat, ou en vous rendant directement à l'accueil. Prévoyez un délai de 5 à 10 jours ouvrables pour obtenir un rendez-vous."
    }
  ]
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('general')
  const [faqs, setFaqs] = useState<any>(defaultFaqs)
  const [helpful, setHelpful] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadFAQs()
  }, [])

  const loadFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error

      if (data && data.length > 0) {
        // Grouper les FAQs par catégorie
        const grouped = data.reduce((acc: any, faq: any) => {
          const category = faq.category || 'general'
          if (!acc[category]) acc[category] = []
          acc[category].push(faq)
          return acc
        }, {})
        setFaqs(grouped)
      }
    } catch (error) {
      console.error('Error loading FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleHelpful = async (faqId: string, isHelpful: boolean) => {
    setHelpful({ ...helpful, [faqId]: isHelpful })
    
    try {
      // Mettre à jour les stats dans la DB
      await supabase.rpc('increment_faq_helpful', {
        faq_id: faqId,
        is_helpful: isHelpful
      } as any)
      
      toast.success('Merci pour votre retour !')
    } catch (error) {
      console.error('Error updating helpful:', error)
    }
  }

  const filteredFaqs = faqs[activeCategory]?.filter((faq: any) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-4 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Foire Aux Questions
            </h1>
            <p className="text-xl text-white/90">
              Trouvez rapidement des réponses à vos questions les plus fréquentes
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher dans les FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Category Tabs */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                {categories.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id}>
                    <cat.icon className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{cat.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((cat) => (
                <TabsContent key={cat.id} value={cat.id}>
                  {filteredFaqs.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Aucune question trouvée</h3>
                        <p className="text-gray-600">
                          {searchTerm 
                            ? 'Essayez avec d\'autres mots-clés'
                            : 'Aucune FAQ dans cette catégorie pour le moment'}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Accordion type="single" collapsible className="space-y-4">
                      {filteredFaqs.map((faq: any, index: number) => (
                        <AccordionItem 
                          key={faq.id || index} 
                          value={`item-${index}`}
                          className="border rounded-lg px-4"
                        >
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-start gap-3 text-left">
                              <div className="p-1 bg-senegal-green-100 rounded-full mt-1">
                                <HelpCircle className="h-4 w-4 text-senegal-green-600" />
                              </div>
                              <span className="font-medium">{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-10 pt-2">
                              <p className="text-gray-600 whitespace-pre-wrap mb-4">
                                {faq.answer}
                              </p>
                              
                              {/* Helpful Section */}
                              <div className="flex items-center gap-4 pt-4 border-t">
                                <span className="text-sm text-gray-500">Cette réponse vous a-t-elle aidé ?</span>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleHelpful(faq.id || `${cat.id}-${index}`, true)}
                                    disabled={helpful[faq.id || `${cat.id}-${index}`] !== undefined}
                                    className={helpful[faq.id || `${cat.id}-${index}`] === true ? 'bg-green-50' : ''}
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    Oui
                                    {faq.helpful_yes && ` (${faq.helpful_yes})`}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleHelpful(faq.id || `${cat.id}-${index}`, false)}
                                    disabled={helpful[faq.id || `${cat.id}-${index}`] !== undefined}
                                    className={helpful[faq.id || `${cat.id}-${index}`] === false ? 'bg-red-50' : ''}
                                  >
                                    <ThumbsDown className="h-3 w-3 mr-1" />
                                    Non
                                    {faq.helpful_no && ` (${faq.helpful_no})`}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </TabsContent>
              ))}
            </Tabs>

            {/* Still Need Help */}
            <Card className="mt-12 bg-gradient-to-r from-senegal-green-50 to-senegal-yellow-50">
              <CardHeader className="text-center">
                <MessageCircle className="h-12 w-12 text-senegal-green-600 mx-auto mb-4" />
                <CardTitle className="text-2xl">Vous n'avez pas trouvé votre réponse ?</CardTitle>
                <CardDescription className="text-base">
                  Notre équipe est là pour vous aider. N'hésitez pas à nous contacter directement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <Card>
                    <CardContent className="p-4">
                      <Phone className="h-8 w-8 text-senegal-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Par téléphone</h3>
                      <p className="text-sm text-gray-600 mb-2">Du lundi au vendredi, 8h-17h</p>
                      <a href="tel:+221338890000" className="text-senegal-green-600 font-medium">
                        +221 33 889 00 00
                      </a>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <Mail className="h-8 w-8 text-senegal-yellow-600 mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Par email</h3>
                      <p className="text-sm text-gray-600 mb-2">Réponse sous 48h</p>
                      <a href="mailto:contact@muctat.sn" className="text-senegal-yellow-600 font-medium">
                        contact@muctat.sn
                      </a>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <MessageCircle className="h-8 w-8 text-senegal-red-600 mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Formulaire</h3>
                      <p className="text-sm text-gray-600 mb-2">Envoyez-nous un message</p>
                      <Link href="/contact" className="text-senegal-red-600 font-medium">
                        Accéder au formulaire
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}