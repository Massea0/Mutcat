/**
 * Generic CRUD Service
 * Reusable data layer for all admin operations
 */

import { createClient } from '@/lib/supabase/client'
import type {
  CrudOperations,
  ListOptions,
  ListResponse,
  BaseEntity,
  ModelConfig
} from './types'
import { AuditService } from './audit-service'

export class CrudService<T extends BaseEntity> implements CrudOperations<T> {
  private supabase = createClient()
  private tableName: string
  private config: ModelConfig

  constructor(config: ModelConfig) {
    this.config = config
    this.tableName = config.tableName
  }

  /**
   * Create a new record
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      // Execute beforeCreate hook if exists
      let processedData = data
      if (this.config.hooks?.beforeCreate) {
        processedData = await this.config.hooks.beforeCreate(data)
      }

      const { data: created, error } = await this.supabase
        .from(this.tableName)
        .insert(processedData)
        .select()
        .single()

      if (error) throw error

      // Execute afterCreate hook if exists
      if (this.config.hooks?.afterCreate) {
        await this.config.hooks.afterCreate(created)
      }

      return created
    } catch (error) {
      console.error(`Error creating ${this.config.name}:`, error)
      throw new Error(`Failed to create ${this.config.label}`)
    }
  }

  /**
   * Read a single record by ID
   */
  async read(id: string): Promise<T | null> {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select('*')
        .eq(this.config.primaryKey || 'id', id)

      // Include relations if configured
      if (this.config.relations) {
        for (const relation of this.config.relations) {
          if (relation.eager) {
            query = query.select(`*, ${relation.name}(*)`)
          }
        }
      }

      const { data, error } = await query.single()

      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        throw error
      }

      return data
    } catch (error) {
      console.error(`Error reading ${this.config.name}:`, error)
      throw new Error(`Failed to read ${this.config.label}`)
    }
  }

  /**
   * Update a record
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      // Execute beforeUpdate hook if exists
      let processedData = data
      if (this.config.hooks?.beforeUpdate) {
        processedData = await this.config.hooks.beforeUpdate(id, data)
      }

      // Add updated_at timestamp
      processedData = {
        ...processedData,
        updated_at: new Date().toISOString()
      }

      const { data: updated, error } = await this.supabase
        .from(this.tableName)
        .update(processedData)
        .eq(this.config.primaryKey || 'id', id)
        .select()
        .single()

      if (error) throw error

      // Execute afterUpdate hook if exists
      if (this.config.hooks?.afterUpdate) {
        await this.config.hooks.afterUpdate(id, updated)
      }

      return updated
    } catch (error) {
      console.error(`Error updating ${this.config.name}:`, error)
      throw new Error(`Failed to update ${this.config.label}`)
    }
  }

  /**
   * Delete a record (soft delete if trash feature is enabled)
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Execute beforeDelete hook if exists
      if (this.config.hooks?.beforeDelete) {
        const canDelete = await this.config.hooks.beforeDelete(id)
        if (!canDelete) return false
      }

      if (this.config.features?.trash) {
        // Soft delete
        const { error } = await this.supabase
          .from(this.tableName)
          .update({ deleted_at: new Date().toISOString() })
          .eq(this.config.primaryKey || 'id', id)

        if (error) throw error
      } else {
        // Hard delete
        const { error } = await this.supabase
          .from(this.tableName)
          .delete()
          .eq(this.config.primaryKey || 'id', id)

        if (error) throw error
      }

      // Execute afterDelete hook if exists
      if (this.config.hooks?.afterDelete) {
        await this.config.hooks.afterDelete(id)
      }

      return true
    } catch (error) {
      console.error(`Error deleting ${this.config.name}:`, error)
      throw new Error(`Failed to delete ${this.config.label}`)
    }
  }

  /**
   * List records with pagination, filtering, sorting
   */
  async list(options: ListOptions = {}): Promise<ListResponse<T>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = this.config.defaultSort?.field || 'created_at',
        sortOrder = this.config.defaultSort?.order || 'desc',
        filters = {},
        search = '',
        includes = []
      } = options

      let query = this.supabase.from(this.tableName).select('*', { count: 'exact' })

      // Apply soft delete filter if trash feature is enabled
      if (this.config.features?.trash) {
        query = query.is('deleted_at', null)
      }

      // Apply filters
      for (const [field, value] of Object.entries(filters)) {
        if (value !== null && value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            query = query.in(field, value)
          } else if (typeof value === 'object' && value.min !== undefined) {
            query = query.gte(field, value.min)
            if (value.max !== undefined) {
              query = query.lte(field, value.max)
            }
          } else {
            query = query.eq(field, value)
          }
        }
      }

      // Apply search
      if (search && this.config.searchFields?.length) {
        const searchConditions = this.config.searchFields
          .map(field => `${field}.ilike.%${search}%`)
          .join(',')
        query = query.or(searchConditions)
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // Apply pagination
      const start = (page - 1) * limit
      query = query.range(start, start + limit - 1)

      // Include relations
      if (includes.length > 0) {
        const includeString = includes.map(rel => `${rel}(*)`).join(',')
        query = query.select(`*, ${includeString}`)
      }

      const { data, error, count } = await query

      if (error) throw error

      const total = count || 0
      const totalPages = Math.ceil(total / limit)

      return {
        data: data || [],
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    } catch (error) {
      console.error(`Error listing ${this.config.name}:`, error)
      throw new Error(`Failed to list ${this.config.pluralLabel}`)
    }
  }

  /**
   * Bulk update records
   */
  async bulkUpdate(ids: string[], data: Partial<T>): Promise<number> {
    try {
      const { data: updated, error } = await this.supabase
        .from(this.tableName)
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .in(this.config.primaryKey || 'id', ids)
        .select()

      if (error) throw error

      return updated?.length || 0
    } catch (error) {
      console.error(`Error bulk updating ${this.config.name}:`, error)
      throw new Error(`Failed to bulk update ${this.config.pluralLabel}`)
    }
  }

  /**
   * Bulk delete records
   */
  async bulkDelete(ids: string[]): Promise<number> {
    try {
      if (this.config.features?.trash) {
        // Soft delete
        const { data: deleted, error } = await this.supabase
          .from(this.tableName)
          .update({ deleted_at: new Date().toISOString() })
          .in(this.config.primaryKey || 'id', ids)
          .select()

        if (error) throw error
        return deleted?.length || 0
      } else {
        // Hard delete
        const { data: deleted, error } = await this.supabase
          .from(this.tableName)
          .delete()
          .in(this.config.primaryKey || 'id', ids)
          .select()

        if (error) throw error
        return deleted?.length || 0
      }
    } catch (error) {
      console.error(`Error bulk deleting ${this.config.name}:`, error)
      throw new Error(`Failed to bulk delete ${this.config.pluralLabel}`)
    }
  }

  /**
   * Export data to CSV
   */
  async export(options: ListOptions = {}): Promise<string> {
    try {
      const allData = await this.list({ ...options, limit: 10000 })
      
      if (allData.data.length === 0) {
        return ''
      }

      // Get headers from first item
      const headers = Object.keys(allData.data[0])
      const csvHeaders = headers.join(',')

      // Convert data to CSV rows
      const csvRows = allData.data.map(item => {
        return headers.map(header => {
          const value = (item as any)[header]
          if (value === null || value === undefined) return ''
          if (typeof value === 'object') return JSON.stringify(value)
          return `"${String(value).replace(/"/g, '""')}"`
        }).join(',')
      })

      return [csvHeaders, ...csvRows].join('\n')
    } catch (error) {
      console.error(`Error exporting ${this.config.name}:`, error)
      throw new Error(`Failed to export ${this.config.pluralLabel}`)
    }
  }

  /**
   * Import data from CSV
   */
  async import(csvData: string): Promise<number> {
    try {
      const lines = csvData.split('\n').filter(line => line.trim())
      if (lines.length < 2) return 0

      const headers = lines[0].split(',').map(h => h.trim())
      const records = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].match(/(".*?"|[^,]+)/g) || []
        const record: any = {}

        headers.forEach((header, index) => {
          let value = values[index]?.trim() || ''
          // Remove quotes
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1).replace(/""/g, '"')
          }
          // Try to parse JSON
          try {
            record[header] = JSON.parse(value)
          } catch {
            record[header] = value
          }
        })

        records.push(record)
      }

      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(records)
        .select()

      if (error) throw error

      return data?.length || 0
    } catch (error) {
      console.error(`Error importing ${this.config.name}:`, error)
      throw new Error(`Failed to import ${this.config.pluralLabel}`)
    }
  }

  /**
   * Get statistics for dashboard
   */
  async getStats(): Promise<any> {
    try {
      const { count: total } = await this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true })

      const { count: recent } = await this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      return {
        total,
        recent,
        growth: total && recent ? ((recent / total) * 100).toFixed(1) : 0
      }
    } catch (error) {
      console.error(`Error getting stats for ${this.config.name}:`, error)
      return { total: 0, recent: 0, growth: 0 }
    }
  }
}