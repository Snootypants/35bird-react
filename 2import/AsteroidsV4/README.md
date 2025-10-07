# Asteroids V4

A modern React/Vite reimagining of the classic Asteroids arcade shooter. Pilot a nimble ship across a huge wraparound starfield, blast procedurally generated rocks, and chase long-form progression in either score-chasing Waves or endurance Survival. The UI, game loop, and content systems are built from scratch for maintainability and fast iteration.

> Canonical repository: [`Snootypants/AsteroidsV4`](https://github.com/Snootypants/AsteroidsV4.git)

## Contents
- [Game Modes](#game-modes)
- [Controls](#controls)
- [Quick Start](#quick-start)
- [Developer Tooling](#developer-tooling)
- [Gameplay & Tuning Guides](#gameplay--tuning-guides)
- [Project Structure](#project-structure)
- [Testing & CI](#testing--ci)
- [Assets](#assets)
- [License](#license)

## Game Modes

### Waves
- Structured wave progression with a configurable asteroid ramp.
- Hyper jump countdown provides a loot grace window before the next stage.
- Stage clear banner and level-up burst effects keep feedback obvious.

### Survival
- Single-life endurance run: one death ends the session.
- Asteroid spawn cadence and speed multiplier follow a gentler curve (defaults live in `SURVIVAL_TUNING_DEFAULTS`).
- Live tuning overlay (optional) shows the current spawn interval, multiplier, elapsed time, and ramp settings in the bottom-right corner.

## Controls
- **Mouse**: aim the ship; cursor projection stays accurate even when idle.
- **Left click / Space**: fire (instant first shot, constant cadence controlled by `BULLET_FIRE_RATE`).
- **W**: thrust forward.
- **S**: brake (no reverse).
- **Escape**: toggle pause.
- **Shift + Tab**: toggle the developer Test Console.

## Quick Start
```bash
# Install dependencies
npm install

# Launch the dev server
npm run dev

# Run unit tests
npm test

# Produce a production build
npm run build
```

React 19 and Vite 5 power the build; Node 20 or newer is recommended. The game renders to an HTML canvas sized by `useResponsiveLayout` to keep HUD panels aligned with the playfield frame.

## Developer Tooling
- **Test Console** (Shift + Tab):
  - Trigger FX such as level-up, hyperspace jump, stage clear, and death explosion.
  - Toggle HUD debug stats (FPS, asteroid counts, XP progress, etc.).
  - Adjust survival mode tuninglive: spawn interval, max multiplier, base tau, curve stretch, ramp duration, overlay toggle, and restart button for quick iteration.
- **Survival Tuning Overlay**: Optional analytics panel anchored bottom-right showing live survival metrics.
- **Responsive HUD**: Theme variables (`src/styles/theme.css`) expose playfield and HUD gaps; `useResponsiveLayout` rewrites CSS variables so layout changes require minimal JS edits.

## Gameplay & Tuning Guides
- Global constants live in `src/utils/constants.js`. Key fields:
  - `SHIP_SPEED`, `SHIP_FRICTION`, `SHIP_DECELERATION`: flight feel.
  - `ASTEROID_SPEED`, `ASTEROID_SPLIT_SPEED_VARIANCE`: base asteroid behavior.
  - `SURVIVAL_TUNING_DEFAULTS`: spawn interval, max multiplier, and ramp curve for Survival.
  - `XP_LEVEL_BASE`, `XP_LEVEL_GROWTH`: level scaling.
  - `WORLD_WIDTH` / `WORLD_HEIGHT`: world dimensions (default 8000 × 5500).
- Loot, XP, and currency drops are weighted bell curves defined next to the constants for quick balancing.
- The minimap and starfield respond to the world size automatically.

## Project Structure
```
src/
  App.jsx                # Composition root (game loop, rendering, overlays)
  components/           # Ship, Asteroid, Bullet classes + UI shells
    ui/                 # HUD, overlays, Test Console, survival overlay
  hooks/                # Game loop, world, session, controls, timers, layout
  render/               # Canvas renderer for ship, asteroids, pickups, portal
  styles/               # Theme variables and UI styling
  utils/                # Constants, camera helpers, collision math
public/                 # Static assets served by Vite
.github/                # CI workflows and repository metadata
```
Historical prototypes live in `asteroids-game/` for reference but are not part of the main build.

## Testing & CI
- **Vitest** (`npm test`): covers collision detection, asteroid behavior, bullet limits, and session bootstrapping (including the single-life Survival rule).
- **ESLint** (`npm run lint`): optional static analysis step.
- **GitHub Actions** (`.github/workflows/ci.yml`): installs dependencies, runs tests, and builds with Node 20 on every push/PR to `main`.

## Assets
- Runtime art lives under `public/assets/`. Reference assets with Vite’s base URL:
  ```jsx
  const shipUrl = `${import.meta.env.BASE_URL}assets/ship/ship1.png`;
  <img src={shipUrl} alt="Ship" />;
  ```
- Starfield sprites, ship frames, and HUD imagery follow the same structure, making asset swaps straightforward.

## License
This project is proprietary. See [`LICENSE`](./LICENSE) for full terms—no copying or reuse of the code or assets is permitted.
