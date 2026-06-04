import { createContext, useContext, useState } from 'react'

// currency: 'usd' | 'bs'
const CurrencyContext = createContext({ currency: 'usd', setCurrency: () => {} })

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(
    () => localStorage.getItem('kiki_currency') === 'bs' ? 'bs' : 'usd'
  )

  function setCurrency(val) {
    setCurrencyState(val)
    localStorage.setItem('kiki_currency', val)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
