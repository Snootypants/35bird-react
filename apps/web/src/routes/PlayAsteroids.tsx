import { lazy, Suspense } from 'react'

const Asteroids = lazy(() => import('@35bird/asteroids'))

export default function PlayAsteroids() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Asteroids />
    </Suspense>
  )
}
