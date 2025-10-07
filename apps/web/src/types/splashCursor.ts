export interface SplashCursorColor {
  r: number
  g: number
  b: number
}

export interface SplashCursorConfig {
  simResolution: number
  dyeResolution: number
  captureResolution: number
  densityDissipation: number
  velocityDissipation: number
  pressure: number
  pressureIterations: number
  curl: number
  splatRadius: number
  splatForce: number
  shading: boolean
  colorUpdateSpeed: number
  backColor: SplashCursorColor
  transparent: boolean
}

export type SplashCursorConfigOverrides = Partial<Omit<SplashCursorConfig, 'backColor'>> & {
  backColor?: Partial<SplashCursorColor> | null
}

export interface SplashCursorRuntimeConfig {
  SIM_RESOLUTION: number
  DYE_RESOLUTION: number
  CAPTURE_RESOLUTION: number
  DENSITY_DISSIPATION: number
  VELOCITY_DISSIPATION: number
  PRESSURE: number
  PRESSURE_ITERATIONS: number
  CURL: number
  SPLAT_RADIUS: number
  SPLAT_FORCE: number
  SHADING: boolean
  COLOR_UPDATE_SPEED: number
  BACK_COLOR: SplashCursorColor
  TRANSPARENT: boolean
}

export type SplashCursorBackgroundProps = SplashCursorConfigOverrides
