'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  FileText,
  Building,
  Calendar,
  TrendingUp,
  Eye,
  MessageSquare,
  Briefcase
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalNews: number;
  totalEvents: number;
  totalTenders: number;
  totalPublications: number;
  totalCareers: number;
  totalViews: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les statistiques
      const [
        { count: usersCount },
        { count: projectsCount },
        { count: newsCount },
        { count: eventsCount },
        { count: tendersCount },
        { count: publicationsCount },
        { count: careersCount }
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('tenders').select('*', { count: 'exact', head: true }),
        supabase.from('publications').select('*', { count: 'exact', head: true }),
        supabase.from('careers').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalUsers: usersCount || 0,
        totalProjects: projectsCount || 0,
        totalNews: newsCount || 0,
        totalEvents: eventsCount || 0,
        totalTenders: tendersCount || 0,
        totalPublications: publicationsCount || 0,
        totalCareers: careersCount || 0,
        totalViews: Math.floor(Math.random() * 10000) + 5000 // Simulation
      });
    } catch (err) {
      console.error('Erreur dashboard:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Utilisateurs',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Projets',
      value: stats?.totalProjects || 0,
      icon: Building,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Actualités',
      value: stats?.totalNews || 0,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Événements',
      value: stats?.totalEvents || 0,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Appels d\'offres',
      value: stats?.totalTenders || 0,
      icon: Briefcase,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Publications',
      value: stats?.totalPublications || 0,
      icon: MessageSquare,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      title: 'Offres d\'emploi',
      value: stats?.totalCareers || 0,
      icon: Users,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Vues totales',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre plateforme</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
                  +12% depuis le mois dernier
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Dernières actions sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Nouveau projet ajouté', time: 'Il y a 2 heures', icon: Building },
                { action: 'Article publié', time: 'Il y a 4 heures', icon: FileText },
                { action: 'Nouvel utilisateur inscrit', time: 'Il y a 6 heures', icon: Users },
                { action: 'Événement créé', time: 'Hier', icon: Calendar },
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accès rapide aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => router.push('/admin/projects')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <Building className="h-6 w-6 text-primary mb-2" />
                <p className="font-medium">Nouveau projet</p>
                <p className="text-xs text-gray-500">Créer un projet</p>
              </button>
              <button 
                onClick={() => router.push('/admin/news')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <FileText className="h-6 w-6 text-primary mb-2" />
                <p className="font-medium">Nouvel article</p>
                <p className="text-xs text-gray-500">Publier une actualité</p>
              </button>
              <button 
                onClick={() => router.push('/admin/events')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <Calendar className="h-6 w-6 text-primary mb-2" />
                <p className="font-medium">Nouvel événement</p>
                <p className="text-xs text-gray-500">Créer un événement</p>
              </button>
              <button 
                onClick={() => router.push('/admin/users')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <Users className="h-6 w-6 text-primary mb-2" />
                <p className="font-medium">Gérer les utilisateurs</p>
                <p className="text-xs text-gray-500">Administration</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}