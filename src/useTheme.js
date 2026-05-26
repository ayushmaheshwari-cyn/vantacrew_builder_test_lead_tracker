import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('lt_theme')
    return stored ? stored === 'dark' : true
  })

  useEffect(() => {
    document.body.classList.remove('dark', 'light')
    document.body.classList.add(isDark ? 'dark' : 'light')
    localStorage.setItem('lt_theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return { isDark, toggleTheme: () => setIsDark(d => !d) }
}
