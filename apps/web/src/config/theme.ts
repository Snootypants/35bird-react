import { THEME_STORAGE_KEY } from '@/config/storage'
import type { Theme } from '@/types'

const AVAILABLE_THEMES = ['light', 'dark'] as const

type AvailableTheme = (typeof AVAILABLE_THEMES)[number]

const envDefault = import.meta.env.VITE_DEFAULT_THEME

const sanitizeTheme = (value: unknown): Theme => {
  if (typeof value === 'string' && AVAILABLE_THEMES.includes(value as AvailableTheme)) {
    return value as Theme
  }
  return 'dark'
}

export const DEFAULT_THEME: Theme = sanitizeTheme(envDefault)

export const isDevEnvironment = import.meta.env.DEV

export const validateStoredTheme = (value: unknown): Theme | null => {
  if (typeof value !== 'string') return null
  return AVAILABLE_THEMES.includes(value as AvailableTheme) ? (value as Theme) : null
}

export const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return DEFAULT_THEME
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    const sanitized = validateStoredTheme(stored)
    return sanitized ?? DEFAULT_THEME
  } catch (error) {
    if (isDevEnvironment) {
      console.warn('Theme persistence unavailable, using default theme', error)
    }
    return DEFAULT_THEME
  }
}
