import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Hook pour récupérer les projets
export function useProjects(filters?: any) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      let query = supabase.from('projects').select('*')
      
      if (filters?.status) query = query.eq('status', filters.status)
      if (filters?.featured) query = query.eq('is_featured', true)
      if (filters?.limit) query = query.limit(filters.limit)
      
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour récupérer les actualités
export function useNews(filters?: any) {
  return useQuery({
    queryKey: ['news', filters],
    queryFn: async () => {
      let query = supabase.from('news').select('*')
      
      if (filters?.featured) query = query.eq('is_featured', true)
      if (filters?.category) query = query.eq('category', filters.category)
      if (filters?.limit) query = query.limit(filters.limit)
      
      const { data, error } = await query.order('published_at', { ascending: false })
      if (error) throw error
      return data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook pour récupérer les appels d'offres
export function useTenders(filters?: any) {
  return useQuery({
    queryKey: ['tenders', filters],
    queryFn: async () => {
      let query = supabase.from('tenders').select('*', { count: 'exact' })
      
      if (filters?.status) query = query.eq('status', filters.status)
      if (filters?.type) query = query.eq('type', filters.type)
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }
      if (filters?.page && filters?.limit) {
        const from = (filters.page - 1) * filters.limit
        const to = from + filters.limit - 1
        query = query.range(from, to)
      }
      
      const { data, count, error } = await query.order('submission_deadline', { ascending: true })
      if (error) throw error
      return { data, count }
    },
    staleTime: 60 * 1000, // 1 minute
  })
}

// Hook pour récupérer les événements
export function useEvents(filters?: any) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      let query = supabase.from('events').select('*')
        .eq('status', 'published')
      
      const now = new Date().toISOString()
      if (filters?.upcoming) {
        query = query.gte('start_date', now)
      }
      if (filters?.past) {
        query = query.lt('start_date', now)
      }
      if (filters?.featured) {
        query = query.eq('is_featured', true)
      }
      if (filters?.type) {
        query = query.eq('event_type', filters.type)
      }
      
      const { data, error } = await query.order('start_date', { 
        ascending: filters?.past ? false : true 
      })
      if (error) throw error
      return data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook pour récupérer les publications
export function usePublications(filters?: any) {
  return useQuery({
    queryKey: ['publications', filters],
    queryFn: async () => {
      let query = supabase.from('publications').select('*', { count: 'exact' })
        .eq('status', 'published')
      
      if (filters?.type) query = query.eq('type', filters.type)
      if (filters?.year) query = query.eq('year', filters.year)
      if (filters?.featured) query = query.eq('is_featured', true)
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }
      if (filters?.page && filters?.limit) {
        const from = (filters.page - 1) * filters.limit
        const to = from + filters.limit - 1
        query = query.range(from, to)
      }
      
      const { data, count, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return { data, count }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour récupérer les statistiques
export function useStatistics() {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('statistics')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
      
      if (error) throw error
      return data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook pour récupérer les partenaires
export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
      
      if (error) throw error
      return data
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Hook pour incrémenter les vues
export function useIncrementViews() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ table, id, field = 'views' }: { 
      table: string
      id: string
      field?: string 
    }) => {
      const { data: current } = await supabase
        .from(table)
        .select(field)
        .eq('id', id)
        .single()
      
      const { error } = await supabase
        .from(table)
        .update({ [field]: (current?.[field] || 0) + 1 })
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: (_, variables) => {
      // Invalider le cache pour forcer un refresh
      queryClient.invalidateQueries({ queryKey: [variables.table] })
    },
  })
}

// Hook pour s'abonner à la newsletter
export function useNewsletterSubscribe() {
  return useMutation({
    mutationFn: async ({ email, name }: { email: string; name?: string }) => {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, name, is_active: true })
      
      if (error) {
        if (error.code === '23505') {
          throw new Error('Cette adresse email est déjà inscrite')
        }
        throw error
      }
    },
  })
}

// Hook pour envoyer un message de contact
export function useContactSubmit() {
  return useMutation({
    mutationFn: async (data: {
      name: string
      email: string
      phone?: string
      subject?: string
      message: string
      type?: string
    }) => {
      const { error } = await supabase
        .from('contacts')
        .insert({
          ...data,
          status: 'new',
          ip_address: window.location.hostname,
          user_agent: navigator.userAgent,
        })
      
      if (error) throw error
    },
  })
}