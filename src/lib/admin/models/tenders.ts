import type { ModelConfig } from '../types'

export const tendersModel: ModelConfig = {
  name: 'tenders',
  label: 'Appel d\'offre',
  pluralLabel: 'Appels d\'offres',
  icon: 'FileText',
  description: 'Gestion des appels d\'offres et marchés publics',
  tableName: 'tenders',
  fields: [
    {
      name: 'reference',
      label: 'Référence',
      type: 'text',
      required: true,
      placeholder: 'AO-2024-001',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'title',
      label: 'Titre',
      type: 'text',
      required: true,
      placeholder: 'Titre de l\'appel d\'offre',
      grid: { cols: 12, span: 8 }
    },
    {
      name: 'description',
      label: 'Description',
      type: 'richtext',
      required: true,
      placeholder: 'Description détaillée...',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: [
        { value: 'goods', label: 'Fournitures' },
        { value: 'services', label: 'Services' },
        { value: 'works', label: 'Travaux' },
        { value: 'consulting', label: 'Consultation' }
      ],
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'category',
      label: 'Catégorie',
      type: 'text',
      placeholder: 'Ex: Construction, IT, Conseil...',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'budget_min',
      label: 'Budget minimum',
      type: 'number',
      placeholder: '0',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'budget_max',
      label: 'Budget maximum',
      type: 'number',
      placeholder: '0',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'currency',
      label: 'Devise',
      type: 'select',
      defaultValue: 'XOF',
      options: [
        { value: 'XOF', label: 'FCFA' },
        { value: 'EUR', label: 'Euro' },
        { value: 'USD', label: 'Dollar US' }
      ],
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'submission_deadline',
      label: 'Date limite de soumission',
      type: 'datetime',
      required: true,
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'opening_date',
      label: 'Date d\'ouverture des plis',
      type: 'datetime',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'requirements',
      label: 'Exigences',
      type: 'tags',
      placeholder: 'Ajouter une exigence',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'evaluation_criteria',
      label: 'Critères d\'évaluation',
      type: 'textarea',
      placeholder: 'Décrivez les critères d\'évaluation...',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'contact_person',
      label: 'Personne de contact',
      type: 'text',
      placeholder: 'Nom complet',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'contact_email',
      label: 'Email de contact',
      type: 'email',
      placeholder: 'email@example.com',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'contact_phone',
      label: 'Téléphone de contact',
      type: 'tel',
      placeholder: '+221 XX XXX XX XX',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'documents',
      label: 'Documents',
      type: 'file-multiple',
      accept: '.pdf,.doc,.docx,.xls,.xlsx',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { value: 'draft', label: 'Brouillon' },
        { value: 'open', label: 'Ouvert' },
        { value: 'closed', label: 'Fermé' },
        { value: 'awarded', label: 'Attribué' },
        { value: 'cancelled', label: 'Annulé' }
      ],
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'is_featured',
      label: 'Mettre en avant',
      type: 'boolean',
      defaultValue: false,
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'winner_company',
      label: 'Entreprise gagnante',
      type: 'text',
      placeholder: 'Nom de l\'entreprise',
      dependsOn: { field: 'status', value: 'awarded' },
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'award_date',
      label: 'Date d\'attribution',
      type: 'date',
      dependsOn: { field: 'status', value: 'awarded' },
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'award_amount',
      label: 'Montant attribué',
      type: 'number',
      dependsOn: { field: 'status', value: 'awarded' },
      grid: { cols: 12, span: 4 }
    }
  ],
  listFields: ['reference', 'title', 'type', 'submission_deadline', 'status'],
  searchFields: ['reference', 'title', 'description'],
  filterFields: ['type', 'status', 'category'],
  sortFields: ['submission_deadline', 'created_at', 'reference'],
  defaultSort: { field: 'submission_deadline', order: 'asc' },
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
      confirmation: 'Voulez-vous publier cet appel d\'offre ?',
      condition: (item) => item.status === 'draft'
    },
    {
      name: 'close',
      label: 'Clôturer',
      icon: 'Lock',
      variant: 'warning',
      confirmation: 'Voulez-vous clôturer cet appel d\'offre ?',
      condition: (item) => item.status === 'open'
    },
    {
      name: 'award',
      label: 'Attribuer',
      icon: 'Award',
      variant: 'success',
      confirmation: 'Voulez-vous attribuer ce marché ?',
      condition: (item) => item.status === 'closed'
    }
  ]
}