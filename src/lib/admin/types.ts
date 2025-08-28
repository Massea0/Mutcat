/**
 * Admin System Type Definitions
 * Silicon Valley-grade TypeScript architecture
 */

// Generic CRUD operations interface
export interface CrudOperations<T> {
  create: (data: Partial<T>) => Promise<T>
  read: (id: string) => Promise<T | null>
  update: (id: string, data: Partial<T>) => Promise<T>
  delete: (id: string) => Promise<boolean>
  list: (options?: ListOptions) => Promise<ListResponse<T>>
}

// List options for pagination, filtering, sorting
export interface ListOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
  search?: string
  includes?: string[]
}

// List response with pagination metadata
export interface ListResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Base entity interface
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

// Field configuration for dynamic forms
export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  helpText?: string
  validation?: ValidationRule[]
  options?: SelectOption[]
  multiple?: boolean
  accept?: string // for file inputs
  maxSize?: number // for file inputs
  richText?: boolean // for textarea
  defaultValue?: any
  disabled?: boolean
  hidden?: boolean
  dependsOn?: DependencyRule
  grid?: GridConfig
}

export type FieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'datetime'
  | 'time'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'richtext'
  | 'file'
  | 'image'
  | 'gallery'
  | 'json'
  | 'relation'
  | 'tags'
  | 'color'
  | 'url'
  | 'slug'

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom'
  value?: any
  message: string
  validator?: (value: any) => boolean
}

export interface SelectOption {
  value: string | number
  label: string
  icon?: string
  disabled?: boolean
}

export interface DependencyRule {
  field: string
  condition: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'empty' | 'not_empty'
  value?: any
}

export interface GridConfig {
  cols?: number
  span?: number
  offset?: number
}

// Model configuration for admin panels
export interface ModelConfig {
  name: string
  label: string
  pluralLabel: string
  icon?: string
  description?: string
  tableName: string
  primaryKey?: string
  fields: FieldConfig[]
  listFields?: string[]
  searchFields?: string[]
  filterFields?: string[]
  sortFields?: string[]
  defaultSort?: { field: string; order: 'asc' | 'desc' }
  permissions?: ModelPermissions
  hooks?: ModelHooks
  actions?: ModelAction[]
  relations?: ModelRelation[]
  features?: ModelFeatures
}

export interface ModelPermissions {
  create?: string[]
  read?: string[]
  update?: string[]
  delete?: string[]
  export?: string[]
  import?: string[]
}

export interface ModelHooks {
  beforeCreate?: (data: any) => Promise<any>
  afterCreate?: (data: any) => Promise<void>
  beforeUpdate?: (id: string, data: any) => Promise<any>
  afterUpdate?: (id: string, data: any) => Promise<void>
  beforeDelete?: (id: string) => Promise<boolean>
  afterDelete?: (id: string) => Promise<void>
}

export interface ModelAction {
  name: string
  label: string
  icon?: string
  type: 'single' | 'bulk' | 'global'
  variant?: 'default' | 'primary' | 'secondary' | 'danger'
  handler: (ids: string[]) => Promise<void>
  confirm?: {
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
  }
}

export interface ModelRelation {
  name: string
  type: 'belongs_to' | 'has_many' | 'has_one' | 'many_to_many'
  model: string
  foreignKey?: string
  localKey?: string
  pivotTable?: string
  eager?: boolean
}

export interface ModelFeatures {
  search?: boolean
  filters?: boolean
  sort?: boolean
  pagination?: boolean
  export?: boolean
  import?: boolean
  bulkActions?: boolean
  trash?: boolean
  versions?: boolean
  audit?: boolean
  duplicate?: boolean
  preview?: boolean
}

// Admin panel configuration
export interface AdminConfig {
  title: string
  logo?: string
  favicon?: string
  theme?: AdminTheme
  models: ModelConfig[]
  navigation?: NavigationConfig[]
  dashboard?: DashboardConfig
  settings?: AdminSettings
}

export interface AdminTheme {
  primaryColor?: string
  secondaryColor?: string
  darkMode?: boolean
  sidebarStyle?: 'light' | 'dark' | 'gradient'
  layout?: 'fixed' | 'fluid'
}

export interface NavigationConfig {
  label: string
  icon?: string
  items: NavigationItem[]
}

export interface NavigationItem {
  label: string
  icon?: string
  path?: string
  model?: string
  badge?: string | number
  children?: NavigationItem[]
  permissions?: string[]
}

export interface DashboardConfig {
  widgets: DashboardWidget[]
  layout?: 'grid' | 'list'
}

export interface DashboardWidget {
  id: string
  type: 'stat' | 'chart' | 'table' | 'calendar' | 'activity' | 'custom'
  title: string
  description?: string
  size?: 'small' | 'medium' | 'large' | 'full'
  config: any
  permissions?: string[]
}

export interface AdminSettings {
  itemsPerPage?: number
  dateFormat?: string
  timeFormat?: string
  timezone?: string
  language?: string
  allowRegistration?: boolean
  requireEmailVerification?: boolean
  sessionTimeout?: number
  maxUploadSize?: number
  allowedFileTypes?: string[]
}

// Audit log types
export interface AuditLog {
  id: string
  user_id: string
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'export' | 'import'
  model?: string
  record_id?: string
  changes?: Record<string, { old: any; new: any }>
  ip_address?: string
  user_agent?: string
  created_at: string
}

// Media management types
export interface MediaFile {
  id: string
  filename: string
  original_name: string
  mime_type: string
  size: number
  url: string
  thumbnail_url?: string
  alt_text?: string
  caption?: string
  folder_id?: string
  tags?: string[]
  metadata?: Record<string, any>
  created_by?: string
  created_at: string
  updated_at: string
}

export interface MediaFolder {
  id: string
  name: string
  parent_id?: string
  path: string
  created_at: string
  updated_at: string
}