import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type HeroSettingsContextValue = {
  size: number
  setSize: (value: number) => void
  sizeTarget: number
  setSizeTarget: (value: number) => void
  spread: number
  setSpread: (value: number) => void
  spreadTarget: number
  setSpreadTarget: (value: number) => void
  intensity: number
  setIntensity: (value: number) => void
  intensityTarget: number
  setIntensityTarget: (value: number) => void
  opacity: number
  setOpacity: (value: number) => void
  opacityTarget: number
  setOpacityTarget: (value: number) => void
  animationDuration: number
  setAnimationDuration: (value: number) => void
  testerOpen: boolean
  openTester: () => void
  closeTester: () => void
  toggleTester: () => void
}

const HeroSettingsContext = createContext<HeroSettingsContextValue | null>(null)

const DEFAULTS = {
  size: 276,
  sizeTarget: 320,
  spread: 0,
  spreadTarget: 0.35,
  intensity: 0.25,
  intensityTarget: 0.55,
  opacity: 0.17,
  opacityTarget: 0.4,
  animationDuration: 6,
} as const

type HeroSettingsProviderProps = {
  children: ReactNode
}

export function HeroSettingsProvider({ children }: HeroSettingsProviderProps) {
  const [size, setSize] = useState(DEFAULTS.size)
  const [sizeTarget, setSizeTarget] = useState(DEFAULTS.sizeTarget)
  const [spread, setSpread] = useState(DEFAULTS.spread)
  const [spreadTarget, setSpreadTarget] = useState(DEFAULTS.spreadTarget)
  const [intensity, setIntensity] = useState(DEFAULTS.intensity)
  const [intensityTarget, setIntensityTarget] = useState(DEFAULTS.intensityTarget)
  const [opacity, setOpacity] = useState(DEFAULTS.opacity)
  const [opacityTarget, setOpacityTarget] = useState(DEFAULTS.opacityTarget)
  const [animationDuration, setAnimationDuration] = useState(DEFAULTS.animationDuration)
  const [testerOpen, setTesterOpen] = useState(false)

  const value = useMemo<HeroSettingsContextValue>(
    () => ({
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
      testerOpen,
      openTester: () => setTesterOpen(true),
      closeTester: () => setTesterOpen(false),
      toggleTester: () => setTesterOpen((prev) => !prev),
    }),
    [
      animationDuration,
      intensity,
      intensityTarget,
      opacity,
      opacityTarget,
      size,
      sizeTarget,
      spread,
      spreadTarget,
      testerOpen,
    ],
  )

  return <HeroSettingsContext.Provider value={value}>{children}</HeroSettingsContext.Provider>
}

export function useHeroSettings() {
  const context = useContext(HeroSettingsContext)
  if (!context) {
    throw new Error('useHeroSettings must be used within a HeroSettingsProvider')
  }
  return context
}

export const heroSettingDefaults = DEFAULTS
