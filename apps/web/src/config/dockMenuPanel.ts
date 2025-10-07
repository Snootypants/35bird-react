export const DOCK_PANEL_IMAGE_FORMATS = ['png', 'jpg', 'jpeg', 'webp'] as const

export const DOCK_SUBMENU_VERTICAL_OFFSET = 16

export const DOCK_PANEL_THEME = {
  dark: {
    imageBackdrop: 'from-slate-700/80 via-slate-800/80 to-slate-950/80',
    imageOverlay: 'bg-slate-900/40',
    surface: 'border-white/15 bg-slate-900/90 text-white shadow-xl',
    childInactive: 'text-white/70 hover:text-white hover:bg-white/10',
    childActive: 'bg-sky-500/20 text-sky-100 shadow-[0_18px_36px_-24px_rgba(56,189,248,0.9)]',
    shadow: 'shadow-[0_28px_60px_-30px_rgba(56,189,248,0.55)]',
  },
  light: {
    imageBackdrop: 'from-slate-100 via-slate-50 to-white',
    imageOverlay: 'bg-white/10',
    surface: 'border-slate-200/80 bg-white/95 text-slate-900 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.45)]',
    childInactive: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
    childActive: 'bg-slate-200 text-sky-600 shadow-[0_18px_36px_-26px_rgba(15,23,42,0.4)]',
    shadow: 'shadow-[0_25px_65px_-35px_rgba(15,23,42,0.25)]',
  },
} as const

export const DOCK_PANEL_FALLBACK_BACKDROP = 'from-slate-800 via-slate-900 to-black'
export const DOCK_PANEL_FALLBACK_OVERLAY = 'bg-black/35'
