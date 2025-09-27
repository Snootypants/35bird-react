import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type HeroSettingsContextValue = {
  size: number
  setSize: (value: number) => void
  spread: number
  setSpread: (value: number) => void
  intensity: number
  setIntensity: (value: number) => void
  opacity: number
  setOpacity: (value: number) => void
  testerOpen: boolean
  openTester: () => void
  closeTester: () => void
  toggleTester: () => void
}

const HeroSettingsContext = createContext<HeroSettingsContextValue | null>(null)

const DEFAULTS = {
  size: 276,
  spread: 0,
  intensity: 0.25,
  opacity: 0.17,
} as const

type HeroSettingsProviderProps = {
  children: ReactNode
}

export function HeroSettingsProvider({ children }: HeroSettingsProviderProps) {
  const [size, setSize] = useState(DEFAULTS.size)
  const [spread, setSpread] = useState(DEFAULTS.spread)
  const [intensity, setIntensity] = useState(DEFAULTS.intensity)
  const [opacity, setOpacity] = useState(DEFAULTS.opacity)
  const [testerOpen, setTesterOpen] = useState(false)

  const value = useMemo<HeroSettingsContextValue>(
    () => ({
      size,
      setSize,
      spread,
      setSpread,
      intensity,
      setIntensity,
      opacity,
      setOpacity,
      testerOpen,
      openTester: () => setTesterOpen(true),
      closeTester: () => setTesterOpen(false),
      toggleTester: () => setTesterOpen((prev) => !prev),
    }),
    [intensity, opacity, size, spread, testerOpen],
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
