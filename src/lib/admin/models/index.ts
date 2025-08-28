/**
 * Model Configurations for Admin Panel
 * Define all data models and their admin interfaces
 */

import type { ModelConfig } from '../types'

export const projectsModel: ModelConfig = {
  name: 'projects',
  label: 'Projet',
  pluralLabel: 'Projets',
  icon: 'Building',
  description: 'Gestion des projets urbains et d\'aménagement',
  tableName: 'projects',
  fields: [
    {
      name: 'title',
      label: 'Titre',
      type: 'text',
      required: true,
      placeholder: 'Nom du projet',
      grid: { cols: 12, span: 8 }
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'slug',
      placeholder: 'nom-du-projet',
      dependsOn: { field: 'title', condition: 'not_empty' },
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'description',
      label: 'Description',
      type: 'richtext',
      required: true,
      placeholder: 'Description détaillée du projet...',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'objectives',
      label: 'Objectifs',
      type: 'tags',
      placeholder: 'Ajouter un objectif',
      helpText: 'Listez les objectifs principaux du projet',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      required: true,
      options: [
        { value: 'planning', label: 'En planification', icon: 'Clock' },
        { value: 'ongoing', label: 'En cours', icon: 'Play' },
        { value: 'completed', label: 'Terminé', icon: 'CheckCircle' },
        { value: 'suspended', label: 'Suspendu', icon: 'PauseCircle' }
      ],
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'progress',
      label: 'Progression (%)',
      type: 'number',
      validation: [
        { type: 'min', value: 0, message: 'La progression doit être entre 0 et 100' },
        { type: 'max', value: 100, message: 'La progression doit être entre 0 et 100' }
      ],
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'budget',
      label: 'Budget (FCFA)',
      type: 'number',
      placeholder: '0',
      helpText: 'Budget total en Francs CFA',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'start_date',
      label: 'Date de début',
      type: 'date',
      required: true,
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'end_date',
      label: 'Date de fin',
      type: 'date',
      required: true,
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'location',
      label: 'Localisation',
      type: 'text',
      placeholder: 'Ville, région ou coordonnées',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'partners',
      label: 'Partenaires',
      type: 'tags',
      placeholder: 'Ajouter un partenaire',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'gallery',
      label: 'Galerie d\'images',
      type: 'gallery',
      accept: 'image/*',
      multiple: true,
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'documents',
      label: 'Documents',
      type: 'file',
      accept: '.pdf,.doc,.docx,.xls,.xlsx',
      multiple: true,
      grid: { cols: 12, span: 12 }
    }
  ],
  listFields: ['title', 'status', 'progress', 'budget', 'start_date'],
  searchFields: ['title', 'description', 'location'],
  filterFields: ['status', 'location'],
  sortFields: ['title', 'created_at', 'progress', 'budget'],
  defaultSort: { field: 'created_at', order: 'desc' },
  features: {
    search: true,
    filters: true,
    sort: true,
    pagination: true,
    export: true,
    import: true,
    bulkActions: true,
    trash: false,  // Désactivé car la colonne deleted_at n'existe pas
    audit: true,
    duplicate: true,
    preview: true,
    softDelete: false
  },
  actions: [
    {
      name: 'publish',
      label: 'Publier',
      icon: 'Send',
      type: 'bulk',
      variant: 'primary',
      handler: async (ids) => {
        console.log('Publishing projects:', ids)
      }
    },
    {
      name: 'archive',
      label: 'Archiver',
      icon: 'Archive',
      type: 'bulk',
      variant: 'secondary',
      handler: async (ids) => {
        console.log('Archiving projects:', ids)
      },
      confirm: {
        title: 'Archiver les projets',
        message: 'Êtes-vous sûr de vouloir archiver ces projets ?'
      }
    }
  ]
}

export const newsModel: ModelConfig = {
  name: 'news',
  label: 'Actualité',
  pluralLabel: 'Actualités',
  icon: 'Newspaper',
  description: 'Gestion des articles et actualités',
  tableName: 'news',
  fields: [
    {
      name: 'title',
      label: 'Titre',
      type: 'text',
      required: true,
      placeholder: 'Titre de l\'article',
      grid: { cols: 12, span: 9 }
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'slug',
      dependsOn: { field: 'title', condition: 'not_empty' },
      grid: { cols: 12, span: 3 }
    },
    {
      name: 'excerpt',
      label: 'Extrait',
      type: 'textarea',
      required: true,
      placeholder: 'Résumé de l\'article...',
      helpText: 'Court résumé qui apparaîtra dans les listes',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'content',
      label: 'Contenu',
      type: 'richtext',
      required: true,
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'category',
      label: 'Catégorie',
      type: 'select',
      required: true,
      options: [
        { value: 'announcement', label: 'Annonce' },
        { value: 'event', label: 'Événement' },
        { value: 'press', label: 'Presse' },
        { value: 'project', label: 'Projet' },
        { value: 'partnership', label: 'Partenariat' }
      ],
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      required: true,
      options: [
        { value: 'draft', label: 'Brouillon' },
        { value: 'published', label: 'Publié' },
        { value: 'archived', label: 'Archivé' }
      ],
      defaultValue: 'draft',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'published_at',
      label: 'Date de publication',
      type: 'datetime',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'featured_image',
      label: 'Image à la une',
      type: 'image',
      accept: 'image/*',
      required: true,
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'tags',
      placeholder: 'Ajouter un tag',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'author_id',
      label: 'Auteur',
      type: 'relation',
      required: true,
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'featured',
      label: 'Mettre en avant',
      type: 'checkbox',
      helpText: 'Afficher cet article en page d\'accueil',
      grid: { cols: 12, span: 6 }
    }
  ],
  listFields: ['title', 'category', 'status', 'published_at', 'featured'],
  searchFields: ['title', 'excerpt', 'content'],
  filterFields: ['category', 'status', 'featured'],
  sortFields: ['title', 'published_at', 'created_at'],
  defaultSort: { field: 'published_at', order: 'desc' },
  features: {
    search: true,
    filters: true,
    sort: true,
    pagination: true,
    export: true,
    import: true,
    bulkActions: true,
    trash: true,
    versions: true,
    audit: true,
    duplicate: true,
    preview: true
  }
}

export const usersModel: ModelConfig = {
  name: 'users',
  label: 'Utilisateur',
  pluralLabel: 'Utilisateurs',
  icon: 'Users',
  description: 'Gestion des utilisateurs et permissions',
  tableName: 'users',
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'email@example.com',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'full_name',
      label: 'Nom complet',
      type: 'text',
      required: true,
      placeholder: 'Prénom Nom',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'role',
      label: 'Rôle',
      type: 'select',
      required: true,
      options: [
        { value: 'admin', label: 'Administrateur' },
        { value: 'editor', label: 'Éditeur' },
        { value: 'author', label: 'Auteur' },
        { value: 'viewer', label: 'Lecteur' }
      ],
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'department',
      label: 'Département',
      type: 'text',
      placeholder: 'Nom du département',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'phone',
      label: 'Téléphone',
      type: 'text',
      placeholder: '+221 XX XXX XX XX',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'avatar',
      label: 'Photo de profil',
      type: 'image',
      accept: 'image/*',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'bio',
      label: 'Biographie',
      type: 'textarea',
      placeholder: 'Quelques mots sur vous...',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'active',
      label: 'Compte actif',
      type: 'checkbox',
      defaultValue: true,
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'email_verified',
      label: 'Email vérifié',
      type: 'checkbox',
      grid: { cols: 12, span: 6 }
    }
  ],
  listFields: ['full_name', 'email', 'role', 'department', 'active'],
  searchFields: ['full_name', 'email', 'department'],
  filterFields: ['role', 'department', 'active'],
  sortFields: ['full_name', 'email', 'created_at'],
  defaultSort: { field: 'created_at', order: 'desc' },
  features: {
    search: true,
    filters: true,
    sort: true,
    pagination: true,
    export: true,
    import: true,
    bulkActions: true,
    audit: true
  },
  permissions: {
    create: ['admin'],
    update: ['admin'],
    delete: ['admin'],
    read: ['admin', 'editor']
  }
}

export const mediaModel: ModelConfig = {
  name: 'media',
  label: 'Média',
  pluralLabel: 'Médias',
  icon: 'Image',
  description: 'Gestion des images et fichiers',
  tableName: 'media',
  fields: [
    {
      name: 'filename',
      label: 'Nom du fichier',
      type: 'text',
      required: true,
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'mime_type',
      label: 'Type MIME',
      type: 'text',
      disabled: true,
      grid: { cols: 12, span: 3 }
    },
    {
      name: 'size',
      label: 'Taille',
      type: 'number',
      disabled: true,
      grid: { cols: 12, span: 3 }
    },
    {
      name: 'alt_text',
      label: 'Texte alternatif',
      type: 'text',
      placeholder: 'Description de l\'image pour l\'accessibilité',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'caption',
      label: 'Légende',
      type: 'textarea',
      placeholder: 'Légende ou description',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'tags',
      placeholder: 'Ajouter un tag',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'folder_id',
      label: 'Dossier',
      type: 'relation',
      grid: { cols: 12, span: 12 }
    }
  ],
  listFields: ['filename', 'mime_type', 'size', 'created_at'],
  searchFields: ['filename', 'alt_text', 'caption'],
  filterFields: ['mime_type', 'folder_id'],
  sortFields: ['filename', 'size', 'created_at'],
  defaultSort: { field: 'created_at', order: 'desc' },
  features: {
    search: true,
    filters: true,
    sort: true,
    pagination: true,
    bulkActions: true,
    trash: true
  }
}

// Export all models
export const adminModels = [
  projectsModel,
  newsModel,
  usersModel,
  mediaModel
]