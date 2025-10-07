import { useContext } from 'react'

import { HeroSettingsContext } from '@/context/HeroSettingsContext'

export function useHeroSettings() {
  const context = useContext(HeroSettingsContext)
  if (!context) {
    throw new Error('useHeroSettings must be used within a HeroSettingsProvider')
  }
  return context
}
