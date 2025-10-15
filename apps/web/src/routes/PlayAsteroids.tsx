import { lazy, Suspense } from 'react'

import { ROUTES } from '@/config/routes'
import GameShell from '@/components/layout/GameShell'
import type { Theme } from '@/types'

const Asteroids = lazy(() => import('@35bird/asteroids'))

interface PlayAsteroidsProps {
  onRestoreTheme?: (theme: Theme) => void
}

export default function PlayAsteroids({ onRestoreTheme }: PlayAsteroidsProps) {
  return (
    <Suspense fallback={<div>{ROUTES.playAsteroids.loadingMessage ?? 'Loading...'}</div>}>
      <GameShell onRestoreTheme={onRestoreTheme}>
        <Asteroids />
      </GameShell>
    </Suspense>
  )
}
