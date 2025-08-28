'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { SafeDynamicForm } from '@/components/admin/SafeDynamicForm'
import { eventsModel } from '@/lib/admin/models/events'
import { CrudService } from '@/lib/admin/crud-service'
import { Button } from '@/components/ui/button'
import { Plus, Calendar } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function EventsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const crudService = new CrudService(eventsModel)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const result = await crudService.list()
      setData(result.data)
    } catch (error) {
      console.error('Error loading events:', error)
      toast.error('Erreur lors du chargement des événements')
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
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await crudService.delete(id)
        toast.success('Événement supprimé avec succès')
        loadData()
      } catch (error) {
        console.error('Error deleting event:', error)
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      if (editingItem) {
        await crudService.update(editingItem.id, formData)
        toast.success('Événement mis à jour avec succès')
      } else {
        await crudService.create(formData)
        toast.success('Événement créé avec succès')
      }
      setIsFormOpen(false)
      loadData()
    } catch (error) {
      console.error('Error saving event:', error)
      toast.error('Erreur lors de l\'enregistrement')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-senegal-green-600" />
            Événements
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les événements et manifestations
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel événement
        </Button>
      </div>

      <DataTable
        model={eventsModel}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="event-form-description">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Modifier l\'événement' : 'Nouvel événement'}
            </DialogTitle>
            <p id="event-form-description" className="sr-only">
              Formulaire pour {editingItem ? 'modifier' : 'créer'} un événement
            </p>
          </DialogHeader>
          <SafeDynamicForm
            model={eventsModel}
            initialData={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}