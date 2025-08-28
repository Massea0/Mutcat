'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { DynamicForm } from '@/components/admin/DynamicForm'
import { publicationsModel } from '@/lib/admin/models/publications'
import { CrudService } from '@/lib/admin/crud-service'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function PublicationsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const crudService = new CrudService(publicationsModel)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const result = await crudService.list()
      setData(result.data)
    } catch (error) {
      console.error('Error loading publications:', error)
      toast.error('Erreur lors du chargement des publications')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingItem(null)
    setIsFormOpen(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      try {
        await crudService.delete(id)
        toast.success('Publication supprimée avec succès')
        loadData()
      } catch (error) {
        console.error('Error deleting publication:', error)
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      if (editingItem) {
        await crudService.update(editingItem.id, formData)
        toast.success('Publication mise à jour avec succès')
      } else {
        await crudService.create(formData)
        toast.success('Publication créée avec succès')
      }
      setIsFormOpen(false)
      loadData()
    } catch (error) {
      console.error('Error saving publication:', error)
      toast.error('Erreur lors de l\'enregistrement')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-senegal-green-600" />
            Publications & Documents
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les documents et publications officielles
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle publication
        </Button>
      </div>

      <DataTable
        model={publicationsModel}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Modifier la publication' : 'Nouvelle publication'}
            </DialogTitle>
            <p id="dialog-description" className="sr-only">Formulaire de gestion</p>
          </DialogHeader>
          <DynamicForm
            model={publicationsModel}
            initialData={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}