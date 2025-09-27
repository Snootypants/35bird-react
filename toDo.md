Legend:
[ ] to do
[+] working on it
[x] done
[-] skipped {{-- reason --}}

[x] Align hero image sizing with reference mock
[x] Adjust hero typography hierarchy to match reference
[x] Verify updated hero layout visually

Review 09.26.25 - 20:27
- Raised default hero emblem size and container width for a fuller hero presence.
- Reworked welcome heading/tagline scale and weight to mirror reference emphasis.
- Added Plus Jakarta Sans import so typography matches the mock's feel.

## 09.26.25 - 08:30 PM
Hero hero adjustments to align the welcome screen with the provided mock.

To Do List
- [x] Compare hero sizing on tablet/mobile breakpoints and adjust if margins feel tight.

Next Step Notes
- Monitor clamp sizing against any manual slider overrides so the bird never shrinks below the desired prominence.

## 09.26.25 - 08:47 PM
Shrink hero emblem slightly and enlarge the "Welcome" headline to match the mock proportions.

To Do List
- [x] Reduce hero emblem size
- [x] Expand welcome heading width/size keeping tagline untouched

Next Step Notes
- Ensure glow softness remains intact while scaling the emblem down so the surrounding haze still feels rich.

## 09.26.25 - 08:55 PM
Modularize the hero glow effect and move the hero asset into a swappable location.

To Do List
- [x] Extract hero glow effect into reusable module
- [x] Update hero layout to consume reusable effect
- [x] Move bird image to `src/assets/hero.png` and point usage there

Next Step Notes
- Lock the rendered dimensions in the effect component so swapping assets keeps layout intact.

Review 09.26.25 - 21:03
- Broke the glow logic into `HeroGlow` component with reusable helpers.
- Pointed HomePage at the new component and kept typography styling locally.
- Relocated hero art to `src/assets/hero.png` so swapping files is a drop-in update.

## 09.26.25 - 09:14 PM
Dial back the rendered hero size from the effect without touching the actual asset.

To Do List
- [x] Tighten `HeroGlow` sizing clamp so rendered hero is smaller

Next Step Notes
- Keep glow softness intact while shrinking; verify typography still balances the emblem.

## 09.26.25 - 09:17 PM
Cut the effect-driven hero footprint roughly in half for the latest pass.

To Do List
- [x] Halve `HeroGlow` clamp dimensions for rendered size

Next Step Notes
- After shrinking, ensure heading still dominates and glow retains shape.

## 09.26.25 - 09:22 PM
Eliminate page scrollbar and shrink the hero effect another ~25%.

To Do List
- [x] Remove vertical scrollbar while keeping hero centered responsively
- [x] Further reduce `HeroGlow` output sizing by ~25%

Next Step Notes
- Confirm the hero tester controls still behave after clamping updates; watch for overflow on very small viewports.

## 09.26.25 - 10:01 PM
Nudge the hero footprint up ~15% now that sizing feels closer.

To Do List
- [x] Expand `HeroGlow` clamp about 15%

Next Step Notes
- Keep heading scale consistent; only the glow/card needs to grow.
