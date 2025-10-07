export interface Project {
  id: string
  title: string
  tagline: string
  description: string
  status: string
  splashImage: string
  iconImage: string
  slug: string
  folder: string
  links: {
    live: string | null
    repo: string | null
  }
  features: string[]
  theme: string
  priority: number
  lastUpdate?: string
}

export type Theme = 'light' | 'dark'

export interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

export * from './dockMenu'
export * from './splashCursor'
export * from './effects'
