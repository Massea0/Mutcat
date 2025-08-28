'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Building, User, Mail, Phone, Globe, FileText, Scale } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export default function LegalPage() {
  const { t } = useI18n()

  const sections = [
    {
      icon: Building,
      title: 'Éditeur du site',
      content: `
        <strong>Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires (MUCTAT)</strong><br/>
        République du Sénégal<br/>
        Building Administratif, Avenue Léopold Sédar Senghor<br/>
        BP 4002 - Dakar, Sénégal<br/>
        Téléphone : +221 33 889 25 00<br/>
        Email : contact@muctat.sn
      `
    },
    {
      icon: User,
      title: 'Directeur de publication',
      content: `
        Le Ministre de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires
      `
    },
    {
      icon: Globe,
      title: 'Hébergement',
      content: `
        Ce site est hébergé par l'Agence de l'Informatique de l'État (ADIE)<br/>
        Route des Almadies, Dakar<br/>
        Sénégal<br/>
        Téléphone : +221 33 869 03 03
      `
    },
    {
      icon: FileText,
      title: 'Propriété intellectuelle',
      content: `
        L'ensemble de ce site relève de la législation sénégalaise et internationale sur le droit d'auteur et la propriété intellectuelle.<br/><br/>
        
        Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.<br/><br/>
        
        La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de publication.<br/><br/>
        
        Les marques citées sur ce site sont déposées par les sociétés qui en sont propriétaires.
      `
    },
    {
      icon: Shield,
      title: 'Protection des données personnelles',
      content: `
        Conformément à la loi n° 2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel, vous disposez d'un droit d'accès, de modification, de rectification et de suppression des données qui vous concernent.<br/><br/>
        
        Pour exercer ce droit, vous pouvez nous contacter :<br/>
        - Par courrier : MUCTAT - Service Communication, BP 4002 Dakar<br/>
        - Par email : dpo@muctat.sn<br/><br/>
        
        Les informations recueillies font l'objet d'un traitement informatique destiné à la gestion de nos services. Les destinataires des données sont les services internes du ministère.
      `
    },
    {
      icon: Scale,
      title: 'Responsabilité',
      content: `
        Les informations proposées sur ce site sont fournies à titre indicatif. Malgré tout le soin apporté à l'actualisation des textes officiels et à la vérification des contenus, les documents mis en ligne ne sauraient engager la responsabilité du MUCTAT.<br/><br/>
        
        Le MUCTAT décline toute responsabilité :<br/>
        - Pour toute interruption du site<br/>
        - En cas de survenance de bogues, virus ou erreurs<br/>
        - Pour toute inexactitude ou omission portant sur des informations disponibles sur le site<br/>
        - Pour tous dommages résultant d'une intrusion frauduleuse<br/>
        - Plus généralement de tout dommage direct ou indirect
      `
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Mentions Légales
          </h1>
          <p className="text-lg opacity-90">
            Informations légales et conditions d'utilisation du site
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-senegal-green-600" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose prose-gray max-w-none"
                      dangerouslySetInnerHTML={{ __html: section.content.trim() }}
                    />
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Additional Information */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Crédits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800">
                Conception et développement : Direction des Systèmes d'Information du MUCTAT<br/>
                Design graphique : Service Communication<br/>
                Photographies : © MUCTAT - Tous droits réservés<br/>
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}