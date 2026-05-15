import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  role: 'admin' | 'staff' | 'customer'
}

const AuthContext = createContext<{
  session: Session | null
  profile: Profile | null
  loading: boolean
}>({ session: null, profile: null, loading: true })

export function useAuthState() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    async function loadProfile() {
      if (!supabase || !session?.user) {
        setProfile(null)
        return
      }

      const fullName =
        session.user.user_metadata?.full_name ??
        session.user.user_metadata?.name ??
        session.user.email?.split('@')[0] ??
        'CAVVE customer'

      await supabase.from('profiles').upsert({
        id: session.user.id,
        full_name: fullName,
        phone: session.user.phone,
      })

      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, phone, role')
        .eq('id', session.user.id)
        .single()

      setProfile((data as Profile | null) ?? null)
    }

    loadProfile()
  }, [session])

  const value = useMemo(() => ({ session, profile, loading }), [session, profile, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
