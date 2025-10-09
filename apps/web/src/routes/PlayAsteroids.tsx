import { lazy, Suspense } from 'react'

import { ROUTES } from '@/config/routes'

const Asteroids = lazy(() => import('@35bird/asteroids'))

export default function PlayAsteroids() {
  return (
    <Suspense fallback={<div>{ROUTES.playAsteroids.loadingMessage ?? 'Loading...'}</div>}>
      <Asteroids />
    </Suspense>
  )
}
