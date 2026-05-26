import { createContext, useContext, useState, useEffect } from 'react'

const CurrencyContext = createContext(null)

const CACHE_KEY = 'kiki_euro_rate'
const CACHE_TTL = 60 * 60 * 1000 // 1 hora

function getCached() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { rate, ts } = JSON.parse(raw)
    if (Date.now() - ts < CACHE_TTL) return rate
  } catch {}
  return null
}

function setCache(rate) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ rate, ts: Date.now() }))
  } catch {}
}

const FALLBACK_RATE = 800

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD')
  const [rate, setRate]         = useState(() => getCached() ?? FALLBACK_RATE)
  const [loading, setLoading]   = useState(() => getCached() === null)

  useEffect(() => {
    const cached = getCached()
    if (cached !== null) { setRate(cached); setLoading(false); return }

    fetch('https://ve.dolarapi.com/v1/euros/oficial')
      .then(r => r.json())
      .then(data => {
        const fetched = data?.promedio ?? FALLBACK_RATE
        setRate(fetched)
        setCache(fetched)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function toggleCurrency() {
    setCurrency(c => c === 'USD' ? 'BS' : 'USD')
  }

  function formatPrice(usd) {
    if (!usd) return null
    if (currency === 'USD') return `$${usd}`
    const bs = Math.round(usd * rate)
    return `Bs. ${bs.toLocaleString('es-VE')}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice, rate, loading }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
