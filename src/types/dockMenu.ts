import type { LucideIcon } from 'lucide-react'

export type DockMenuCommandKey = 'toggleTheme' | 'toggleTester' | (string & {})

export type DockMenuAction =
  | {
      kind: 'link'
      href: string
    }
  | {
      kind: 'command'
      command: DockMenuCommandKey
    }

export type DockMenuDynamicProp<T> = T | ((context: DockMenuRuntimeContext) => T)

export interface DockMenuItem {
  id: string
  label: DockMenuDynamicProp<string>
  icon: DockMenuDynamicProp<LucideIcon>
  action: DockMenuAction
  children?: DockMenuItem[]
  isActive?: (context: DockMenuRuntimeContext) => boolean
}

export interface DockMenuRuntimeContext {
  theme?: 'light' | 'dark'
  [key: string]: unknown
}

export type DockMenuActionHandlers = Partial<Record<DockMenuCommandKey, () => void>>
