import { useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Gamepad2,
  Hammer,
  Home,
  Moon,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import clsx from 'clsx'
import {
  DOCK_ACTIVE_GAP,
  DOCK_ACTIVE_SCALE,
  DOCK_GAP,
  DOCK_ICON_BLUR_ACTIVE,
  DOCK_ICON_SIZE,
  DOCK_TRANSITION,
} from '../../config/dockMenu'

interface DockMenuProps {
  theme: 'light' | 'dark'
  onThemeToggle: () => void
}

interface DockItemConfig {
  id: string
  label: string
  icon: ReactNode
  action: 'link' | 'button'
  href?: string
  onClick?: () => void
}

const baseIconClasses =
  'flex items-center justify-center focus-visible:outline-none cursor-pointer select-none bg-transparent border-0 p-0'

const makeIcon = (Icon: LucideIcon) => <Icon className="h-6 w-6" strokeWidth={1.4} />

function DockMenu({ theme, onThemeToggle }: DockMenuProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const iconColor = theme === 'dark' ? '#ffffff' : '#000000'
  const highlightColor = theme === 'dark' ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.25)'

  const items: DockItemConfig[] = [
    {
      id: 'games',
      label: 'Games',
      icon: makeIcon(Gamepad2),
      action: 'link',
      href: '/games',
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: makeIcon(Hammer),
      action: 'link',
      href: '/tools',
    },
    {
      id: 'theme',
      label: theme === 'dark' ? 'Light mode' : 'Dark mode',
      icon: theme === 'dark' ? makeIcon(Sun) : makeIcon(Moon),
      action: 'button',
      onClick: onThemeToggle,
    },
    {
      id: 'home',
      label: 'Home',
      icon: makeIcon(Home),
      action: 'link',
      href: '/',
    },
  ]

  const gap = activeId ? DOCK_ACTIVE_GAP : DOCK_GAP

  return (
    <nav
      className="flex items-start"
      style={{ gap, transition: `gap ${DOCK_TRANSITION}` }}
      aria-label="Primary"
      onMouseLeave={() => setActiveId(null)}
    >
      {items.map((item) => {
        const isActive = activeId === item.id

        const iconStyles: CSSProperties = {
          width: DOCK_ICON_SIZE,
          height: DOCK_ICON_SIZE,
          transform: isActive
            ? `scale(${DOCK_ACTIVE_SCALE})`
            : 'scale(1)',
          transformOrigin: 'top center',
          filter: isActive ? `blur(${DOCK_ICON_BLUR_ACTIVE})` : 'none',
          transition: `transform ${DOCK_TRANSITION}, filter ${DOCK_TRANSITION}, box-shadow ${DOCK_TRANSITION}`,
          color: iconColor,
          boxShadow: isActive ? `0 0 18px ${highlightColor}` : 'none',
          overflow: 'visible',
        }

        const activate = () => setActiveId(item.id)
        const deactivate = () => setActiveId((prev) => (prev === item.id ? null : prev))

        return (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={activate}
            onMouseLeave={deactivate}
            onFocus={activate}
            onBlur={deactivate}
          >
            {item.action === 'link' && item.href ? (
              <Link
                to={item.href}
                aria-label={item.label}
                className={clsx(baseIconClasses)}
                style={iconStyles}
              >
                {item.icon}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  item.onClick?.()
                  requestAnimationFrame(() => setActiveId(null))
                }}
                aria-label={item.label}
                className={clsx(baseIconClasses)}
                style={iconStyles}
              >
                {item.icon}
              </button>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default DockMenu
