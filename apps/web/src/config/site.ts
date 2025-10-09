interface SiteMeta {
  title: string
  description: string
  tagline: string
  url?: string
}

const FALLBACK_META: SiteMeta = {
  title: '35Bird',
  description: 'Designing and building interactive experiences with a focus on polish and feel.',
  tagline: 'Design · Code · Done',
  url: 'https://35bird.com',
}

const env = import.meta.env

export const SITE_META: SiteMeta = {
  title: env.VITE_SITE_TITLE?.trim() || FALLBACK_META.title,
  description: env.VITE_SITE_DESCRIPTION?.trim() || FALLBACK_META.description,
  tagline: env.VITE_SITE_TAGLINE?.trim() || FALLBACK_META.tagline,
  url: env.VITE_SITE_URL?.trim() || FALLBACK_META.url,
}

export const applySiteMetaToDocument = () => {
  if (typeof document === 'undefined') return

  document.title = SITE_META.title

  const ensureTag = (selector: string, attributes: Record<string, string>) => {
    let element = document.head.querySelector<HTMLMetaElement>(selector)
    if (!element) {
      element = document.createElement('meta')
      document.head.appendChild(element)
    }
    Object.entries(attributes).forEach(([key, value]) => {
      element?.setAttribute(key, value)
    })
  }

  ensureTag('meta[name="description"]', { name: 'description', content: SITE_META.description })
  ensureTag('meta[property="og:title"]', { property: 'og:title', content: SITE_META.title })
  ensureTag('meta[property="og:description"]', { property: 'og:description', content: SITE_META.description })

  if (SITE_META.url) {
    ensureTag('meta[property="og:url"]', { property: 'og:url', content: SITE_META.url })
  }
}
