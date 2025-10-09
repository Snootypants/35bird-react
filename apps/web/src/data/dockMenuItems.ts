import { Gamepad2, Hammer, Home, Moon, Palette, Rocket, Settings2, Sun } from 'lucide-react'

import { createDynamicProp } from '@/lib/dockMenu'
import type { DockMenuItem } from '@/types/dockMenu'

export const dockMenuItems: DockMenuItem[] = [
  {
    id: 'games',
    label: 'Games',
    icon: Gamepad2,
    action: { kind: 'link', href: '/games' },
    panel: {
      title: 'Play the latest builds',
      description: 'Jump into prototypes, arcade throwbacks, and experiments fresh from the studio.',
    },
    children: [
      {
        id: 'asteroids',
        label: 'Asteroids',
        icon: Rocket,
        action: { kind: 'link', href: '/play/asteroids' },
      },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: Hammer,
    action: { kind: 'link', href: '/tools' },
    panel: {
      title: 'Tools & utilities',
      description: 'A growing kit of design and dev helpers built for 35Bird projects.',
      imageBasePath: '/images/menu/tools-preview',
    },
  },
  {
    id: 'theme',
    label: createDynamicProp(({ theme }) => (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')),
    icon: createDynamicProp(({ theme, minimal }) => (minimal ? Palette : theme === 'dark' ? Sun : Moon)),
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
    action: { kind: 'link', href: '/' },
  },
]
