import { useEffect, useMemo, useRef, type CSSProperties } from 'react'

import { createSplashCursorRuntimeConfig, SPLASH_CURSOR_CANVAS_STYLE } from '@/config/splashCursor'
import { initSplashCursorBackground } from '@/lib/splashCursorRuntime.js'
import type { SplashCursorBackgroundProps } from '@/types/splashCursor'

function SplashCursorBackground(props: SplashCursorBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const {
    simResolution,
    dyeResolution,
    captureResolution,
    densityDissipation,
    velocityDissipation,
    pressure,
    pressureIterations,
    curl,
    splatRadius,
    splatForce,
    shading,
    colorUpdateSpeed,
    backColor,
    transparent,
  } = props

  const runtimeConfig = useMemo(
    () =>
      createSplashCursorRuntimeConfig({
        simResolution,
        dyeResolution,
        captureResolution,
        densityDissipation,
        velocityDissipation,
        pressure,
        pressureIterations,
        curl,
        splatRadius,
        splatForce,
        shading,
        colorUpdateSpeed,
        backColor,
        transparent,
      }),
    [
      simResolution,
      dyeResolution,
      captureResolution,
      densityDissipation,
      velocityDissipation,
      pressure,
      pressureIterations,
      curl,
      splatRadius,
      splatForce,
      shading,
      colorUpdateSpeed,
      backColor,
      transparent,
    ],
  )

  const canvasStyle = useMemo<CSSProperties>(
    () => ({ ...SPLASH_CURSOR_CANVAS_STYLE }),
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const teardown = initSplashCursorBackground(canvas, runtimeConfig)
    return () => {
      teardown()
    }
  }, [runtimeConfig])

  return <canvas ref={canvasRef} id="fluid" className="block" style={canvasStyle} />
}

export default SplashCursorBackground
