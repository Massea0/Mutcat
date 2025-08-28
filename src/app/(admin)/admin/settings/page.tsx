'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import {
  Settings,
  Globe,
  Mail,
  Bell,
  Shield,
  Database,
  Palette,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Upload,
  Link,
  Phone,
  MapPin
} from 'lucide-react';

interface SiteSettings {
  // Informations générales
  site_name: string;
  site_description: string;
  site_keywords: string;
  site_url: string;
  logo_url: string;
  favicon_url: string;
  
  // Contact
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  contact_hours: string;
  
  // Réseaux sociaux
  social_facebook: string;
  social_twitter: string;
  social_linkedin: string;
  social_youtube: string;
  social_instagram: string;
  
  // Email/SMTP
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  smtp_secure: boolean;
  email_from: string;
  email_from_name: string;
  
  // Notifications
  notify_new_user: boolean;
  notify_new_content: boolean;
  notify_new_comment: boolean;
  notify_system_error: boolean;
  notify_emails: string[];
  
  // Sécurité
  enable_2fa: boolean;
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_numbers: boolean;
  password_require_symbols: boolean;
  session_timeout: number;
  max_login_attempts: number;
  
  // Maintenance
  maintenance_mode: boolean;
  maintenance_message: string;
  
  // Analytics
  google_analytics_id: string;
  google_tag_manager_id: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'MUCTAT - Ministère de l\'Urbanisme',
  site_description: 'Site officiel du Ministère de l\'Urbanisme, du Cadre de vie, des Territoires, de l\'Aménagement et du Tourisme',
  site_keywords: 'urbanisme, sénégal, aménagement, territoire, tourisme',
  site_url: 'https://muctat.sn',
  logo_url: '/images/logo.png',
  favicon_url: '/favicon.ico',
  
  contact_email: 'contact@muctat.sn',
  contact_phone: '+221 33 123 45 67',
  contact_address: 'Building Administratif, Dakar, Sénégal',
  contact_hours: 'Lundi - Vendredi: 8h00 - 17h00',
  
  social_facebook: 'https://facebook.com/muctat',
  social_twitter: 'https://twitter.com/muctat',
  social_linkedin: 'https://linkedin.com/company/muctat',
  social_youtube: 'https://youtube.com/muctat',
  social_instagram: 'https://instagram.com/muctat',
  
  smtp_host: 'smtp.gmail.com',
  smtp_port: 587,
  smtp_user: '',
  smtp_password: '',
  smtp_secure: true,
  email_from: 'noreply@muctat.sn',
  email_from_name: 'MUCTAT',
  
  notify_new_user: true,
  notify_new_content: true,
  notify_new_comment: false,
  notify_system_error: true,
  notify_emails: ['admin@muctat.sn'],
  
  enable_2fa: false,
  password_min_length: 8,
  password_require_uppercase: true,
  password_require_numbers: true,
  password_require_symbols: false,
  session_timeout: 30,
  max_login_attempts: 5,
  
  maintenance_mode: false,
  maintenance_message: 'Le site est actuellement en maintenance. Nous serons de retour bientôt.',
  
  google_analytics_id: '',
  google_tag_manager_id: ''
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Charger les paramètres depuis Supabase
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (error) {
        console.log('Site settings table not found or empty, using defaults');
        // Utiliser les paramètres par défaut
        setSettings(DEFAULT_SETTINGS);
      } else if (data) {
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Utiliser les paramètres par défaut en cas d'erreur
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      // Vérifier si la table existe
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .single();
      
      if (existing) {
        // Mettre à jour les paramètres existants
        const { error } = await supabase
          .from('site_settings')
          .update(settings)
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        // Insérer de nouveaux paramètres
        const { error } = await supabase
          .from('site_settings')
          .insert([settings]);
        
        if (error) throw error;
      }
      
      setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès' });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      if (error?.code === 'PGRST204' || error?.code === '42P01') {
        setMessage({ 
          type: 'error', 
          text: 'La table des paramètres n\'existe pas. Veuillez contacter l\'administrateur.' 
        });
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
      }
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-senegal-green-600" />
            Paramètres du site
          </h1>
          <p className="text-gray-600 mt-2">
            Configuration générale et paramètres du système
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>Enregistrement...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full max-w-3xl">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* Général */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Paramètres de base du site web
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site_name">Nom du site</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => updateSetting('site_name', e.target.value)}
                    placeholder="Nom du site"
                  />
                </div>
                <div>
                  <Label htmlFor="site_url">URL du site</Label>
                  <Input
                    id="site_url"
                    value={settings.site_url}
                    onChange={(e) => updateSetting('site_url', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="site_description">Description</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => updateSetting('site_description', e.target.value)}
                  placeholder="Description du site"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="site_keywords">Mots-clés SEO</Label>
                <Input
                  id="site_keywords"
                  value={settings.site_keywords}
                  onChange={(e) => updateSetting('site_keywords', e.target.value)}
                  placeholder="mot1, mot2, mot3"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Réseaux sociaux</CardTitle>
              <CardDescription>
                Liens vers les profils de réseaux sociaux
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="social_facebook">Facebook</Label>
                  <Input
                    id="social_facebook"
                    value={settings.social_facebook}
                    onChange={(e) => updateSetting('social_facebook', e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="social_twitter">Twitter</Label>
                  <Input
                    id="social_twitter"
                    value={settings.social_twitter}
                    onChange={(e) => updateSetting('social_twitter', e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="social_linkedin">LinkedIn</Label>
                  <Input
                    id="social_linkedin"
                    value={settings.social_linkedin}
                    onChange={(e) => updateSetting('social_linkedin', e.target.value)}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="social_youtube">YouTube</Label>
                  <Input
                    id="social_youtube"
                    value={settings.social_youtube}
                    onChange={(e) => updateSetting('social_youtube', e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
              <CardDescription>
                Coordonnées affichées sur le site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_email">Email de contact</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="contact_email"
                      value={settings.contact_email}
                      onChange={(e) => updateSetting('contact_email', e.target.value)}
                      placeholder="contact@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact_phone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="contact_phone"
                      value={settings.contact_phone}
                      onChange={(e) => updateSetting('contact_phone', e.target.value)}
                      placeholder="+221 33 123 45 67"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="contact_address">Adresse</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="contact_address"
                    value={settings.contact_address}
                    onChange={(e) => updateSetting('contact_address', e.target.value)}
                    placeholder="Adresse complète"
                    className="pl-10"
                    rows={2}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="contact_hours">Horaires d'ouverture</Label>
                <Input
                  id="contact_hours"
                  value={settings.contact_hours}
                  onChange={(e) => updateSetting('contact_hours', e.target.value)}
                  placeholder="Lundi - Vendredi: 8h00 - 17h00"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email/SMTP */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration SMTP</CardTitle>
              <CardDescription>
                Paramètres pour l'envoi d'emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp_host">Serveur SMTP</Label>
                  <Input
                    id="smtp_host"
                    value={settings.smtp_host}
                    onChange={(e) => updateSetting('smtp_host', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp_port">Port</Label>
                  <Input
                    id="smtp_port"
                    type="number"
                    value={settings.smtp_port}
                    onChange={(e) => updateSetting('smtp_port', parseInt(e.target.value))}
                    placeholder="587"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp_user">Utilisateur</Label>
                  <Input
                    id="smtp_user"
                    value={settings.smtp_user}
                    onChange={(e) => updateSetting('smtp_user', e.target.value)}
                    placeholder="user@gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp_password">Mot de passe</Label>
                  <Input
                    id="smtp_password"
                    type="password"
                    value={settings.smtp_password}
                    onChange={(e) => updateSetting('smtp_password', e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="smtp_secure"
                  checked={settings.smtp_secure}
                  onCheckedChange={(checked) => updateSetting('smtp_secure', checked)}
                />
                <Label htmlFor="smtp_secure">Connexion sécurisée (TLS/SSL)</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications système</CardTitle>
              <CardDescription>
                Configuration des alertes email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notify_new_user"
                    checked={settings.notify_new_user}
                    onCheckedChange={(checked) => updateSetting('notify_new_user', checked)}
                  />
                  <Label htmlFor="notify_new_user">Nouvel utilisateur inscrit</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notify_new_content"
                    checked={settings.notify_new_content}
                    onCheckedChange={(checked) => updateSetting('notify_new_content', checked)}
                  />
                  <Label htmlFor="notify_new_content">Nouveau contenu publié</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notify_system_error"
                    checked={settings.notify_system_error}
                    onCheckedChange={(checked) => updateSetting('notify_system_error', checked)}
                  />
                  <Label htmlFor="notify_system_error">Erreur système critique</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
              <CardDescription>
                Configuration de la sécurité et des mots de passe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password_min_length">Longueur minimale du mot de passe</Label>
                  <Input
                    id="password_min_length"
                    type="number"
                    value={settings.password_min_length}
                    onChange={(e) => updateSetting('password_min_length', parseInt(e.target.value))}
                    min="6"
                    max="32"
                  />
                </div>
                <div>
                  <Label htmlFor="max_login_attempts">Tentatives de connexion max</Label>
                  <Input
                    id="max_login_attempts"
                    type="number"
                    value={settings.max_login_attempts}
                    onChange={(e) => updateSetting('max_login_attempts', parseInt(e.target.value))}
                    min="3"
                    max="10"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable_2fa"
                    checked={settings.enable_2fa}
                    onCheckedChange={(checked) => updateSetting('enable_2fa', checked)}
                  />
                  <Label htmlFor="enable_2fa">Activer l'authentification à deux facteurs</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="password_require_uppercase"
                    checked={settings.password_require_uppercase}
                    onCheckedChange={(checked) => updateSetting('password_require_uppercase', checked)}
                  />
                  <Label htmlFor="password_require_uppercase">Exiger des majuscules</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="password_require_numbers"
                    checked={settings.password_require_numbers}
                    onCheckedChange={(checked) => updateSetting('password_require_numbers', checked)}
                  />
                  <Label htmlFor="password_require_numbers">Exiger des chiffres</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="password_require_symbols"
                    checked={settings.password_require_symbols}
                    onCheckedChange={(checked) => updateSetting('password_require_symbols', checked)}
                  />
                  <Label htmlFor="password_require_symbols">Exiger des symboles</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mode maintenance</CardTitle>
              <CardDescription>
                Activer le mode maintenance pour effectuer des mises à jour
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenance_mode"
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
                />
                <Label htmlFor="maintenance_mode">Activer le mode maintenance</Label>
              </div>
              
              {settings.maintenance_mode && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Le site est actuellement en mode maintenance. Seuls les administrateurs peuvent y accéder.
                  </AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="maintenance_message">Message de maintenance</Label>
                <Textarea
                  id="maintenance_message"
                  value={settings.maintenance_message}
                  onChange={(e) => updateSetting('maintenance_message', e.target.value)}
                  placeholder="Message affiché aux visiteurs"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}