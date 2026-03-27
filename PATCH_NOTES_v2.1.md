# Office Adventure: The Toilet Quest — Patch Notes v2.1

**Version:** v2.1
**Date:** 2026-03-27
**Codename:** "Bugslayer"

---

## CRITICAL BUG FIXES

### FIX-001: Toilet meter now rises during the work mini-game
**Was:** `updateTimers()` had a guard `if (game.state !== 'playing') return` which blocked ALL timer updates (toilet, time, decay) during the `workScreen` state. Players could spam the mini-game with zero risk.
**Now:** Guard updated to `if (game.state !== 'playing' && game.state !== 'workScreen') return`. Time ticks down, toilet fills up, and work decays while you're answering math questions. The pressure is real.
**Files changed:** `js/logic.js`

### FIX-002: Karen's branching dialogue choices are now reachable
**Was:** Karen's auto-interact (proximity trigger) fired before the player could ever press E, setting `interacted = true` and playing only the linear dialogue. The branching choices ("Politely decline" / "Run away" / "Accept the meeting") were dead code.
**Now:** The auto-interact now includes the full branching dialogue with all 3 choices and their time-loss effects (5s / 15s / 45s). The flat 30s time deduction on proximity has been removed — the penalty now depends on your choice.
**Files changed:** `js/npcs.js`

### FIX-003: Free Roam inventory now shows all 4 slots
**Was:** Free Roam gave the player 4 inventory slots but the UI hardcoded 2 slots. Items in slots 3-4 were invisible and unusable.
**Now:** Inventory bar dynamically sizes based on `player.inventory.length`. Added keybinds for `[3]` and `[4]`. Controls hint text updates accordingly.
**Files changed:** `js/ui.js`, `js/state.js`

---

## HIGH SEVERITY FIXES

### FIX-004: Replaced dead `game.isWorking` state with `game.state === 'workScreen'`
**Was:** `game.isWorking` was set to `false` every frame and never set to `true` after the mini-game refactor. Enemy AI never reduced aggression during work, and the "Working..." player label never showed.
**Now:** All references to `game.isWorking` replaced with `game.state === 'workScreen'`. Enemy zombies now correctly reduce to 'suspicious' state when you're doing math. Player shows "Working..." text above their head during the mini-game. The `isWorking` property, `workTask`, and `workTaskTimer` removed from game state (dead properties).
**Files changed:** `js/logic.js`, `js/player.js`, `js/state.js`

### FIX-005: Locked door message now says "Press [E]" instead of "Hold [E]"
**Was:** The locked door dialogue still said `"Hold [E] near a computer to work"` — a remnant of the old hold-E mechanic.
**Now:** Updated to `"Press [E] near a computer to work"`.
**Files changed:** `js/interactions.js`

### FIX-006: Level 1 and Level 2 quests now auto-complete on item pickup
**Was:** L1 (Coffee Emergency) and L2 (Emergency Supplies) quests had `giver: 'Survival'` but no NPC with that name existed. Quests appeared in the log but could never be turned in.
**Now:** When picking up an item, the game checks for quests with `giver: 'Survival'` that match the item type and auto-completes them with a quest-complete dialogue. Also fixed the "pockets full" message to show the correct max slot count.
**Files changed:** `js/interactions.js`

### FIX-007: Paper balls now require ammo
**Was:** `throwPaperBall()` had no ammo check. Players could throw infinite paper balls from the start without buying them from Kunal's shop.
**Now:** Function checks `game.paperBallAmmo > 0` before throwing and decrements the counter. You now actually need to buy Paper Balls x5 from Kunal.
**Files changed:** `js/logic.js`

---

## MEDIUM SEVERITY FIXES

### FIX-008: Occupied cubicle now blocks the win condition
**Was:** In Level 2, one random toilet cubicle displays "OCCUPIED" but the player could walk onto it and still win the game.
**Now:** The win-tile check now skips the occupied cubicle index. Players must find one of the other unoccupied toilets.
**Files changed:** `js/logic.js`

### FIX-009: Removed 56 lines of dead `drawWorkOverlay()` code
**Was:** The old hold-E work overlay function (`drawWorkOverlay()`) still existed in effects.js but was never called after the mini-game refactor.
**Now:** Function deleted. Cleaner codebase.
**Files changed:** `js/effects.js`

### FIX-010: Work meter no longer decays in Free Roam
**Was:** Work points (the vendor currency) decayed at 0.8/second in Free Roam, draining quest rewards while the player explored.
**Now:** Work decay is disabled when `game.mode === 'freeroam'`. Your earned work points are safe.
**Files changed:** `js/logic.js`

### FIX-011: Enemies can no longer see through furniture
**Was:** `hasLineOfSight()` only blocked on `TILE_WALL`. Zombie Andrew could "see through" desks, fridges, copiers, sofas, and plants, making furniture-based stealth useless.
**Now:** Uses `isSolid()` which checks all solid tile types (wall, desk, fridge, kitchen, monitor, sink, copier, sofa, plant, water cooler, wet floor sign). Hiding behind furniture actually works now.
**Files changed:** `js/logic.js`

### FIX-012: Greg's encounter now has branching dialogue with player choice
**Was:** Greg's auto-interact deducted a flat 30 seconds upfront with no player agency. The manual interact handler also deducted 30 seconds (double penalty risk).
**Now:** Greg's encounter (both auto and manual) now has branching dialogue: "Politely listen" costs 30 seconds, "Walk away mid-story" costs only 10 seconds. No upfront time deduction — the penalty depends on your choice.
**Files changed:** `js/npcs.js`, `js/interactions.js`

---

## SUMMARY

12 bugs fixed across 7 files. All 15 JS files pass syntax validation. Key improvements: the work mini-game now has real tension (timers tick during it), enemy stealth is functional, Free Roam economy is stable, and all quest/dialogue content is reachable.
