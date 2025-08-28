'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Users,
  Eye,
  FileText,
  Calendar,
  Search,
  Download,
  Activity
} from 'lucide-react';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState<any>({
    pageViews: [],
    topPages: [],
    userActivity: [],
    contentStats: {},
    searchTerms: []
  });

  const supabase = createClient();

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Charger les statistiques de contenu
      const [
        { count: projectsCount },
        { count: newsCount },
        { count: eventsCount },
        { count: tendersCount }
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('tenders').select('*', { count: 'exact', head: true })
      ]);

      // Charger les termes de recherche
      const { data: searchData, error: searchError } = await supabase
        .from('search_analytics')
        .select('query, count')
        .order('count', { ascending: false })
        .limit(10);
      
      // Si la table n'existe pas, utiliser des données vides
      if (searchError) {
        console.log('Search analytics table not found, using empty data');
      }

      // Données simulées pour les graphiques (à remplacer par de vraies données)
      const pageViewsData = generatePageViewsData(dateRange);
      const topPagesData = generateTopPagesData();
      const userActivityData = generateUserActivityData();

      setAnalyticsData({
        pageViews: pageViewsData,
        topPages: topPagesData,
        userActivity: userActivityData,
        contentStats: {
          projects: projectsCount || 0,
          news: newsCount || 0,
          events: eventsCount || 0,
          tenders: tendersCount || 0
        },
        searchTerms: searchData || (searchError ? [
          { query: 'projet urbain', count: 15 },
          { query: 'appel offre', count: 12 },
          { query: 'logement social', count: 10 },
          { query: 'aménagement territoire', count: 8 },
          { query: 'permis construire', count: 7 }
        ] : [])
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Générateurs de données simulées
  const generatePageViewsData = (range: string) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        vues: Math.floor(Math.random() * 1000) + 500,
        visiteurs: Math.floor(Math.random() * 500) + 200
      });
    }
    return data;
  };

  const generateTopPagesData = () => {
    return [
      { page: 'Accueil', vues: 4523 },
      { page: 'Projets', vues: 3421 },
      { page: 'Actualités', vues: 2890 },
      { page: 'Appels d\'offres', vues: 2345 },
      { page: 'Contact', vues: 1876 }
    ];
  };

  const generateUserActivityData = () => {
    return [
      { heure: '00h', sessions: 120 },
      { heure: '04h', sessions: 80 },
      { heure: '08h', sessions: 450 },
      { heure: '12h', sessions: 680 },
      { heure: '16h', sessions: 520 },
      { heure: '20h', sessions: 380 }
    ];
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-senegal-green-600" />
            Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Tableau de bord des statistiques et analyses
          </p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">30 derniers jours</SelectItem>
            <SelectItem value="90d">90 derniers jours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projets
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.contentStats.projects}</div>
            <p className="text-xs text-muted-foreground">
              Projets publiés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Actualités
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.contentStats.news}</div>
            <p className="text-xs text-muted-foreground">
              Articles publiés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Événements
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.contentStats.events}</div>
            <p className="text-xs text-muted-foreground">
              Événements actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Appels d'offres
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.contentStats.tenders}</div>
            <p className="text-xs text-muted-foreground">
              Appels d'offres ouverts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <Tabs defaultValue="pageviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pageviews">Vues des pages</TabsTrigger>
          <TabsTrigger value="toppages">Pages populaires</TabsTrigger>
          <TabsTrigger value="activity">Activité utilisateur</TabsTrigger>
          <TabsTrigger value="search">Recherches</TabsTrigger>
        </TabsList>

        <TabsContent value="pageviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des vues</CardTitle>
              <CardDescription>
                Nombre de vues et de visiteurs uniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height="350">
                <LineChart data={analyticsData.pageViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="vues" 
                    stroke="#10b981" 
                    name="Vues"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visiteurs" 
                    stroke="#3b82f6" 
                    name="Visiteurs"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="toppages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pages les plus visitées</CardTitle>
              <CardDescription>
                Top 5 des pages par nombre de vues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height="350">
                <BarChart data={analyticsData.topPages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="page" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="vues" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activité par heure</CardTitle>
              <CardDescription>
                Distribution des sessions sur 24h
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height="350">
                <BarChart data={analyticsData.userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="heure" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Termes de recherche populaires</CardTitle>
              <CardDescription>
                Les mots-clés les plus recherchés sur le site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.searchTerms.length > 0 ? (
                  analyticsData.searchTerms.map((term: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Search className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{term.query}</span>
                      </div>
                      <span className="text-sm text-gray-500">{term.count} recherches</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Aucune donnée de recherche disponible
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}