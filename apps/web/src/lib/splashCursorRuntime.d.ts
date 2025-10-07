export type SplashCursorRuntimeColor = {
  r: number
  g: number
  b: number
}

export type SplashCursorRuntimeConfig = {
  SIM_RESOLUTION?: number
  DYE_RESOLUTION?: number
  CAPTURE_RESOLUTION?: number
  DENSITY_DISSIPATION?: number
  VELOCITY_DISSIPATION?: number
  PRESSURE?: number
  PRESSURE_ITERATIONS?: number
  CURL?: number
  SPLAT_RADIUS?: number
  SPLAT_FORCE?: number
  SHADING?: boolean
  COLOR_UPDATE_SPEED?: number
  BACK_COLOR?: SplashCursorRuntimeColor
  TRANSPARENT?: boolean
}

export function initSplashCursorBackground(
  canvas: HTMLCanvasElement,
  config?: SplashCursorRuntimeConfig,
): () => void
