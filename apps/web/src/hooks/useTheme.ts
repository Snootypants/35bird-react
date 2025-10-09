import { useCallback, useEffect, useMemo, useState } from 'react'

import { THEME_STORAGE_KEY } from '@/config/storage'
import { DEFAULT_THEME, getInitialTheme, isDevEnvironment, validateStoredTheme } from '@/config/theme'
import type { Theme } from '@/types'

const applyThemeClass = (value: Theme) => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', value === 'dark')
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())

  const persistTheme = useCallback((value: Theme) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(THEME_STORAGE_KEY, value)
    } catch (error) {
      if (isDevEnvironment) {
        console.warn('Failed to persist theme preference', error)
      }
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((previous) => (previous === 'light' ? 'dark' : 'light'))
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return
      const nextValue = validateStoredTheme(event.newValue)
      setTheme(nextValue ?? DEFAULT_THEME)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  useEffect(() => {
    applyThemeClass(theme)
    persistTheme(theme)
  }, [persistTheme, theme])

  return useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
}
