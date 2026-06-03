import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'warm' : 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('kiki-theme') || getSystemTheme()
  )

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }
    localStorage.setItem('kiki-theme', theme)
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    function onSystemChange(e) {
      if (!localStorage.getItem('kiki-theme')) {
        setTheme(e.matches ? 'warm' : 'dark')
      }
    }
    mq.addEventListener('change', onSystemChange)
    return () => mq.removeEventListener('change', onSystemChange)
  }, [])

  function toggle() {
    setTheme(t => (t === 'dark' ? 'warm' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
