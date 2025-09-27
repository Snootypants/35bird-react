import { useMemo, type CSSProperties } from 'react'

import { useHeroSettings } from '../../context/HeroSettingsContext'

const heroGlowCss = `
.hero-box{position:relative;width:var(--sz);height:var(--sz);display:grid;place-items:center}
.hero-img{width:100%;height:100%;object-fit:contain;position:relative;z-index:10;
filter:
  drop-shadow(0 0 var(--rim-blur) color-mix(in srgb,var(--gc) var(--rim-alpha),transparent))
  drop-shadow(0 0 var(--wide-blur) color-mix(in srgb,var(--gc) var(--wide-alpha),transparent))
  drop-shadow(0 0 var(--fade-blur) color-mix(in srgb,var(--gc) var(--fade-alpha),transparent));}
.glow-mask{position:absolute;inset:0;pointer-events:none;z-index:5;opacity:1;
background:radial-gradient(circle at center,
  color-mix(in srgb,var(--gc) var(--rim-alpha),transparent) 0%,
  color-mix(in srgb,var(--gc) var(--mid-alpha),transparent) 42%,
  color-mix(in srgb,var(--gc) var(--fade-alpha),transparent) 65%,
  transparent 88%) center/100% 100% no-repeat;
filter:blur(calc(var(--spill-blur) * 0.95));
transform:scale(var(--spill-scale))}
.glow-mask::after{content:'';position:absolute;inset:calc(var(--sz) / -7);border-radius:50%;box-shadow:0 0 var(--halo-radius) color-mix(in srgb,var(--gc) var(--spill-alpha),transparent);opacity:var(--ambient-alpha);filter:blur(calc(var(--spill-blur) * 0.6))}
.range-wrap input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:2px;background:#cbd5e1;outline:none;border-radius:9999px}
.range-wrap input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:9999px;background:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.25)}
.range-wrap input[type=range]::-moz-range-thumb{width:14px;height:14px;border:none;border-radius:9999px;background:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.25)}
`

function HomePage() {
  const glowColor = '#3aa0ff'
  const { size, spread, intensity, opacity } = useHeroSettings()

  const cssVars = useMemo(() => {
    const clampedSize = Math.max(200, Math.min(720, size))
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

    return {
      '--sz': `${clampedSize}px`,
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
  }, [glowColor, intensity, opacity, size, spread])

  const imageSrc = '/images/bird.png'

  return (
    <div className="relative z-20 flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 text-slate-200">
      <style>{heroGlowCss}</style>

      <div className="relative flex w-full max-w-4xl flex-col items-center gap-8 text-center">
        <div className="relative" style={cssVars}>
          <div className="hero-box">
            <div
              className="glow-mask"
              style={{
                WebkitMaskImage: `url(${imageSrc})`,
                maskImage: `url(${imageSrc})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
            <img className="hero-img" src={imageSrc} alt="35Bird" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            <span className="text-white">Welcome to</span>
            {' '}
            <span className="text-sky-300 sm:text-sky-400">35Bird</span>
          </h1>
          <p className="text-[13px] font-medium uppercase tracking-[0.45em] text-white/85">
            Design · Code · Done
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
