import type { LucideIcon } from 'lucide-react'

export type DockMenuCommandKey =
  | 'toggleTheme'
  | 'toggleTester'
  | (string & {})

export type DockMenuAction =
  | {
      kind: 'link'
      href: string
    }
  | {
      kind: 'command'
      command: DockMenuCommandKey
    }

export interface DockMenuDynamicResolver<T> {
  resolve: (context: DockMenuRuntimeContext) => T
}

export type DockMenuDynamicProp<T> = T | DockMenuDynamicResolver<T>

export interface DockMenuPanel {
  title?: DockMenuDynamicProp<string>
  description?: DockMenuDynamicProp<string>
  imageSrc?: string
  imageBasePath?: string
  imageFormats?: string[]
}

export interface DockMenuItem {
  id: string
  label: DockMenuDynamicProp<string>
  icon: DockMenuDynamicProp<LucideIcon>
  action: DockMenuAction
  children?: DockMenuItem[]
  isActive?: (context: DockMenuRuntimeContext) => boolean
  panel?: DockMenuPanel
}

export interface DockMenuRuntimeContext {
  theme?: 'light' | 'dark'
  [key: string]: unknown
}

export type DockMenuActionHandlers = Partial<Record<DockMenuCommandKey, () => void>>
