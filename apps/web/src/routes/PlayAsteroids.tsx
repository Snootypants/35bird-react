import { lazy, Suspense } from 'react'

import { ROUTES } from '@/config/routes'
import GameShell from '@/components/layout/GameShell'

const Asteroids = lazy(() => import('@35bird/asteroids'))

interface PlayAsteroidsProps {
  onRestoreTheme?: () => void
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
