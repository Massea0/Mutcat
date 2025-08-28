'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DataTable } from '@/components/admin/DataTable'
import { SimpleDynamicForm } from '@/components/admin/SimpleDynamicForm'
import { usersModel } from '@/lib/admin/models'
import { CrudService } from '@/lib/admin/crud-service'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Download,
  Upload,
  Users,
  UserPlus,
  Shield,
  Key,
  Mail,
  Phone,
  Calendar,
  Activity,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Settings,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Permissions configuration
const permissions = {
  admin: {
    label: 'Administrateur',
    color: 'bg-red-100 text-red-700',
    permissions: [
      'users.create', 'users.read', 'users.update', 'users.delete',
      'projects.create', 'projects.read', 'projects.update', 'projects.delete',
      'news.create', 'news.read', 'news.update', 'news.delete',
      'media.create', 'media.read', 'media.update', 'media.delete',
      'settings.manage', 'audit.view'
    ]
  },
  editor: {
    label: 'Éditeur',
    color: 'bg-blue-100 text-blue-700',
    permissions: [
      'projects.create', 'projects.read', 'projects.update',
      'news.create', 'news.read', 'news.update',
      'media.create', 'media.read', 'media.update'
    ]
  },
  author: {
    label: 'Auteur',
    color: 'bg-green-100 text-green-700',
    permissions: [
      'news.create', 'news.read', 'news.update',
      'media.create', 'media.read'
    ]
  },
  viewer: {
    label: 'Lecteur',
    color: 'bg-gray-100 text-gray-700',
    permissions: [
      'projects.read',
      'news.read',
      'media.read'
    ]
  }
}

export default function UsersAdminPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0
  })
  
  const service = new CrudService(usersModel)
  const supabase = createClient()

  useEffect(() => {
    fetchStats()
  }, [refreshKey])

  const fetchStats = async () => {
    try {
      const { count: total } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      const { count: active } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('active', true)

      const { count: newThisMonth } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

      setStats({
        total: total || 0,
        active: active || 0,
        inactive: (total || 0) - (active || 0),
        newThisMonth: newThisMonth || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleDelete = async (user: any) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.full_name || user.email}" ?`)) {
      try {
        await service.delete(user.id)
        toast.success('Utilisateur supprimé avec succès')
        setRefreshKey(prev => prev + 1)
      } catch (error) {
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  const handlePermissions = (user: any) => {
    setSelectedUser(user)
    setIsPermissionsOpen(true)
  }

  const handleBulkAction = async (action: string, userIds: string[]) => {
    try {
      switch (action) {
        case 'activate':
          await service.bulkUpdate(userIds, { active: true } as any)
          toast.success(`${userIds.length} utilisateur(s) activé(s)`)
          break
        case 'deactivate':
          await service.bulkUpdate(userIds, { active: false } as any)
          toast.success(`${userIds.length} utilisateur(s) désactivé(s)`)
          break
        case 'delete':
          if (confirm(`Êtes-vous sûr de vouloir supprimer ${userIds.length} utilisateur(s) ?`)) {
            await service.bulkDelete(userIds)
            toast.success(`${userIds.length} utilisateur(s) supprimé(s)`)
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
      if (selectedUser?.id) {
        await service.update(selectedUser.id, data)
        toast.success('Utilisateur mis à jour avec succès')
      } else {
        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: data.email,
          password: Math.random().toString(36).slice(-8), // Generate random password
          email_confirm: true
        })

        if (authError) throw authError

        // Create user profile
        await service.create({
          ...data,
          id: authData.user.id
        })
        
        toast.success('Utilisateur créé avec succès')
      }
      setIsFormOpen(false)
      setSelectedUser(null)
      setRefreshKey(prev => prev + 1)
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'enregistrement')
      throw error
    }
  }

  const handlePasswordReset = async (userId: string, email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      toast.success('Email de réinitialisation envoyé')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'envoi')
    }
  }

  const handlePermissionToggle = (permission: string) => {
    if (!selectedUser) return
    
    const currentPermissions = selectedUser.permissions || []
    const newPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter((p: string) => p !== permission)
      : [...currentPermissions, permission]
    
    setSelectedUser({ ...selectedUser, permissions: newPermissions })
  }

  const savePermissions = async () => {
    if (!selectedUser) return
    
    try {
      await service.update(selectedUser.id, {
        permissions: selectedUser.permissions
      } as any)
      toast.success('Permissions mises à jour')
      setIsPermissionsOpen(false)
      setRefreshKey(prev => prev + 1)
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gérez les utilisateurs et leurs permissions
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
              setSelectedUser(null)
              setIsFormOpen(true)
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nouvel utilisateur
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newThisMonth} ce mois
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% du total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}% du total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Ce mois-ci
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par rôle</CardTitle>
          <CardDescription>Distribution des utilisateurs selon leurs rôles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(permissions).map(([role, config]) => (
              <div key={role} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{config.label}</p>
                    <p className="text-sm text-gray-500">{config.permissions.length} permissions</p>
                  </div>
                </div>
                <Badge className={config.color}>
                  12
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="active">Actifs</TabsTrigger>
          <TabsTrigger value="inactive">Inactifs</TabsTrigger>
          <TabsTrigger value="admins">Administrateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <DataTable
            key={`all-${refreshKey}`}
            model={{
              ...usersModel,
              actions: [
                {
                  name: 'permissions',
                  label: 'Gérer permissions',
                  icon: 'Shield',
                  type: 'single',
                  handler: async (ids) => {
                    const user = await service.read(ids[0])
                    if (user) handlePermissions(user)
                  }
                },
                {
                  name: 'reset-password',
                  label: 'Réinitialiser mot de passe',
                  icon: 'Key',
                  type: 'single',
                  handler: async (ids) => {
                    const user = await service.read(ids[0])
                    if (user) handlePasswordReset(user.id, (user as any).email)
                  }
                },
                {
                  name: 'activate',
                  label: 'Activer',
                  icon: 'UserCheck',
                  type: 'bulk',
                  variant: 'default',
                  handler: async (ids) => handleBulkAction('activate', ids)
                },
                {
                  name: 'deactivate',
                  label: 'Désactiver',
                  icon: 'UserX',
                  type: 'bulk',
                  variant: 'secondary',
                  handler: async (ids) => handleBulkAction('deactivate', ids)
                }
              ]
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkAction={handleBulkAction}
          />
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <DataTable
            key={`active-${refreshKey}`}
            model={usersModel}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkAction={handleBulkAction}
          />
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          <DataTable
            key={`inactive-${refreshKey}`}
            model={usersModel}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkAction={handleBulkAction}
          />
        </TabsContent>

        <TabsContent value="admins" className="mt-6">
          <DataTable
            key={`admins-${refreshKey}`}
            model={usersModel}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkAction={handleBulkAction}
          />
        </TabsContent>
      </Tabs>

      {/* User Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl" aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.id ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.id 
                ? 'Modifiez les informations de l\'utilisateur'
                : 'Créez un nouveau compte utilisateur'}
            </DialogDescription>
          </DialogHeader>
          
          <SimpleDynamicForm
            model={usersModel}
            initialData={selectedUser}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false)
              setSelectedUser(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>Gérer les permissions</DialogTitle>
            <DialogDescription>
              Configurez les permissions pour {selectedUser?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* Quick role assignment */}
              <div>
                <Label>Rôle rapide</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {Object.entries(permissions).map(([role, config]) => (
                    <Button
                      key={role}
                      variant={selectedUser.role === role ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSelectedUser({
                          ...selectedUser,
                          role,
                          permissions: config.permissions
                        })
                      }}
                    >
                      {config.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Detailed permissions */}
              <div>
                <Label>Permissions détaillées</Label>
                <div className="space-y-4 mt-4">
                  {/* Projects permissions */}
                  <div>
                    <h4 className="font-medium mb-2">Projets</h4>
                    <div className="space-y-2">
                      {['create', 'read', 'update', 'delete'].map(action => (
                        <div key={action} className="flex items-center justify-between">
                          <Label htmlFor={`projects-${action}`} className="font-normal">
                            {action === 'create' && 'Créer des projets'}
                            {action === 'read' && 'Voir les projets'}
                            {action === 'update' && 'Modifier les projets'}
                            {action === 'delete' && 'Supprimer les projets'}
                          </Label>
                          <Switch
                            id={`projects-${action}`}
                            checked={selectedUser.permissions?.includes(`projects.${action}`)}
                            onCheckedChange={() => handlePermissionToggle(`projects.${action}`)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* News permissions */}
                  <div>
                    <h4 className="font-medium mb-2">Actualités</h4>
                    <div className="space-y-2">
                      {['create', 'read', 'update', 'delete'].map(action => (
                        <div key={action} className="flex items-center justify-between">
                          <Label htmlFor={`news-${action}`} className="font-normal">
                            {action === 'create' && 'Créer des actualités'}
                            {action === 'read' && 'Voir les actualités'}
                            {action === 'update' && 'Modifier les actualités'}
                            {action === 'delete' && 'Supprimer les actualités'}
                          </Label>
                          <Switch
                            id={`news-${action}`}
                            checked={selectedUser.permissions?.includes(`news.${action}`)}
                            onCheckedChange={() => handlePermissionToggle(`news.${action}`)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Users permissions */}
                  <div>
                    <h4 className="font-medium mb-2">Utilisateurs</h4>
                    <div className="space-y-2">
                      {['create', 'read', 'update', 'delete'].map(action => (
                        <div key={action} className="flex items-center justify-between">
                          <Label htmlFor={`users-${action}`} className="font-normal">
                            {action === 'create' && 'Créer des utilisateurs'}
                            {action === 'read' && 'Voir les utilisateurs'}
                            {action === 'update' && 'Modifier les utilisateurs'}
                            {action === 'delete' && 'Supprimer les utilisateurs'}
                          </Label>
                          <Switch
                            id={`users-${action}`}
                            checked={selectedUser.permissions?.includes(`users.${action}`)}
                            onCheckedChange={() => handlePermissionToggle(`users.${action}`)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System permissions */}
                  <div>
                    <h4 className="font-medium mb-2">Système</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="settings-manage" className="font-normal">
                          Gérer les paramètres
                        </Label>
                        <Switch
                          id="settings-manage"
                          checked={selectedUser.permissions?.includes('settings.manage')}
                          onCheckedChange={() => handlePermissionToggle('settings.manage')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="audit-view" className="font-normal">
                          Voir l'audit log
                        </Label>
                        <Switch
                          id="audit-view"
                          checked={selectedUser.permissions?.includes('audit.view')}
                          onCheckedChange={() => handlePermissionToggle('audit.view')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsPermissionsOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={savePermissions}>
                  Sauvegarder les permissions
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}