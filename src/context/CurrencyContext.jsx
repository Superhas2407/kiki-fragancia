import { createContext, useContext, useState } from 'react'

const CurrencyContext = createContext(null)

const RATE_USD_TO_BS = 36.5 // tasa aproximada, ajustar según necesario

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD')

  function toggleCurrency() {
    setCurrency(c => c === 'USD' ? 'BS' : 'USD')
  }

  function formatPrice(usd) {
    if (!usd) return null
    if (currency === 'USD') return `$${usd}`
    const bs = Math.round(usd * RATE_USD_TO_BS)
    return `Bs. ${bs.toLocaleString('es-VE')}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice, rate: RATE_USD_TO_BS }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
