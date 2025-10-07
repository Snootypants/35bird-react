import { useMemo, useState, type ReactNode } from 'react'

import { HeroSettingsContext, type HeroSettingsContextValue } from './HeroSettingsContext'
import { heroSettingDefaults } from './heroSettingsDefaults'

type HeroSettingsProviderProps = {
  children: ReactNode
}

export function HeroSettingsProvider({ children }: HeroSettingsProviderProps) {
  const [size, setSize] = useState<number>(heroSettingDefaults.size)
  const [sizeTarget, setSizeTarget] = useState<number>(heroSettingDefaults.sizeTarget)
  const [spread, setSpread] = useState<number>(heroSettingDefaults.spread)
  const [spreadTarget, setSpreadTarget] = useState<number>(heroSettingDefaults.spreadTarget)
  const [intensity, setIntensity] = useState<number>(heroSettingDefaults.intensity)
  const [intensityTarget, setIntensityTarget] = useState<number>(heroSettingDefaults.intensityTarget)
  const [opacity, setOpacity] = useState<number>(heroSettingDefaults.opacity)
  const [opacityTarget, setOpacityTarget] = useState<number>(heroSettingDefaults.opacityTarget)
  const [animationDuration, setAnimationDuration] = useState<number>(heroSettingDefaults.animationDuration)
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

