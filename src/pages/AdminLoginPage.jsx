import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError('Credenciales incorrectas')
      setLoading(false)
    } else {
      navigate('/kiki-desk')
    }
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0A0806', fontFamily: 'var(--font-s, sans-serif)',
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '100%', maxWidth: 360, padding: '48px 40px',
        background: '#12100D', border: '1px solid rgba(201,168,76,0.15)',
      }}>
        <p style={{ color: '#C9A84C', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8 }}>
          KiKi Fragancia
        </p>
        <h1 style={{ color: '#F7F2EA', fontSize: 22, fontWeight: 300, margin: '0 0 36px', fontStyle: 'italic' }}>
          Admin
        </h1>

        <label style={{ display: 'block', color: 'rgba(247,242,234,0.5)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
          Email
        </label>
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          style={{
            width: '100%', padding: '12px 14px', marginBottom: 20, boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)',
            color: '#F7F2EA', fontSize: 13, outline: 'none',
          }}
        />

        <label style={{ display: 'block', color: 'rgba(247,242,234,0.5)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
          Contraseña
        </label>
        <input
          type="password" required value={password} onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          style={{
            width: '100%', padding: '12px 14px', marginBottom: 28, boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)',
            color: '#F7F2EA', fontSize: 13, outline: 'none',
          }}
        />

        {error && (
          <p style={{ color: '#E05050', fontSize: 12, marginBottom: 16, textAlign: 'center' }}>{error}</p>
        )}

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '14px', background: loading ? 'rgba(201,168,76,0.4)' : '#C9A84C',
          border: 'none', color: '#0A0806', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.25em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
