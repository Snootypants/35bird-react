# Code Hygiene Audit

This document captures the changes from the automated hygiene pass and highlights follow-up notes for the team.

## Highlights

- Added a workspace-level dev dependency on `globals` so the shared ESLint flat config resolves across every package.
- Centralised site metadata and navigation config to eliminate hard-coded titles, URLs, and routes.
- Hardened the theme hooks and Asteroids game timer to work in SSR/tests by validating stored values and falling back when the performance API is unavailable.
- Removed legacy example assets, the `2import` dump, unused UI utilities, and stale diff artefacts to reduce bundle size and repo noise.
- Converted the Asteroids package to use React peer dependencies which prevents duplicate React bundles when the package is embedded.

## Follow-up Recommendations

- Consider adding focused tests for the new `applySiteMetaToDocument` helper so document mutations stay guarded.
- Update onboarding docs to point developers at `apps/web/.env.example` for required environment variables before running the app locally.
- Keep an eye on the theme/preferences logic if new theme variants are introduced—`config/theme.ts` is now the single source of truth.
