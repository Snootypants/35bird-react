import { createContext, type Dispatch, type SetStateAction } from 'react'

export type HeroSettingsContextValue = {
  size: number
  setSize: Dispatch<SetStateAction<number>>
  sizeTarget: number
  setSizeTarget: Dispatch<SetStateAction<number>>
  spread: number
  setSpread: Dispatch<SetStateAction<number>>
  spreadTarget: number
  setSpreadTarget: Dispatch<SetStateAction<number>>
  intensity: number
  setIntensity: Dispatch<SetStateAction<number>>
  intensityTarget: number
  setIntensityTarget: Dispatch<SetStateAction<number>>
  opacity: number
  setOpacity: Dispatch<SetStateAction<number>>
  opacityTarget: number
  setOpacityTarget: Dispatch<SetStateAction<number>>
  animationDuration: number
  setAnimationDuration: Dispatch<SetStateAction<number>>
  testerOpen: boolean
  openTester: () => void
  closeTester: () => void
  toggleTester: () => void
}

export const HeroSettingsContext = createContext<HeroSettingsContextValue | null>(null)
