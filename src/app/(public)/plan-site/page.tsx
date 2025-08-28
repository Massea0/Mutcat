'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Map, 
  ChevronRight, 
  Home,
  Building,
  Briefcase,
  FileText,
  Users,
  Globe,
  Camera,
  Phone,
  Shield,
  Info,
  Calendar,
  Search,
  Settings,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface SiteSection {
  title: string;
  icon: any;
  links: {
    label: string;
    href: string;
    badge?: string;
  }[];
}

const siteSections: SiteSection[] = [
  {
    title: 'Accueil',
    icon: Home,
    links: [
      { label: 'Page d\'accueil', href: '/' },
      { label: 'Actualités', href: '/actualites' },
      { label: 'Projets en vedette', href: '/projets' }
    ]
  },
  {
    title: 'Le Ministère',
    icon: Building,
    links: [
      { label: 'Missions et Objectifs', href: '/ministere/missions' },
      { label: 'Le Ministre', href: '/ministere/ministre' },
      { label: 'Directions et Services', href: '/ministere/directions' },
      { label: 'Organigramme', href: '/ministere/organigramme' },
      { label: 'Historique', href: '/ministere/historique' },
      { label: 'Agenda du Ministre', href: '/agenda' }
    ]
  },
  {
    title: 'Projets et Réalisations',
    icon: Briefcase,
    links: [
      { label: 'Tous les projets', href: '/projets' },
      { label: 'Carte interactive', href: '/projets/carte' },
      { label: 'Projets phares', href: '/projets', badge: 'Dynamique' }
    ]
  },
  {
    title: 'Services',
    icon: FileText,
    links: [
      { label: 'Appels d\'offres', href: '/appels-offres' },
      { label: 'Publications', href: '/publications' },
      { label: 'Formulaires', href: '/services/formulaires' },
      { label: 'FAQ', href: '/faq' }
    ]
  },
  {
    title: 'Actualités et Événements',
    icon: Globe,
    links: [
      { label: 'Toutes les actualités', href: '/actualites' },
      { label: 'Événements', href: '/evenements' },
      { label: 'Communiqués de presse', href: '/medias/presse' }
    ]
  },
  {
    title: 'Médiathèque',
    icon: Camera,
    links: [
      { label: 'Galerie photos', href: '/medias/photos' },
      { label: 'Vidéothèque', href: '/medias/videos' },
      { label: 'Revue de presse', href: '/medias/presse' }
    ]
  },
  {
    title: 'Carrières',
    icon: Users,
    links: [
      { label: 'Offres d\'emploi', href: '/carrieres' },
      { label: 'Stages et formations', href: '/carrieres' }
    ]
  },
  {
    title: 'Contact et Support',
    icon: Phone,
    links: [
      { label: 'Nous contacter', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Recherche', href: '/recherche' }
    ]
  },
  {
    title: 'Informations légales',
    icon: Shield,
    links: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Politique de confidentialité', href: '/confidentialite' },
      { label: 'Accessibilité', href: '/accessibilite' },
      { label: 'Plan du site', href: '/plan-site' }
    ]
  },
  {
    title: 'Espace Admin',
    icon: Settings,
    links: [
      { label: 'Connexion', href: '/login' },
      { label: 'Console d\'administration', href: '/admin', badge: 'Restreint' }
    ]
  }
];

export default function PlanSitePage() {
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
              <Map className="h-10 w-10" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Plan du Site
              </h1>
            </div>
            <p className="text-xl opacity-90">
              Vue d'ensemble de toutes les pages et sections du site
            </p>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb Style Quick Links */}
      <section className="py-8 border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link 
              href="/" 
              className="text-primary hover:underline flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link 
              href="/ministere/missions" 
              className="text-primary hover:underline"
            >
              Le Ministère
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link 
              href="/projets" 
              className="text-primary hover:underline"
            >
              Projets
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link 
              href="/actualites" 
              className="text-primary hover:underline"
            >
              Actualités
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link 
              href="/contact" 
              className="text-primary hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>

      {/* Site Map Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteSections.map((section, index) => {
              const Icon = section.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {section.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <Link
                              href={link.href}
                              className="flex items-center justify-between group hover:text-primary transition-colors"
                            >
                              <span className="flex items-center gap-2">
                                <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-primary transition-colors" />
                                <span className="text-sm">{link.label}</span>
                              </span>
                              {link.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {link.badge}
                                </Badge>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Search className="h-6 w-6 text-primary" />
                <CardTitle>Vous ne trouvez pas ce que vous cherchez ?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Utilisez notre fonction de recherche pour trouver rapidement l'information dont vous avez besoin.
              </p>
              <div className="flex gap-4">
                <Link href="/recherche">
                  <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">
                    Aller à la recherche
                  </button>
                </Link>
                <Link href="/faq">
                  <button className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary/10 transition-colors">
                    Consulter la FAQ
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Statistiques du site
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <p className="text-sm text-gray-600">Pages disponibles</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">10</div>
                  <p className="text-sm text-gray-600">Sections principales</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <p className="text-sm text-gray-600">Contenu dynamique</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <p className="text-sm text-gray-600">Accessible</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Besoin d'aide pour naviguer ?</h2>
            <p className="text-gray-600 mb-6">
              Notre équipe est disponible pour vous aider à trouver l'information que vous recherchez.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/contact">
                <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                  Contactez-nous
                </button>
              </Link>
              <Link href="/accessibilite">
                <button className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors">
                  Options d'accessibilité
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}