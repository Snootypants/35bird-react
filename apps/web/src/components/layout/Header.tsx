import { useMemo, useState } from 'react'

import DockMenu from './DockMenu'
import type { Theme } from '@/types'
import { DOCK_OFFSET } from '@/config/dockMenu'
import { dockMenuItems } from '@/data/dockMenuItems'
import { useHeroSettings } from '@/hooks/useHeroSettings'
import {
  DOCK_COMMAND_DEFAULT_DISMISS_LABEL,
  DOCK_COMMAND_FEEDBACK,
} from '@/config/dockMenuCommands'

interface HeaderProps {
  theme: Theme
  onThemeToggle: () => void
}

type CommandWithFeedback = keyof typeof DOCK_COMMAND_FEEDBACK

function Header({ theme, onThemeToggle }: HeaderProps) {
  const { toggleTester, testerOpen } = useHeroSettings()
  const [activeCommandKey, setActiveCommandKey] = useState<CommandWithFeedback | null>(null)

  const menuActions = useMemo(
    () => ({
      toggleTheme: onThemeToggle,
      toggleTester,
      showTestItem1: () => setActiveCommandKey('showTestItem1'),
      showAsteroids: () => setActiveCommandKey('showAsteroids'),
    }),
    [onThemeToggle, toggleTester, setActiveCommandKey],
  )

  const activeFeedback = activeCommandKey ? DOCK_COMMAND_FEEDBACK[activeCommandKey] ?? null : null
  const dismissLabel = activeFeedback?.dismissLabel ?? DOCK_COMMAND_DEFAULT_DISMISS_LABEL

  return (
    <header className="pointer-events-none">
      <div
        className="fixed z-50 pointer-events-auto"
        style={{ top: `${DOCK_OFFSET}px`, right: `${DOCK_OFFSET}px` }}
      >
        <DockMenu
          theme={theme}
          items={dockMenuItems}
          actions={menuActions}
          context={{ testerOpen }}
        />
      </div>
      {activeFeedback ? (
        <div className="pointer-events-auto fixed inset-0 z-[70] flex items-center justify-center bg-black/60">
          <div
            role="alertdialog"
            aria-modal="true"
            className="pointer-events-auto w-[280px] rounded-2xl border border-white/15 bg-black/80 px-5 py-4 text-white shadow-xl backdrop-blur"
          >
            <p className="mb-4 text-sm leading-relaxed">{activeFeedback.message}</p>
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-md border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                onClick={() => setActiveCommandKey(null)}
              >
                {dismissLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Header
