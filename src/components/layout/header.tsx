"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Search, Globe, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Accueil',
    href: '/',
  },
  {
    name: 'Le Ministère',
    href: '#',
    children: [
      { name: 'Missions & Organisation', href: '/ministere/missions' },
      { name: 'Le Ministre', href: '/ministere/ministre' },
      { name: 'Directions & Agences', href: '/ministere/directions' },
      { name: 'Organigramme', href: '/ministere/organigramme' },
      { name: 'Textes Législatifs', href: '/ministere/textes' },
    ],
  },
  {
    name: 'Projets',
    href: '#',
    children: [
      { name: 'Projets en Cours', href: '/projets/en-cours' },
      { name: 'Projets Réalisés', href: '/projets/realises' },
      { name: 'PNALRU', href: '/projets/pnalru' },
      { name: 'Pôles Territoriaux', href: '/projets/poles' },
    ],
  },
  {
    name: 'Actualités',
    href: '/actualites',
  },
  {
    name: 'Services',
    href: '#',
    children: [
      { name: 'Publications', href: '/services/publications' },
      { name: 'Appels d\'Offres', href: '/services/appels-offres' },
      { name: 'Carrières', href: '/services/carrieres' },
      { name: 'FAQ', href: '/services/faq' },
    ],
  },
  {
    name: 'Médias',
    href: '#',
    children: [
      { name: 'Galerie Photos', href: '/medias/photos' },
      { name: 'Vidéos', href: '/medias/videos' },
      { name: 'Podcasts', href: '/medias/podcasts' },
      { name: 'Communiqués', href: '/medias/communiques' },
    ],
  },
  {
    name: 'Contact',
    href: '/contact',
  },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState<'fr' | 'en'>('fr')
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg'
          : 'bg-white dark:bg-gray-900'
      )}
    >
      {/* Barre supérieure avec les couleurs du Sénégal */}
      <div className="h-1 bg-gradient-to-r from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo et nom */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-senegal-green-500 to-senegal-green-600 p-2 shadow-lg">
                <div className="h-full w-full rounded-lg bg-white/20" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">MUCTAT</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">République du Sénégal</p>
              </div>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.children ? (
                  <div
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center space-x-1 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-senegal-green-50 hover:text-senegal-green-600 dark:text-gray-300 dark:hover:bg-senegal-green-900/20 dark:hover:text-senegal-green-400">
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block rounded-xl px-4 py-3 text-sm text-gray-700 transition-all hover:bg-senegal-green-50 hover:text-senegal-green-600 dark:text-gray-300 dark:hover:bg-senegal-green-900/20"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'rounded-xl px-4 py-2 text-sm font-medium transition-all',
                      pathname === item.href
                        ? 'bg-senegal-green-100 text-senegal-green-700 dark:bg-senegal-green-900/30 dark:text-senegal-green-400'
                        : 'text-gray-700 hover:bg-senegal-green-50 hover:text-senegal-green-600 dark:text-gray-300 dark:hover:bg-senegal-green-900/20'
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Actions à droite */}
          <div className="flex items-center space-x-3">
            {/* Recherche */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Changement de langue */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="hidden sm:flex"
            >
              <Globe className="h-5 w-5" />
            </Button>
            
            {/* Mode sombre */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="hidden sm:flex"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Espace Intranet */}
            <Link href="/auth/login" className="hidden lg:block">
              <Button variant="gradient" size="sm">
                Espace Intranet
              </Button>
            </Link>

            {/* Menu mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <button className="block w-full rounded-xl px-4 py-2 text-left text-base font-medium text-gray-700 hover:bg-senegal-green-50 hover:text-senegal-green-600 dark:text-gray-300">
                      {item.name}
                    </button>
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block rounded-xl px-4 py-2 text-sm text-gray-600 hover:bg-senegal-green-50 hover:text-senegal-green-600 dark:text-gray-400"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block rounded-xl px-4 py-2 text-base font-medium text-gray-700 hover:bg-senegal-green-50 hover:text-senegal-green-600 dark:text-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <Link href="/auth/login" className="block pt-4">
              <Button variant="gradient" className="w-full">
                Espace Intranet
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}