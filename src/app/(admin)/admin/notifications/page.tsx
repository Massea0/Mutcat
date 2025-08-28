'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bell,
  BellOff,
  Check,
  X,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mail,
  MessageSquare,
  User,
  FileText,
  Calendar,
  Trash2,
  Archive,
  RefreshCw,
  Filter,
  Settings,
  Save
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'system' | 'user' | 'content' | 'security';
  read: boolean;
  archived: boolean;
  created_at: string;
  user_id?: string;
  user_name?: string;
  action_url?: string;
  metadata?: any;
}

// Données simulées
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Nouveau projet publié',
    message: 'Le projet "Modernisation urbaine de Dakar" a été publié avec succès.',
    type: 'success',
    category: 'content',
    read: false,
    archived: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    user_name: 'Admin User',
    action_url: '/admin/projects'
  },
  {
    id: '2',
    title: 'Nouvel utilisateur inscrit',
    message: 'Un nouvel utilisateur s\'est inscrit : editor@muctat.sn',
    type: 'info',
    category: 'user',
    read: false,
    archived: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    action_url: '/admin/users'
  },
  {
    id: '3',
    title: 'Tentative de connexion échouée',
    message: '5 tentatives de connexion échouées détectées pour l\'IP 192.168.1.100',
    type: 'warning',
    category: 'security',
    read: true,
    archived: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: '4',
    title: 'Sauvegarde automatique',
    message: 'La sauvegarde automatique de la base de données a été effectuée avec succès.',
    type: 'success',
    category: 'system',
    read: true,
    archived: false,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: '5',
    title: 'Espace disque faible',
    message: 'L\'espace disque disponible est inférieur à 10%. Veuillez libérer de l\'espace.',
    type: 'error',
    category: 'system',
    read: false,
    archived: false,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  }
];

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: false,
    system: true,
    security: true,
    content: true,
    users: true
  });

  const supabase = createClient();

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, activeTab]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Simuler le chargement depuis la base de données
      // Dans un cas réel, charger depuis Supabase
      setNotifications(MOCK_NOTIFICATIONS);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = [...notifications];
    
    switch (activeTab) {
      case 'unread':
        filtered = filtered.filter(n => !n.read);
        break;
      case 'archived':
        filtered = filtered.filter(n => n.archived);
        break;
      case 'all':
      default:
        filtered = filtered.filter(n => !n.archived);
        break;
    }
    
    setFilteredNotifications(filtered);
  };

  const markAsRead = async (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const archiveNotification = async (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, archived: true } : n
    ));
  };

  const deleteNotification = async (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'content':
        return <FileText className="h-4 w-4" />;
      case 'security':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
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
            <Bell className="h-8 w-8 text-senegal-green-600" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos notifications et alertes système
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
          <Button variant="outline" onClick={loadNotifications}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des notifications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">
                    Toutes ({notifications.filter(n => !n.archived).length})
                  </TabsTrigger>
                  <TabsTrigger value="unread">
                    Non lues ({unreadCount})
                  </TabsTrigger>
                  <TabsTrigger value="archived">
                    Archivées ({notifications.filter(n => n.archived).length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                {notification.title}
                                {!notification.read && (
                                  <Badge variant="secondary" className="text-xs">
                                    Nouveau
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  {getCategoryIcon(notification.category)}
                                  {notification.category}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(notification.created_at).toLocaleString('fr-FR')}
                                </span>
                                {notification.user_name && (
                                  <span className="text-xs text-gray-500">
                                    Par {notification.user_name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => markAsRead(notification.id)}
                                  title="Marquer comme lu"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              {!notification.archived ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => archiveNotification(notification.id)}
                                  title="Archiver"
                                >
                                  <Archive className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteNotification(notification.id)}
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          {notification.action_url && (
                            <Button
                              variant="link"
                              className="h-auto p-0 mt-2 text-xs"
                              asChild
                            >
                              <a href={notification.action_url}>
                                Voir plus →
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <BellOff className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune notification</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Paramètres de notification */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
              <CardDescription>
                Configurez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Canaux de notification</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Email</span>
                    </div>
                    <Switch
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, email: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Push</span>
                    </div>
                    <Switch
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, push: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Types de notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Système</span>
                    <Switch
                      checked={notificationSettings.system}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, system: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sécurité</span>
                    <Switch
                      checked={notificationSettings.security}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, security: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Contenu</span>
                    <Switch
                      checked={notificationSettings.content}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, content: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Utilisateurs</span>
                    <Switch
                      checked={notificationSettings.users}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, users: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les préférences
              </Button>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="font-semibold">{notifications.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Non lues</span>
                  <span className="font-semibold text-blue-600">{unreadCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Archivées</span>
                  <span className="font-semibold">
                    {notifications.filter(n => n.archived).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Aujourd'hui</span>
                  <span className="font-semibold">
                    {notifications.filter(n => {
                      const today = new Date().toDateString();
                      return new Date(n.created_at).toDateString() === today;
                    }).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}