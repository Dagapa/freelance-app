'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@lib/supabase/client'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const refreshSession = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
    } catch (error) {
      console.error('Error refreshing session:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase.auth])

  useEffect(() => {
    // Initial session fetch
    refreshSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        setLoading(false)

        // Redirect based on auth state
        if (event === 'SIGNED_IN') {
          const redirectTo = new URLSearchParams(window.location.search).get('redirectedFrom') || '/dashboard'
          router.push(redirectTo)
        } else if (event === 'SIGNED_OUT') {
          router.push('/login')
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase.auth, router, pathname, refreshSession])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }, [router, supabase.auth])

  const value = {
    user,
    session,
    loading,
    signOut,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context;
};
