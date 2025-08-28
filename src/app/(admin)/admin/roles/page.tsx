'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Users,
  Key,
  AlertCircle,
  Check
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  user_count?: number;
  created_at: string;
  updated_at: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

const DEFAULT_PERMISSIONS: Permission[] = [
  // Gestion du contenu
  { id: 'content.create', name: 'Créer du contenu', description: 'Créer des articles, projets, événements', category: 'Contenu' },
  { id: 'content.edit', name: 'Modifier le contenu', description: 'Modifier le contenu existant', category: 'Contenu' },
  { id: 'content.delete', name: 'Supprimer le contenu', description: 'Supprimer le contenu', category: 'Contenu' },
  { id: 'content.publish', name: 'Publier le contenu', description: 'Publier ou dépublier le contenu', category: 'Contenu' },
  
  // Gestion des utilisateurs
  { id: 'users.view', name: 'Voir les utilisateurs', description: 'Consulter la liste des utilisateurs', category: 'Utilisateurs' },
  { id: 'users.create', name: 'Créer des utilisateurs', description: 'Créer de nouveaux utilisateurs', category: 'Utilisateurs' },
  { id: 'users.edit', name: 'Modifier les utilisateurs', description: 'Modifier les informations des utilisateurs', category: 'Utilisateurs' },
  { id: 'users.delete', name: 'Supprimer des utilisateurs', description: 'Supprimer des comptes utilisateurs', category: 'Utilisateurs' },
  { id: 'users.roles', name: 'Gérer les rôles', description: 'Attribuer ou retirer des rôles', category: 'Utilisateurs' },
  
  // Analytics
  { id: 'analytics.view', name: 'Voir les analytics', description: 'Accéder aux statistiques', category: 'Analytics' },
  { id: 'analytics.export', name: 'Exporter les données', description: 'Exporter les données analytics', category: 'Analytics' },
  
  // Système
  { id: 'system.settings', name: 'Paramètres système', description: 'Modifier les paramètres du site', category: 'Système' },
  { id: 'system.audit', name: 'Voir l\'audit', description: 'Consulter les logs d\'audit', category: 'Système' },
  { id: 'system.backup', name: 'Sauvegardes', description: 'Gérer les sauvegardes', category: 'Système' },
];

const DEFAULT_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
    permissions: DEFAULT_PERMISSIONS.map(p => p.id),
    user_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'editor',
    name: 'Éditeur',
    description: 'Peut créer et modifier du contenu',
    permissions: ['content.create', 'content.edit', 'content.publish', 'analytics.view'],
    user_count: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'viewer',
    name: 'Lecteur',
    description: 'Accès en lecture seule',
    permissions: ['analytics.view'],
    user_count: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function RolesPage() {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: []
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      // Simuler le chargement depuis la base de données
      // Dans un cas réel, charger depuis Supabase
      setRoles(DEFAULT_ROLES);
    } catch (error) {
      console.error('Error loading roles:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des rôles' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
    setIsFormOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (roleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) return;
    
    try {
      // Simuler la suppression
      setRoles(roles.filter(r => r.id !== roleId));
      setMessage({ type: 'success', text: 'Rôle supprimé avec succès' });
    } catch (error) {
      console.error('Error deleting role:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (selectedRole) {
        // Mise à jour
        setRoles(roles.map(r => 
          r.id === selectedRole.id 
            ? { ...r, ...formData, updated_at: new Date().toISOString() }
            : r
        ));
        setMessage({ type: 'success', text: 'Rôle mis à jour avec succès' });
      } else {
        // Création
        const newRole: Role = {
          id: Date.now().toString(),
          name: formData.name!,
          description: formData.description!,
          permissions: formData.permissions!,
          user_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setRoles([...roles, newRole]);
        setMessage({ type: 'success', text: 'Rôle créé avec succès' });
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving role:', error);
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement' });
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    const current = formData.permissions || [];
    if (current.includes(permissionId)) {
      setFormData({
        ...formData,
        permissions: current.filter(p => p !== permissionId)
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...current, permissionId]
      });
    }
  };

  const groupedPermissions = DEFAULT_PERMISSIONS.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-senegal-green-600" />
            Gestion des rôles
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les rôles et permissions des utilisateurs
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rôle
        </Button>
      </div>

      {/* Message */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map(role => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{role.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {role.description}
                  </CardDescription>
                </div>
                {role.id !== 'admin' && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(role.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{role.user_count} utilisateur(s)</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Key className="h-4 w-4" />
                    <span>Permissions ({role.permissions.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map(permId => {
                      const perm = DEFAULT_PERMISSIONS.find(p => p.id === permId);
                      return perm ? (
                        <Badge key={permId} variant="secondary" className="text-xs">
                          {perm.name}
                        </Badge>
                      ) : null;
                    })}
                    {role.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 3} autres
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRole ? 'Modifier le rôle' : 'Nouveau rôle'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Informations de base */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nom du rôle</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Modérateur"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du rôle"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-sm font-medium mb-4">Permissions</h3>
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, perms]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                    <div className="space-y-2 pl-4">
                      {perms.map(perm => (
                        <div key={perm.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={perm.id}
                            checked={formData.permissions?.includes(perm.id)}
                            onCheckedChange={() => togglePermission(perm.id)}
                            disabled={selectedRole?.id === 'admin'}
                          />
                          <div className="space-y-1">
                            <label
                              htmlFor={perm.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {perm.name}
                            </label>
                            <p className="text-xs text-gray-500">
                              {perm.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saving || !formData.name || !formData.description}
              >
                {saving ? (
                  <>Enregistrement...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {selectedRole ? 'Mettre à jour' : 'Créer'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}