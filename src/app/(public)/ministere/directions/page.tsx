import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  FileText,
  Home,
  Briefcase,
  Globe,
  Shield,
  Landmark,
  TreePine
} from "lucide-react"

export default function DirectionsPage() {
  const directions = [
    {
      name: "Direction de l'Urbanisme et de l'Architecture",
      acronyme: "DUA",
      icon: Building2,
      description: "Chargée de la conception et de la mise en œuvre de la politique nationale en matière d'urbanisme et d'architecture",
      missions: [
        "Élaboration des documents d'urbanisme",
        "Contrôle de conformité des constructions",
        "Promotion de l'architecture nationale",
        "Délivrance des autorisations de construire"
      ],
      responsable: "M. Amadou DIALLO",
      contact: {
        phone: "+221 33 889 XX XX",
        email: "dua@muctat.sn",
        address: "Building Administratif, 3ème étage"
      }
    },
    {
      name: "Direction de la Surveillance et du Contrôle de l'Occupation du Sol",
      acronyme: "DSCOS",
      icon: Shield,
      description: "Veille au respect des règles d'occupation et d'utilisation du sol sur l'ensemble du territoire",
      missions: [
        "Surveillance de l'occupation du sol",
        "Lutte contre les occupations irrégulières",
        "Protection du domaine public",
        "Contrôle des lotissements"
      ],
      responsable: "Mme Fatou SOW",
      contact: {
        phone: "+221 33 889 XX XX",
        email: "dscos@muctat.sn",
        address: "Building Administratif, 4ème étage"
      }
    },
    {
      name: "Direction de l'Habitat et de la Construction",
      acronyme: "DHC",
      icon: Home,
      description: "Responsable de la politique nationale en matière d'habitat et de construction",
      missions: [
        "Promotion du logement social",
        "Amélioration de l'habitat",
        "Normes de construction",
        "Partenariats public-privé"
      ],
      responsable: "M. Ibrahima FALL",
      contact: {
        phone: "+221 33 889 XX XX",
        email: "dhc@muctat.sn",
        address: "Building Administratif, 5ème étage"
      }
    },
    {
      name: "Direction des Collectivités Territoriales",
      acronyme: "DCT",
      icon: Users,
      description: "Accompagne et appuie les collectivités territoriales dans leur développement",
      missions: [
        "Appui technique aux collectivités",
        "Formation des élus locaux",
        "Suivi de la décentralisation",
        "Mobilisation des ressources"
      ],
      responsable: "M. Ousmane NDIAYE",
      contact: {
        phone: "+221 33 889 XX XX",
        email: "dct@muctat.sn",
        address: "Building Administratif, 2ème étage"
      }
    },
    {
      name: "Direction de l'Aménagement du Territoire",
      acronyme: "DAT",
      icon: Globe,
      description: "Conçoit et met en œuvre la politique d'aménagement du territoire national",
      missions: [
        "Planification territoriale",
        "Études d'aménagement",
        "Développement régional",
        "Équilibre territorial"
      ],
      responsable: "Mme Aïssatou DIOP",
      contact: {
        phone: "+221 33 889 XX XX",
        email: "dat@muctat.sn",
        address: "Building Administratif, 6ème étage"
      }
    },
    {
      name: "Direction de la Planification et des Statistiques",
      acronyme: "DPS",
      icon: FileText,
      description: "Assure la planification stratégique et le suivi-évaluation des politiques du ministère",
      missions: [
        "Planification stratégique",
        "Collecte et analyse de données",
        "Suivi-évaluation",
        "Études prospectives"
      ],
      responsable: "M. Mamadou BA",
      contact: {
        phone: "+221 33 889 XX XX",
        email: "dps@muctat.sn",
        address: "Building Administratif, 1er étage"
      }
    }
  ]

  const agences = [
    {
      name: "Agence de Développement Municipal",
      sigle: "ADM",
      type: "Agence",
      description: "Appui au développement des communes et amélioration de la gouvernance locale",
      website: "www.adm.sn"
    },
    {
      name: "Agence Nationale de l'Aménagement du Territoire",
      sigle: "ANAT",
      type: "Agence",
      description: "Mise en œuvre opérationnelle de la politique d'aménagement du territoire",
      website: "www.anat.sn"
    },
    {
      name: "Société Nationale des Habitations à Loyer Modéré",
      sigle: "SN-HLM",
      type: "Société",
      description: "Construction et gestion de logements sociaux",
      website: "www.snhlm.sn"
    },
    {
      name: "SICAP SA",
      sigle: "SICAP",
      type: "Société",
      description: "Promotion immobilière et aménagement urbain",
      website: "www.sicap.sn"
    },
    {
      name: "Bureau d'Urbanisme et d'Habitat du Sénégal",
      sigle: "BHS",
      type: "Établissement",
      description: "Études et réalisation de projets d'urbanisme",
      website: "www.bhs.sn"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-senegal-green-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Directions & Agences
            </h1>
            <p className="text-xl opacity-90">
              Les structures opérationnelles du ministère au service du développement territorial
            </p>
          </div>
        </div>
      </section>

      {/* Directions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Directions Nationales</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Six directions techniques assurent la mise en œuvre des politiques du ministère 
              sur l'ensemble du territoire national
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {directions.map((direction, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-senegal-green-100 rounded-lg">
                        <direction.icon className="h-6 w-6 text-senegal-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-1">{direction.name}</CardTitle>
                        <Badge className="bg-senegal-green-100 text-senegal-green-700">
                          {direction.acronyme}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-4">
                    {direction.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Missions principales</h4>
                      <ul className="space-y-1">
                        {direction.missions.map((mission, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-senegal-green-500 mt-1">•</span>
                            {mission}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">Directeur: {direction.responsable}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {direction.contact.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {direction.contact.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {direction.contact.address}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Agences Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Agences & Établissements Sous Tutelle</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des organismes spécialisés pour la mise en œuvre opérationnelle 
              des politiques d'urbanisme et d'habitat
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agences.map((agence, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{agence.type}</Badge>
                    <Landmark className="h-5 w-5 text-senegal-green-600" />
                  </div>
                  <CardTitle className="text-lg">{agence.name}</CardTitle>
                  <Badge className="w-fit bg-senegal-yellow-100 text-senegal-yellow-700">
                    {agence.sigle}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{agence.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {agence.website}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Régionaux */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-senegal-green-50 to-senegal-yellow-50">
            <CardHeader>
              <CardTitle className="text-2xl">Services Régionaux</CardTitle>
              <CardDescription>
                Présence territoriale dans les 14 régions du Sénégal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Services Régionaux de l'Urbanisme</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack', 'Louga', 'Diourbel'].map((region) => (
                      <div key={region} className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-senegal-green-500" />
                        {region}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Services Régionaux de l'Aménagement</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Matam', 'Fatick', 'Kolda', 'Tambacounda', 'Kédougou', 'Sédhiou', 'Kaffrine'].map((region) => (
                      <div key={region} className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-senegal-yellow-500" />
                        {region}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button>
                  <MapPin className="h-4 w-4 mr-2" />
                  Voir la carte des implantations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}