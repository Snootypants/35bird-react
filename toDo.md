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

## 09.26.25 - 11:30 PM
Redesign the hero settings panel as a tabbed dialog launched from a settings icon.

To Do List
- [x] Add settings icon to tools menu and open a right-side dialog with tab space
- [x] Move existing hero sliders into first tab and support min/max range values
- [x] Provide animation duration slider for looping control (UI only for now)

Next Step Notes
- Keep dialog responsive and ensure tester toggles still integrate with HeroSettings state.

Review 09.26.25 - 23:35
- Replaced dock hammer with `Settings` icon that toggles the new right-side Page Settings drawer.
- Rebuilt tester panel into a tab-ready layout with base/target sliders and duration control tied to context state.
- Extended hero settings context to store target values and animation timing for future loop logic.

## 09.26.25 - 11:42 PM
Restore hammer tools icon, add dropdown for Page Settings, and lower the dialog.

To Do List
- [x] Reinstate hammer icon and show page settings option as dropdown
- [x] Wire dropdown entry to open existing settings drawer
- [x] Offset drawer downward by roughly two inches

Next Step Notes
- Ensure hover/focus behavior works on keyboard and keeps future tool slots simple to add.

Review 09.26.25 - 23:47
- Restored hammer tools icon with hover dropdown exposing the Page Settings action.
- Reused settings icon inside dropdown to open existing drawer via context toggle.
- Dropped the drawer top offset by ~2" so it sits lower on the page.

## 09.26.25 - 11:51 PM
Update dropdown styling: icon-only entry, match dock look, and move Page Settings under theme.

To Do List
- [x] Shift page settings option under the theme icon with vertical dock-style dropdown
- [x] Remove text label from the dropdown button, keeping icon-only design

Next Step Notes
- Ensure focus/hover still feel like the main dock so future items can plug in.

Review 09.26.25 - 23:55
- Shifted Page Settings dropdown beneath the theme switcher with a vertical dock-style menu.
- Converted dropdown buttons to icon-only while keeping accessible labels.

## 09.27.25 - 12:02 AM
Keep the dropdown visible while the pointer is over the menu so the icon can be clicked.

To Do List
- [x] Adjust theme submenu hover/focus logic to stay active when interacting with entries

Next Step Notes
- Probably need a shared hover zone or keep submenu open when pointer is within the flyout container.

Review 09.27.25 - 00:05
- Updated dock hover handling so the theme submenu stays open while pointer moves into the flyout.
- Shared mouse/blur handlers keep accessibility intact without flicker when selecting Page Settings.

## 09.27.25 - 12:13 AM
Menu still closes before click; keep submenu visible and clickable.

To Do List
- [x] Ensure submenu retains pointer events until icon click completes
  - [x] `src/components/layout/DockMenu.tsx`

Next Step Notes
- Maybe the wrapper resets `activeId`; we might need a small delay or dedicated state for the flyout.

Review 09.27.25 - 00:17
- Reduced submenu gap and removed nav-level mouseleave so the flyout stays interactive for clicks.

## 09.27.25 - 12:20 AM
Dropdown still closes too quickly; keep menu visible during hover transition.

To Do List
- [x] Add hover delay logic so submenu stays open when moving to child options
  - [x] `src/components/layout/DockMenu.tsx`

Next Step Notes
- Consider timeout-based close or expanded hover zone.

Review 09.27.25 - 00:24
- Added hover delay with timer-based close so theme submenu stays up long enough for clicks.

## 09.27.25 - 01:13 AM
Theme submenu icon still not clickable; align behavior/styling with main dock.

To Do List
- [x] Fix theme dropdown click handling and icon styling
  - [x] `src/components/layout/DockMenu.tsx`

Next Step Notes
- Maybe reuse Dock components so hover ring/spacing match exactly.

Review 09.27.25 - 01:36
- Synced dropdown styling with dock icons and increased close delay so Page Settings is clickable.

## 09.27.25 - 01:39 AM
Submenu still vanishes while hovering; need rock-solid hover/interaction handling.

To Do List
- [x] Rework theme submenu hover detection so it stays while pointer is inside
  - [x] `src/components/layout/DockMenu.tsx`

Next Step Notes
- Consider putting trigger + menu inside shared wrapper or using pointerenter/pointerleave on container.

Review 09.27.25 - 01:42
- Added shared hover zone ref and timer logic so the theme submenu stays visible until the cursor fully leaves.

## 09.27.25 - 06:15 PM
Page Settings icon still unclickable; need consistent hover and click behavior matching dock.

To Do List
- [x] Refactor menu rendering to reuse dock-like component for submenu
  - [x] `src/components/layout/DockMenu.tsx`
- [x] Verify settings drawer opens on click after refactor

Next Step Notes
- Maybe render submenu items with same JSX as main dock items instead of custom button.

Review 09.27.25 - 18:17
- Extracted a shared DockIconButton so the submenu reuses dock styling and click handling.
- Confirmed the settings drawer opens reliably when selecting the Page Settings icon.

## 03.06.25 - 21:10
[x] Review dock menu child styling and flyout trigger behavior
[x] Update DockMenu so child icons respect theme and Tools panel opens only on child hover/click with image
[x] Run lint check
Review 03.06.25 - 21:32
- Tightened dock submenu activation so the Tools preview appears only when its child is active.
- Ensured submenu icons inherit theme-aware colors and captured lint results (existing errors remain in other files).

## 03.06.25 - 21:55
[x] Investigate submenu hover color and tools preview image issues
[x] Fix dock submenu styling and ensure tools preview renders
[x] Run lint check
Review 03.06.25 - 22:07
- Removed inline icon color overrides so submenu buttons follow theme hover colors and added fallback image resolution.
- Ensured tools flyout falls back to the `.png` asset when dynamic probe misses so the preview now appears.
- Lint still reports existing repo errors (`examples/menu/button.tsx`, `HeroGlow.tsx`, `SplashCursorBackground.tsx`, `HeroSettingsContext.tsx`).
