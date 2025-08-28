'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Cookie, Database, Lock, Eye, UserCheck, AlertCircle, Mail } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useI18n } from '@/lib/i18n/context'

export default function PrivacyPage() {
  const { t } = useI18n()

  const sections = [
    {
      icon: Shield,
      title: 'Engagement de confidentialité',
      content: `
        Le Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires (MUCTAT) s'engage à protéger la vie privée des utilisateurs de son site web.<br/><br/>
        
        Cette politique de confidentialité explique comment nous collectons, utilisons, conservons et protégeons vos informations personnelles conformément à la loi n° 2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel au Sénégal.
      `
    },
    {
      icon: Database,
      title: 'Données collectées',
      content: `
        <strong>1. Données collectées automatiquement :</strong><br/>
        - Adresse IP<br/>
        - Type de navigateur et système d'exploitation<br/>
        - Pages visitées et durée de visite<br/>
        - Date et heure de connexion<br/>
        - Source de référencement<br/><br/>
        
        <strong>2. Données fournies volontairement :</strong><br/>
        - Nom et prénom<br/>
        - Adresse email<br/>
        - Numéro de téléphone<br/>
        - Adresse postale<br/>
        - Informations professionnelles (pour les appels d'offres)<br/>
        - Messages et demandes via les formulaires de contact
      `
    },
    {
      icon: Eye,
      title: 'Utilisation des données',
      content: `
        Les données collectées sont utilisées pour :<br/><br/>
        
        <strong>• Services et fonctionnalités :</strong><br/>
        - Répondre à vos demandes et questions<br/>
        - Traiter vos candidatures et soumissions<br/>
        - Vous envoyer des informations sur nos services<br/>
        - Gérer votre inscription à la newsletter<br/><br/>
        
        <strong>• Amélioration du site :</strong><br/>
        - Analyser l'utilisation du site<br/>
        - Améliorer nos contenus et services<br/>
        - Personnaliser votre expérience<br/><br/>
        
        <strong>• Obligations légales :</strong><br/>
        - Respecter nos obligations légales<br/>
        - Prévenir les fraudes et abus<br/>
        - Assurer la sécurité du site
      `
    },
    {
      icon: Lock,
      title: 'Protection et sécurité',
      content: `
        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :<br/><br/>
        
        • <strong>Sécurité technique :</strong> Chiffrement SSL, pare-feu, sauvegardes régulières<br/>
        • <strong>Accès limité :</strong> Seuls les agents autorisés ont accès aux données<br/>
        • <strong>Formation :</strong> Notre personnel est formé à la protection des données<br/>
        • <strong>Audits :</strong> Contrôles réguliers de nos systèmes de sécurité<br/><br/>
        
        Malgré ces mesures, aucune transmission de données sur Internet n'est totalement sécurisée. Nous ne pouvons garantir la sécurité absolue des informations transmises.
      `
    },
    {
      icon: UserCheck,
      title: 'Vos droits',
      content: `
        Conformément à la législation en vigueur, vous disposez des droits suivants :<br/><br/>
        
        • <strong>Droit d'accès :</strong> Obtenir la confirmation que vos données sont traitées et accéder à ces données<br/>
        • <strong>Droit de rectification :</strong> Corriger les données inexactes ou incomplètes<br/>
        • <strong>Droit à l'effacement :</strong> Demander la suppression de vos données<br/>
        • <strong>Droit à la limitation :</strong> Limiter le traitement de vos données<br/>
        • <strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données<br/>
        • <strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré<br/><br/>
        
        Pour exercer ces droits, contactez notre Délégué à la Protection des Données :<br/>
        Email : dpo@muctat.sn<br/>
        Courrier : DPO - MUCTAT, BP 4002 Dakar, Sénégal
      `
    },
    {
      icon: Cookie,
      title: 'Cookies',
      content: `
        Notre site utilise des cookies pour améliorer votre expérience :<br/><br/>
        
        <strong>• Cookies essentiels :</strong> Nécessaires au fonctionnement du site<br/>
        <strong>• Cookies de performance :</strong> Analysent l'utilisation du site (Google Analytics)<br/>
        <strong>• Cookies de fonctionnalité :</strong> Mémorisent vos préférences<br/><br/>
        
        Vous pouvez gérer les cookies via les paramètres de votre navigateur. La désactivation de certains cookies peut affecter votre expérience sur le site.<br/><br/>
        
        <strong>Comment gérer les cookies :</strong><br/>
        • Chrome : Paramètres > Confidentialité et sécurité > Cookies<br/>
        • Firefox : Options > Vie privée et sécurité > Cookies<br/>
        • Safari : Préférences > Confidentialité > Cookies<br/>
        • Edge : Paramètres > Confidentialité > Cookies
      `
    },
    {
      icon: AlertCircle,
      title: 'Partage des données',
      content: `
        Nous ne vendons, ne louons ni n'échangeons vos données personnelles. Vos données peuvent être partagées uniquement dans les cas suivants :<br/><br/>
        
        • <strong>Services gouvernementaux :</strong> Autres ministères et agences dans le cadre de nos missions<br/>
        • <strong>Prestataires :</strong> Fournisseurs de services techniques (hébergement, maintenance)<br/>
        • <strong>Obligations légales :</strong> Autorités judiciaires sur demande légale<br/>
        • <strong>Protection :</strong> Pour protéger nos droits et la sécurité des utilisateurs<br/><br/>
        
        Tous nos partenaires sont tenus de respecter la confidentialité de vos données.
      `
    },
    {
      icon: Mail,
      title: 'Contact et réclamations',
      content: `
        Pour toute question concernant cette politique ou pour exercer vos droits :<br/><br/>
        
        <strong>Délégué à la Protection des Données (DPO)</strong><br/>
        Email : dpo@muctat.sn<br/>
        Téléphone : +221 33 889 25 00<br/>
        Adresse : MUCTAT - Service DPO, BP 4002 Dakar, Sénégal<br/><br/>
        
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de la Commission de Protection des Données Personnelles (CDP) :<br/>
        Site web : www.cdp.sn<br/>
        Email : contact@cdp.sn
      `
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-lg opacity-90">
            Protection de vos données personnelles
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}<br/>
              Cette politique peut être mise à jour périodiquement. Nous vous encourageons à la consulter régulièrement.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Content */}
      <section className="pb-12">
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

          {/* Summary Card */}
          <Card className="mt-8 bg-senegal-green-50 border-senegal-green-200">
            <CardHeader>
              <CardTitle className="text-senegal-green-900">
                Résumé de nos engagements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-senegal-green-800">
                <li className="flex items-start gap-2">
                  <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Nous protégeons vos données personnelles conformément à la loi</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Nous utilisons des mesures de sécurité avancées</span>
                </li>
                <li className="flex items-start gap-2">
                  <UserCheck className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Vous gardez le contrôle sur vos données</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Nous sommes transparents sur l'utilisation de vos données</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}