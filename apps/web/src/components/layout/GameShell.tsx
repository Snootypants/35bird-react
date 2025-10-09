import { useEffect, useMemo } from 'react'

import { captureDocumentBaseline, restoreDocumentBaseline } from '@/lib/documentState'
import { THEME_STORAGE_KEY } from '@/config/storage'
import { readStoredTheme } from '@/config/theme'
import type { Theme } from '@/types'

interface GameShellProps {
  children: React.ReactNode
  forceDark?: boolean
  onRestoreTheme?: (theme: Theme) => void
}

function GameShell({ children, forceDark = true, onRestoreTheme }: GameShellProps) {
  const baseline = useMemo(() => captureDocumentBaseline(), [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    if (forceDark) {
      root.classList.add('dark')
    }

    return () => {
      restoreDocumentBaseline(baseline)
      const theme = readStoredTheme()
      root.classList.toggle('dark', theme === 'dark')
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(THEME_STORAGE_KEY, theme)
        } catch {
          // ignore
        }
      }
      onRestoreTheme?.(theme)
    }
  }, [baseline, forceDark, onRestoreTheme])

  return <>{children}</>
}

export default GameShell
