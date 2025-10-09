import { useMemo } from 'react'

import DockMenu from './DockMenu'
import type { Theme } from '@/types'
import { DOCK_OFFSET } from '@/config/dockMenu'
import { dockMenuItems } from '@/data/dockMenuItems'
import { useHeroSettings } from '@/hooks/useHeroSettings'

interface HeaderProps {
  theme: Theme
  onThemeToggle: () => void
  minimal?: boolean
}

function Header({ theme, onThemeToggle, minimal = false }: HeaderProps) {
  const { toggleTester, testerOpen } = useHeroSettings()

  const menuActions = useMemo(
    () => ({
      toggleTheme: onThemeToggle,
      toggleTester,
    }),
    [onThemeToggle, toggleTester],
  )

  return (
    <header className="pointer-events-none">
      <div
        className="fixed pointer-events-auto z-[300]"
        style={{ top: `${DOCK_OFFSET}px`, right: `${DOCK_OFFSET}px` }}
      >
        <DockMenu
          theme={theme}
          items={dockMenuItems}
          actions={menuActions}
          context={{ testerOpen, minimal }}
        />
      </div>
    </header>
  )
}

export default Header
