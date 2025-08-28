import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Quote,
  Download,
  Mail,
  Phone,
  Twitter,
  Linkedin
} from "lucide-react"

export default function MinistrePage() {
  const parcours = [
    {
      periode: "2024 - Présent",
      poste: "Ministre de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires",
      organisation: "République du Sénégal",
      type: "current"
    },
    {
      periode: "2020 - 2024",
      poste: "Directeur Général",
      organisation: "Agence Nationale de l'Aménagement du Territoire",
      type: "experience"
    },
    {
      periode: "2015 - 2020",
      poste: "Conseiller Technique",
      organisation: "Présidence de la République",
      type: "experience"
    },
    {
      periode: "2010 - 2015",
      poste: "Directeur de l'Urbanisme",
      organisation: "Ville de Dakar",
      type: "experience"
    }
  ]

  const formations = [
    {
      diplome: "Doctorat en Urbanisme et Aménagement",
      etablissement: "Université Cheikh Anta Diop de Dakar",
      annee: "2008"
    },
    {
      diplome: "Master en Développement Territorial",
      etablissement: "École Nationale d'Administration (ENA)",
      annee: "2003"
    },
    {
      diplome: "Ingénieur en Génie Civil",
      etablissement: "École Polytechnique de Thiès",
      annee: "2000"
    }
  ]

  const realisations = [
    {
      title: "Programme National de Logements Sociaux",
      description: "Lancement du programme ambitieux de 100 000 logements",
      impact: "20 000 familles bénéficiaires"
    },
    {
      title: "Modernisation de l'Administration Territoriale",
      description: "Digitalisation complète des services du ministère",
      impact: "Réduction de 60% des délais de traitement"
    },
    {
      title: "Vision Urbaine 2050",
      description: "Élaboration de la stratégie nationale d'urbanisme",
      impact: "14 régions impliquées"
    },
    {
      title: "Partenariats Internationaux",
      description: "Mobilisation de financements pour les grands projets",
      impact: "500 milliards FCFA mobilisés"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section avec Photo */}
      <section className="relative bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Badge className="bg-senegal-yellow-500 text-black mb-4">
                Ministre de la République
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Son Excellence
                <br />
                Monsieur le Ministre
              </h1>
              <p className="text-xl mb-6 opacity-90">
                Ministre de l'Urbanisme, des Collectivités Territoriales 
                et de l'Aménagement des Territoires
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Nommé en Mars 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>Dakar, Sénégal</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button size="lg" className="bg-white text-senegal-green-600 hover:bg-gray-100">
                  <Download className="h-5 w-5 mr-2" />
                  Biographie complète
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-senegal-yellow-500 rounded-2xl transform rotate-6"></div>
                <div className="relative bg-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src="/images/portraitministre.png"
                      alt="Portrait du Ministre"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Message du Ministre */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-none shadow-xl">
            <CardHeader className="bg-gradient-to-r from-senegal-green-50 to-senegal-yellow-50">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Quote className="h-8 w-8 text-senegal-green-600" />
                Message du Ministre
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <blockquote className="text-lg leading-relaxed text-gray-700 italic">
                "Notre ambition est de faire du Sénégal un modèle de développement urbain 
                durable en Afrique. À travers une approche inclusive et innovante, nous 
                travaillons chaque jour pour améliorer le cadre de vie de nos concitoyens 
                et bâtir des villes résilientes pour les générations futures.
                <br /><br />
                La transformation de nos territoires est au cœur de la Vision Sénégal 2050. 
                Ensemble, avec l'engagement de tous les acteurs, nous construisons un Sénégal 
                moderne, équitable et prospère."
              </blockquote>
              <div className="mt-6 text-right">
                <p className="font-bold text-senegal-green-600">- Le Ministre</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Parcours Professionnel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Parcours Professionnel</h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-senegal-green-200"></div>
              {parcours.map((item, index) => (
                <div key={index} className="relative flex items-start mb-8">
                  <div className={`absolute left-8 w-4 h-4 rounded-full -translate-x-1/2 ${
                    item.type === 'current' ? 'bg-senegal-green-600' : 'bg-senegal-green-400'
                  }`}></div>
                  <div className="ml-16">
                    <Card className={item.type === 'current' ? 'border-senegal-green-500' : ''}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{item.poste}</h3>
                            <p className="text-gray-600">{item.organisation}</p>
                          </div>
                          <Badge variant={item.type === 'current' ? 'default' : 'secondary'}>
                            {item.periode}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formation */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Formation Académique</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {formations.map((formation, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <GraduationCap className="h-8 w-8 text-senegal-green-600 mb-3" />
                  <CardTitle className="text-lg">{formation.diplome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{formation.etablissement}</p>
                  <Badge variant="outline">{formation.annee}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Réalisations */}
      <section className="py-16 bg-gradient-to-b from-senegal-green-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Principales Réalisations</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {realisations.map((realisation, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Award className="h-6 w-6 text-senegal-yellow-600 mb-2" />
                  <CardTitle>{realisation.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{realisation.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-senegal-green-100 text-senegal-green-700">
                      Impact: {realisation.impact}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-senegal-green-600 to-senegal-green-700 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Cabinet du Ministre</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  <div>
                    <p className="text-sm opacity-80">Téléphone</p>
                    <p className="font-semibold">+221 33 889 XX XX</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5" />
                  <div>
                    <p className="text-sm opacity-80">Email</p>
                    <p className="font-semibold">cabinet@muctat.sn</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Twitter className="h-5 w-5 mr-2" />
                  Twitter
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Linkedin className="h-5 w-5 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}