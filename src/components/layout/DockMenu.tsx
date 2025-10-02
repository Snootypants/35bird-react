import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

import {
  DOCK_ACTIVE_GAP,
  DOCK_ACTIVE_SCALE,
  DOCK_GAP,
  DOCK_ICON_BLUR_ACTIVE,
  DOCK_ICON_SIZE,
  DOCK_TRANSITION,
} from '../../config/dockMenu'
import type {
  DockMenuAction,
  DockMenuActionHandlers,
  DockMenuDynamicProp,
  DockMenuItem,
  DockMenuRuntimeContext,
} from '@/types/dockMenu'

const baseIconClasses =
  'flex items-center justify-center focus-visible:outline-none cursor-pointer select-none bg-transparent border-0 p-0'

function DockIconButton({
  label,
  icon,
  className,
  ...props
}: {
  label: string
  icon: ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      className={clsx(
        baseIconClasses,
        'rounded-full border border-white/10 bg-white/0 transition hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40',
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  )
}

const makeIcon = (Icon: LucideIcon) => <Icon className="h-6 w-6" strokeWidth={1.4} />

const resolveDynamicProp = <T,>(
  value: DockMenuDynamicProp<T>,
  context: DockMenuRuntimeContext,
): T => (typeof value === 'function' ? value(context) : value)

interface DockMenuProps {
  theme: 'light' | 'dark'
  items: DockMenuItem[]
  actions?: DockMenuActionHandlers
  context?: DockMenuRuntimeContext
}

function DockMenu({ theme, items, actions = {}, context }: DockMenuProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const hoverZoneRef = useRef<HTMLDivElement | null>(null)

  const runtimeContext: DockMenuRuntimeContext = { theme, ...(context ?? {}) }

  useEffect(() => () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
    }
  }, [])

  const iconColor = theme === 'dark' ? '#ffffff' : '#000000'

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const scheduleClose = (id: string) => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setActiveId((prev) => (prev === id ? null : prev))
      closeTimerRef.current = null
    }, 280)
  }

  const handleEnter = (id: string) => {
    clearCloseTimer()
    setActiveId(id)
  }

  const handleLeave = (id: string, currentTarget: HTMLElement, related: Node | null) => {
    const hoverZone = hoverZoneRef.current
    if (hoverZone && related instanceof Node && hoverZone.contains(related)) {
      return
    }
    if (!currentTarget.contains(related)) {
      scheduleClose(id)
    }
  }

  const handleSelect = (action: DockMenuAction) => {
    clearCloseTimer()
    if (action.kind === 'command') {
      const handler = actions[action.command]
      handler?.()
    }
    requestAnimationFrame(() => setActiveId(null))
  }

  const gap = activeId ? DOCK_ACTIVE_GAP : DOCK_GAP

  return (
    <nav
      className="flex items-start"
      style={{ gap, transition: `gap ${DOCK_TRANSITION}` }}
      aria-label="Primary"
    >
      {items.map((item) => {
        const isHovered = activeId === item.id
        const hasChildren = Boolean(item.children?.length)

        const isItemStateActive = item.isActive?.(runtimeContext) ?? false
        const hasActiveChild = item.children?.some((child) => child.isActive?.(runtimeContext)) ?? false

        const label = resolveDynamicProp(item.label, runtimeContext)
        const iconComponent = resolveDynamicProp(item.icon, runtimeContext)
        const icon = makeIcon(iconComponent)

        const iconStyles: CSSProperties = {
          width: DOCK_ICON_SIZE,
          height: DOCK_ICON_SIZE,
          transform: isHovered ? `scale(${DOCK_ACTIVE_SCALE})` : 'scale(1)',
          transformOrigin: 'top center',
          filter: isHovered ? `blur(${DOCK_ICON_BLUR_ACTIVE})` : 'none',
          transition: `transform ${DOCK_TRANSITION}`,
          color: hasActiveChild || isItemStateActive ? '#3b82f6' : iconColor,
          backgroundColor: 'transparent',
          borderRadius: '9999px',
          overflow: 'visible',
        }

        const onMouseEnter = () => handleEnter(item.id)
        const onMouseLeave = (event: ReactMouseEvent<HTMLElement>) => {
          handleLeave(item.id, event.currentTarget, event.relatedTarget as Node | null)
        }

        return (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocus={onMouseEnter}
            onBlur={(event) => {
              const related = event.relatedTarget as Node | null
              if (!event.currentTarget.contains(related)) {
                scheduleClose(item.id)
              }
            }}
          >
            {item.action.kind === 'link' ? (
              <Link
                to={item.action.href}
                aria-label={label}
                className={clsx(baseIconClasses)}
                style={iconStyles}
                onClick={() => handleSelect(item.action)}
              >
                {icon}
              </Link>
            ) : (
              <DockIconButton
                label={label}
                icon={icon}
                style={iconStyles}
                aria-haspopup={hasChildren ? 'menu' : undefined}
                aria-expanded={hasChildren ? isHovered : undefined}
                onClick={() => handleSelect(item.action)}
              />
            )}

            {hasChildren ? (
              <div
                ref={isHovered ? hoverZoneRef : undefined}
                className={clsx(
                  'absolute left-1/2 top-full -translate-x-1/2 transition-all duration-150',
                  isHovered
                    ? 'pointer-events-auto translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-2 opacity-0',
                )}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-black/80 px-3 py-3 text-white shadow-lg backdrop-blur-sm">
                  {item.children?.map((child) => {
                    const childLabel = resolveDynamicProp(child.label, runtimeContext)
                    const childIconComponent = resolveDynamicProp(child.icon, runtimeContext)
                    const childIcon = makeIcon(childIconComponent)
                    const childActive = child.isActive?.(runtimeContext) ?? false

                    return (
                      <DockIconButton
                        key={child.id}
                        label={childLabel}
                        icon={childIcon}
                        style={{
                          width: DOCK_ICON_SIZE,
                          height: DOCK_ICON_SIZE,
                          color: childActive ? '#3b82f6' : iconColor,
                        }}
                        onClick={() => handleSelect(child.action)}
                      />
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        )
      })}
    </nav>
  )
}

export default DockMenu
