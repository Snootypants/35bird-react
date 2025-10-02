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
