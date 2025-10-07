import {
  HERO_GLOW_ANIMATION_DURATION,
  HERO_GLOW_INTENSITY,
  HERO_GLOW_OPACITY,
  HERO_GLOW_SIZE,
  HERO_GLOW_SPREAD,
} from './heroGlow'
import type { HeroSettingsKey } from '@/context/HeroSettingsContext'

export type HeroTesterValueFormatter = 'px' | 'fixed0' | 'fixed1' | 'fixed2'

export interface HeroTesterRangeControlConfig {
  type: 'range'
  id: string
  label: string
  helper?: string
  min: number
  max: number
  step: number
  primaryKey: HeroSettingsKey
  secondaryKey: HeroSettingsKey
  formatter: HeroTesterValueFormatter
}

export interface HeroTesterSingleControlConfig {
  type: 'single'
  id: string
  label: string
  min: number
  max: number
  step: number
  key: HeroSettingsKey
  suffix?: string
  formatter: HeroTesterValueFormatter
}

export type HeroTesterControlConfig =
  | HeroTesterRangeControlConfig
  | HeroTesterSingleControlConfig

export const heroTesterControls: readonly HeroTesterControlConfig[] = [
  {
    type: 'range',
    id: 'hero-size',
    label: 'Badge Size',
    helper: 'Pixels',
    min: HERO_GLOW_SIZE.min,
    max: HERO_GLOW_SIZE.max,
    step: HERO_GLOW_SIZE.step,
    primaryKey: 'size',
    secondaryKey: 'sizeTarget',
    formatter: 'px',
  },
  {
    type: 'range',
    id: 'hero-spread',
    label: 'Glow Spread',
    helper: '0 (tight) – 1 (wide)',
    min: HERO_GLOW_SPREAD.min,
    max: HERO_GLOW_SPREAD.max,
    step: HERO_GLOW_SPREAD.step,
    primaryKey: 'spread',
    secondaryKey: 'spreadTarget',
    formatter: 'fixed2',
  },
  {
    type: 'range',
    id: 'hero-intensity',
    label: 'Glow Intensity',
    helper: 'Higher = brighter core',
    min: HERO_GLOW_INTENSITY.min,
    max: HERO_GLOW_INTENSITY.max,
    step: HERO_GLOW_INTENSITY.step,
    primaryKey: 'intensity',
    secondaryKey: 'intensityTarget',
    formatter: 'fixed2',
  },
  {
    type: 'range',
    id: 'hero-opacity',
    label: 'Glow Opacity',
    helper: 'Controls halo softness',
    min: HERO_GLOW_OPACITY.min,
    max: HERO_GLOW_OPACITY.max,
    step: HERO_GLOW_OPACITY.step,
    primaryKey: 'opacity',
    secondaryKey: 'opacityTarget',
    formatter: 'fixed2',
  },
  {
    type: 'single',
    id: 'hero-duration',
    label: 'Animation Duration',
    min: HERO_GLOW_ANIMATION_DURATION.min,
    max: HERO_GLOW_ANIMATION_DURATION.max,
    step: HERO_GLOW_ANIMATION_DURATION.step,
    key: 'animationDuration',
    suffix: HERO_GLOW_ANIMATION_DURATION.suffix,
    formatter: 'fixed1',
  },
] as const
