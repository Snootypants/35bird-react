import DockMenu from './DockMenu'
import type { Theme } from '../../types'
import { DOCK_OFFSET } from '../../config/dockMenu'

interface HeaderProps {
  theme: Theme
  onThemeToggle: () => void
}

function Header({ theme, onThemeToggle }: HeaderProps) {
  return (
    <header className="pointer-events-none">
      <div
        className="fixed z-50 pointer-events-auto"
        style={{ top: `${DOCK_OFFSET}px`, right: `${DOCK_OFFSET}px` }}
      >
        <DockMenu theme={theme} onThemeToggle={onThemeToggle} />
      </div>
    </header>
  )
}

export default Header
