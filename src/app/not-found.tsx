import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <h1 className="text-[200px] font-bold text-gray-200 leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold bg-gradient-to-r from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500 bg-clip-text text-transparent">
              Oops!
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page introuvable
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="bg-senegal-green-600 hover:bg-senegal-green-700">
              <Home className="mr-2 h-5 w-5" />
              Retour à l'accueil
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Page précédente
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pages populaires
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Link href="/projets" className="text-senegal-green-600 hover:underline">
              Projets
            </Link>
            <Link href="/actualites" className="text-senegal-green-600 hover:underline">
              Actualités
            </Link>
            <Link href="/appels-offres" className="text-senegal-green-600 hover:underline">
              Appels d'offres
            </Link>
            <Link href="/contact" className="text-senegal-green-600 hover:underline">
              Contact
            </Link>
            <Link href="/publications" className="text-senegal-green-600 hover:underline">
              Publications
            </Link>
            <Link href="/services" className="text-senegal-green-600 hover:underline">
              Services
            </Link>
            <Link href="/ministere/missions" className="text-senegal-green-600 hover:underline">
              Le Ministère
            </Link>
            <Link href="/faq" className="text-senegal-green-600 hover:underline">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}