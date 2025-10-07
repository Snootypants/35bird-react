import { Gamepad2, Hammer, Home, Moon, Settings2, Sun } from 'lucide-react'

import { createDynamicProp } from '../lib/dockMenu'
import type { DockMenuItem } from '../types/dockMenu'

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
    action: { kind: 'command', command: 'showTestItem1' },
  },
  {
    id: 'theme',
    label: createDynamicProp(({ theme }) => (theme === 'dark' ? 'Light mode' : 'Dark mode')),
    icon: createDynamicProp(({ theme }) => (theme === 'dark' ? Sun : Moon)),
    action: { kind: 'command', command: 'toggleTheme' },
    isActive: ({ testerOpen }) => Boolean(testerOpen),
    children: [
      {
        id: 'page-settings',
        label: createDynamicProp(({ testerOpen }) => (testerOpen ? 'Close page settings' : 'Page settings')),
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
