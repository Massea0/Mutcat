export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'agent' | 'citizen'
          department: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'agent' | 'citizen'
          department?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'agent' | 'citizen'
          department?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          featured_image: string | null
          category: string
          published: boolean
          published_at: string | null
          author_id: string
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          featured_image?: string | null
          category: string
          published?: boolean
          published_at?: string | null
          author_id: string
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          featured_image?: string | null
          category?: string
          published?: boolean
          published_at?: string | null
          author_id?: string
          views?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          objectives: Json
          status: 'planned' | 'ongoing' | 'completed'
          start_date: string
          end_date: string | null
          budget: number | null
          location: string
          partners: Json | null
          progress: number
          featured_image: string | null
          gallery: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          objectives?: Json
          status?: 'planned' | 'ongoing' | 'completed'
          start_date: string
          end_date?: string | null
          budget?: number | null
          location: string
          partners?: Json | null
          progress?: number
          featured_image?: string | null
          gallery?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          objectives?: Json
          status?: 'planned' | 'ongoing' | 'completed'
          start_date?: string
          end_date?: string | null
          budget?: number | null
          location?: string
          partners?: Json | null
          progress?: number
          featured_image?: string | null
          gallery?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          description: string | null
          file_url: string
          file_type: string
          file_size: number
          category: string
          access_level: 'public' | 'internal' | 'restricted'
          department: string | null
          uploaded_by: string
          downloads: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          file_url: string
          file_type: string
          file_size: number
          category: string
          access_level?: 'public' | 'internal' | 'restricted'
          department?: string | null
          uploaded_by: string
          downloads?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          file_url?: string
          file_type?: string
          file_size?: number
          category?: string
          access_level?: 'public' | 'internal' | 'restricted'
          department?: string | null
          uploaded_by?: string
          downloads?: number
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string
          type: string
          registration_link: string | null
          featured_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string
          type: string
          registration_link?: string | null
          featured_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          start_date?: string
          end_date?: string
          location?: string
          type?: string
          registration_link?: string | null
          featured_image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          status: 'new' | 'read' | 'replied' | 'archived'
          replied_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject: string
          message: string
          status?: 'new' | 'read' | 'replied' | 'archived'
          replied_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string
          message?: string
          status?: 'new' | 'read' | 'replied' | 'archived'
          replied_at?: string | null
          created_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          subscribed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          subscribed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          subscribed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      social_posts: {
        Row: {
          id: string
          content: string
          platforms: Json
          scheduled_at: string | null
          published_at: string | null
          status: 'draft' | 'scheduled' | 'published' | 'failed'
          author_id: string
          media_urls: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          platforms: Json
          scheduled_at?: string | null
          published_at?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          author_id: string
          media_urls?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          platforms?: Json
          scheduled_at?: string | null
          published_at?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          author_id?: string
          media_urls?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      chatbot_conversations: {
        Row: {
          id: string
          session_id: string
          user_message: string
          bot_response: string
          context: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_message: string
          bot_response: string
          context?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_message?: string
          bot_response?: string
          context?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}