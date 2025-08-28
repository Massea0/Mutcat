"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  Share2,
  MessageSquare,
  TrendingUp,
  Eye,
  Download,
  Plus
} from 'lucide-react'
import { SocialPublisher } from './social-publisher'
import { ContentManager } from './content-manager'
import { AnalyticsDashboard } from './analytics-dashboard'
import Link from 'next/link'

const tabs = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'content', label: 'Gestion du Contenu', icon: FileText },
  { id: 'social', label: 'Réseaux Sociaux', icon: Share2 },
  { id: 'analytics', label: 'Analyses IA', icon: BarChart3 },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'settings', label: 'Paramètres', icon: Settings },
]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Admin */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-senegal-green-500 to-senegal-green-600 p-2">
                  <div className="h-full w-full rounded-lg bg-white/20" />
                </div>
                <span className="font-bold text-xl">MUCTAT Admin</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Voir le site
              </Button>
              <Button variant="gradient" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau contenu
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 h-[calc(100vh-73px)] border-r">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-senegal-green-50 text-senegal-green-600 dark:bg-senegal-green-900/20 dark:text-senegal-green-400'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'content' && <ContentManager />}
          {activeTab === 'social' && <SocialPublisher />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  )
}

function OverviewTab() {
  const stats = [
    { label: 'Articles publiés', value: '156', change: '+12%', icon: FileText, color: 'text-senegal-green-500' },
    { label: 'Visiteurs mensuels', value: '45.2K', change: '+23%', icon: Eye, color: 'text-senegal-yellow-500' },
    { label: 'Messages reçus', value: '89', change: '+5', icon: MessageSquare, color: 'text-senegal-red-500' },
    { label: 'Téléchargements', value: '3.4K', change: '+18%', icon: Download, color: 'text-blue-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Vue d'ensemble de l'activité du site
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} ce mois
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activité récente */}
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
              { action: 'Nouvel article publié', user: 'Admin', time: 'Il y a 2 heures' },
              { action: 'Message de contact reçu', user: 'Citoyen', time: 'Il y a 3 heures' },
              { action: 'Document téléchargé', user: 'Agent', time: 'Il y a 5 heures' },
              { action: 'Mise à jour du projet PNALRU', user: 'Admin', time: 'Il y a 1 jour' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">Par {activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Publier un article</CardTitle>
            <CardDescription>Créer et publier un nouvel article</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Ajouter un projet</CardTitle>
            <CardDescription>Enregistrer un nouveau projet</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Programmer un événement</CardTitle>
            <CardDescription>Créer un nouvel événement</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

function UsersTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestion des utilisateurs
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gérer les comptes et les permissions
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Module de gestion des utilisateurs en cours de développement...</p>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Paramètres
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configuration de la plateforme
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Paramètres système en cours de développement...</p>
        </CardContent>
      </Card>
    </div>
  )
}