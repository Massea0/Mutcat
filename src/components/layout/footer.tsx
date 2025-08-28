import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  ministere: [
    { name: 'Missions & Organisation', href: '/ministere/missions' },
    { name: 'Le Ministre', href: '/ministere/ministre' },
    { name: 'Directions & Agences', href: '/ministere/directions' },
    { name: 'Organigramme', href: '/ministere/organigramme' },
  ],
  services: [
    { name: 'Publications', href: '/services/publications' },
    { name: 'Appels d\'Offres', href: '/services/appels-offres' },
    { name: 'Carrières', href: '/services/carrieres' },
    { name: 'FAQ', href: '/services/faq' },
  ],
  projets: [
    { name: 'PNALRU', href: '/projets/pnalru' },
    { name: 'Pôles Territoriaux', href: '/projets/poles' },
    { name: 'Vision Sénégal 2050', href: '/projets/vision-2050' },
    { name: 'Smart Cities', href: '/projets/smart-cities' },
  ],
  legal: [
    { name: 'Mentions Légales', href: '/legal/mentions' },
    { name: 'Politique de Confidentialité', href: '/legal/confidentialite' },
    { name: 'Conditions d\'Utilisation', href: '/legal/conditions' },
    { name: 'Plan du Site', href: '/sitemap' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
  { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-sky-500' },
  { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-700' },
  { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
  { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-600' },
]

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900">
      {/* Barre décorative avec les couleurs du Sénégal */}
      <div className="h-1 bg-gradient-to-r from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500" />
      
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Section principale */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Informations du ministère */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-senegal-green-500 to-senegal-green-600 p-2 shadow-lg">
                <div className="h-full w-full rounded-lg bg-white/20" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">MUCTAT</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">République du Sénégal</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires
            </p>
            
            {/* Réseaux sociaux */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`text-gray-400 transition-colors ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Liens rapides */}
          <div className="col-span-1 lg:col-span-3">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                  Le Ministère
                </h3>
                <ul className="mt-4 space-y-2">
                  {footerLinks.ministere.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 transition-colors hover:text-senegal-green-600 dark:text-gray-400 dark:hover:text-senegal-green-400"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                  Services
                </h3>
                <ul className="mt-4 space-y-2">
                  {footerLinks.services.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 transition-colors hover:text-senegal-green-600 dark:text-gray-400 dark:hover:text-senegal-green-400"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                  Projets
                </h3>
                <ul className="mt-4 space-y-2">
                  {footerLinks.projets.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 transition-colors hover:text-senegal-green-600 dark:text-gray-400 dark:hover:text-senegal-green-400"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                  Informations Légales
                </h3>
                <ul className="mt-4 space-y-2">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 transition-colors hover:text-senegal-green-600 dark:text-gray-400 dark:hover:text-senegal-green-400"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section contact */}
        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-senegal-green-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Adresse</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Building Administratif, Dakar, Sénégal
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-senegal-green-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Téléphone</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  +221 33 XXX XX XX
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-senegal-green-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Email</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  contact@muctat.sn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires.
            <br />
            République du Sénégal - Un Peuple, Un But, Une Foi
          </p>
        </div>
      </div>
    </footer>
  )
}