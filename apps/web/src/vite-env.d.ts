/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_TITLE?: string
  readonly VITE_SITE_DESCRIPTION?: string
  readonly VITE_SITE_TAGLINE?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_DEFAULT_THEME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
