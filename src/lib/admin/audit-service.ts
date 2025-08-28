import { createClient } from '@/lib/supabase/server'

export interface AuditLog {
  id?: string
  user_id: string
  user_email?: string
  action: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout'
  entity_type: string
  entity_id?: string
  entity_name?: string
  changes?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at?: string
}

export class AuditService {
  static async log(log: AuditLog): Promise<void> {
    try {
      const supabase = await createClient()
      
      // Récupérer les infos utilisateur si non fournies
      if (!log.user_email && log.user_id) {
        const { data: userData } = await supabase
          .from('users')
          .select('email')
          .eq('id', log.user_id)
          .single()
        
        if (userData) {
          log.user_email = userData.email
        }
      }

      // Enregistrer le log
      const { error } = await supabase
        .from('audit_logs')
        .insert([{
          ...log,
          created_at: new Date().toISOString()
        }])

      if (error) {
        console.error('Error logging audit:', error)
      }
    } catch (error) {
      console.error('Audit logging failed:', error)
      // Ne pas faire échouer l'opération principale si l'audit échoue
    }
  }

  static async getRecentLogs(limit: number = 50): Promise<AuditLog[]> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching audit logs:', error)
      return []
    }

    return data || []
  }

  static async getUserLogs(userId: string, limit: number = 50): Promise<AuditLog[]> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching user logs:', error)
      return []
    }

    return data || []
  }

  static async getEntityLogs(entityType: string, entityId: string): Promise<AuditLog[]> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching entity logs:', error)
      return []
    }

    return data || []
  }

  static async getAnalytics(days: number = 7): Promise<any> {
    const supabase = await createClient()
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('audit_logs')
      .select('action, entity_type, created_at')
      .gte('created_at', startDate.toISOString())

    if (error) {
      console.error('Error fetching analytics:', error)
      return null
    }

    // Analyser les données
    const analytics = {
      totalActions: data?.length || 0,
      actionsByType: {} as Record<string, number>,
      actionsByEntity: {} as Record<string, number>,
      actionsByDay: {} as Record<string, number>
    }

    data?.forEach(log => {
      // Par type d'action
      analytics.actionsByType[log.action] = (analytics.actionsByType[log.action] || 0) + 1
      
      // Par entité
      analytics.actionsByEntity[log.entity_type] = (analytics.actionsByEntity[log.entity_type] || 0) + 1
      
      // Par jour
      const day = new Date(log.created_at).toLocaleDateString()
      analytics.actionsByDay[day] = (analytics.actionsByDay[day] || 0) + 1
    })

    return analytics
  }
}