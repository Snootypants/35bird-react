import { useMemo, type CSSProperties, type ChangeEvent } from 'react'
import { X } from 'lucide-react'

import { DOCK_OFFSET } from '@/config/dockMenu'
import {
  HERO_GLOW_ANIMATION_DURATION,
  HERO_GLOW_INTENSITY,
  HERO_GLOW_OPACITY,
  HERO_GLOW_SIZE,
  HERO_GLOW_SPREAD,
  HERO_TESTER_PANEL_VERTICAL_GAP,
} from '@/config/heroGlow'
import { useHeroSettings } from '@/hooks/useHeroSettings'

type RangeControlProps = {
  id: string
  label: string
  min: number
  max: number
  step: number
  primaryValue: number
  secondaryValue: number
  onPrimaryChange: (value: number) => void
  onSecondaryChange: (value: number) => void
  formatValue?: (value: number) => string
  helper?: string
}

type SingleSliderProps = {
  id: string
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  suffix?: string
}

const sliderClasses = 'w-full cursor-pointer accent-sky-400'

function formatNumber(value: number, digits = 0) {
  return value.toFixed(digits)
}

function RangeControl({
  id,
  label,
  min,
  max,
  step,
  primaryValue,
  secondaryValue,
  onPrimaryChange,
  onSecondaryChange,
  formatValue = (value) => formatNumber(value, step < 1 ? 2 : 0),
  helper,
}: RangeControlProps) {
  const handlePrimary = (event: ChangeEvent<HTMLInputElement>) => {
    onPrimaryChange(Number(event.currentTarget.value))
  }

  const handleSecondary = (event: ChangeEvent<HTMLInputElement>) => {
    onSecondaryChange(Number(event.currentTarget.value))
  }

  return (
    <section className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">{label}</p>
          {helper ? <p className="text-[11px] text-white/45">{helper}</p> : null}
        </div>
        <div className="text-right text-[11px] font-semibold leading-snug text-white/70">
          <div>Base: {formatValue(primaryValue)}</div>
          <div>Target: {formatValue(secondaryValue)}</div>
        </div>
      </div>
      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-inner">
        <label htmlFor={`${id}-base`} className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-white/55">
          <span>Base Value</span>
          <input
            id={`${id}-base`}
            type="range"
            min={min}
            max={max}
            step={step}
            value={primaryValue}
            onChange={handlePrimary}
            className={sliderClasses}
          />
        </label>
        <label htmlFor={`${id}-target`} className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-white/55">
          <span>Target Value</span>
          <input
            id={`${id}-target`}
            type="range"
            min={min}
            max={max}
            step={step}
            value={secondaryValue}
            onChange={handleSecondary}
            className={sliderClasses}
          />
        </label>
      </div>
    </section>
  )
}

function SingleSlider({ id, label, min, max, step, value, onChange, suffix = 's' }: SingleSliderProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.currentTarget.value))
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">{label}</p>
        <span className="text-[11px] font-semibold text-white/70">{formatNumber(value, 1)}{suffix}</span>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-inner">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className={sliderClasses}
        />
      </div>
    </section>
  )
}

function HeroTestingPanel() {
  const {
    testerOpen,
    closeTester,
    size,
    setSize,
    sizeTarget,
    setSizeTarget,
    spread,
    setSpread,
    spreadTarget,
    setSpreadTarget,
    intensity,
    setIntensity,
    intensityTarget,
    setIntensityTarget,
    opacity,
    setOpacity,
    opacityTarget,
    setOpacityTarget,
    animationDuration,
    setAnimationDuration,
  } = useHeroSettings()

  const style = useMemo<CSSProperties>(() => {
    const topOffset = DOCK_OFFSET + HERO_TESTER_PANEL_VERTICAL_GAP
    const bottomOffset = DOCK_OFFSET
    return {
      top: topOffset,
      right: DOCK_OFFSET,
      height: `calc(100vh - ${topOffset + bottomOffset}px)`,
    }
  }, [])

  if (!testerOpen) {
    return null
  }

  return (
    <aside
      className="pointer-events-auto fixed z-50 w-[380px] max-w-[88vw] rounded-3xl border border-white/10 bg-black/75 text-slate-200 shadow-2xl backdrop-blur"
      style={style}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="space-y-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Page Settings</h2>
            <p className="text-[11px] text-white/50">Dial in hero glow ranges and timing.</p>
          </div>
          <button
            type="button"
            onClick={closeTester}
            aria-label="Close settings"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 transition hover:text-white"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </header>

        <div className="border-b border-white/10 px-6 pb-3 pt-2">
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white"
            >
              Hero Glow
            </button>
            <button
              type="button"
              className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/30"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5 space-y-6">
          <RangeControl
            id="hero-size"
            label="Badge Size"
            min={HERO_GLOW_SIZE.min}
            max={HERO_GLOW_SIZE.max}
            step={HERO_GLOW_SIZE.step}
            primaryValue={size}
            secondaryValue={sizeTarget}
            onPrimaryChange={setSize}
            onSecondaryChange={setSizeTarget}
            helper="Pixels"
            formatValue={(value) => `${Math.round(value)} px`}
          />

          <RangeControl
            id="hero-spread"
            label="Glow Spread"
            min={HERO_GLOW_SPREAD.min}
            max={HERO_GLOW_SPREAD.max}
            step={HERO_GLOW_SPREAD.step}
            primaryValue={spread}
            secondaryValue={spreadTarget}
            onPrimaryChange={setSpread}
            onSecondaryChange={setSpreadTarget}
            helper="0 (tight) – 1 (wide)"
            formatValue={(value) => formatNumber(value, 2)}
          />

          <RangeControl
            id="hero-intensity"
            label="Glow Intensity"
            min={HERO_GLOW_INTENSITY.min}
            max={HERO_GLOW_INTENSITY.max}
            step={HERO_GLOW_INTENSITY.step}
            primaryValue={intensity}
            secondaryValue={intensityTarget}
            onPrimaryChange={setIntensity}
            onSecondaryChange={setIntensityTarget}
            helper="Higher = brighter core"
            formatValue={(value) => formatNumber(value, 2)}
          />

          <RangeControl
            id="hero-opacity"
            label="Glow Opacity"
            min={HERO_GLOW_OPACITY.min}
            max={HERO_GLOW_OPACITY.max}
            step={HERO_GLOW_OPACITY.step}
            primaryValue={opacity}
            secondaryValue={opacityTarget}
            onPrimaryChange={setOpacity}
            onSecondaryChange={setOpacityTarget}
            helper="Controls halo softness"
            formatValue={(value) => formatNumber(value, 2)}
          />

          <SingleSlider
            id="hero-duration"
            label="Animation Duration"
            min={HERO_GLOW_ANIMATION_DURATION.min}
            max={HERO_GLOW_ANIMATION_DURATION.max}
            step={HERO_GLOW_ANIMATION_DURATION.step}
            value={animationDuration}
            onChange={setAnimationDuration}
            suffix={HERO_GLOW_ANIMATION_DURATION.suffix}
          />
        </div>
      </div>
    </aside>
  )
}

export default HeroTestingPanel
