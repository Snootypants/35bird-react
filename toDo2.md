Legend:
[ ] to do
[+] working on it
[x] done
[-] skipped {{-- reason --}}

This doc tracks the dock menu refactor that decouples data, actions, and presentation so the menu stays easy to extend and portable across projects.

## 09.27.25 - 06:45 PM
Refactor dock menu to read from shared data/config and dispatch mapped handlers.

To Do List
- [x] Introduce shared dock menu types and item data files
- [x] Update DockMenu to use data-driven props and action map
- [x] Wire Header to provide actions/context and document the architecture in README

Next Step Notes
- Consider defining behavior for the `openTools` command or convert it to a link before shipping.

Review 09.27.25 - 06:47 PM
- Added `src/types/dockMenu.ts` and `src/data/dockMenuItems.ts` to centralize structure and content.
- Refactored `DockMenu` to resolve dynamic labels/icons via context and dispatch command handlers.
- Updated README with an overview + diagram so future edits stay straightforward.

## 09.27.25 - 07:05 PM
Remove submenu chrome so Page Settings icon renders without a square background.

To Do List
- [x] Strip border/hover background from submenu `DockIconButton`

Next Step Notes
- Double-check focus style stays accessible enough after removing the square highlight.

Review 09.27.25 - 07:06 PM
- Added a `minimal` variant to `DockIconButton` so submenu icons render without borders, hover fill, or focus ring while keeping the hit target.

## 09.27.25 - 07:12 PM
Remove submenu wrapper styling that was still drawing the square around Page Settings.

To Do List
- [x] Strip border/background classes from submenu container wrapper

Next Step Notes
- If we need a hover affordance later, reintroduce a subtle glow instead of a square background.

Review 09.27.25 - 07:13 PM
- Updated the submenu container to be layout-only so only the icon renders.

## 09.27.25 - 07:25 PM
Add test menu items that surface click confirmations.

To Do List
- [x] Append two test entries under Tools with dedicated icons
- [x] Display dismissible overlay messages when each test item is selected

Next Step Notes
- Maybe reuse the shared `Dialog` component later for richer confirmations.

Review 09.27.25 - 07:27 PM
- Added `FlaskConical` and `TestTube` items that trigger overlay notices.
- Header now manages a lightweight alert dialog with `[OK]` to dismiss the test message.

## 09.27.25 - 07:35 PM
Expand Tools entry with descriptive flyout panel.

To Do List
- [x] Remove second test submenu item and related command wiring
- [x] Add data-driven panel with image slot and copy under the Tools icon
- [x] Ensure panel renders on hover and inherits the hover-zone behavior

Next Step Notes
- Image should live in `public/images/menu/` so swapping art is a drop-in update.

Review 09.27.25 - 07:44 PM
- Dropped the extra test submenu, keeping the FlaskConical trigger for quick overlay checks.
- Introduced `panel` metadata on dock items and render support so the Tools icon reveals a card with gradient/image, title, and description.
- Panel styling hooks into the existing hover zone, so hovering the card keeps the menu active.

## 09.27.25 - 07:48 PM
Prepare menu asset directory.

To Do List
- [x] Create `public/images/menu/` folder for panel artwork

Next Step Notes
- Drop `tools-preview.jpg` (or matching asset) into the folder to light up the Tools flyout.

Review 09.27.25 - 07:49 PM
- Added the `menu` directory under `public/images` so panel references resolve once assets are in place.
- Updated panel image handling to accept multi-extension base paths (tools-preview.png/jpg/etc.).

## 09.27.25 - 07:58 PM
Make panel image resolution automatic.

To Do List
- [x] Resolve panel image source at runtime by probing available extensions
- [x] Use resolved image when rendering hover card

Next Step Notes
- Consider caching per-item results across sessions if menus become dynamic downstream.

Review 09.27.25 - 08:01 PM
- Added fetch-based resolver that checks the configured extension list and stores the first success.
- DockMenu now reads from the resolved cache so panels show artwork as soon as it’s available.

## 09.27.25 - 08:05 PM
Fix panel resolver to actually preload images client-side.

To Do List
- [x] Replace HEAD fetch with `Image` probing so dev server responses succeed

Next Step Notes
- Remember to re-drop `tools-preview.*` after this change if the placeholder asset was overwritten.

Review 09.27.25 - 08:07 PM
- Swapped to `new Image()` loading which works against the Vite dev server and production bundles alike.

## 09.27.25 - 08:12 PM
QA pass on Tools panel asset pipeline.

To Do List
- [x] Verify panel resolver with fresh placeholder image
- [x] Ensure `public/images/menu/tools-preview.*` exists with non-empty data

Next Step Notes
- Replace the placeholder graphic with final art when ready.

Review 09.27.25 - 08:13 PM
- Dropped a sample `tools-preview.png` so the hover card displays art while iterating.
- Confirmed the resolver picks up the file after reload; expect the panel to show immediately once real art lands.
