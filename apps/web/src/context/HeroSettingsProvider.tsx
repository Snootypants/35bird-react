import { useCallback, useMemo, useReducer, useState, type ReactNode } from 'react'

import {
  HeroSettingsContext,
  type HeroSettingsContextValue,
  type HeroSettingsKey,
  type HeroSettingsValues,
} from './HeroSettingsContext'
import { heroSettingDefaults } from './heroSettingsDefaults'

type HeroSettingsProviderProps = {
  children: ReactNode
}

type HeroSettingsAction =
  | { type: 'update'; key: HeroSettingsKey; value: number }
  | { type: 'updateMany'; values: Partial<HeroSettingsValues> }
  | { type: 'reset'; key: HeroSettingsKey }
  | { type: 'resetAll' }

const heroSettingsReducer = (
  state: HeroSettingsValues,
  action: HeroSettingsAction,
): HeroSettingsValues => {
  switch (action.type) {
    case 'update':
      if (state[action.key] === action.value) {
        return state
      }
      return { ...state, [action.key]: action.value }
    case 'updateMany': {
      if (!action.values || Object.keys(action.values).length === 0) {
        return state
      }
      let changed = false
      const next: HeroSettingsValues = { ...state }
      for (const [key, value] of Object.entries(action.values) as Array<[HeroSettingsKey, number]>) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
          continue
        }
        if (next[key] !== value) {
          next[key] = value
          changed = true
        }
      }
      return changed ? next : state
    }
    case 'reset':
      if (!(action.key in heroSettingDefaults)) {
        return state
      }
      if (state[action.key] === heroSettingDefaults[action.key]) {
        return state
      }
      return { ...state, [action.key]: heroSettingDefaults[action.key] }
    case 'resetAll':
      return { ...heroSettingDefaults }
    default:
      return state
  }
}

export function HeroSettingsProvider({ children }: HeroSettingsProviderProps) {
  const [values, dispatch] = useReducer(
    heroSettingsReducer,
    heroSettingDefaults,
    (defaults) => ({ ...defaults }),
  )
  const [testerOpen, setTesterOpen] = useState(false)

  const updateValue = useCallback((key: HeroSettingsKey, value: number) => {
    if (!Number.isFinite(value)) {
      return
    }
    dispatch({ type: 'update', key, value })
  }, [])

  const updateValues = useCallback((changes: Partial<HeroSettingsValues>) => {
    dispatch({ type: 'updateMany', values: changes })
  }, [])

  const resetValue = useCallback((key: HeroSettingsKey) => {
    dispatch({ type: 'reset', key })
  }, [])

  const resetAll = useCallback(() => {
    dispatch({ type: 'resetAll' })
  }, [])

  const openTester = useCallback(() => setTesterOpen(true), [])
  const closeTester = useCallback(() => setTesterOpen(false), [])
  const toggleTester = useCallback(() => setTesterOpen((prev) => !prev), [])

  const value = useMemo<HeroSettingsContextValue>(
    () => ({
      values,
      testerOpen,
      updateValue,
      updateValues,
      resetValue,
      resetAll,
      openTester,
      closeTester,
      toggleTester,
    }),
    [values, testerOpen, updateValue, updateValues, resetValue, resetAll, openTester, closeTester, toggleTester],
  )

  return <HeroSettingsContext.Provider value={value}>{children}</HeroSettingsContext.Provider>
}
