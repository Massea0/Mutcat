'use client'

import { useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { DynamicForm } from '@/components/admin/DynamicForm'
import { projectsModel } from '@/lib/admin/models'
import { CrudService } from '@/lib/admin/crud-service'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, Download, Upload } from 'lucide-react'
import { toast } from 'sonner'

export default function ProjectsAdminPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  
  const service = new CrudService(projectsModel)

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setIsFormOpen(true)
  }

  const handleDelete = async (item: any) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${item.title}" ?`)) {
      try {
        await service.delete(item.id)
        toast.success('Projet supprimé avec succès')
        setRefreshKey(prev => prev + 1)
      } catch (error) {
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  const handleView = (item: any) => {
    // Open preview in new tab
    window.open(`/projets/${item.slug}`, '_blank')
  }

  const handleBulkAction = async (action: string, items: string[]) => {
    console.log('Bulk action:', action, items)
    // Implement bulk actions
  }

  const handleSubmit = async (data: any) => {
    try {
      if (selectedItem?.id) {
        await service.update(selectedItem.id, data)
        toast.success('Projet mis à jour avec succès')
      } else {
        await service.create(data)
        toast.success('Projet créé avec succès')
      }
      setIsFormOpen(false)
      setSelectedItem(null)
      setRefreshKey(prev => prev + 1)
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement')
      throw error
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projets</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gérez les projets urbains et d'aménagement du territoire
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          
          <Button
            variant="outline"
            size="sm"
          >
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
            Nouveau projet
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total projets</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            <span className="text-green-600 font-medium">+12%</span> ce mois
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <div className="h-6 w-6 text-yellow-600">⚡</div>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            62% du total
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Terminés</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <div className="h-6 w-6 text-green-600">✓</div>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            33% du total
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget total</p>
              <p className="text-2xl font-bold text-gray-900">850M</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <div className="h-6 w-6 text-purple-600">💰</div>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            FCFA
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        key={refreshKey}
        model={projectsModel}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onBulkAction={handleBulkAction}
      />

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.id ? 'Modifier le projet' : 'Nouveau projet'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.id 
                ? 'Modifiez les informations du projet ci-dessous'
                : 'Remplissez les informations pour créer un nouveau projet'}
            </DialogDescription>
          </DialogHeader>
          
          <DynamicForm
            model={projectsModel}
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