import { useMemo } from 'react'

import heroDefaultImage from '../../assets/hero.png'
import { useHeroSettings } from '../../hooks/useHeroSettings'
import { buildHeroGlowVariables, heroGlowCss } from '../../lib/heroGlow'

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
