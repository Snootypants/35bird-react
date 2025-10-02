import { Gamepad2, Hammer, Home, Moon, Settings2, Sun } from 'lucide-react'

import type { DockMenuItem, DockMenuRuntimeContext } from '@/types/dockMenu'

const resolveThemeLabel = ({ theme }: DockMenuRuntimeContext) =>
  theme === 'dark' ? 'Light mode' : 'Dark mode'

const resolveThemeIcon = ({ theme }: DockMenuRuntimeContext) =>
  (theme === 'dark' ? Sun : Moon)

const resolveTesterLabel = ({ testerOpen }: DockMenuRuntimeContext) =>
  testerOpen ? 'Close page settings' : 'Page settings'

export const dockMenuItems: DockMenuItem[] = [
  {
    id: 'games',
    label: 'Games',
    icon: Gamepad2,
    action: { kind: 'link', href: '/games' },
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: Hammer,
    action: { kind: 'command', command: 'openTools' },
  },
  {
    id: 'theme',
    label: resolveThemeLabel,
    icon: resolveThemeIcon,
    action: { kind: 'command', command: 'toggleTheme' },
    isActive: ({ testerOpen }) => Boolean(testerOpen),
    children: [
      {
        id: 'page-settings',
        label: resolveTesterLabel,
        icon: Settings2,
        action: { kind: 'command', command: 'toggleTester' },
        isActive: ({ testerOpen }) => Boolean(testerOpen),
      },
    ],
  },
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    action: { kind: 'link', href: '/' },
  },
]
