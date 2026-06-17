import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function AuthModal({ open, onClose }) {
  const { session } = useAuth()
  const [tab, setTab]           = useState('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [error, setError]       = useState(null)
  const [info, setInfo]         = useState(null)
  const [loading, setLoading]   = useState(false)

  // Cerrar automáticamente al iniciar sesión
  useEffect(() => { if (session && open) onClose() }, [session, open])

  function reset() { setEmail(''); setPassword(''); setName(''); setError(null); setInfo(null) }

  function switchTab(t) { setTab(t); reset() }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(null); setInfo(null)

    if (tab === 'login') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) setError('Email o contraseña incorrectos')
    } else {
      const { error: err } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
      })
      if (err) setError(err.message)
      else setInfo('¡Cuenta creada! Revisa tu email para confirmar.')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 380,
          background: '#0F0D0A',
          border: '1px solid rgba(201,168,76,0.18)',
          padding: '36px 32px',
          fontFamily: 'var(--font-s, sans-serif)',
        }}
      >
        {/* Logo */}
        <p style={{ color: '#C9A84C', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 20px' }}>
          KiKi Fragancia
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => switchTab(t)} style={{
              flex: 1, padding: '10px 0', background: 'none', border: 'none',
              borderBottom: tab === t ? '2px solid #C9A84C' : '2px solid transparent',
              color: tab === t ? '#F7F2EA' : 'rgba(247,242,234,0.35)',
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'color 0.2s', marginBottom: -1,
            }}>
              {t === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {tab === 'register' && (
            <>
              <label style={labelStyle}>Nombre</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Tu nombre" style={inputStyle} autoComplete="name" />
            </>
          )}

          <label style={labelStyle}>Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com" style={inputStyle} autoComplete="email" />

          <label style={labelStyle}>Contraseña</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
            placeholder={tab === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
            style={{ ...inputStyle, marginBottom: 20 }}
            autoComplete={tab === 'login' ? 'current-password' : 'new-password'} />

          {error && <p style={{ color: '#E05050', fontSize: 11, marginBottom: 12, textAlign: 'center' }}>{error}</p>}
          {info  && <p style={{ color: '#6BAF6B', fontSize: 11, marginBottom: 12, textAlign: 'center' }}>{info}</p>}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px',
            background: loading ? 'rgba(201,168,76,0.4)' : '#C9A84C',
            border: 'none', color: '#0A0806',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 16,
          }}>
            {loading ? '...' : tab === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.12)' }} />
          <span style={{ color: 'rgba(247,242,234,0.3)', fontSize: 10 }}>o</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.12)' }} />
        </div>

        <button onClick={handleGoogle} style={{
          width: '100%', padding: '12px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#F7F2EA', fontSize: 11, letterSpacing: '0.08em',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <GoogleIcon /> Continuar con Google
        </button>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block', color: 'rgba(247,242,234,0.45)',
  fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 7,
}

const inputStyle = {
  width: '100%', padding: '11px 13px', marginBottom: 16, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.18)',
  color: '#F7F2EA', fontSize: 13, outline: 'none', fontFamily: 'inherit',
}
