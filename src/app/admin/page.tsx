"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AdminDashboard } from '@/components/admin/dashboard'
import { Loader2 } from 'lucide-react'

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuthorization()
  }, [])

  const checkAuthorization = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Vérifier le rôle admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (userData && (userData.role === 'admin' || userData.role === 'agent')) {
        setIsAuthorized(true)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Authorization error:', error)
      router.push('/auth/login')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-senegal-green-500" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <AdminDashboard />
}