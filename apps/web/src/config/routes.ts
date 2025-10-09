export type RouteConfig = {
  path: string
  label: string
  description?: string
  panelDescription?: string
  panelImage?: string
  loadingMessage?: string
}

export const ROUTES = {
  home: {
    path: '/',
    label: 'Home',
  },
  games: {
    path: '/games',
    label: 'Games',
    description: 'Play the latest builds',
    panelDescription: 'Jump into prototypes, arcade throwbacks, and experiments fresh from the studio.',
  },
  tools: {
    path: '/tools',
    label: 'Tools',
    description: 'Tools & utilities',
    panelDescription: 'A growing kit of design and dev helpers built for 35Bird projects.',
    panelImage: '/images/menu/tools-preview',
  },
  playAsteroids: {
    path: '/play/asteroids',
    label: 'Asteroids',
    description: 'Arcade throwback',
    loadingMessage: 'Launching Asteroids...',
  },
} as const satisfies Record<string, RouteConfig>

export type RouteKey = keyof typeof ROUTES

export const ROUTE_LIST = Object.values(ROUTES)
