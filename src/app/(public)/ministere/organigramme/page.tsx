'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  User,
  Users,
  Building,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2
} from "lucide-react"

interface OrgNode {
  id: string
  title: string
  name?: string
  role?: string
  email?: string
  phone?: string
  type: 'minister' | 'secretary' | 'director' | 'service' | 'agency'
  children?: OrgNode[]
  expanded?: boolean
}

export default function OrganigrammePage() {
  const [zoom, setZoom] = useState(100)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'directions', 'agencies']))

  const orgStructure: OrgNode = {
    id: 'root',
    title: 'Cabinet du Ministre',
    name: 'Son Excellence le Ministre',
    type: 'minister',
    children: [
      {
        id: 'sg',
        title: 'Secrétariat Général',
        name: 'M. Secrétaire Général',
        type: 'secretary',
        children: [
          {
            id: 'directions',
            title: 'Directions Nationales',
            type: 'director',
            children: [
              {
                id: 'dua',
                title: 'Direction de l\'Urbanisme et de l\'Architecture',
                name: 'M. Amadou DIALLO',
                type: 'director',
                children: [
                  { id: 'dua-1', title: 'Division Planification Urbaine', type: 'service' },
                  { id: 'dua-2', title: 'Division Architecture', type: 'service' },
                  { id: 'dua-3', title: 'Division Autorisations', type: 'service' }
                ]
              },
              {
                id: 'dscos',
                title: 'Direction de la Surveillance et du Contrôle',
                name: 'Mme Fatou SOW',
                type: 'director',
                children: [
                  { id: 'dscos-1', title: 'Division Contrôle Terrain', type: 'service' },
                  { id: 'dscos-2', title: 'Division Contentieux', type: 'service' }
                ]
              },
              {
                id: 'dhc',
                title: 'Direction de l\'Habitat et de la Construction',
                name: 'M. Ibrahima FALL',
                type: 'director',
                children: [
                  { id: 'dhc-1', title: 'Division Logement Social', type: 'service' },
                  { id: 'dhc-2', title: 'Division Normes Construction', type: 'service' },
                  { id: 'dhc-3', title: 'Division Partenariats', type: 'service' }
                ]
              },
              {
                id: 'dct',
                title: 'Direction des Collectivités Territoriales',
                name: 'M. Ousmane NDIAYE',
                type: 'director',
                children: [
                  { id: 'dct-1', title: 'Division Appui Technique', type: 'service' },
                  { id: 'dct-2', title: 'Division Formation', type: 'service' }
                ]
              },
              {
                id: 'dat',
                title: 'Direction de l\'Aménagement du Territoire',
                name: 'Mme Aïssatou DIOP',
                type: 'director',
                children: [
                  { id: 'dat-1', title: 'Division Planification', type: 'service' },
                  { id: 'dat-2', title: 'Division Développement Régional', type: 'service' }
                ]
              },
              {
                id: 'dps',
                title: 'Direction de la Planification et des Statistiques',
                name: 'M. Mamadou BA',
                type: 'director',
                children: [
                  { id: 'dps-1', title: 'Division Études', type: 'service' },
                  { id: 'dps-2', title: 'Division Suivi-Évaluation', type: 'service' }
                ]
              }
            ]
          },
          {
            id: 'agencies',
            title: 'Agences et Établissements',
            type: 'agency',
            children: [
              { id: 'adm', title: 'ADM - Agence de Développement Municipal', type: 'agency' },
              { id: 'anat', title: 'ANAT - Agence Nationale de l\'Aménagement du Territoire', type: 'agency' },
              { id: 'snhlm', title: 'SN-HLM - Société Nationale HLM', type: 'agency' },
              { id: 'sicap', title: 'SICAP SA', type: 'agency' },
              { id: 'bhs', title: 'BHS - Bureau d\'Urbanisme et d\'Habitat', type: 'agency' }
            ]
          }
        ]
      },
      {
        id: 'cabinet',
        title: 'Cabinet Ministériel',
        type: 'secretary',
        children: [
          { id: 'cab-1', title: 'Conseiller Technique n°1', type: 'service' },
          { id: 'cab-2', title: 'Conseiller Technique n°2', type: 'service' },
          { id: 'cab-3', title: 'Conseiller Juridique', type: 'service' },
          { id: 'cab-4', title: 'Attaché de Cabinet', type: 'service' },
          { id: 'cab-5', title: 'Chef de Cabinet', type: 'service' }
        ]
      },
      {
        id: 'inspection',
        title: 'Inspection Interne',
        name: 'M. Inspecteur Général',
        type: 'director'
      }
    ]
  }

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'minister': return 'bg-gradient-to-br from-senegal-green-600 to-senegal-green-700 text-white'
      case 'secretary': return 'bg-gradient-to-br from-senegal-yellow-500 to-senegal-yellow-600 text-white'
      case 'director': return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
      case 'agency': return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
      case 'service': return 'bg-gray-100 text-gray-700 border border-gray-300'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'minister': return <Briefcase className="h-5 w-5" />
      case 'secretary': return <Building className="h-5 w-5" />
      case 'director': return <Users className="h-5 w-5" />
      case 'agency': return <Building className="h-5 w-5" />
      case 'service': return <User className="h-5 w-5" />
      default: return <User className="h-5 w-5" />
    }
  }

  const renderNode = (node: OrgNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedNodes.has(node.id)

    return (
      <div key={node.id} className={`${level > 0 ? 'ml-8' : ''}`}>
        <div className={`relative ${hasChildren ? 'mb-4' : 'mb-2'}`}>
          {/* Ligne de connexion verticale */}
          {level > 0 && (
            <div className="absolute -left-8 top-0 bottom-0 w-px bg-gray-300"></div>
          )}
          
          {/* Ligne de connexion horizontale */}
          {level > 0 && (
            <div className="absolute -left-8 top-8 w-8 h-px bg-gray-300"></div>
          )}

          <div className={`
            relative p-4 rounded-lg shadow-md transition-all hover:shadow-lg cursor-pointer
            ${getNodeColor(node.type)}
            ${level === 0 ? 'max-w-md mx-auto' : ''}
          `}
            onClick={() => hasChildren && toggleNode(node.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getNodeIcon(node.type)}
                <div>
                  <h3 className={`font-semibold ${node.type === 'service' ? 'text-sm' : ''}`}>
                    {node.title}
                  </h3>
                  {node.name && (
                    <p className={`${node.type === 'service' ? 'text-xs' : 'text-sm'} opacity-90 mt-1`}>
                      {node.name}
                    </p>
                  )}
                </div>
              </div>
              {hasChildren && (
                <div className="ml-2">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enfants */}
        {hasChildren && isExpanded && (
          <div className="relative">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-senegal-green-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Organigramme du Ministère
            </h1>
            <p className="text-xl opacity-90">
              Structure organisationnelle du MUCTAT
            </p>
          </div>
        </div>
      </section>

      {/* Contrôles */}
      <section className="sticky top-20 z-20 bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(50, zoom - 10))}
              >
                <ZoomOut className="h-4 w-4 mr-1" />
                Zoom -
              </Button>
              <span className="text-sm font-medium">{zoom}%</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(150, zoom + 10))}
              >
                <ZoomIn className="h-4 w-4 mr-1" />
                Zoom +
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allNodes = new Set<string>()
                  const collectIds = (node: OrgNode) => {
                    allNodes.add(node.id)
                    node.children?.forEach(collectIds)
                  }
                  collectIds(orgStructure)
                  setExpandedNodes(allNodes)
                }}
              >
                <Maximize2 className="h-4 w-4 mr-1" />
                Tout déplier
              </Button>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Organigramme */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div 
            className="overflow-x-auto"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <div className="min-w-max p-8">
              {renderNode(orgStructure)}
            </div>
          </div>
        </div>
      </section>

      {/* Légende */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Légende</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-senegal-green-600 to-senegal-green-700"></div>
                  <span className="text-sm">Cabinet Ministériel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-senegal-yellow-500 to-senegal-yellow-600"></div>
                  <span className="text-sm">Secrétariat</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-blue-600"></div>
                  <span className="text-sm">Direction</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-purple-600"></div>
                  <span className="text-sm">Agence</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
                  <span className="text-sm">Service/Division</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-senegal-green-600 mb-2">1</div>
                <p className="text-gray-600">Cabinet Ministériel</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-senegal-yellow-600 mb-2">6</div>
                <p className="text-gray-600">Directions Nationales</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
                <p className="text-gray-600">Agences sous tutelle</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <p className="text-gray-600">Agents et Cadres</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}