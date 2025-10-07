import { createContext } from 'react'

export interface HeroSettingsValues {
  size: number
  sizeTarget: number
  spread: number
  spreadTarget: number
  intensity: number
  intensityTarget: number
  opacity: number
  opacityTarget: number
  animationDuration: number
}

export type HeroSettingsKey = keyof HeroSettingsValues

export interface HeroSettingsContextValue {
  values: HeroSettingsValues
  testerOpen: boolean
  updateValue: (key: HeroSettingsKey, value: number) => void
  updateValues: (changes: Partial<HeroSettingsValues>) => void
  resetValue: (key: HeroSettingsKey) => void
  resetAll: () => void
  openTester: () => void
  closeTester: () => void
  toggleTester: () => void
}

export const HeroSettingsContext = createContext<HeroSettingsContextValue | null>(null)
