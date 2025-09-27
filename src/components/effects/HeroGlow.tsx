import { useMemo, type CSSProperties } from 'react'

import heroDefaultImage from '../../assets/hero.png'
import { useHeroSettings } from '../../context/HeroSettingsContext'

type HeroGlowVariables = {
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

export function buildHeroGlowVariables({
  size,
  spread,
  intensity,
  opacity,
  glowColor,
  forcedSize,
}: HeroGlowVariables) {
  const clampedSize = Math.max(138, Math.min(368, size))
  const clampedSpread = Math.max(0, Math.min(1, spread))
  const clampedIntensity = Math.max(0, Math.min(1.5, intensity))
  const clampedOpacity = Math.max(0, Math.min(1, opacity))

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
    : `clamp(138px, 35vw, ${clampedSize}px)`

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
  } satisfies CSSProperties
}

export type HeroGlowProps = {
  src?: string
  alt?: string
  glowColor?: string
  className?: string
  forcedSize?: number
}

export function HeroGlow({
  src = heroDefaultImage,
  alt = 'Hero artwork',
  glowColor = '#3aa0ff',
  className = '',
  forcedSize,
}: HeroGlowProps) {
  const { size, spread, intensity, opacity } = useHeroSettings()

  const variables = useMemo(
    () =>
      buildHeroGlowVariables({
        size,
        spread,
        intensity,
        opacity,
        glowColor,
        forcedSize,
      }),
    [forcedSize, glowColor, intensity, opacity, size, spread],
  )

  const maskStyle = useMemo(
    () => ({
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
    }),
    [src],
  )

  return (
    <div className={`relative ${className}`} style={variables}>
      <style>{heroGlowCss}</style>
      <div className="hero-glow-box">
        <div className="hero-glow-mask" style={maskStyle} />
        <img className="hero-glow-img" src={src} alt={alt} />
      </div>
    </div>
  )
}

export default HeroGlow
