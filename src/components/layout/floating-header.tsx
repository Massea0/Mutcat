'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils'
import { 
  Menu, 
  X, 
  ChevronDown,
  Building,
  Newspaper,
  Calendar,
  Briefcase,
  Image,
  Phone,
  Globe,
  Moon,
  Sun,
  Search,
  User,
  Home,
  FileText,
  Users,
  MapPin,
  Target,
  Award,
  TrendingUp,
  Camera,
  Video,
  Mic,
  Download,
  HelpCircle,
  Mail
} from 'lucide-react'

interface NavItem {
  title: string
  href?: string
  icon?: any
  description?: string
  children?: NavItem[]
}

export function FloatingHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems: NavItem[] = [
    {
      title: 'Accueil',
      href: '/',
      icon: Home
    },
    {
      title: 'Le Ministère',
      icon: Building,
      children: [
        {
          title: 'Missions & Organisation',
          href: '/ministere/missions',
          icon: Target,
          description: 'Découvrez nos missions et notre vision'
        },
        {
          title: 'Le Ministre',
          href: '/ministere/ministre',
          icon: User,
          description: 'Biographie et message du ministre'
        },
        {
          title: 'Directions & Agences',
          href: '/ministere/directions',
          icon: Users,
          description: 'Nos structures opérationnelles'
        },
        {
          title: 'Organigramme',
          href: '/ministere/organigramme',
          icon: MapPin,
          description: 'Structure organisationnelle'
        }
      ]
    },
    {
      title: 'Projets',
      icon: Briefcase,
      children: [
        {
          title: 'Tous les projets',
          href: '/projets',
          icon: TrendingUp,
          description: 'Voir tous nos projets'
        },
        {
          title: 'Projets phares',
          href: '/projets?featured=true',
          icon: Award,
          description: 'Nos projets majeurs'
        },
        {
          title: 'Carte interactive',
          href: '/projets/carte',
          icon: MapPin,
          description: 'Localisation des projets'
        }
      ]
    },
    {
      title: 'Actualités',
      icon: Newspaper,
      children: [
        {
          title: 'Toutes les actualités',
          href: '/actualites',
          icon: Newspaper,
          description: 'Les dernières nouvelles'
        },
        {
          title: 'Événements',
          href: '/evenements',
          icon: Calendar,
          description: 'Agenda des événements'
        },
        {
          title: 'Communiqués',
          href: '/actualites?category=press',
          icon: Mic,
          description: 'Communiqués de presse'
        }
      ]
    },
    {
      title: 'Services',
      icon: FileText,
      children: [
        {
          title: 'Publications',
          href: '/services/publications',
          icon: Download,
          description: 'Documents et rapports'
        },
        {
          title: 'Appels d\'offres',
          href: '/services/appels-offres',
          icon: Briefcase,
          description: 'Marchés publics'
        },
        {
          title: 'FAQ',
          href: '/services/faq',
          icon: HelpCircle,
          description: 'Questions fréquentes'
        },
        {
          title: 'Formulaires',
          href: '/services/formulaires',
          icon: FileText,
          description: 'Télécharger les formulaires'
        }
      ]
    },
    {
      title: 'Médias',
      icon: Image,
      children: [
        {
          title: 'Galerie Photos',
          href: '/medias/photos',
          icon: Camera,
          description: 'Photos des événements'
        },
        {
          title: 'Vidéos',
          href: '/medias/videos',
          icon: Video,
          description: 'Vidéothèque'
        },
        {
          title: 'Revue de presse',
          href: '/medias/presse',
          icon: Newspaper,
          description: 'Articles de presse'
        }
      ]
    },
    {
      title: 'Contact',
      href: '/contact',
      icon: Phone
    }
  ]

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <>
      {/* Spacer pour éviter que le contenu passe sous la navbar */}
      <div className="h-20"></div>
      
      {/* Navbar flottante */}
      <header className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500",
        "w-[95%] max-w-7xl",
        isScrolled 
          ? "bg-white/95 dark:bg-gray-900/95 shadow-2xl backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50" 
          : "bg-white/80 dark:bg-gray-900/80 shadow-xl backdrop-blur-lg border border-gray-200/30 dark:border-gray-700/30",
        "rounded-2xl"
      )}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white dark:bg-gray-900 rounded-xl p-2">
                  <Building className="h-6 w-6 text-senegal-green-600" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-senegal-green-600 to-senegal-green-500 bg-clip-text text-transparent">
                  MUCTAT
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">République du Sénégal</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.children.map((child) => (
                              <li key={child.title}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={child.href || '#'}
                                    className={cn(
                                      "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors",
                                      "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                      pathname === child.href && "bg-accent/50"
                                    )}
                                  >
                                    <div className="flex items-center gap-2">
                                      <child.icon className="h-4 w-4 text-senegal-green-600" />
                                      <div className="text-sm font-medium leading-none">
                                        {child.title}
                                      </div>
                                    </div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {child.description}
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link href={item.href || '#'} legacyBehavior passHref>
                        <NavigationMenuLink className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50",
                          pathname === item.href && "bg-accent/50"
                        )}>
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.title}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                aria-label="Rechercher"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Language Switcher */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                aria-label="Changer de langue"
              >
                <Globe className="h-5 w-5" />
              </Button>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                onClick={toggleDarkMode}
                aria-label="Basculer le mode sombre"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* CTA Button */}
              <Link href="/admin" className="hidden sm:block">
                <Button className="rounded-xl bg-gradient-to-r from-senegal-green-500 to-senegal-green-600 hover:from-senegal-green-600 hover:to-senegal-green-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  Espace Intranet
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 dark:border-gray-700/50">
            <nav className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  {item.children ? (
                    <details className="group">
                      <summary className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="mt-2 ml-6 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.title}
                            href={child.href || '#'}
                            className="block p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="flex items-center gap-2">
                              <child.icon className="h-4 w-4 text-senegal-green-600" />
                              <span className="text-sm">{child.title}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile CTA */}
              <Link href="/admin" className="block pt-4">
                <Button className="w-full rounded-xl bg-gradient-to-r from-senegal-green-500 to-senegal-green-600 text-white">
                  Espace Intranet
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}