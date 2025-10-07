import { useEffect, useMemo, useRef } from 'react'

import { initSplashCursorBackground } from '@/lib/splashCursorRuntime.js'

type FluidColor = {
  r: number
  g: number
  b: number
}

type SplashCursorBackgroundProps = {
  simResolution?: number
  dyeResolution?: number
  captureResolution?: number
  densityDissipation?: number
  velocityDissipation?: number
  pressure?: number
  pressureIterations?: number
  curl?: number
  splatRadius?: number
  splatForce?: number
  shading?: boolean
  colorUpdateSpeed?: number
  backColor?: FluidColor
  transparent?: boolean
}

const DEFAULT_COLOR: FluidColor = { r: 0.5, g: 0, b: 0 }

const DEFAULT_CONFIG = {
  simResolution: 128,
  dyeResolution: 1440,
  captureResolution: 512,
  densityDissipation: 3.5,
  velocityDissipation: 2,
  pressure: 0.1,
  pressureIterations: 20,
  curl: 3,
  splatRadius: 0.2,
  splatForce: 6000,
  shading: true,
  colorUpdateSpeed: 10,
  backColor: DEFAULT_COLOR,
  transparent: true,
} as const satisfies Required<SplashCursorBackgroundProps>

function SplashCursorBackground(props: SplashCursorBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const runtimeConfig = useMemo(
    () => ({
      SIM_RESOLUTION: props.simResolution ?? DEFAULT_CONFIG.simResolution,
      DYE_RESOLUTION: props.dyeResolution ?? DEFAULT_CONFIG.dyeResolution,
      CAPTURE_RESOLUTION: props.captureResolution ?? DEFAULT_CONFIG.captureResolution,
      DENSITY_DISSIPATION: props.densityDissipation ?? DEFAULT_CONFIG.densityDissipation,
      VELOCITY_DISSIPATION: props.velocityDissipation ?? DEFAULT_CONFIG.velocityDissipation,
      PRESSURE: props.pressure ?? DEFAULT_CONFIG.pressure,
      PRESSURE_ITERATIONS: props.pressureIterations ?? DEFAULT_CONFIG.pressureIterations,
      CURL: props.curl ?? DEFAULT_CONFIG.curl,
      SPLAT_RADIUS: props.splatRadius ?? DEFAULT_CONFIG.splatRadius,
      SPLAT_FORCE: props.splatForce ?? DEFAULT_CONFIG.splatForce,
      SHADING: props.shading ?? DEFAULT_CONFIG.shading,
      COLOR_UPDATE_SPEED: props.colorUpdateSpeed ?? DEFAULT_CONFIG.colorUpdateSpeed,
      BACK_COLOR: {
        r: props.backColor?.r ?? DEFAULT_COLOR.r,
        g: props.backColor?.g ?? DEFAULT_COLOR.g,
        b: props.backColor?.b ?? DEFAULT_COLOR.b,
      },
      TRANSPARENT: props.transparent ?? DEFAULT_CONFIG.transparent,
    }),
    [
      props.simResolution,
      props.dyeResolution,
      props.captureResolution,
      props.densityDissipation,
      props.velocityDissipation,
      props.pressure,
      props.pressureIterations,
      props.curl,
      props.splatRadius,
      props.splatForce,
      props.shading,
      props.colorUpdateSpeed,
      props.backColor?.r,
      props.backColor?.g,
      props.backColor?.b,
      props.transparent,
    ],
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

  return <canvas ref={canvasRef} id="fluid" className="block" />
}

export default SplashCursorBackground
