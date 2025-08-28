import type { ModelConfig } from '../types'

export const eventsModel: ModelConfig = {
  name: 'events',
  label: 'Événement',
  pluralLabel: 'Événements',
  icon: 'Calendar',
  description: 'Gestion des événements et manifestations',
  tableName: 'events',
  fields: [
    {
      name: 'title',
      label: 'Titre',
      type: 'text',
      required: true,
      placeholder: 'Nom de l\'événement',
      grid: { cols: 12, span: 8 }
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'slug',
      placeholder: 'nom-evenement',
      dependsOn: { field: 'title', condition: 'not_empty' },
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'description',
      label: 'Description',
      type: 'richtext',
      required: true,
      placeholder: 'Description détaillée de l\'événement...',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'event_type',
      label: 'Type d\'événement',
      type: 'select',
      required: true,
      options: [
        { value: 'conference', label: 'Conférence' },
        { value: 'workshop', label: 'Atelier' },
        { value: 'seminar', label: 'Séminaire' },
        { value: 'meeting', label: 'Réunion' },
        { value: 'ceremony', label: 'Cérémonie' },
        { value: 'other', label: 'Autre' }
      ],
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'category',
      label: 'Catégorie',
      type: 'text',
      placeholder: 'Ex: Formation, Inauguration...',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'start_date',
      label: 'Date de début',
      type: 'datetime',
      required: true,
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'end_date',
      label: 'Date de fin',
      type: 'datetime',
      required: true,
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'venue',
      label: 'Lieu',
      type: 'text',
      required: true,
      placeholder: 'Nom du lieu',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'venue_address',
      label: 'Adresse',
      type: 'textarea',
      placeholder: 'Adresse complète du lieu',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'venue_map_url',
      label: 'Lien Google Maps',
      type: 'url',
      placeholder: 'https://maps.google.com/...',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'organizer',
      label: 'Organisateur',
      type: 'text',
      placeholder: 'Nom de l\'organisateur',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'partners',
      label: 'Partenaires',
      type: 'tags',
      placeholder: 'Ajouter un partenaire',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'registration_required',
      label: 'Inscription requise',
      type: 'boolean',
      defaultValue: false,
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'registration_link',
      label: 'Lien d\'inscription',
      type: 'url',
      placeholder: 'https://...',
      dependsOn: { field: 'registration_required', value: true },
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'max_participants',
      label: 'Nombre max de participants',
      type: 'number',
      placeholder: '0',
      dependsOn: { field: 'registration_required', value: true },
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'speakers',
      label: 'Intervenants',
      type: 'json',
      placeholder: '[{"name": "...", "title": "...", "bio": "..."}]',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'agenda',
      label: 'Programme',
      type: 'json',
      placeholder: '[{"time": "09:00", "title": "...", "description": "..."}]',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'image_url',
      label: 'Image principale',
      type: 'image',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'gallery_images',
      label: 'Galerie d\'images',
      type: 'image-multiple',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'documents',
      label: 'Documents',
      type: 'file-multiple',
      accept: '.pdf,.doc,.docx,.ppt,.pptx',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'live_stream_url',
      label: 'Lien de diffusion en direct',
      type: 'url',
      placeholder: 'https://youtube.com/live/...',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'recording_url',
      label: 'Lien de l\'enregistrement',
      type: 'url',
      placeholder: 'https://youtube.com/watch?v=...',
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
      name: 'status',
      label: 'Statut',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { value: 'draft', label: 'Brouillon' },
        { value: 'published', label: 'Publié' },
        { value: 'cancelled', label: 'Annulé' },
        { value: 'postponed', label: 'Reporté' },
        { value: 'completed', label: 'Terminé' }
      ],
      grid: { cols: 12, span: 3 }
    },
    {
      name: 'is_featured',
      label: 'Mettre en avant',
      type: 'boolean',
      defaultValue: false,
      grid: { cols: 12, span: 3 }
    }
  ],
  listFields: ['title', 'event_type', 'start_date', 'venue', 'status'],
  searchFields: ['title', 'description', 'venue', 'tags'],
  filterFields: ['event_type', 'status', 'category'],
  sortFields: ['start_date', 'title', 'created_at'],
  defaultSort: { field: 'start_date', order: 'desc' },
  features: {
    search: true,
    filters: true,
    sort: true,
    pagination: true,
    export: true,
    import: false,
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
      confirmation: 'Voulez-vous publier cet événement ?',
      condition: (item) => item.status === 'draft'
    },
    {
      name: 'cancel',
      label: 'Annuler',
      icon: 'X',
      variant: 'destructive',
      confirmation: 'Voulez-vous annuler cet événement ?',
      condition: (item) => item.status === 'published'
    },
    {
      name: 'postpone',
      label: 'Reporter',
      icon: 'Clock',
      variant: 'warning',
      confirmation: 'Voulez-vous reporter cet événement ?',
      condition: (item) => item.status === 'published'
    }
  ]
}