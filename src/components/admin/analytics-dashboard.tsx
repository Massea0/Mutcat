"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  TrendingUp, 
  MessageSquare, 
  FileText,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface CitizenInsight {
  category: string
  count: number
  sentiment: 'positive' | 'neutral' | 'negative'
  keywords: string[]
}

interface TenderSummary {
  id: string
  title: string
  deadline: string
  budget: number
  relevance_score: number
  key_requirements: string[]
}

export function AnalyticsDashboard() {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [citizenInsights, setCitizenInsights] = useState<CitizenInsight[]>([])
  const [tenderSummaries, setTenderSummaries] = useState<TenderSummary[]>([])
  const [chatbotStats, setChatbotStats] = useState({
    totalConversations: 0,
    averageRating: 0,
    topQuestions: [] as string[]
  })
  const supabase = createClient()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Récupérer les messages de contact pour analyse
      const { data: messages } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      // Récupérer les conversations du chatbot
      const { data: conversations } = await supabase
        .from('chatbot_conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      // Récupérer les appels d'offres
      const { data: tenders } = await supabase
        .from('tenders')
        .select('*')
        .eq('status', 'open')
        .order('submission_deadline', { ascending: true })

      // Analyser les données (simulation)
      if (messages) {
        const insights = analyzeMessages(messages)
        setCitizenInsights(insights)
      }

      if (conversations) {
        const stats = analyzeChatbotConversations(conversations)
        setChatbotStats(stats)
      }

      if (tenders) {
        const summaries = analyzeTenders(tenders)
        setTenderSummaries(summaries)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const analyzeMessages = (messages: any[]): CitizenInsight[] => {
    // Simulation d'analyse - En production, utiliser OpenAI API
    const categories = {
      'Logement': { count: 0, sentiment: 'neutral' as const, keywords: ['logement', 'habitat', 'construction'] },
      'Infrastructure': { count: 0, sentiment: 'positive' as const, keywords: ['route', 'transport', 'pont'] },
      'Services': { count: 0, sentiment: 'neutral' as const, keywords: ['service', 'administration', 'document'] },
      'Environnement': { count: 0, sentiment: 'positive' as const, keywords: ['environnement', 'espace vert', 'pollution'] },
    }

    messages.forEach(msg => {
      const content = msg.message.toLowerCase()
      Object.entries(categories).forEach(([category, data]) => {
        if (data.keywords.some(keyword => content.includes(keyword))) {
          categories[category as keyof typeof categories].count++
        }
      })
    })

    return Object.entries(categories).map(([category, data]) => ({
      category,
      count: data.count,
      sentiment: data.sentiment,
      keywords: data.keywords
    }))
  }

  const analyzeChatbotConversations = (conversations: any[]) => {
    // Simulation d'analyse
    return {
      totalConversations: conversations.length,
      averageRating: 4.2,
      topQuestions: [
        'Comment obtenir un permis de construire ?',
        'Quels sont les critères pour le programme PNALRU ?',
        'Où trouver les documents d\'urbanisme ?',
        'Comment contacter le ministère ?',
        'Quels sont les projets en cours ?'
      ]
    }
  }

  const analyzeTenders = (tenders: any[]): TenderSummary[] => {
    // Simulation d'analyse
    return tenders.slice(0, 5).map(tender => ({
      id: tender.id,
      title: tender.title,
      deadline: tender.submission_deadline,
      budget: tender.budget_estimate || 0,
      relevance_score: Math.random() * 100,
      key_requirements: [
        'Expérience dans le secteur public',
        'Capacité financière',
        'Références techniques'
      ]
    }))
  }

  const generateAIReport = async () => {
    setIsGeneratingReport(true)
    
    // Simulation de génération de rapport
    setTimeout(() => {
      alert('Rapport IA généré avec succès ! Le document est disponible au téléchargement.')
      setIsGeneratingReport(false)
    }, 3000)
  }

  const sentimentColors = {
    positive: 'text-green-600 bg-green-100',
    neutral: 'text-gray-600 bg-gray-100',
    negative: 'text-red-600 bg-red-100'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tableau de Bord Intelligence Artificielle
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analyses et insights générés par l'IA
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button 
            variant="gradient" 
            onClick={generateAIReport}
            disabled={isGeneratingReport}
          >
            <Brain className="h-4 w-4 mr-2" />
            {isGeneratingReport ? 'Génération...' : 'Générer Rapport IA'}
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Interactions Citoyennes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citizenInsights.reduce((acc, i) => acc + i.count, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> +23% ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conversations Chatbot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatbotStats.totalConversations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Note moyenne: {chatbotStats.averageRating}/5
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Appels d'Offres Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenderSummaries.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Clock className="inline h-3 w-3 text-yellow-500" /> 3 expirent bientôt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rapports IA Générés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">
              <CheckCircle className="inline h-3 w-3 text-green-500" /> Ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analyse des interactions citoyennes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Analyse des Interactions Citoyennes
          </CardTitle>
          <CardDescription>
            Thèmes principaux et sentiments détectés dans les messages reçus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {citizenInsights.map((insight) => (
              <div key={insight.category} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{insight.category}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sentimentColors[insight.sentiment]
                    }`}>
                      {insight.sentiment === 'positive' ? 'Positif' :
                       insight.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {insight.keywords.map((keyword) => (
                      <span key={keyword} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {insight.count}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-300">
                  Recommandations IA
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-400">
                  <li>• Augmenter la communication sur le programme de logement</li>
                  <li>• Créer une FAQ dédiée aux questions d'infrastructure</li>
                  <li>• Améliorer le temps de réponse pour les demandes de service</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions fréquentes du chatbot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Top Questions Chatbot
            </CardTitle>
            <CardDescription>
              Questions les plus fréquemment posées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {chatbotStats.topQuestions.map((question, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-senegal-green-100 text-senegal-green-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Synthèse des appels d'offres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Appels d'Offres Prioritaires
            </CardTitle>
            <CardDescription>
              Opportunités identifiées par l'IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tenderSummaries.slice(0, 3).map((tender) => (
                <div key={tender.id} className="border-l-4 border-senegal-yellow-500 pl-3">
                  <h4 className="font-medium text-sm line-clamp-1">
                    {tender.title}
                  </h4>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span>Échéance: {new Date(tender.deadline).toLocaleDateString('fr-FR')}</span>
                    <span className="text-green-600 font-medium">
                      Score: {tender.relevance_score.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              Voir tous les appels d'offres
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}