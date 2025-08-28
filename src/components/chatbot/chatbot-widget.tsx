"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'
// import { generateSessionId } from '@/lib/utils'

// Fonction pour générer un ID de session
function generateSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
  timestamp: Date
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: 'Bonjour ! Je suis l\'assistant virtuel du MUCTAT. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(generateSessionId())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulation de réponse du bot - à remplacer par l'appel API réel
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: getBotResponse(inputValue),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsLoading(false)
    }, 1000)
  }

  // Fonction temporaire pour simuler les réponses du bot
  const getBotResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes('logement') || lowerQuestion.includes('pnalru')) {
      return 'Le Programme National d\'Accès au Logement et de Rénovation Urbaine (PNALRU) vise à construire 500 000 logements sur 15 ans. Pour plus d\'informations sur les critères d\'éligibilité et les modalités d\'inscription, consultez la section Projets de notre site.'
    }
    
    if (lowerQuestion.includes('permis') || lowerQuestion.includes('construire')) {
      return 'Pour obtenir un permis de construire, vous devez soumettre votre dossier via notre plateforme en ligne. Les documents requis incluent : plan de situation, plan de masse, plans architecturaux, et titre de propriété. Le délai de traitement est généralement de 30 jours.'
    }
    
    if (lowerQuestion.includes('contact') || lowerQuestion.includes('rendez-vous')) {
      return 'Vous pouvez nous contacter au +221 33 XXX XX XX ou par email à contact@muctat.sn. Pour prendre rendez-vous, utilisez notre système de réservation en ligne dans la section Services.'
    }
    
    if (lowerQuestion.includes('ministre')) {
      return 'Le Ministre de l\'Urbanisme, des Collectivités Territoriales et de l\'Aménagement des Territoires est M. Balla Moussa FOFANA. Il dirige le ministère dans la mise en œuvre de la Vision Sénégal 2050.'
    }
    
    return 'Je comprends votre question. Pour obtenir une réponse plus précise, je vous invite à consulter notre FAQ ou à contacter directement nos services. Puis-je vous aider avec autre chose ?'
  }

  return (
    <>
      {/* Bouton flottant */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            size="icon"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500 shadow-lg hover:shadow-xl hover:scale-110 transition-all"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        )}
      </div>

      {/* Fenêtre de chat */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] flex flex-col shadow-2xl animate-fade-up">
          {/* En-tête */}
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Assistant MUCTAT</h3>
                <p className="text-xs text-white/80">En ligne</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Zone de messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] items-start space-x-2 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    message.role === 'user'
                      ? 'bg-senegal-green-500'
                      : 'bg-gradient-to-br from-senegal-green-500 to-senegal-yellow-500'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-senegal-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 rounded-2xl bg-gray-100 dark:bg-gray-800 px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-senegal-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    L'assistant réfléchit...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tapez votre message..."
                className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm focus:border-senegal-green-500 focus:outline-none focus:ring-2 focus:ring-senegal-green-500/20"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={!inputValue.trim() || isLoading}
                className="bg-senegal-green-500 hover:bg-senegal-green-600"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Alimenté par l'IA • Disponible 24/7
            </p>
          </div>
        </Card>
      )}
    </>
  )
}