import Link from 'next/link'
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Building,
  Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ModernFooter() {
  const footerLinks = {
    ministere: [
      { title: 'Missions & Organisation', href: '/ministere/missions' },
      { title: 'Le Ministre', href: '/ministere/ministre' },
      { title: 'Directions & Agences', href: '/ministere/directions' },
      { title: 'Organigramme', href: '/ministere/organigramme' },
    ],
    services: [
      { title: 'Publications', href: '/services/publications' },
      { title: 'Appels d\'offres', href: '/services/appels-offres' },
      { title: 'Formulaires', href: '/services/formulaires' },
      { title: 'FAQ', href: '/services/faq' },
    ],
    projets: [
      { title: 'Projets en cours', href: '/projets?status=in_progress' },
      { title: 'Projets phares', href: '/projets?featured=true' },
      { title: 'Vision 2050', href: '/projets/vision-2050' },
      { title: 'Smart Cities', href: '/projets/smart-cities' },
    ],
    liens: [
      { title: 'Présidence', href: 'https://www.presidence.sn' },
      { title: 'Primature', href: 'https://www.primature.sn' },
      { title: 'Gouvernement', href: 'https://www.gouvernement.sn' },
      { title: 'ADIE', href: 'https://www.adie.sn' },
    ]
  }

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/muctat', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/muctat', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/muctat', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com/muctat', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/muctat', label: 'YouTube' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
      {/* Wave decoration */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full">
        <svg className="w-full h-20" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 50L60 45.8C120 41.7 240 33.3 360 33.3C480 33.3 600 41.7 720 45.8C840 50 960 50 1080 45.8C1200 41.7 1320 33.3 1380 29.2L1440 25V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" 
            fill="url(#gradient)" />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1440" y2="0">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="50%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 rounded-2xl p-8 md:p-12 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    Restez informé de nos actualités
                  </h3>
                  <p className="text-white/90">
                    Abonnez-vous à notre newsletter pour recevoir les dernières nouvelles et mises à jour du ministère
                  </p>
                </div>
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="Votre adresse email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur"
                  />
                  <Button className="bg-white text-senegal-green-600 hover:bg-gray-100 px-6">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500 rounded-xl blur-lg opacity-75"></div>
                <div className="relative bg-white rounded-xl p-3">
                  <Building className="h-8 w-8 text-senegal-green-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">MUCTAT</h2>
                <p className="text-sm text-gray-400">République du Sénégal</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires. 
              Bâtir ensemble le Sénégal de demain.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center transition-all hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-senegal-yellow-400">Le Ministère</h3>
            <ul className="space-y-3">
              {footerLinks.ministere.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    <span>{link.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-senegal-yellow-400">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    <span>{link.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-senegal-yellow-400">Projets</h3>
            <ul className="space-y-3">
              {footerLinks.projets.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    <span>{link.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-senegal-yellow-400">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  Building Administratif<br />
                  Avenue Léopold Sédar Senghor<br />
                  Dakar, Sénégal
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">+221 33 889 XX XX</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">contact@muctat.sn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © 2024 MUCTAT - Tous droits réservés
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/mentions-legales" className="text-gray-400 hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="text-gray-400 hover:text-white transition-colors">
                Confidentialité
              </Link>
              <Link href="/accessibilite" className="text-gray-400 hover:text-white transition-colors">
                Accessibilité
              </Link>
              <Link href="/plan-site" className="text-gray-400 hover:text-white transition-colors">
                Plan du site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </footer>
  )
}