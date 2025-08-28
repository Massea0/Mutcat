'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { SimpleDynamicForm } from '@/components/admin/SimpleDynamicForm'
import { tendersModel } from '@/lib/admin/models/tenders'
import { CrudService } from '@/lib/admin/crud-service'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function TendersPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const crudService = new CrudService(tendersModel)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const result = await crudService.list()
      setData(result.data)
    } catch (error) {
      console.error('Error loading tenders:', error)
      toast.error('Erreur lors du chargement des appels d\'offres')
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
    if (confirm('Êtes-vous sûr de vouloir supprimer cet appel d\'offre ?')) {
      try {
        await crudService.delete(id)
        toast.success('Appel d\'offre supprimé avec succès')
        loadData()
      } catch (error) {
        console.error('Error deleting tender:', error)
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      if (editingItem) {
        await crudService.update(editingItem.id, formData)
        toast.success('Appel d\'offre mis à jour avec succès')
      } else {
        await crudService.create(formData)
        toast.success('Appel d\'offre créé avec succès')
      }
      setIsFormOpen(false)
      loadData()
    } catch (error) {
      console.error('Error saving tender:', error)
      toast.error('Erreur lors de l\'enregistrement')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-senegal-green-600" />
            Appels d'offres
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les appels d'offres et marchés publics
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel appel d'offre
        </Button>
      </div>

      <DataTable
        model={tendersModel}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl" aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Modifier l\'appel d\'offre' : 'Nouvel appel d\'offre'}
            </DialogTitle>
            <p id="dialog-description" className="sr-only">Formulaire de gestion</p>
          </DialogHeader>
          <SimpleDynamicForm
            model={tendersModel}
            initialData={editingItem || {}}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}