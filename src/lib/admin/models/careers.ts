import type { ModelConfig } from '../types'

export const careersModel: ModelConfig = {
  name: 'careers',
  label: 'Offre d\'emploi',
  pluralLabel: 'Offres d\'emploi',
  icon: 'Briefcase',
  description: 'Gestion des offres d\'emploi et recrutements',
  tableName: 'careers',
  fields: [
    {
      name: 'reference',
      label: 'Référence',
      type: 'text',
      required: true,
      placeholder: 'REF-2024-001',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'title',
      label: 'Titre du poste',
      type: 'text',
      required: true,
      placeholder: 'Ex: Ingénieur en génie civil',
      grid: { cols: 12, span: 8 }
    },
    {
      name: 'department',
      label: 'Direction/Service',
      type: 'text',
      placeholder: 'Service concerné',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'location',
      label: 'Lieu de travail',
      type: 'text',
      required: true,
      placeholder: 'Dakar, Sénégal',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'contract_type',
      label: 'Type de contrat',
      type: 'select',
      required: true,
      options: [
        { value: 'permanent', label: 'CDI' },
        { value: 'temporary', label: 'CDD' },
        { value: 'internship', label: 'Stage' },
        { value: 'consultant', label: 'Consultant' }
      ],
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'level',
      label: 'Niveau',
      type: 'select',
      options: [
        { value: 'junior', label: 'Junior' },
        { value: 'mid', label: 'Intermédiaire' },
        { value: 'senior', label: 'Senior' },
        { value: 'executive', label: 'Cadre supérieur' }
      ],
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'description',
      label: 'Description du poste',
      type: 'richtext',
      required: true,
      placeholder: 'Description détaillée du poste...',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'responsibilities',
      label: 'Responsabilités',
      type: 'tags',
      placeholder: 'Ajouter une responsabilité',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'requirements',
      label: 'Exigences',
      type: 'tags',
      placeholder: 'Ajouter une exigence',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'nice_to_have',
      label: 'Atouts',
      type: 'tags',
      placeholder: 'Ajouter un atout',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'benefits',
      label: 'Avantages',
      type: 'tags',
      placeholder: 'Ajouter un avantage',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'salary_min',
      label: 'Salaire minimum',
      type: 'number',
      placeholder: '0',
      grid: { cols: 12, span: 4 }
    },
    {
      name: 'salary_max',
      label: 'Salaire maximum',
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
      name: 'application_deadline',
      label: 'Date limite de candidature',
      type: 'date',
      required: true,
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'start_date',
      label: 'Date de début',
      type: 'date',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'documents_required',
      label: 'Documents requis',
      type: 'tags',
      placeholder: 'Ex: CV, Lettre de motivation...',
      grid: { cols: 12, span: 12 }
    },
    {
      name: 'application_email',
      label: 'Email de candidature',
      type: 'email',
      placeholder: 'recrutement@muctat.sn',
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'application_link',
      label: 'Lien de candidature',
      type: 'url',
      placeholder: 'https://...',
      grid: { cols: 12, span: 6 }
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
        { value: 'filled', label: 'Pourvu' }
      ],
      grid: { cols: 12, span: 6 }
    },
    {
      name: 'is_featured',
      label: 'Mettre en avant',
      type: 'boolean',
      defaultValue: false,
      grid: { cols: 12, span: 6 }
    }
  ],
  listFields: ['reference', 'title', 'department', 'contract_type', 'application_deadline', 'status'],
  searchFields: ['title', 'description', 'department'],
  filterFields: ['contract_type', 'level', 'status', 'department'],
  sortFields: ['application_deadline', 'created_at', 'title'],
  defaultSort: { field: 'application_deadline', order: 'asc' },
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
      confirmation: 'Voulez-vous publier cette offre ?',
      condition: (item) => item.status === 'draft'
    },
    {
      name: 'close',
      label: 'Clôturer',
      icon: 'Lock',
      variant: 'warning',
      confirmation: 'Voulez-vous clôturer cette offre ?',
      condition: (item) => item.status === 'open'
    },
    {
      name: 'fill',
      label: 'Marquer comme pourvu',
      icon: 'CheckCircle',
      variant: 'success',
      confirmation: 'Le poste a-t-il été pourvu ?',
      condition: (item) => item.status === 'closed'
    }
  ]
}