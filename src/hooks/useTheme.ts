import { useState, useEffect } from 'react'
import type { Theme } from '../types'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get initial theme from localStorage or default to dark
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('35bird-theme') as Theme
        return stored || 'dark'
      } catch {
        // Fallback if localStorage is disabled
        console.warn('localStorage unavailable, using default theme')
        return 'dark'
      }
    }
    return 'dark'
  })

  useEffect(() => {
    // Save theme to localStorage (with fallback)
    try {
      localStorage.setItem('35bird-theme', theme)
    } catch {
      console.warn('Failed to save theme to localStorage')
    }
    
    // Update document class for Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return { theme, toggleTheme }
}