import { useMemo, type CSSProperties, type InputHTMLAttributes } from 'react'
import { X } from 'lucide-react'

import { DOCK_OFFSET, DOCK_ICON_SIZE } from '../../config/dockMenu'
import { useHeroSettings } from '../../context/HeroSettingsContext'

type SliderProps = {
  label: string
  valueLabel: string
  inputProps: InputHTMLAttributes<HTMLInputElement>
}

function Slider({ label, valueLabel, inputProps }: SliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/60">
        <span>{label}</span>
        <span className="font-semibold text-white/70">{valueLabel}</span>
      </div>
      <div className="h-8 rounded-lg bg-white/5 px-3 py-2">
        <div className="range-wrap">
          <input className="w-full accent-sky-400" type="range" {...inputProps} />
        </div>
      </div>
    </div>
  )
}

function HeroTestingPanel() {
  const {
    testerOpen,
    closeTester,
    size,
    setSize,
    spread,
    setSpread,
    intensity,
    setIntensity,
    opacity,
    setOpacity,
  } = useHeroSettings()

  const style = useMemo<CSSProperties>(
    () => ({
      top: DOCK_OFFSET + DOCK_ICON_SIZE + 20,
      right: DOCK_OFFSET,
    }),
    [],
  )

  if (!testerOpen) {
    return null
  }

  return (
    <aside
      className="pointer-events-auto fixed z-50 w-[320px] rounded-3xl border border-white/10 bg-black/75 p-6 text-sm text-slate-200 shadow-2xl backdrop-blur"
      style={style}
    >
      <header className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Hero Tester</h2>
          <p className="text-[11px] text-white/50">Live-only controls. Jot final numbers when ready.</p>
        </div>
        <button
          type="button"
          onClick={closeTester}
          aria-label="Close tester"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 transition hover:text-white"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </header>

      <div className="space-y-4">
        <Slider
          label="Badge Size"
          valueLabel={`${Math.round(size)} px`}
          inputProps={{
            id: 'tester-size',
            min: 200,
            max: 720,
            step: 1,
            value: size,
            onChange: (event) => setSize(Number(event.currentTarget.value)),
          }}
        />

        <Slider
          label="Glow Size"
          valueLabel={spread.toFixed(2)}
          inputProps={{
            id: 'tester-spread',
            min: 0,
            max: 1,
            step: 0.01,
            value: spread,
            onChange: (event) => setSpread(Number(event.currentTarget.value)),
          }}
        />

        <Slider
          label="Intensity"
          valueLabel={intensity.toFixed(2)}
          inputProps={{
            id: 'tester-intensity',
            min: 0,
            max: 1.5,
            step: 0.01,
            value: intensity,
            onChange: (event) => setIntensity(Number(event.currentTarget.value)),
          }}
        />

        <Slider
          label="Opacity"
          valueLabel={opacity.toFixed(2)}
          inputProps={{
            id: 'tester-opacity',
            min: 0,
            max: 1,
            step: 0.01,
            value: opacity,
            onChange: (event) => setOpacity(Number(event.currentTarget.value)),
          }}
        />
      </div>
    </aside>
  )
}

export default HeroTestingPanel
