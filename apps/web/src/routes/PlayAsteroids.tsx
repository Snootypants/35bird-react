import { lazy, Suspense } from 'react'

import { ROUTES } from '@/config/routes'
import GameShell from '@/components/layout/GameShell'
import { useTheme } from '@/hooks/useTheme'

const Asteroids = lazy(() => import('@35bird/asteroids'))

export default function PlayAsteroids() {
  const { syncTheme } = useTheme()
  return (
    <Suspense fallback={<div>{ROUTES.playAsteroids.loadingMessage ?? 'Loading...'}</div>}>
      <GameShell onRestoreTheme={syncTheme}>
        <Asteroids />
      </GameShell>
    </Suspense>
  )
}
