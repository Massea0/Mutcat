import { createClient } from '@/lib/supabase/client'

// Types
export interface HeroSlide {
  id: string
  title: string
  subtitle?: string
  description?: string
  image_url: string
  button_text?: string
  button_link?: string
  order_index: number
}

export interface Statistic {
  id: string
  label: string
  value: string
  icon?: string
  order_index: number
}

export interface Partner {
  id: string
  name: string
  logo_url: string
  website_url?: string
  description?: string
  order_index: number
}

export interface QuickLink {
  id: string
  title: string
  description?: string
  icon?: string
  link_url?: string
  category?: string
  order_index: number
}

export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  published_at: string
  image_url?: string
  video_url?: string
  is_featured: boolean
  featured_order: number
  tags?: string[]
  views?: number
}

export interface Project {
  id: string
  title: string
  description: string
  status: string
  budget: number
  start_date: string
  end_date: string
  location: string
  category: string
  is_featured: boolean
  featured_order: number
  main_image_url?: string
  gallery_images?: string[]
  progress?: number
  beneficiaries?: number
}

// Service CMS
export class CMSService {
  private supabase = createClient()

  // Hero Sliders
  async getHeroSliders() {
    const { data, error } = await this.supabase
      .from('hero_sliders')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) throw error
    return data as HeroSlide[]
  }

  // Statistics
  async getStatistics() {
    const { data, error } = await this.supabase
      .from('statistics')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) throw error
    return data as Statistic[]
  }

  // Partners
  async getPartners() {
    const { data, error } = await this.supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) throw error
    return data as Partner[]
  }

  // Quick Links
  async getQuickLinks(category?: string) {
    let query = this.supabase
      .from('quick_links')
      .select('*')
      .eq('is_active', true)

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.order('order_index', { ascending: true })

    if (error) throw error
    return data as QuickLink[]
  }

  // Featured News
  async getFeaturedNews(limit: number = 3) {
    const { data, error } = await this.supabase
      .from('news')
      .select('*')
      .eq('is_featured', true)
      .order('featured_order', { ascending: true })
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as NewsArticle[]
  }

  // Latest News
  async getLatestNews(limit: number = 6) {
    const { data, error } = await this.supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as NewsArticle[]
  }

  // Featured Projects
  async getFeaturedProjects(limit: number = 4) {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('is_featured', true)
      .order('featured_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Project[]
  }

  // Latest Projects
  async getLatestProjects(limit: number = 6) {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Project[]
  }

  // Site Settings
  async getSiteSetting(key: string) {
    const { data, error } = await this.supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single()

    if (error) throw error
    return data?.value
  }

  async getAllSiteSettings() {
    const { data, error } = await this.supabase
      .from('site_settings')
      .select('*')

    if (error) throw error
    
    // Convertir en objet key-value
    const settings: Record<string, any> = {}
    data?.forEach(item => {
      settings[item.key] = item.value
    })
    
    return settings
  }

  // Update methods for admin
  async updateHeroSlide(id: string, data: Partial<HeroSlide>) {
    const { error } = await this.supabase
      .from('hero_sliders')
      .update(data)
      .eq('id', id)

    if (error) throw error
  }

  async createHeroSlide(data: Omit<HeroSlide, 'id'>) {
    const { error } = await this.supabase
      .from('hero_sliders')
      .insert(data)

    if (error) throw error
  }

  async deleteHeroSlide(id: string) {
    const { error } = await this.supabase
      .from('hero_sliders')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async toggleFeaturedNews(id: string, featured: boolean) {
    const { error } = await this.supabase
      .from('news')
      .update({ is_featured: featured })
      .eq('id', id)

    if (error) throw error
  }

  async toggleFeaturedProject(id: string, featured: boolean) {
    const { error } = await this.supabase
      .from('projects')
      .update({ is_featured: featured })
      .eq('id', id)

    if (error) throw error
  }

  async updateSiteSetting(key: string, value: any) {
    const { error } = await this.supabase
      .from('site_settings')
      .upsert({ key, value })

    if (error) throw error
  }
}

export const cmsService = new CMSService()