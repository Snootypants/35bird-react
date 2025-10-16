import { useEffect, useMemo } from 'react'

import { captureDocumentBaseline, restoreDocumentBaseline } from '@/lib/documentState'
import { readStoredTheme } from '@/config/theme'

interface GameShellProps {
  children: React.ReactNode
  forceDark?: boolean
  onRestoreTheme?: () => void
}

function GameShell({ children, forceDark = true, onRestoreTheme }: GameShellProps) {
  const baseline = useMemo(() => captureDocumentBaseline(), [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const body = document.body

    root.classList.add('asteroids-active')
    body?.classList.add('asteroids-active')
    if (forceDark) {
      root.classList.add('dark')
    }

    return () => {
      root.classList.remove('asteroids-active')
      body?.classList.remove('asteroids-active')
      restoreDocumentBaseline(baseline)
      if (!baseline) {
        const theme = readStoredTheme()
        root.classList.toggle('dark', theme === 'dark')
      }
      onRestoreTheme?.()
    }
  }, [baseline, forceDark, onRestoreTheme])

  return <>{children}</>
}

export default GameShell
