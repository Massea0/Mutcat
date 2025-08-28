'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Accessibility, 
  Eye, 
  Ear, 
  Hand, 
  Brain,
  Keyboard,
  Monitor,
  Smartphone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Volume2,
  ZoomIn,
  Type,
  Palette
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AccessibilityFeature {
  icon: any;
  title: string;
  description: string;
  status: 'available' | 'partial' | 'planned';
  details?: string[];
}

const features: AccessibilityFeature[] = [
  {
    icon: Eye,
    title: 'Accessibilité visuelle',
    description: 'Adaptations pour les personnes malvoyantes ou non-voyantes',
    status: 'available',
    details: [
      'Compatibilité avec les lecteurs d\'écran (NVDA, JAWS)',
      'Textes alternatifs pour toutes les images',
      'Contraste élevé entre texte et arrière-plan',
      'Possibilité d\'agrandir le texte jusqu\'à 200%'
    ]
  },
  {
    icon: Ear,
    title: 'Accessibilité auditive',
    description: 'Adaptations pour les personnes malentendantes ou sourdes',
    status: 'partial',
    details: [
      'Sous-titres pour les vidéos',
      'Transcriptions textuelles disponibles',
      'Alertes visuelles pour les notifications'
    ]
  },
  {
    icon: Hand,
    title: 'Accessibilité motrice',
    description: 'Navigation facilitée pour les personnes à mobilité réduite',
    status: 'available',
    details: [
      'Navigation complète au clavier',
      'Zones cliquables suffisamment grandes',
      'Temps de réponse ajustable',
      'Pas de mouvements automatiques gênants'
    ]
  },
  {
    icon: Brain,
    title: 'Accessibilité cognitive',
    description: 'Simplification pour les personnes avec troubles cognitifs',
    status: 'partial',
    details: [
      'Langage simple et clair',
      'Structure logique et cohérente',
      'Instructions explicites',
      'Mode de lecture simplifié disponible'
    ]
  }
];

const shortcuts = [
  { keys: 'Alt + 1', action: 'Aller à l\'accueil' },
  { keys: 'Alt + 2', action: 'Aller au menu principal' },
  { keys: 'Alt + 3', action: 'Aller au contenu principal' },
  { keys: 'Alt + 4', action: 'Aller à la recherche' },
  { keys: 'Alt + 0', action: 'Page d\'accessibilité' },
  { keys: 'Tab', action: 'Naviguer entre les éléments' },
  { keys: 'Entrée', action: 'Activer un élément' },
  { keys: 'Échap', action: 'Fermer les fenêtres modales' }
];

const statusColors = {
  available: 'bg-green-100 text-green-800',
  partial: 'bg-yellow-100 text-yellow-800',
  planned: 'bg-gray-100 text-gray-800'
};

const statusIcons = {
  available: CheckCircle,
  partial: AlertCircle,
  planned: XCircle
};

const statusLabels = {
  available: 'Disponible',
  partial: 'Partiel',
  planned: 'Prévu'
};

export default function AccessibilitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Accessibility className="h-10 w-10" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Accessibilité
              </h1>
            </div>
            <p className="text-xl opacity-90">
              Notre engagement pour un site accessible à tous
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Notre engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 mb-4">
                Le Ministère de l'Urbanisme, du Cadre de Vie et de l'Aménagement du Territoire 
                s'engage à rendre son site web accessible à tous les citoyens, y compris les 
                personnes en situation de handicap.
              </p>
              <p className="text-lg text-gray-700">
                Nous nous efforçons de respecter les standards internationaux d'accessibilité 
                web (WCAG 2.1 niveau AA) pour garantir une expérience utilisateur optimale 
                pour tous.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Fonctionnalités d'accessibilité
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const StatusIcon = statusIcons[feature.status];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Icon className="h-8 w-8 text-primary" />
                        <Badge className={statusColors[feature.status]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusLabels[feature.status]}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    {feature.details && (
                      <CardContent>
                        <ul className="space-y-2">
                          {feature.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Accessibility Tools */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Outils d'accessibilité
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Personnalisez votre expérience</CardTitle>
                <CardDescription>
                  Utilisez ces outils pour adapter l'affichage selon vos besoins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <ZoomIn className="h-6 w-6" />
                    <span className="text-sm">Agrandir le texte</span>
                    <kbd className="text-xs bg-gray-100 px-2 py-1 rounded">Ctrl + +</kbd>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Palette className="h-6 w-6" />
                    <span className="text-sm">Contraste élevé</span>
                    <kbd className="text-xs bg-gray-100 px-2 py-1 rounded">Alt + C</kbd>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Type className="h-6 w-6" />
                    <span className="text-sm">Police dyslexie</span>
                    <kbd className="text-xs bg-gray-100 px-2 py-1 rounded">Alt + D</kbd>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Volume2 className="h-6 w-6" />
                    <span className="text-sm">Lecture audio</span>
                    <kbd className="text-xs bg-gray-100 px-2 py-1 rounded">Alt + R</kbd>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Raccourcis clavier
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <span className="text-gray-700">{shortcut.action}</span>
                      <kbd className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                        {shortcut.keys}
                      </kbd>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testing & Compliance */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-6 w-6 text-primary" />
                  <CardTitle>Tests et conformité</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Standards respectés</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>WCAG 2.1 (Web Content Accessibility Guidelines) - Niveau AA</li>
                      <li>Section 508 (États-Unis)</li>
                      <li>EN 301 549 (Union Européenne)</li>
                      <li>RGAA 4.1 (Référentiel Général d'Amélioration de l'Accessibilité)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Tests réguliers</h3>
                    <p className="text-gray-600">
                      Notre site est régulièrement testé avec les outils suivants :
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
                      <li>WAVE (Web Accessibility Evaluation Tool)</li>
                      <li>axe DevTools</li>
                      <li>Tests manuels avec lecteurs d'écran</li>
                      <li>Tests utilisateurs avec personnes en situation de handicap</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl">Besoin d'aide ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Si vous rencontrez des difficultés pour accéder à certaines parties de notre site 
                ou si vous avez des suggestions pour améliorer l'accessibilité, n'hésitez pas à 
                nous contacter.
              </p>
              
              <div className="space-y-2 mb-6">
                <p className="text-sm">
                  <strong>Email :</strong> accessibilite@muctat.gouv.sn
                </p>
                <p className="text-sm">
                  <strong>Téléphone :</strong> +221 33 123 45 67
                </p>
                <p className="text-sm">
                  <strong>Adresse :</strong> Building Administratif, Avenue Léopold Sédar Senghor, Dakar
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button asChild>
                  <a href="/contact">Nous contacter</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/faq">FAQ Accessibilité</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}