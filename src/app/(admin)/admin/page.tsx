'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import {
  Users,
  FileText,
  Building,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Eye,
  MessageSquare,
  Download,
  Upload,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Données simulées pour les graphiques
const monthlyData = [
  { month: 'Jan', projets: 12, actualites: 45, visiteurs: 12000 },
  { month: 'Fév', projets: 15, actualites: 52, visiteurs: 15000 },
  { month: 'Mar', projets: 18, actualites: 48, visiteurs: 18000 },
  { month: 'Avr', projets: 22, actualites: 61, visiteurs: 22000 },
  { month: 'Mai', projets: 28, actualites: 58, visiteurs: 28000 },
  { month: 'Jun', projets: 32, actualites: 72, visiteurs: 35000 },
]

const projectStatusData = [
  { name: 'En cours', value: 28, color: '#ffb800' },
  { name: 'Terminés', value: 15, color: '#00923f' },
  { name: 'En attente', value: 8, color: '#d91010' },
  { name: 'Planifiés', value: 12, color: '#6366f1' },
]

const recentActivities = [
  { id: 1, type: 'project', action: 'Nouveau projet créé', title: 'Réhabilitation urbaine de Pikine', user: 'Admin', time: 'Il y a 2 heures' },
  { id: 2, type: 'news', action: 'Article publié', title: 'Lancement du programme de modernisation', user: 'Editeur', time: 'Il y a 3 heures' },
  { id: 3, type: 'user', action: 'Nouvel utilisateur', title: 'Marie Diop', user: 'Système', time: 'Il y a 5 heures' },
  { id: 4, type: 'event', action: 'Événement créé', title: 'Conférence sur l\'urbanisme durable', user: 'Admin', time: 'Hier' },
  { id: 5, type: 'document', action: 'Document téléchargé', title: 'Rapport annuel 2024', user: 'Manager', time: 'Hier' },
]

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    users: { total: 0, growth: 0 },
    projects: { total: 0, growth: 0 },
    news: { total: 0, growth: 0 },
    visits: { total: 0, growth: 0 }
  })
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch real data from Supabase
      const [usersCount, projectsCount, newsCount] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('news').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        users: { total: usersCount.count || 0, growth: 12.5 },
        projects: { total: projectsCount.count || 0, growth: 8.2 },
        news: { total: newsCount.count || 0, growth: 15.3 },
        visits: { total: 45230, growth: 22.4 }
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ 
    title, 
    value, 
    growth, 
    icon: Icon, 
    color 
  }: { 
    title: string
    value: number
    growth: number
    icon: any
    color: string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString('fr-FR')}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          {growth > 0 ? (
            <>
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+{growth}%</span>
            </>
          ) : (
            <>
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500">{growth}%</span>
            </>
          )}
          <span className="ml-1">vs mois dernier</span>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-senegal-green-600" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-2 text-sm text-gray-600">
            Bienvenue sur votre espace d'administration MUCTAT
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedPeriod === 'week' && 'Cette semaine'}
                {selectedPeriod === 'month' && 'Ce mois'}
                {selectedPeriod === 'year' && 'Cette année'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedPeriod('week')}>
                Cette semaine
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod('month')}>
                Ce mois
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod('year')}>
                Cette année
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Utilisateurs"
          value={stats.users.total}
          growth={stats.users.growth}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Projets"
          value={stats.projects.total}
          growth={stats.projects.growth}
          icon={Building}
          color="bg-green-500"
        />
        <StatCard
          title="Actualités"
          value={stats.news.total}
          growth={stats.news.growth}
          icon={FileText}
          color="bg-purple-500"
        />
        <StatCard
          title="Visiteurs"
          value={stats.visits.total}
          growth={stats.visits.growth}
          icon={Eye}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Évolution du trafic</CardTitle>
                <CardDescription>Visiteurs mensuels du site</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Voir détails</DropdownMenuItem>
                  <DropdownMenuItem>Exporter données</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorVisiteurs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00923f" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00923f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="visiteurs"
                  stroke="#00923f"
                  fillOpacity={1}
                  fill="url(#colorVisiteurs)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Status Pie Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Statut des projets</CardTitle>
                <CardDescription>Répartition par état d'avancement</CardDescription>
              </div>
              <Badge variant="outline">63 projets</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance du contenu</CardTitle>
          <CardDescription>Comparaison mensuelle des publications</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="projets" fill="#00923f" name="Projets" />
              <Bar dataKey="actualites" fill="#ffb800" name="Actualités" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Activité récente</CardTitle>
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'project' ? 'bg-blue-100' :
                    activity.type === 'news' ? 'bg-green-100' :
                    activity.type === 'user' ? 'bg-purple-100' :
                    activity.type === 'event' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'project' && <Building className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'news' && <FileText className="h-4 w-4 text-green-600" />}
                    {activity.type === 'user' && <Users className="h-4 w-4 text-purple-600" />}
                    {activity.type === 'event' && <Calendar className="h-4 w-4 text-yellow-600" />}
                    {activity.type === 'document' && <Download className="h-4 w-4 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.title}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>{activity.user}</span>
                      <span className="mx-1">•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Accès direct aux fonctionnalités principales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 flex-col">
                <FileText className="h-6 w-6 mb-2" />
                <span>Nouvelle actualité</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col">
                <Building className="h-6 w-6 mb-2" />
                <span>Nouveau projet</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span>Gérer utilisateurs</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                <span>Créer événement</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span>Messages</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col">
                <Upload className="h-6 w-6 mb-2" />
                <span>Upload média</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>Santé du système</CardTitle>
          <CardDescription>État des services et performances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Base de données</p>
                  <p className="text-xs text-gray-500">PostgreSQL - Supabase</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={85} className="w-24" />
                <span className="text-sm text-gray-600">85%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Stockage</p>
                  <p className="text-xs text-gray-500">45 GB / 100 GB utilisés</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={45} className="w-24" />
                <span className="text-sm text-gray-600">45%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Activity className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">API Calls</p>
                  <p className="text-xs text-gray-500">8,542 / 10,000 ce mois</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={85} className="w-24" />
                <span className="text-sm text-gray-600">85%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Temps de réponse</p>
                  <p className="text-xs text-gray-500">Moyenne: 124ms</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50">
                Excellent
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}