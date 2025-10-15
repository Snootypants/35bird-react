import { Gamepad2, Hammer, Home, Moon, Rocket, Sun } from 'lucide-react'

import { createDynamicProp } from '@/lib/dockMenu'
import type { DockMenuItem } from '@/types/dockMenu'
import { ROUTES } from '@/config/routes'

export const dockMenuItems: DockMenuItem[] = [
  {
    id: 'games',
    label: ROUTES.games.label,
    icon: Gamepad2,
    action: { kind: 'link', href: ROUTES.games.path },
    panel: {
      title: ROUTES.games.description,
      description: ROUTES.games.panelDescription,
    },
    children: [
      {
        id: 'asteroids',
        label: ROUTES.playAsteroids.label,
        icon: Rocket,
        action: { kind: 'link', href: ROUTES.playAsteroids.path },
      },
    ],
  },
  {
    id: 'tools',
    label: ROUTES.tools.label,
    icon: Hammer,
    action: { kind: 'link', href: ROUTES.tools.path },
  },
  {
    id: 'theme',
    label: createDynamicProp(({ theme }) => (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')),
    icon: createDynamicProp(({ theme }) => (theme === 'dark' ? Sun : Moon)),
    action: { kind: 'command', command: 'toggleTheme' },
  },
  {
    id: 'home',
    label: 'Back to home',
    icon: Home,
    action: { kind: 'link', href: ROUTES.home.path },
  },
]
