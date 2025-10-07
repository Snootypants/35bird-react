import type { CSSProperties } from 'react'

import {
  HERO_GLOW_INTENSITY,
  HERO_GLOW_OPACITY,
  HERO_GLOW_SIZE,
  HERO_GLOW_SPREAD,
} from '../config/heroGlow'

type HeroGlowVariableInput = {
  size: number
  spread: number
  intensity: number
  opacity: number
  glowColor: string
  forcedSize?: number
}

export const heroGlowCss = `
.hero-glow-box{position:relative;width:var(--sz);height:var(--sz);display:grid;place-items:center}
.hero-glow-img{width:100%;height:100%;object-fit:contain;position:relative;z-index:10;
filter:
  drop-shadow(0 0 var(--rim-blur) color-mix(in srgb,var(--gc) var(--rim-alpha),transparent))
  drop-shadow(0 0 var(--wide-blur) color-mix(in srgb,var(--gc) var(--wide-alpha),transparent))
  drop-shadow(0 0 var(--fade-blur) color-mix(in srgb,var(--gc) var(--fade-alpha),transparent));}
.hero-glow-mask{position:absolute;inset:0;pointer-events:none;z-index:5;opacity:1;
background:radial-gradient(circle at center,
  color-mix(in srgb,var(--gc) var(--rim-alpha),transparent) 0%,
  color-mix(in srgb,var(--gc) var(--mid-alpha),transparent) 42%,
  color-mix(in srgb,var(--gc) var(--fade-alpha),transparent) 65%,
  transparent 88%) center/100% 100% no-repeat;
filter:blur(calc(var(--spill-blur) * 0.95));
transform:scale(var(--spill-scale))}
.hero-glow-mask::after{content:'';position:absolute;inset:calc(var(--sz) / -7);border-radius:50%;box-shadow:0 0 var(--halo-radius) color-mix(in srgb,var(--gc) var(--spill-alpha),transparent);opacity:var(--ambient-alpha);filter:blur(calc(var(--spill-blur) * 0.6))}
`

type HeroGlowStyleVariables = CSSProperties & Record<
  | '--sz'
  | '--gc'
  | '--rim-blur'
  | '--wide-blur'
  | '--fade-blur'
  | '--spill-blur'
  | '--halo-radius'
  | '--spill-scale'
  | '--rim-alpha'
  | '--wide-alpha'
  | '--fade-alpha'
  | '--spill-alpha'
  | '--mid-alpha'
  | '--ambient-alpha',
  string
>

export function buildHeroGlowVariables({
  size,
  spread,
  intensity,
  opacity,
  glowColor,
  forcedSize,
}: HeroGlowVariableInput): HeroGlowStyleVariables {
  const clampedSize = Math.max(HERO_GLOW_SIZE.min, Math.min(HERO_GLOW_SIZE.max, size))
  const clampedSpread = Math.max(HERO_GLOW_SPREAD.min, Math.min(HERO_GLOW_SPREAD.max, spread))
  const clampedIntensity = Math.max(
    HERO_GLOW_INTENSITY.min,
    Math.min(HERO_GLOW_INTENSITY.max, intensity),
  )
  const clampedOpacity = Math.max(HERO_GLOW_OPACITY.min, Math.min(HERO_GLOW_OPACITY.max, opacity))

  const rimBlur = Math.max(2, Math.round(clampedSize * 0.018))
  const wideBlur = Math.round(clampedSize * (0.1 + clampedSpread * 0.3))
  const fadeBlur = Math.round(clampedSize * (0.28 + clampedSpread * 0.42))
  const spillBlur = Math.round(clampedSize * (0.06 + clampedSpread * 0.22))
  const haloRadius = Math.round(clampedSize * (0.2 + clampedSpread * 0.55))

  const rimAlpha = Math.min(100, Math.max(40, Math.round(clampedIntensity * 120)))
  const wideAlpha = Math.min(65, Math.max(15, Math.round(clampedIntensity * 55)))
  const fadeAlpha = Math.min(60, Math.max(12, Math.round((clampedOpacity + clampedIntensity * 0.2) * 100)))
  const ambientAlpha = Math.min(80, Math.max(10, Math.round(clampedOpacity * 100)))
  const spillAlpha = Math.min(70, Math.max(18, Math.round((clampedOpacity * 0.7 + clampedIntensity * 0.25) * 100)))
  const midAlpha = Math.round((rimAlpha + wideAlpha) / 2)

  const sizeValue = forcedSize != null
    ? `${forcedSize}px`
    : `clamp(${HERO_GLOW_SIZE.min}px, ${HERO_GLOW_SIZE.viewportClamp}, ${clampedSize}px)`

  return {
    '--sz': sizeValue,
    '--gc': glowColor,
    '--rim-blur': `${rimBlur}px`,
    '--wide-blur': `${wideBlur}px`,
    '--fade-blur': `${fadeBlur}px`,
    '--spill-blur': `${spillBlur}px`,
    '--halo-radius': `${haloRadius}px`,
    '--spill-scale': (1 + clampedSpread * 0.3).toFixed(3),
    '--rim-alpha': `${rimAlpha}%`,
    '--wide-alpha': `${wideAlpha}%`,
    '--fade-alpha': `${fadeAlpha}%`,
    '--spill-alpha': `${spillAlpha}%`,
    '--mid-alpha': `${midAlpha}%`,
    '--ambient-alpha': (ambientAlpha / 100).toFixed(2),
  }
}

export type { HeroGlowVariableInput }
