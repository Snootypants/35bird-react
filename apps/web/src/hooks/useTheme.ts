import { useCallback, useEffect, useMemo, useState } from 'react'

import { THEME_STORAGE_KEY } from '@/config/storage'
import type { Theme } from '@/types'

const DEFAULT_THEME: Theme = 'dark'

const applyThemeClass = (theme: Theme) => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get initial theme from localStorage or default to dark
    let initial: Theme = DEFAULT_THEME
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
        initial = stored ?? DEFAULT_THEME
      } catch {
        console.warn('localStorage unavailable, using default theme')
      }
      applyThemeClass(initial)
    }
    return initial
  })

  const persistTheme = useCallback((value: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, value)
    } catch {
      console.warn('Failed to save theme to localStorage')
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((previous) => (previous === 'light' ? 'dark' : 'light'))
  }, [])

  useEffect(() => {
    // Save theme to localStorage (with fallback)
    persistTheme(theme)
    applyThemeClass(theme)
  }, [persistTheme, theme])

  return useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
}
