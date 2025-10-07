import { useMemo } from 'react'

import { HERO_GLOW_DEFAULT_COLOR } from '@/config/heroGlow'
import heroDefaultImage from '@/assets/hero.png'
import { useHeroSettings } from '@/hooks/useHeroSettings'
import { buildHeroGlowVariables, heroGlowCss } from '@/lib/heroGlow'
import type { HeroGlowProps } from '@/types/effects'

export function HeroGlow({
  src = heroDefaultImage,
  alt = 'Hero artwork',
  glowColor = HERO_GLOW_DEFAULT_COLOR,
  className = '',
  forcedSize,
}: HeroGlowProps) {
  const { values } = useHeroSettings()
  const { size, spread, intensity, opacity } = values

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
export type { HeroGlowProps } from '@/types/effects'
