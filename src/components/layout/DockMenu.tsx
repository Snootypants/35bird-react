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
} from '../../types/dockMenu'

const baseIconClasses =
  'flex items-center justify-center focus-visible:outline-none cursor-pointer select-none bg-transparent border-0 p-0'

type DockIconButtonVariant = 'default' | 'minimal'

const DEFAULT_PANEL_IMAGE_FORMATS = ['png', 'jpg', 'jpeg', 'webp'] as const
const SUBMENU_VERTICAL_OFFSET = 16
const PANEL_DARK_SHADOW = 'shadow-[0_28px_60px_-30px_rgba(56,189,248,0.55)]'
const PANEL_LIGHT_SHADOW = 'shadow-[0_25px_65px_-35px_rgba(15,23,42,0.25)]'

function DockIconButton({
  label,
  icon,
  className,
  variant = 'default',
  ...props
}: {
  label: string
  icon: ReactNode
  className?: string
  variant?: DockIconButtonVariant
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variantClasses =
    variant === 'minimal'
      ? 'rounded-full border-0 border-transparent bg-transparent text-inherit hover:bg-transparent focus-visible:ring-0'
      : 'rounded-full border border-white/10 bg-white/0 transition hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40'

  return (
    <button
      type="button"
      aria-label={label}
      className={clsx(
        baseIconClasses,
        variantClasses,
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  )
}

const makeIcon = (Icon: LucideIcon) => <Icon className="h-6 w-6" strokeWidth={1.4} />

const isDynamicResolver = <T,>(value: DockMenuDynamicProp<T>): value is { resolve: (context: DockMenuRuntimeContext) => T } =>
  typeof value === 'object' && value !== null && 'resolve' in value && typeof value.resolve === 'function'

const resolveDynamicProp = <T,>(
  value: DockMenuDynamicProp<T>,
  context: DockMenuRuntimeContext,
): T => (isDynamicResolver(value) ? value.resolve(context) : value)

interface DockMenuProps {
  theme: 'light' | 'dark'
  items: DockMenuItem[]
  actions?: DockMenuActionHandlers
  context?: DockMenuRuntimeContext
}

function DockMenu({ theme, items, actions = {}, context }: DockMenuProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeChildId, setActiveChildId] = useState<string | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const hoverZoneRef = useRef<HTMLDivElement | null>(null)
  const [panelImages, setPanelImages] = useState<Record<string, string | null>>({})

  const runtimeContext: DockMenuRuntimeContext = { theme, ...(context ?? {}) }

  useEffect(() => () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    if (typeof window === 'undefined') {
      return
    }

    const cacheTag = `cb=${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`
    const applyCacheBust = (url: string) => {
      if (/^(?:data|blob):/.test(url)) {
        return url
      }
      return url.includes('?') ? `${url}&${cacheTag}` : `${url}?${cacheTag}`
    }

    const resolveImages = async () => {
      setPanelImages({})

      const loadCandidate = (src: string) =>
        new Promise<boolean>((resolve) => {
          const img = new Image()
          img.onload = () => resolve(true)
          img.onerror = () => resolve(false)
          img.src = src
        })

      const results = await Promise.all(
        items.map(async (item) => {
          const panel = item.panel
          if (!panel) {
            return null
          }

          if (panel.imageSrc) {
            const bust = applyCacheBust(panel.imageSrc)
            const variants = bust === panel.imageSrc ? [panel.imageSrc] : [bust, panel.imageSrc]
            for (const src of variants) {
              try {
                const ok = await loadCandidate(src)
                if (ok) {
                  if (import.meta.env.DEV) {
                    console.debug('[DockMenu] Resolved panel image', item.id, src)
                  }
                  return [item.id, src] as const
                }
              } catch (error) {
                if (import.meta.env.DEV) {
                  console.warn('[DockMenu] Failed to load panel image candidate', src, error)
                }
              }
            }

            return [item.id, null] as const
          }

          if (!panel.imageBasePath) {
            return [item.id, null] as const
          }

          const formats = panel.imageFormats?.length
            ? panel.imageFormats
            : DEFAULT_PANEL_IMAGE_FORMATS

          for (const ext of formats) {
            const candidate = `${panel.imageBasePath}.${ext}`
            const bust = applyCacheBust(candidate)
            const variants = bust === candidate ? [candidate] : [bust, candidate]

            for (const src of variants) {
              try {
                const ok = await loadCandidate(src)
                if (ok) {
                  if (import.meta.env.DEV) {
                    console.debug('[DockMenu] Resolved panel image', item.id, src)
                  }
                  return [item.id, src] as const
                }
              } catch (error) {
                if (import.meta.env.DEV) {
                  console.warn('[DockMenu] Failed to load panel image candidate', src, error)
                }
              }
            }
          }

          return [item.id, null] as const
        }),
      )

      if (cancelled) {
        return
      }

      setPanelImages((prev) => {
        const next = { ...prev }
        for (const entry of results) {
          if (!entry) continue
          const [id, src] = entry
          next[id] = src
        }
        return next
      })
    }

    void resolveImages()

    return () => {
      cancelled = true
    }
  }, [items])

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
      setActiveChildId(null)
      closeTimerRef.current = null
    }, 280)
  }

  const handleEnter = (id: string) => {
    clearCloseTimer()
    setActiveId((prev) => {
      if (prev !== id) {
        setActiveChildId(null)
      }
      return id
    })
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
    requestAnimationFrame(() => {
      setActiveId(null)
      setActiveChildId(null)
    })
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
        const panelConfig = item.panel
        const hasPanel = Boolean(panelConfig)
        const shouldRenderFlyout = hasChildren || hasPanel

        const resolvedChildren = item.children ?? []
        const hasChildMatch = resolvedChildren.some((child) => child.id === activeChildId)
        const resolvedActiveChildId = activeId === item.id && hasChildMatch ? activeChildId : null
        const isItemStateActive = item.isActive?.(runtimeContext) ?? false
        const hasActiveChild = resolvedChildren.some((child) => child.isActive?.(runtimeContext))
        const fallbackPanelImage = panelConfig?.imageBasePath
          ? `${panelConfig.imageBasePath}.${panelConfig.imageFormats?.[0] ?? DEFAULT_PANEL_IMAGE_FORMATS[0]}`
          : null
        const panelImageCandidate = panelConfig?.imageSrc ?? panelImages[item.id] ?? fallbackPanelImage
        const isPanelActive = Boolean(panelConfig && (hasChildren ? resolvedActiveChildId : isHovered))

        const resolvedPanelImage = isPanelActive ? panelImageCandidate : null
        const resolvedPanelTitle = isPanelActive && panelConfig?.title
          ? resolveDynamicProp<string>(panelConfig.title, runtimeContext)
          : null
        const resolvedPanelDescription = isPanelActive && panelConfig?.description
          ? resolveDynamicProp<string>(panelConfig.description, runtimeContext)
          : null

        const label = resolveDynamicProp<string>(item.label, runtimeContext)
        const iconComponent = resolveDynamicProp<LucideIcon>(item.icon, runtimeContext)
        const icon = makeIcon(iconComponent)
        const panelImageAlt = resolvedPanelTitle ?? `${label} preview`
        const panelBackdropClass = resolvedPanelImage
          ? theme === 'dark'
            ? 'from-slate-700/80 via-slate-800/80 to-slate-950/80'
            : 'from-slate-100 via-slate-50 to-white'
          : 'from-slate-800 via-slate-900 to-black'
        const panelOverlayClass = resolvedPanelImage
          ? theme === 'dark'
            ? 'bg-slate-900/40'
            : 'bg-white/10'
          : 'bg-black/35'
        const panelSurfaceClasses = theme === 'dark'
          ? 'border-white/15 bg-slate-900/90 text-white shadow-xl'
          : 'border-slate-200/80 bg-white/95 text-slate-900 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.45)]'
        const childInactiveClasses = theme === 'dark'
          ? 'text-white/70 hover:text-white hover:bg-white/10'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        const childActiveClasses = theme === 'dark'
          ? 'bg-sky-500/20 text-sky-100 shadow-[0_18px_36px_-24px_rgba(56,189,248,0.9)]'
          : 'bg-slate-200 text-sky-600 shadow-[0_18px_36px_-26px_rgba(15,23,42,0.4)]'

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
          const related = event.relatedTarget
          handleLeave(item.id, event.currentTarget, related instanceof Node ? related : null)
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
                aria-haspopup={shouldRenderFlyout ? 'menu' : undefined}
                aria-expanded={shouldRenderFlyout ? isHovered : undefined}
                onClick={() => handleSelect(item.action)}
              />
            )}

            {shouldRenderFlyout ? (
              <div
                ref={isHovered ? hoverZoneRef : undefined}
                className={clsx(
                  'absolute left-1/2 top-full z-40 -translate-x-1/2 transition-all duration-200 ease-out',
                  isHovered
                    ? 'pointer-events-auto translate-y-3 opacity-100'
                    : 'pointer-events-none translate-y-1 opacity-0',
                )}
                onMouseEnter={() => handleEnter(item.id)}
                onMouseLeave={(event) => {
                  const related = event.relatedTarget
                  handleLeave(item.id, event.currentTarget, related instanceof Node ? related : null)
                }}
              >
                <div className="relative flex justify-center">
                  {panelConfig && (resolvedPanelImage || resolvedPanelTitle || resolvedPanelDescription) ? (
                    <div
                      className={clsx(
                        'absolute right-full mr-4 w-[320px] max-w-[75vw] origin-top-right rounded-3xl border backdrop-blur-lg transition-[transform,opacity,filter] duration-200 ease-out saturate-125',
                        panelSurfaceClasses,
                        theme === 'dark' ? PANEL_DARK_SHADOW : PANEL_LIGHT_SHADOW,
                        isPanelActive
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none -translate-y-4 translate-x-2 opacity-0 backdrop-blur-sm',
                      )}
                      style={{ top: SUBMENU_VERTICAL_OFFSET }}
                    >
                      {resolvedPanelImage ? (
                        <div className="overflow-hidden rounded-2xl">
                          <div className="relative h-40 w-full">
                            <div
                              className={clsx(
                                'absolute inset-0 z-0 bg-gradient-to-br',
                                panelBackdropClass,
                              )}
                            />
                            <img
                              src={resolvedPanelImage}
                              alt={panelImageAlt}
                              className="absolute inset-0 z-10 h-full w-full object-cover"
                              decoding="async"
                              loading="lazy"
                            />
                            <div className={clsx('absolute inset-0 z-20', panelOverlayClass)} />
                          </div>
                        </div>
                      ) : null}
                      {resolvedPanelTitle || resolvedPanelDescription ? (
                        <div className={clsx('mt-4 space-y-2', resolvedPanelImage ? '' : 'pt-2')}>
                          {resolvedPanelTitle ? (
                            <h3 className="text-base font-semibold tracking-tight">{resolvedPanelTitle}</h3>
                          ) : null}
                          {resolvedPanelDescription ? (
                            <p
                              className={clsx(
                                'text-sm leading-relaxed',
                                theme === 'dark' ? 'text-white/70' : 'text-slate-600',
                              )}
                            >
                              {resolvedPanelDescription}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {hasChildren ? (
                    <div
                      className={clsx(
                        'flex flex-col items-center gap-2 transition-all duration-200 ease-out',
                        isHovered
                          ? 'translate-y-0 opacity-100'
                          : '-translate-y-2 opacity-0 pointer-events-none',
                      )}
                      style={{ marginTop: SUBMENU_VERTICAL_OFFSET }}
                    >
                    {resolvedChildren.map((child) => {
                        const childLabel = resolveDynamicProp<string>(child.label, runtimeContext)
                        const childIconComponent = resolveDynamicProp<LucideIcon>(child.icon, runtimeContext)
                        const childIcon = makeIcon(childIconComponent)
                        const isChildActive = resolvedActiveChildId === child.id

                        return (
                          <DockIconButton
                            key={child.id}
                            label={childLabel}
                            icon={childIcon}
                            variant="minimal"
                            className={clsx(
                              'rounded-xl p-1 transition-colors duration-150',
                              isChildActive ? childActiveClasses : childInactiveClasses,
                            )}
                            style={{
                              width: DOCK_ICON_SIZE,
                              height: DOCK_ICON_SIZE,
                            }}
                            onMouseEnter={() => {
                              setActiveChildId(child.id)
                              handleEnter(item.id)
                            }}
                            onFocus={() => {
                              setActiveChildId(child.id)
                              handleEnter(item.id)
                            }}
                            onClick={() => {
                              setActiveChildId(child.id)
                              handleSelect(child.action)
                            }}
                          />
                        )
                      })}
                    </div>
                  ) : null}
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
