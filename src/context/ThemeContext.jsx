import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

function getSystemTheme() {
  try { return window.matchMedia('(prefers-color-scheme: light)').matches ? 'warm' : 'dark' }
  catch { return 'dark' }
}

const THEME_KEY = 'kiki-theme-v2'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) || 'warm' }
    catch { return 'warm' }
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }
    try { localStorage.setItem(THEME_KEY, theme) } catch {}
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    function onSystemChange(e) {
      try {
        if (!localStorage.getItem('kiki-theme')) setTheme(e.matches ? 'warm' : 'dark')
      } catch {
        setTheme(e.matches ? 'warm' : 'dark')
      }
    }
    mq.addEventListener('change', onSystemChange)
    return () => mq.removeEventListener('change', onSystemChange)
  }, [])

  function toggleTheme() {
    setTheme(t => (t === 'dark' ? 'warm' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
