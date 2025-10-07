Legend:
[ ] to do
[+] working on it
[x] done
[-] skipped {{-- reason --}}

## 09.27.25 - 12:00 AM
Tune survival mode pacing and add live tuning controls.
To Do List
- [x] Limit survival mode runs to a single life
  - [x] `src/utils/constants.js`
  - [x] `src/hooks/useGameSession.js`
  - [x] `src/hooks/useGameSession.test.jsx`
- [x] Slow survival speed ramp and centralize tuning defaults
  - [x] `src/utils/constants.js`
  - [x] `src/App.jsx`
  - [x] `src/hooks/useGameLogic.js`
- [x] Build survival tuning overlay and console controls
  - [x] `src/App.jsx`
  - [x] `src/components/ui/TestConsole.jsx`
  - [x] `src/components/ui/SurvivalTuningOverlay.jsx`
  - [x] `src/styles/ui.css`
- [x] Add/verify tests covering new survival behavior
  - [x] `src/hooks/useGameSession.test.jsx`
  - [x] `src/hooks/useGameLoop.test.jsx`
Next Step Notes
- Confirm overlay toggle and live updates while running survival
- Run vitest suite once changes settle
Review 09.27.25 - 12:01
- Survival mode now starts with one life and uses gentler speed curve defaults
- Added live-adjustable survival tuning controls plus bottom-right overlay
- Vitest run passes including new survival single-life test

## 09.27.25 - 12:09 AM
Prep repo metadata, docs, and license for AsteroidsV4.
To Do List
- [x] Clarify .github repo info guidance
  - [x] `.github/workflows/ci.yml`
- [x] Record target repo URL under .github
  - [x] `.github/repository.yml`
- [x] Refresh README with up-to-date project details
  - [x] `README.md`
- [x] Add no-copy license file
  - [x] `LICENSE`
- [x] Point git remote to Snootypants/AsteroidsV4 and push initial commit
  - [x] `.git/config`
Next Step Notes
- README should cover gameplay, setup, controls, and testing
- Confirm remote update before committing
Review 09.27.25 - 12:12
- Added .github/repository.yml pointing to Snootypants/AsteroidsV4
- Refreshed README with mode, tuning, and tooling coverage
- Created restrictive LICENSE and pushed initial commit to new remote

## 09.27.25 - 12:22 AM
Move survival tuning controls to dedicated window and align to-do format.
To Do List
- [x] Move survival tuning controls to dedicated window toggled by Upgrades button
  - [x] `src/components/ui/TestConsole.jsx`
  - [x] `src/components/ui/SurvivalTuningWindow.jsx`
  - [x] `src/App.jsx`
  - [x] `src/styles/ui.css`
- [x] Update to-do checklist format with per-file subtasks
  - [x] `toDo.md`
Next Step Notes
- Consider adding keyboard shortcut or console hotkey for the tuning window
- QA modal layout on smaller screens and with pointer lock disabled
Review 09.27.25 - 12:34
- Survival tuning controls now live in modal window triggered from Test Console tab
- Added dedicated component and styles while preserving overlay HUD toggle
- Vitest suite still passing after UI refactor

## 09.27.25 - 12:39 AM
Embed survival tuning panel within the Test Console sidebar.
To Do List
- [x] Restore Survival tab content inside Test Console
  - [x] `src/components/ui/TestConsole.jsx`
  - [x] `src/App.jsx`
  - [x] `src/styles/ui.css`
  - [x] `src/components/ui/SurvivalTuningWindow.jsx`
Next Step Notes
- Remove modal-specific state and styles; re-add inline form layout
- Ensure tab switching between Effects and Survival works with Shift+Tab console
Review 09.27.25 - 12:41
- Survival tuning controls now live as a console tab alongside Effects
- Modal component removed; sidebar styling reinstated for tuning form
- Vitest suite stays green after UI reshuffle

## 09.27.25 - 12:42 AM
Rename survival tab and gate telemetry behind a button.
To Do List
- [x] Adjust Test Console tabs and embed telemetry toggle
  - [x] `src/components/ui/TestConsole.jsx`
- [x] Update tests for telemetry toggle workflow
  - [x] `src/App.test.jsx`
Next Step Notes
- Replace tab label with "Survival Tuning" and relocate telemetry controls accordingly
- Ensure telemetry checkboxes remain reachable after the change
Review 09.27.25 - 01:01
- Renamed console tab to Survival Tuning with inline telemetry toggle button
- Telemitry button now reveals checkbox panel; tests updated for new flow
- Vitest suite passes after UI/test adjustments

## 09.27.25 - 01:05 AM
Create dedicated telemetry page inside Test Console.
To Do List
- [x] Move telemetry checkboxes into their own tab/button
  - [x] `src/components/ui/TestConsole.jsx`
  - [x] `src/styles/ui.css`
  - [x] `src/App.jsx`
  - [x] `src/App.test.jsx`
Next Step Notes
- Smoke test console navigation between Survival Tuning and Telemetry views
- Confirm telemetry back button feels natural with controller/keyboard
Review 09.27.25 - 01:11
- Added dedicated Telemetry page accessible via button beneath Survival Tuning
- Telemetry view includes back button; nav highlights Survival for both views
- Updated tests and styles; vitest suite still green

## 09.27.25 - 01:18 AM
Promote Telemetry to top-level Test Console tab.
To Do List
- [x] Add Telemetry tab alongside Effects and Survival
  - [x] `src/components/ui/TestConsole.jsx`
  - [x] `src/styles/ui.css`
  - [x] `src/App.jsx`
  - [x] `src/App.test.jsx`
Next Step Notes
- Keep quick Telemetry button under Survival if useful, but tabs must show Effects/Survival/Telemetry
- Verify nav state resets when console closes
Review 09.27.25 - 01:20
- Added Telemetry as a full top-tab beside Effects and Survival
- Survival panel still offers a button shortcut to switch tabs
- Back button and tests updated; vitest suite passes

## 09.27.25 - 01:47 AM
Reset survival on replay and add intro warmup.
To Do List
- [x] Ensure Play Again fully resets survival state (clears asteroids, ship rendered)
  - [x] `src/hooks/useGameSession.js`
  - [x] `src/hooks/useGameWorld.js`
  - [x] `src/hooks/useGameLogic.js`
  - [x] `src/App.jsx`
- [x] Add 2s warmup with ship blink and pre-rendered asteroids on start
  - [x] `src/hooks/useGameSession.js`
  - [x] `src/hooks/useGameLogic.js`
  - [x] `src/components/Ship.js`
  - [x] `src/utils/constants.js`
  - [x] `src/App.jsx`
  - [x] `src/App.test.jsx`
Next Step Notes
- QA warmup timing in both modes (ensure ship control unlocks promptly)
- Evaluate if additional UI cue is needed during the 2s intro period
Review 09.27.25 - 03:33
- Survival Play Again now performs full reset including asteroids and state
- Added 2s warmup with 3Hz ship blink before control unlocks in both modes
- Tests updated; vitest run passes after warmup changes
