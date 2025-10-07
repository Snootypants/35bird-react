export const heroSettingDefaults = {
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

export type HeroSettingsDefaults = typeof heroSettingDefaults
