'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Upload,
  Image as ImageIcon,
  MoveUp,
  MoveDown,
  Star,
  StarOff
} from 'lucide-react'
import { cmsService } from '@/lib/cms/services'
import { storageService } from '@/lib/supabase/storage'
import { toast } from 'sonner'

export default function CMSPage() {
  const [heroSliders, setHeroSliders] = useState([])
  const [statistics, setStatistics] = useState([])
  const [partners, setPartners] = useState([])
  const [featuredNews, setFeaturedNews] = useState([])
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      const [sliders, stats, partnersData, news, projects] = await Promise.all([
        cmsService.getHeroSliders(),
        cmsService.getStatistics(),
        cmsService.getPartners(),
        cmsService.getFeaturedNews(10),
        cmsService.getFeaturedProjects(10)
      ])

      setHeroSliders(sliders)
      setStatistics(stats)
      setPartners(partnersData)
      setFeaturedNews(news)
      setFeaturedProjects(projects)
    } catch (error) {
      console.error('Error loading CMS data:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File, type: string, id?: string) => {
    try {
      const result = await storageService.uploadImage(file, type)
      toast.success('Image téléchargée avec succès')
      return result.url
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Erreur lors du téléchargement de l\'image')
      return null
    }
  }

  const toggleFeatured = async (type: 'news' | 'project', id: string, featured: boolean) => {
    try {
      if (type === 'news') {
        await cmsService.toggleFeaturedNews(id, featured)
        toast.success(featured ? 'Article mis en avant' : 'Article retiré de la une')
      } else {
        await cmsService.toggleFeaturedProject(id, featured)
        toast.success(featured ? 'Projet mis en avant' : 'Projet retiré de la une')
      }
      loadAllData()
    } catch (error) {
      console.error('Error toggling featured:', error)
      toast.error('Erreur lors de la modification')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-senegal-green-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestion du Contenu (CMS)</h1>
        <p className="text-gray-600 mt-2">
          Gérez le contenu affiché sur le site public
        </p>
      </div>

      <Tabs defaultValue="sliders" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="sliders">Slider Accueil</TabsTrigger>
          <TabsTrigger value="featured">À la Une</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          <TabsTrigger value="partners">Partenaires</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        {/* Hero Sliders */}
        <TabsContent value="sliders">
          <Card>
            <CardHeader>
              <CardTitle>Slides de la Page d'Accueil</CardTitle>
              <CardDescription>
                Gérez les images et textes du slider principal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {heroSliders.map((slide, index) => (
                  <div key={slide.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{slide.title}</h3>
                        {slide.subtitle && (
                          <p className="text-sm text-gray-600">{slide.subtitle}</p>
                        )}
                        {slide.description && (
                          <p className="text-sm text-gray-500 mt-1">{slide.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={slide.is_active ? 'default' : 'secondary'}>
                            {slide.is_active ? 'Actif' : 'Inactif'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Ordre: {slide.order_index}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {slide.image_url && (
                      <div className="mt-3">
                        <img 
                          src={slide.image_url} 
                          alt={slide.title}
                          className="h-32 w-auto rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
                
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un slide
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Featured Content */}
        <TabsContent value="featured">
          <div className="space-y-6">
            {/* Featured News */}
            <Card>
              <CardHeader>
                <CardTitle>Actualités à la Une</CardTitle>
                <CardDescription>
                  Sélectionnez les articles à mettre en avant sur la page d'accueil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {featuredNews.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{article.title}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(article.published_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={article.is_featured ? 'default' : 'outline'}
                        onClick={() => toggleFeatured('news', article.id, !article.is_featured)}
                      >
                        {article.is_featured ? (
                          <>
                            <Star className="h-4 w-4 mr-1 fill-current" />
                            À la une
                          </>
                        ) : (
                          <>
                            <StarOff className="h-4 w-4 mr-1" />
                            Mettre à la une
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Projets Phares</CardTitle>
                <CardDescription>
                  Sélectionnez les projets à mettre en avant sur la page d'accueil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {featuredProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm text-gray-500">{project.location}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={project.is_featured ? 'default' : 'outline'}
                        onClick={() => toggleFeatured('project', project.id, !project.is_featured)}
                      >
                        {project.is_featured ? (
                          <>
                            <Star className="h-4 w-4 mr-1 fill-current" />
                            Projet phare
                          </>
                        ) : (
                          <>
                            <StarOff className="h-4 w-4 mr-1" />
                            Mettre en avant
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>
                Gérez les chiffres clés affichés sur le site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {statistics.map((stat) => (
                  <div key={stat.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Input 
                        value={stat.value}
                        className="w-24 font-bold text-lg"
                        placeholder="Valeur"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Input 
                      value={stat.label}
                      className="mb-2"
                      placeholder="Label"
                    />
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{stat.icon || 'Pas d\'icône'}</Badge>
                      <span className="text-sm text-gray-500">Ordre: {stat.order_index}</span>
                    </div>
                  </div>
                ))}
                
                <Button className="border-2 border-dashed h-32 hover:border-solid">
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partners */}
        <TabsContent value="partners">
          <Card>
            <CardHeader>
              <CardTitle>Partenaires</CardTitle>
              <CardDescription>
                Gérez les logos et liens des partenaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {partners.map((partner) => (
                  <div key={partner.id} className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{partner.name}</h4>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {partner.logo_url && (
                      <img 
                        src={partner.logo_url}
                        alt={partner.name}
                        className="h-16 w-full object-contain mb-2"
                      />
                    )}
                    {partner.website_url && (
                      <a 
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline truncate block"
                      >
                        {partner.website_url}
                      </a>
                    )}
                  </div>
                ))}
                
                <Button variant="outline" className="border-2 border-dashed h-32 hover:border-solid">
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du Site</CardTitle>
              <CardDescription>
                Configuration générale du site public
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="home-title">Titre de la page d'accueil</Label>
                  <Input 
                    id="home-title"
                    placeholder="Ministère de l'Urbanisme du Sénégal"
                  />
                </div>
                <div>
                  <Label htmlFor="home-subtitle">Sous-titre de la page d'accueil</Label>
                  <Input 
                    id="home-subtitle"
                    placeholder="Bâtir ensemble le Sénégal de demain"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Nombre d'actualités sur la page d'accueil</Label>
                    <p className="text-sm text-gray-500">Articles affichés dans la section actualités</p>
                  </div>
                  <Input type="number" className="w-20" defaultValue={3} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Nombre de projets sur la page d'accueil</Label>
                    <p className="text-sm text-gray-500">Projets affichés dans la section projets</p>
                  </div>
                  <Input type="number" className="w-20" defaultValue={4} />
                </div>
                
                <div className="pt-4">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les paramètres
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}