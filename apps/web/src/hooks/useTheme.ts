import { useCallback, useEffect, useMemo, useState } from 'react'

import { THEME_STORAGE_KEY } from '@/config/storage'
import { readStoredTheme } from '@/config/theme'
import type { Theme } from '@/types'

const applyThemeClass = (value: Theme) => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', value === 'dark')
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = readStoredTheme()
    applyThemeClass(initial)
    return initial
  })

  const persistTheme = useCallback((value: Theme) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(THEME_STORAGE_KEY, value)
    } catch {
      // ignore storage failures
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((previous) => (previous === 'light' ? 'dark' : 'light'))
  }, [])

  const syncTheme = useCallback(() => {
    const next = readStoredTheme()
    setTheme(next)
    applyThemeClass(next)
  }, [])

  useEffect(() => {
    applyThemeClass(theme)
    persistTheme(theme)
  }, [persistTheme, theme])

  return useMemo(() => ({ theme, toggleTheme, syncTheme }), [theme, toggleTheme, syncTheme])
}
