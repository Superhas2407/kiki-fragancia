import { createContext, useContext, useEffect, useState } from 'react'
import { afterFirstPaint } from '../lib/defer'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    let disposed = false
    let subscription
    const cancel = afterFirstPaint(async () => {
      try {
        const { supabase } = await import('../lib/supabaseClient')
        if (disposed) return
        const { data } = await supabase.auth.getSession()
        if (disposed) return
        setSession(data.session)
        subscription = supabase.auth.onAuthStateChange((_e, s) => setSession(s)).data.subscription
      } catch { if (!disposed) setSession(null) }
    })
    return () => { disposed = true; cancel(); subscription?.unsubscribe() }
  }, [])

  return <AuthContext.Provider value={{ session, loading: session === undefined }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
