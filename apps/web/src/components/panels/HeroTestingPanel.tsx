import { useCallback, useMemo } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'
import { X } from 'lucide-react'

import { DOCK_OFFSET } from '@/config/dockMenu'
import { HERO_TESTER_PANEL_VERTICAL_GAP } from '@/config/heroGlow'
import {
  heroTesterControls,
  type HeroTesterControlConfig,
  type HeroTesterRangeControlConfig,
  type HeroTesterSingleControlConfig,
  type HeroTesterValueFormatter,
} from '@/config/heroTesterPanel'
import { useHeroSettings } from '@/hooks/useHeroSettings'
import type { HeroSettingsKey, HeroSettingsValues } from '@/context/HeroSettingsContext'
import { heroSettingDefaults } from '@/context/heroSettingsDefaults'

const sliderClasses = 'w-full cursor-pointer accent-sky-400'

const formatValue = (value: number, formatter: HeroTesterValueFormatter): string => {
  if (!Number.isFinite(value)) {
    return '—'
  }
  switch (formatter) {
    case 'px':
      return `${Math.round(value)} px`
    case 'fixed2':
      return value.toFixed(2)
    case 'fixed1':
      return value.toFixed(1)
    case 'fixed0':
    default:
      return value.toFixed(0)
  }
}

type RangeControlProps = {
  config: HeroTesterRangeControlConfig
  values: HeroSettingsValues
  onChange: (key: HeroSettingsKey, value: number) => void
}

function RangeControl({ config, values, onChange }: RangeControlProps) {
  const primaryValue = values[config.primaryKey]
  const secondaryValue = values[config.secondaryKey]

  const handlePrimary = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(config.primaryKey, Number(event.currentTarget.value))
    },
    [config.primaryKey, onChange],
  )

  const handleSecondary = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(config.secondaryKey, Number(event.currentTarget.value))
    },
    [config.secondaryKey, onChange],
  )

  return (
    <section className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
            {config.label}
          </p>
          {config.helper ? <p className="text-[11px] text-white/45">{config.helper}</p> : null}
        </div>
        <div className="text-right text-[11px] font-semibold leading-snug text-white/70">
          <div>Base: {formatValue(primaryValue, config.formatter)}</div>
          <div>Target: {formatValue(secondaryValue, config.formatter)}</div>
        </div>
      </div>
      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-inner">
        <label
          htmlFor={`${config.id}-base`}
          className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-white/55"
        >
          <span>Base Value</span>
          <input
            id={`${config.id}-base`}
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={primaryValue}
            onChange={handlePrimary}
            className={sliderClasses}
          />
        </label>
        <label
          htmlFor={`${config.id}-target`}
          className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.3em] text-white/55"
        >
          <span>Target Value</span>
          <input
            id={`${config.id}-target`}
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={secondaryValue}
            onChange={handleSecondary}
            className={sliderClasses}
          />
        </label>
      </div>
    </section>
  )
}

type SingleSliderProps = {
  config: HeroTesterSingleControlConfig
  values: HeroSettingsValues
  onChange: (key: HeroSettingsKey, value: number) => void
}

function SingleSlider({ config, values, onChange }: SingleSliderProps) {
  const value = values[config.key]

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(config.key, Number(event.currentTarget.value))
    },
    [config.key, onChange],
  )

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
          {config.label}
        </p>
        <span className="text-[11px] font-semibold text-white/70">
          {formatValue(value, config.formatter)}
          {config.suffix ?? ''}
        </span>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-inner">
        <input
          id={config.id}
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={value}
          onChange={handleChange}
          className={sliderClasses}
        />
      </div>
    </section>
  )
}

const isRangeControl = (
  control: HeroTesterControlConfig,
): control is HeroTesterRangeControlConfig => control.type === 'range'

function HeroTestingPanel() {
  const {
    values,
    testerOpen,
    closeTester,
    updateValue,
    resetAll,
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

  const handleResetAll = useCallback(() => {
    resetAll()
  }, [resetAll])

  const pristine = useMemo(
    () =>
      (Object.keys(heroSettingDefaults) as HeroSettingsKey[]).every(
        (key) => values[key] === heroSettingDefaults[key],
      ),
    [values],
  )

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
            <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
              Page Settings
            </h2>
            <p className="text-[11px] text-white/50">Dial in hero glow ranges and timing.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex h-9 items-center justify-center rounded-full border border-white/20 bg-white/5 px-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:text-white disabled:opacity-40"
              disabled={pristine}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={closeTester}
              aria-label="Close settings"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 transition hover:text-white"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </header>

        <div className="border-b border-white/10 px-6 pb-3 pt-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white">
                Hero Glow
              </span>
              <span className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/30">
                Coming Soon
              </span>
            </div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">
              Adjust live values
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-6 pt-5">
          {heroTesterControls.map((control) =>
            isRangeControl(control) ? (
              <RangeControl
                key={control.id}
                config={control}
                values={values}
                onChange={updateValue}
              />
            ) : (
              <SingleSlider
                key={control.id}
                config={control}
                values={values}
                onChange={updateValue}
              />
            ),
          )}
        </div>
      </div>
    </aside>
  )
}

export default HeroTestingPanel
