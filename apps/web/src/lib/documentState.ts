const CSS_VARS = ['--hud-padding-h', '--hud-padding-top', '--hud-actual-height'] as const

export interface DocumentBaseline {
  classList: string[]
  cssVariables: Record<(typeof CSS_VARS)[number], string>
}

export const captureDocumentBaseline = (): DocumentBaseline | null => {
  if (typeof document === 'undefined') return null
  const root = document.documentElement
  const styles = getComputedStyle(root)
  const cssVariables = CSS_VARS.reduce<Record<string, string>>((acc, key) => {
    acc[key] = styles.getPropertyValue(key)
    return acc
  }, {})
  return {
    classList: Array.from(root.classList),
    cssVariables: cssVariables as Record<(typeof CSS_VARS)[number], string>,
  }
}

export const restoreDocumentBaseline = (baseline: DocumentBaseline | null) => {
  if (!baseline || typeof document === 'undefined') return
  const root = document.documentElement
  root.className = baseline.classList.join(' ')
  Object.entries(baseline.cssVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}
