# 35Bird React Playground

An opinionated React + TypeScript playground for iterating on 35Bird hero concepts. It bundles the production hero mock, a GPU fluid cursor background, and a handful of reusable UI experiments that support the brand.

## Features
- Live hero glow tuner with real-time controls for badge size, spread, intensity, and opacity via `HeroTestingPanel`
- GPU-accelerated splash cursor background (`SplashCursorBackground`) that renders fluid motion while staying pointer-passive
- Dock-style command menu anchored top-right for theme switching, hero tester toggling, and quick navigation shortcuts
- Curated prototypes under `examples/` (dock menu, floating action button, splash cursor variants) for rapid iteration outside the main app

## Getting Started
### Prerequisites
- Node.js 18+
- npm 10+ (a `package-lock.json` is checked in)

### Installation & Development
```bash
npm install
npm run dev
```
The dev server runs on Vite with React Fast Refresh. Visit the URL printed in the terminal (defaults to http://localhost:5173).

### Production Build
```bash
npm run build
```
The optimized build is emitted to `dist/`. Inspect it locally with:
```bash
npm run preview
```

### Linting
```bash
npm run lint
```
Vite ships with TypeScript and ESLint. Tailwind CSS v4 handles global theming via tokens in `src/index.css`.

## Project Structure
- `src/components/` – layout scaffolding, the dock menu, hero tester panel, and utility effects
- `src/context/` – hero settings provider powering the tester overlay
- `src/data/` & `src/lib/` – supporting data/config helpers for prototypes
- `examples/` – isolated sandboxes for interaction patterns before they ship to `src/`
- `public/images/` – hero artwork (`hero.png`, `bird.png`) used by the main scene

## Dock Menu Architecture
- `src/data/dockMenuItems.ts` houses the menu definition (IDs, dynamic label/icon resolvers, command keys, and optional children). Edit this file to add, remove, or reorder entries.
- `src/types/dockMenu.ts` formalizes the menu contracts—`DockMenuItem`, `DockMenuAction`, the runtime context, and the command handler map.
- `src/components/layout/DockMenu.tsx` renders the interactive dock. It resolves dynamic props with the runtime context, manages hover spacing/animation, and dispatches actions through the handler map.
- `src/components/layout/Header.tsx` is the bridge into app state: it imports `dockMenuItems`, supplies the hero tester and theme callbacks, and passes any runtime context (`testerOpen`, etc.).
- Dock items can define a `panel` block for richer flyouts (image/title/description). Provide either `imageSrc` or an extension-agnostic `imageBasePath` (e.g. `/images/menu/tools-preview`) and any of `.png/.jpg/.jpeg/.webp` will be picked up automatically.

### Visual Overview
```
Header
  ├─ useHeroSettings()
  ├─ menuActions = { toggleTheme, toggleTester }
  └─ <DockMenu theme items=dockMenuItems actions=menuActions context={{ testerOpen }}>

DockMenu
  ├─ runtimeContext = { theme, testerOpen }
  ├─ resolves dynamic label/icon values
  ├─ manages hover/open state & styling constants
  └─ dispatches actions map → matching command handlers

dockMenuItems (data)
  ├─ Games → link /games
  ├─ Tools → command openTools
  └─ Theme → command toggleTheme
           └─ Page settings → command toggleTester
```

## Customization Notes
- Adjust hero defaults in `src/context/HeroSettingsContext.tsx`
- Replace hero artwork in `public/images/` while keeping transparent backgrounds for best glow results
- Dock menu dimensions/colors live in `src/config/dockMenu.ts`
- Dock menu items, labels, icons, and command keys live in `src/data/dockMenuItems.ts`
- Tailwind design tokens can be tuned in `tailwind.config.js` and `src/index.css`

## Status
Proprietary use only. This codebase is not open source; review `LICENSE.md` for the full restrictions and contact the maintainers before using anything here.
