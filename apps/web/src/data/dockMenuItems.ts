import { Gamepad2, Hammer, Home, Moon, Rocket, Settings2, Sun } from 'lucide-react'

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
    panel: {
      title: ROUTES.tools.description,
      description: ROUTES.tools.panelDescription,
      imageBasePath: ROUTES.tools.panelImage,
    },
  },
  {
    id: 'theme',
    label: createDynamicProp(({ theme }) => (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')),
    icon: createDynamicProp(({ theme }) => (theme === 'dark' ? Sun : Moon)),
    action: { kind: 'command', command: 'toggleTheme' },
    panel: {
      title: createDynamicProp(({ theme }) => (theme === 'dark' ? 'Light theme' : 'Dark theme')),
      description: 'Toggle the site palette or open page settings while you fine-tune layouts.',
    },
    children: [
      {
        id: 'page-settings',
        label: createDynamicProp(({ testerOpen }) => (testerOpen ? 'Hide page settings' : 'Page settings')),
        icon: Settings2,
        action: { kind: 'command', command: 'toggleTester' },
        isActive: ({ testerOpen }) => Boolean(testerOpen),
      },
    ],
  },
  {
    id: 'home',
    label: 'Back to home',
    icon: Home,
    action: { kind: 'link', href: ROUTES.home.path },
  },
]
