import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Users, 
  Building, 
  Globe, 
  Shield, 
  Briefcase,
  CheckCircle,
  ArrowRight
} from "lucide-react"

export default function MissionsPage() {
  const missions = [
    {
      icon: Building,
      title: "Urbanisme et Aménagement",
      description: "Élaborer et mettre en œuvre la politique nationale en matière d'urbanisme et d'aménagement du territoire",
      tasks: [
        "Planification urbaine stratégique",
        "Contrôle de l'occupation des sols",
        "Délivrance des autorisations de construire",
        "Promotion de l'habitat social"
      ]
    },
    {
      icon: Users,
      title: "Collectivités Territoriales",
      description: "Accompagner et renforcer les capacités des collectivités territoriales dans leur développement",
      tasks: [
        "Appui technique aux communes",
        "Formation des élus locaux",
        "Mobilisation des ressources",
        "Décentralisation effective"
      ]
    },
    {
      icon: Globe,
      title: "Développement Territorial",
      description: "Assurer un développement équilibré et harmonieux du territoire national",
      tasks: [
        "Réduction des disparités régionales",
        "Promotion des pôles de développement",
        "Aménagement des zones rurales",
        "Développement des villes secondaires"
      ]
    },
    {
      icon: Shield,
      title: "Régulation et Contrôle",
      description: "Veiller au respect des normes et réglementations en matière d'urbanisme",
      tasks: [
        "Contrôle de conformité",
        "Lutte contre les constructions anarchiques",
        "Protection du domaine public",
        "Préservation de l'environnement urbain"
      ]
    }
  ]

  const objectifs = [
    "Améliorer le cadre de vie des populations",
    "Promouvoir un développement urbain durable",
    "Renforcer la gouvernance territoriale",
    "Moderniser l'administration territoriale",
    "Favoriser l'émergence de villes intelligentes",
    "Réduire le déficit en logements sociaux"
  ]

  const valeurs = [
    { name: "Excellence", description: "Recherche constante de la qualité" },
    { name: "Transparence", description: "Gestion ouverte et participative" },
    { name: "Innovation", description: "Solutions modernes et adaptées" },
    { name: "Équité", description: "Accès égal aux services publics" },
    { name: "Durabilité", description: "Préservation pour les générations futures" },
    { name: "Proximité", description: "Services accessibles aux citoyens" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-senegal-green-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nos Missions & Organisation
            </h1>
            <p className="text-xl opacity-90">
              Le Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement 
              des Territoires œuvre pour un Sénégal moderne, équitable et durable
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-none shadow-xl">
              <CardHeader className="bg-gradient-to-r from-senegal-green-50 to-senegal-yellow-50">
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Target className="h-8 w-8 text-senegal-green-600" />
                  Notre Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed text-gray-700">
                  Faire du Sénégal un modèle de développement territorial harmonieux en Afrique, 
                  avec des villes intelligentes, durables et inclusives, où chaque citoyen 
                  bénéficie d'un cadre de vie de qualité et d'opportunités équitables de développement, 
                  conformément à la Vision Sénégal 2050.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Missions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Missions Principales</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {missions.map((mission, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <mission.icon className="h-6 w-6 text-senegal-green-600" />
                    {mission.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{mission.description}</p>
                  <ul className="space-y-2">
                    {mission.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-senegal-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{task}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Objectifs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Objectifs Stratégiques</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {objectifs.map((objectif, index) => (
                <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow">
                  <ArrowRight className="h-5 w-5 text-senegal-yellow-500 flex-shrink-0" />
                  <span className="text-gray-700">{objectif}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Valeurs</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {valeurs.map((valeur, index) => (
              <div key={index} className="text-center">
                <div className="bg-senegal-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-10 w-10 text-senegal-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{valeur.name}</h3>
                <p className="text-gray-600 text-sm">{valeur.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organisation Section */}
      <section className="py-16 bg-gradient-to-b from-senegal-green-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre Organisation</h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-senegal-green-600 mb-2">8</div>
                  <p className="text-gray-600">Directions Nationales</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-senegal-yellow-600 mb-2">14</div>
                  <p className="text-gray-600">Services Régionaux</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-senegal-red-600 mb-2">500+</div>
                  <p className="text-gray-600">Agents et Cadres</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-gray-700 mb-6">
                Une équipe dédiée au service du développement territorial du Sénégal
              </p>
              <div className="flex justify-center gap-4">
                <Badge className="bg-senegal-green-100 text-senegal-green-700">
                  Innovation
                </Badge>
                <Badge className="bg-senegal-yellow-100 text-senegal-yellow-700">
                  Excellence
                </Badge>
                <Badge className="bg-senegal-red-100 text-senegal-red-700">
                  Engagement
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}