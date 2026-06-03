import { createContext, useContext, useState, useEffect } from 'react'

// Temas disponibles
export const THEMES = {
  dark:  { key: 'dark',  label: 'Oscuro' },
  warm:  { key: 'warm',  label: 'Claro' },
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('kiki-theme')
    if (saved && THEMES[saved]) return saved
    // Respetar preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'warm' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('kiki-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'warm' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
