import type { Theme } from '@/types'

const FALLBACK_THEME: Theme = 'dark'
const rawDefault = import.meta.env.VITE_DEFAULT_THEME

const normalizeTheme = (value: unknown): Theme => (value === 'light' ? 'light' : 'dark')

export const DEFAULT_THEME: Theme = normalizeTheme(rawDefault)

export const readStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return DEFAULT_THEME
  try {
    const stored = window.localStorage.getItem('35bird-theme')
    return normalizeTheme(stored ?? undefined)
  } catch {
    return FALLBACK_THEME
  }
}
