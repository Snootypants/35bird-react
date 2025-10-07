import type { DockMenuCommandKey } from '@/types/dockMenu'

export interface CommandFeedbackConfig {
  message: string
  dismissLabel?: string
}

export const DOCK_COMMAND_FEEDBACK = {
  showTestItem1: {
    message: 'Test item 1 was clicked.',
    dismissLabel: 'OK',
  },
} as const satisfies Partial<Record<DockMenuCommandKey, CommandFeedbackConfig>>

export const DOCK_COMMAND_DEFAULT_DISMISS_LABEL = 'OK'
