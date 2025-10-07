import type {
  SplashCursorColor,
  SplashCursorConfig,
  SplashCursorConfigOverrides,
  SplashCursorRuntimeConfig,
} from '@/types/splashCursor'

export const SPLASH_CURSOR_DEFAULT_COLOR: SplashCursorColor = Object.freeze({
  r: 0.5,
  g: 0,
  b: 0,
})

const numberFallback = (candidate: unknown, fallback: number): number =>
  typeof candidate === 'number' && Number.isFinite(candidate) ? candidate : fallback

const booleanFallback = (candidate: unknown, fallback: boolean): boolean =>
  typeof candidate === 'boolean' ? candidate : fallback

const clampColorComponent = (value: number): number =>
  Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0))

const sanitizeColor = (candidate: SplashCursorConfigOverrides['backColor']): SplashCursorColor => {
  const base = candidate ?? {}
  return {
    r: clampColorComponent(numberFallback(base.r, SPLASH_CURSOR_DEFAULT_COLOR.r)),
    g: clampColorComponent(numberFallback(base.g, SPLASH_CURSOR_DEFAULT_COLOR.g)),
    b: clampColorComponent(numberFallback(base.b, SPLASH_CURSOR_DEFAULT_COLOR.b)),
  }
}

export const SPLASH_CURSOR_DEFAULTS: SplashCursorConfig = Object.freeze({
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
  backColor: SPLASH_CURSOR_DEFAULT_COLOR,
  transparent: true,
})

export const SPLASH_CURSOR_CANVAS_STYLE = Object.freeze({
  position: 'fixed',
  top: '0px',
  left: '0px',
  pointerEvents: 'none',
  zIndex: '-10',
  display: 'block',
})

export const resolveSplashCursorConfig = (
  overrides: SplashCursorConfigOverrides = {},
): SplashCursorConfig => ({
  simResolution: numberFallback(overrides.simResolution, SPLASH_CURSOR_DEFAULTS.simResolution),
  dyeResolution: numberFallback(overrides.dyeResolution, SPLASH_CURSOR_DEFAULTS.dyeResolution),
  captureResolution: numberFallback(
    overrides.captureResolution,
    SPLASH_CURSOR_DEFAULTS.captureResolution,
  ),
  densityDissipation: numberFallback(
    overrides.densityDissipation,
    SPLASH_CURSOR_DEFAULTS.densityDissipation,
  ),
  velocityDissipation: numberFallback(
    overrides.velocityDissipation,
    SPLASH_CURSOR_DEFAULTS.velocityDissipation,
  ),
  pressure: numberFallback(overrides.pressure, SPLASH_CURSOR_DEFAULTS.pressure),
  pressureIterations: numberFallback(
    overrides.pressureIterations,
    SPLASH_CURSOR_DEFAULTS.pressureIterations,
  ),
  curl: numberFallback(overrides.curl, SPLASH_CURSOR_DEFAULTS.curl),
  splatRadius: numberFallback(overrides.splatRadius, SPLASH_CURSOR_DEFAULTS.splatRadius),
  splatForce: numberFallback(overrides.splatForce, SPLASH_CURSOR_DEFAULTS.splatForce),
  shading: booleanFallback(overrides.shading, SPLASH_CURSOR_DEFAULTS.shading),
  colorUpdateSpeed: numberFallback(
    overrides.colorUpdateSpeed,
    SPLASH_CURSOR_DEFAULTS.colorUpdateSpeed,
  ),
  backColor: sanitizeColor(overrides.backColor),
  transparent: booleanFallback(overrides.transparent, SPLASH_CURSOR_DEFAULTS.transparent),
})

export const createSplashCursorRuntimeConfig = (
  overrides?: SplashCursorConfigOverrides,
): SplashCursorRuntimeConfig => {
  const resolved = resolveSplashCursorConfig(overrides)
  return {
    SIM_RESOLUTION: resolved.simResolution,
    DYE_RESOLUTION: resolved.dyeResolution,
    CAPTURE_RESOLUTION: resolved.captureResolution,
    DENSITY_DISSIPATION: resolved.densityDissipation,
    VELOCITY_DISSIPATION: resolved.velocityDissipation,
    PRESSURE: resolved.pressure,
    PRESSURE_ITERATIONS: resolved.pressureIterations,
    CURL: resolved.curl,
    SPLAT_RADIUS: resolved.splatRadius,
    SPLAT_FORCE: resolved.splatForce,
    SHADING: resolved.shading,
    COLOR_UPDATE_SPEED: resolved.colorUpdateSpeed,
    BACK_COLOR: resolved.backColor,
    TRANSPARENT: resolved.transparent,
  }
}
