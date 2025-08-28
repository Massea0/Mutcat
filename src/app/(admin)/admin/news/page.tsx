'use client'

import { useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { DynamicForm } from '@/components/admin/DynamicForm'
import { newsModel } from '@/lib/admin/models'
import { CrudService } from '@/lib/admin/crud-service'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Download, 
  Upload, 
  Newspaper,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Tag,
  TrendingUp,
  FileText,
  Image
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function NewsAdminPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState('published')
  
  const service = new CrudService(newsModel)

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setIsFormOpen(true)
  }

  const handleDelete = async (item: any) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${item.title}" ?`)) {
      try {
        await service.delete(item.id)
        toast.success('Article supprimé avec succès')
        setRefreshKey(prev => prev + 1)
      } catch (error) {
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  const handleView = (item: any) => {
    window.open(`/actualites/${item.slug}`, '_blank')
  }

  const handleBulkAction = async (action: string, items: string[]) => {
    try {
      switch (action) {
        case 'publish':
          await service.bulkUpdate(items, { status: 'published', published_at: new Date().toISOString() })
          toast.success(`${items.length} articles publiés`)
          break
        case 'archive':
          await service.bulkUpdate(items, { status: 'archived' })
          toast.success(`${items.length} articles archivés`)
          break
        case 'delete':
          if (confirm(`Êtes-vous sûr de vouloir supprimer ${items.length} articles ?`)) {
            await service.bulkDelete(items)
            toast.success(`${items.length} articles supprimés`)
          }
          break
      }
      setRefreshKey(prev => prev + 1)
    } catch (error) {
      toast.error('Erreur lors de l\'action en masse')
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      // Auto-generate slug from title if not provided
      if (!data.slug && data.title) {
        data.slug = data.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }

      if (selectedItem?.id) {
        await service.update(selectedItem.id, data)
        toast.success('Article mis à jour avec succès')
      } else {
        await service.create(data)
        toast.success('Article créé avec succès')
      }
      setIsFormOpen(false)
      setSelectedItem(null)
      setRefreshKey(prev => prev + 1)
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement')
      throw error
    }
  }

  // Stats cards data
  const stats = [
    {
      title: 'Total articles',
      value: 156,
      change: '+12%',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Publiés',
      value: 98,
      change: '+8%',
      icon: Eye,
      color: 'bg-green-500'
    },
    {
      title: 'Brouillons',
      value: 45,
      change: '-5%',
      icon: Edit,
      color: 'bg-yellow-500'
    },
    {
      title: 'Vues totales',
      value: '24.5K',
      change: '+18%',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ]

  // Recent articles preview
  const recentArticles = [
    {
      id: 1,
      title: 'Inauguration du nouveau pont de l\'émergence',
      category: 'Projet',
      author: 'Admin',
      date: new Date(),
      views: 1250,
      status: 'published',
      image: '/images/placeholder.svg'
    },
    {
      id: 2,
      title: 'Conférence sur l\'urbanisme durable à Dakar',
      category: 'Événement',
      author: 'Editeur',
      date: new Date(Date.now() - 86400000),
      views: 890,
      status: 'published',
      image: '/images/placeholder.svg'
    },
    {
      id: 3,
      title: 'Nouveau programme de logements sociaux',
      category: 'Annonce',
      author: 'Admin',
      date: new Date(Date.now() - 172800000),
      views: 2100,
      status: 'draft',
      image: '/images/placeholder.svg'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Actualités</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gérez vos articles, annonces et publications
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          
          <Button
            onClick={() => {
              setSelectedItem(null)
              setIsFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel article
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                {' '}par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Articles Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Articles récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <div key={article.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{article.title}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          {article.category}
                        </span>
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {article.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(article.date, 'dd MMM yyyy', { locale: fr })}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {article.views}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                        {article.status === 'published' ? 'Publié' : 'Brouillon'}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(article)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleView(article)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different article statuses */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="published">Publiés</TabsTrigger>
          <TabsTrigger value="draft">Brouillons</TabsTrigger>
          <TabsTrigger value="archived">Archivés</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <DataTable
            key={`all-${refreshKey}`}
            model={newsModel}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onBulkAction={handleBulkAction}
          />
        </TabsContent>

        <TabsContent value="published" className="mt-6">
          <DataTable
            key={`published-${refreshKey}`}
            model={{
              ...newsModel,
              defaultSort: { field: 'published_at', order: 'desc' }
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onBulkAction={handleBulkAction}
          />
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          <DataTable
            key={`draft-${refreshKey}`}
            model={newsModel}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onBulkAction={handleBulkAction}
          />
        </TabsContent>

        <TabsContent value="archived" className="mt-6">
          <DataTable
            key={`archived-${refreshKey}`}
            model={newsModel}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onBulkAction={handleBulkAction}
          />
        </TabsContent>
      </Tabs>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.id ? 'Modifier l\'article' : 'Nouvel article'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.id 
                ? 'Modifiez les informations de l\'article ci-dessous'
                : 'Remplissez les informations pour créer un nouvel article'}
            </DialogDescription>
          </DialogHeader>
          
          <DynamicForm
            model={newsModel}
            initialData={selectedItem}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false)
              setSelectedItem(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}