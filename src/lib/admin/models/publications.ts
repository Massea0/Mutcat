import type { ModelConfig } from '../types'

export const publicationsModel: ModelConfig = {
  name: 'publications',
  label: 'Publication',
  pluralLabel: 'Publications',
  icon: 'FileText',
  description: 'Gestion des documents et publications officielles',
  tableName: 'publications',
  fields: [
    {
      name: 'title',
      label: 'Titre',
      type: 'text',
      required: true,
      placeholder: 'Titre du document',
      grid: { cols: 12, span: 8 }
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'slug',
      placeholder: 'titre-du-document',
      dependsOn: { field: 'title', condition: 'not_empty' },
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Description du document...',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'type',
      label: 'Type de document',
      type: 'select',
      required: true,
      options: [
        { value: 'report', label: 'Rapport' },
        { value: 'law', label: 'Loi' },
        { value: 'decree', label: 'Décret' },
        { value: 'circular', label: 'Circulaire' },
        { value: 'guide', label: 'Guide' },
        { value: 'form', label: 'Formulaire' }
      ],
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'category',
      label: 'Catégorie',
      type: 'text',
      placeholder: 'Ex: Urbanisme, Logement...',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'file_url',
      label: 'Document',
      type: 'file',
      required: true,
      accept: '.pdf,.doc,.docx,.xls,.xlsx',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'cover_image_url',
      label: 'Image de couverture',
      type: 'image',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'language',
      label: 'Langue',
      type: 'select',
      defaultValue: 'fr',
      options: [
        { value: 'fr', label: 'Français' },
        { value: 'en', label: 'Anglais' },
        { value: 'wo', label: 'Wolof' }
      ],
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'year',
      label: 'Année',
      type: 'number',
      placeholder: new Date().getFullYear().toString(),
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'author',
      label: 'Auteur',
      type: 'text',
      placeholder: 'Nom de l\'auteur ou institution',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'department',
      label: 'Direction/Service',
      type: 'text',
      placeholder: 'Service responsable',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'tags',
      label: 'Mots-clés',
      type: 'tags',
      placeholder: 'Ajouter un mot-clé',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'is_featured',
      label: 'Mettre en avant',
      type: 'boolean',
      defaultValue: false,
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'is_downloadable',
      label: 'Téléchargeable',
      type: 'boolean',
      defaultValue: true,
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { value: 'draft', label: 'Brouillon' },
        { value: 'published', label: 'Publié' },
        { value: 'archived', label: 'Archivé' }
      ],
      grid: { cols: 12, span: 4 }
    }
  ],
  listFields: ['title', 'type', 'category', 'year', 'status', 'download_count'],
  searchFields: ['title', 'description', 'tags'],
  filterFields: ['type', 'category', 'status', 'language', 'year'],
  sortFields: ['title', 'year', 'created_at', 'download_count'],
  defaultSort: { field: 'created_at', order: 'desc' },
  features: {
    search: true,
    filters: true,
    sort: true,
    pagination: true,
    export: true,
    import: true,
    bulkActions: true,
    trash: false,
    audit: true,
    duplicate: true,
    preview: true
  },
  actions: [
    {
      name: 'publish',
      label: 'Publier',
      icon: 'Send',
      variant: 'default',
      confirmation: 'Voulez-vous publier ce document ?',
      condition: (item) => item.status === 'draft'
    },
    {
      name: 'archive',
      label: 'Archiver',
      icon: 'Archive',
      variant: 'warning',
      confirmation: 'Voulez-vous archiver ce document ?',
      condition: (item) => item.status === 'published'
    },
    {
      name: 'download',
      label: 'Télécharger',
      icon: 'Download',
      variant: 'outline',
      condition: (item) => item.file_url
    }
  ]
}