"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare,
  Building,
  Globe,
  CheckCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const offices = [
  {
    name: 'Siège Principal',
    address: 'Building Administratif, Avenue Léopold Sédar Senghor',
    city: 'Dakar, Sénégal',
    phone: '+221 33 XXX XX XX',
    email: 'contact@muctat.sn',
    hours: 'Lun-Ven: 8h00 - 17h00'
  },
  {
    name: 'Direction de l\'Urbanisme',
    address: 'Immeuble Fahd, Rue 12 x Bourguiba',
    city: 'Dakar, Sénégal',
    phone: '+221 33 XXX XX XX',
    email: 'urbanisme@muctat.sn',
    hours: 'Lun-Ven: 8h00 - 17h00'
  },
  {
    name: 'Direction des Collectivités',
    address: 'Cité Administrative',
    city: 'Dakar, Sénégal',
    phone: '+221 33 XXX XX XX',
    email: 'collectivites@muctat.sn',
    hours: 'Lun-Ven: 8h00 - 17h00'
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          status: 'new'
        } as any)

      if (error) throw error

      setSubmitSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })

      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error('Error submitting contact form:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Nous sommes à votre écoute pour répondre à toutes vos questions concernant l'urbanisme et l'aménagement du territoire
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire de contact */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Envoyez-nous un message</CardTitle>
                  <CardDescription>
                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-300">
                          Message envoyé avec succès !
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                          Nous vous répondrons dans les 24-48 heures.
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-senegal-green-500 focus:border-senegal-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-senegal-green-500 focus:border-senegal-green-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-senegal-green-500 focus:border-senegal-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Sujet *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-senegal-green-500 focus:border-senegal-green-500"
                        >
                          <option value="">Sélectionnez un sujet</option>
                          <option value="information">Demande d'information</option>
                          <option value="permit">Permis de construire</option>
                          <option value="complaint">Réclamation</option>
                          <option value="suggestion">Suggestion</option>
                          <option value="partnership">Partenariat</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-senegal-green-500 focus:border-senegal-green-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      variant="gradient"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        'Envoi en cours...'
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Informations de contact */}
            <div className="space-y-6">
              {/* Carte principale */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-senegal-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Adresse principale</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Building Administratif<br />
                        Avenue Léopold Sédar Senghor<br />
                        Dakar, Sénégal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-senegal-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        +221 33 XXX XX XX<br />
                        +221 77 XXX XX XX (Mobile)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-senegal-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        contact@muctat.sn<br />
                        info@muctat.sn
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-senegal-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Heures d'ouverture</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Lundi - Vendredi: 8h00 - 17h00<br />
                        Samedi: 9h00 - 13h00<br />
                        Dimanche: Fermé
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liens rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Liens utiles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="#" className="flex items-center gap-2 text-senegal-green-600 hover:text-senegal-green-700">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">FAQ</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 text-senegal-green-600 hover:text-senegal-green-700">
                    <Building className="h-4 w-4" />
                    <span className="text-sm font-medium">Nos bureaux</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 text-senegal-green-600 hover:text-senegal-green-700">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">Réseaux sociaux</span>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bureaux régionaux */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nos Bureaux
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Retrouvez-nous dans nos différentes directions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{office.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="inline h-4 w-4 mr-1 text-senegal-green-500" />
                    {office.address}<br />{office.city}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="inline h-4 w-4 mr-1 text-senegal-green-500" />
                    {office.phone}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="inline h-4 w-4 mr-1 text-senegal-green-500" />
                    {office.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="inline h-4 w-4 mr-1 text-senegal-green-500" />
                    {office.hours}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}