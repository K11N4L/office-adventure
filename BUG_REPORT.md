# Office Adventure: The Toilet Quest — Bug Report

**Date:** 2026-03-27
**Version:** v2.0 (Post Math Mini-Game Refactor)
**Reviewer:** Claude (Code Review Agent)

---

## CRITICAL BUGS

### BUG-001: Toilet meter does NOT rise during work mini-game (despite comment saying it should)

**File:** `js/main.js` line 33-37, `js/logic.js` line 659
**Severity:** Critical (gameplay balance)

In `main.js`, the `workScreen` state calls `updateTimers(dt)` with a comment: "Still tick timers (toilet still rises while working!)". However, `updateTimers()` has a guard at line 659: `if (game.state !== 'playing') return;` — since the state is `'workScreen'`, the function returns immediately. The toilet meter, time countdown, and work decay all freeze during the mini-game.

**Impact:** Players can spam the work mini-game with zero risk. The toilet never fills and the timer never counts down while answering questions. This removes a key tension mechanic.

**Fix:** Change the guard in `updateTimers()` to allow `workScreen` state:
```javascript
if (game.state !== 'playing' && game.state !== 'workScreen') return;
```

---

### BUG-002: Karen's branching dialogue choices are unreachable (dead code)

**File:** `js/interactions.js` line 137-166, `js/npcs.js` line 394-403
**Severity:** Critical (content inaccessible)

Karen has two interaction paths:
1. **Auto-interact** (in `updateNpcMovement`): Triggers when player walks within `autoRange`, sets `npc.interacted = true`, plays linear dialogue, and deducts 30 seconds.
2. **Manual interact** (in `tryInteract`): Checks `!data.interacted` before showing the branching dialogue with three choices ("Politely decline" / "Run away" / "Accept the meeting").

Since the auto-interact fires from the update loop before the player can ever press E, `interacted` is always `true` by the time `tryInteract` runs. The branching dialogue with the meeting scheduling joke is never seen.

**Fix:** Remove the `karen_block` auto-interact from `updateNpcMovement()` and let the `tryInteract` handler be the sole path, OR merge the branching choices into the auto-interact dialogue queue.

---

### BUG-003: Free Roam inventory has 4 slots but UI only renders 2

**File:** `js/logic.js` line 22, `js/ui.js` line 60
**Severity:** Critical (items lost/invisible)

In free roam mode, `player.inventory` is set to `[null, null, null, null]` (4 slots). However, `drawUI()` hardcodes `for (let i = 0; i < 2; i++)` when rendering inventory slots. Items picked up into slots 3 and 4 are invisible to the player and cannot be used (keybinds only support `[1]` and `[2]`).

**Fix:** Either reduce free roam inventory to 2, or update the UI to render all slots and add keybinds for `[3]` and `[4]`.

---

## HIGH SEVERITY BUGS

### BUG-004: `game.isWorking` is dead state — enemy AI never sees player as "working"

**File:** `js/logic.js` lines 295, 508
**Severity:** High (enemy behavior broken)

After the mini-game refactor, `game.isWorking` is set to `false` at the start of every `updatePlayer()` call (line 295) and is never set to `true` anywhere. The old hold-E mechanic that set it was removed.

**Impact on enemy AI:** In `updateEnemies()` line 508, there's a check: `if (game.isWorking) { ... continue; }` that was supposed to make enemies less aggressive when the player is working at the computer. This never fires.

**Impact on player rendering:** In `drawPlayer()` line 98, `if (game.isWorking)` shows "Working..." text above the player. This never renders.

**Fix:** Either check `game.state === 'workScreen'` instead of `game.isWorking`, or remove the dead code entirely.

---

### BUG-005: Locked door message says "Hold [E]" instead of "Press [E]"

**File:** `js/interactions.js` line 64
**Severity:** High (misleading player instructions)

The locked door dialogue says: `"Hold [E] near a computer to work."` — but the work mechanic now uses a single press of E to open the math mini-game, not a hold.

**Fix:** Change to `"Press [E] near a computer to work."`

---

### BUG-006: Level 1 and Level 2 quests cannot be completed

**File:** `js/logic.js` lines 86-101
**Severity:** High (quest system broken for L1/L2)

Level 1 has a coffee quest with `giver: 'Survival'` and Level 2 has an imodium quest also with `giver: 'Survival'`. There is no NPC named "Survival" in any room — quest turn-in only works for NPCs with `karin_quest` or `rebecca_quest` interactType (Free Roam only). These quests appear in the quest log but can never be turned in.

**Fix:** Either add a turn-in mechanism for non-NPC quests (auto-complete on pickup), or add a turn-in NPC for L1/L2.

---

### BUG-007: Paper balls have unlimited ammo

**File:** `js/logic.js` lines 225-233
**Severity:** High (balance exploit)

`throwPaperBall()` creates a paper ball every time Q is pressed with no ammo check. The vendor sells "Paper Balls x5" which sets `game.paperBallAmmo`, but `throwPaperBall()` never reads or decrements this value. Players get infinite distraction throws from the start.

**Fix:** Add ammo check:
```javascript
function throwPaperBall() {
  if (!game.paperBallAmmo || game.paperBallAmmo <= 0) return;
  game.paperBallAmmo--;
  // ... rest of function
}
```

---

## MEDIUM SEVERITY BUGS

### BUG-008: Occupied cubicle in Level 2 is cosmetic only

**File:** `js/rendering.js` lines 179-187, `js/logic.js` line 362-369
**Severity:** Medium (misleading visual)

When `game.occupiedCubicle >= 0`, an "OCCUPIED" label is drawn on one toilet cubicle. However, the win-tile check in `updatePlayer()` doesn't exclude occupied cubicles — the player can walk onto the occupied toilet and still win.

**Fix:** Add a check in the win-tile loop:
```javascript
if (game.occupiedCubicle >= 0 && i === game.occupiedCubicle) continue;
```

---

### BUG-009: `drawWorkOverlay()` is dead code

**File:** `js/effects.js` lines 252-308
**Severity:** Medium (code cleanliness)

The entire `drawWorkOverlay()` function is never called. It was the old hold-E work overlay, replaced by `drawWorkScreen()`. The function still exists in effects.js occupying ~56 lines.

**Fix:** Remove `drawWorkOverlay()` and the `game.isWorking` property from state.js.

---

### BUG-010: Work decay continues in Free Roam mode

**File:** `js/logic.js` lines 680-686
**Severity:** Medium (Free Roam balance)

In Free Roam, `toiletRiseRate` is set to 0 and time is set to 9999, but the work meter still decays at `0.8/second`. Since work points are the currency for the vendor, the player's earned work slowly drains away even when not spending it. Combined with BUG-004 (isWorking is always false), decay is always active.

**Fix:** Set `game.workDecayRate = 0` in Free Roam setup, or add a mode check in `updateTimers()`.

---

### BUG-011: `hasLineOfSight` only checks for WALL tiles

**File:** `js/logic.js` lines 459-472
**Severity:** Medium (enemy AI)

The line-of-sight check only blocks on `TILE_WALL`. Enemies can "see through" desks, fridges, copiers, sofas, and other solid furniture. This makes sneaking behind furniture useless against zombie AI.

**Fix:** Use `isSolid()` instead of `=== TILE_WALL`:
```javascript
if (isSolid(room.grid[gy][gx])) return false;
```

---

### BUG-012: Greg auto-interact + tryInteract double time deduction

**File:** `js/interactions.js` line 169-177, `js/npcs.js` line 405-415
**Severity:** Medium (double penalty)

Greg has both an auto-interact (in `updateNpcMovement`, deducts 30 seconds) and a manual interact handler (in `tryInteract`, also deducts 30 seconds). If the auto-interact fires, the player loses 30s. If they then press E to interact with Greg manually, `storyActive` is already true so nothing happens. But the auto-interact already applied the full 30s penalty plus the dialogue. This is correct but the auto-interact bypasses any potential future branching dialogue.

---

## LOW SEVERITY BUGS

### BUG-013: Player can get stuck in desks when hiding

**File:** `js/logic.js` lines 211-222
**Severity:** Low

`toggleHiding()` teleports the player to the center of the nearest desk/copier tile. When unhiding, the player may be inside the solid tile and unable to move. `canMoveTo()` checks all 4 corners which may fail.

---

### BUG-014: Enemy detection range circle always visible

**File:** `js/enemies.js` lines 4-7
**Severity:** Low (visual)

`drawEnemy()` always draws a faint red circle showing the enemy's detection range. This should probably only show in debug mode.

---

### BUG-015: Sleeping Kunal in toiletHall has unhandled interactType

**File:** `js/rooms.js` line 126-129
**Severity:** Low

Kunal in toiletHall has `interactType: 'kunal_sleeping'` which has no handler in `tryInteract()`. Falls through to the generic NPC handler. Not a crash, but the interaction is only proximity-based (sleeping mechanic resets work and teleports to office).

---

### BUG-016: Free Roam Kunal vendor removes sleeping from ALL rooms' NPCs

**File:** `js/logic.js` lines 120-125
**Severity:** Low (minor side effect)

The Free Roam setup loop sets `sleeping = false` for all NPCs in all rooms. This means the sleeping-Kunal penalty mechanic is disabled globally in Free Roam, which is probably intentional but done via a broad loop rather than targeted changes.

---

### BUG-017: Wrong answer generation can produce negative options

**File:** `js/logic.js` lines 742-751
**Severity:** Low

The wrong answer generation checks `wrong >= 0` but for subtraction questions where the answer is small (e.g., 30 - 25 = 5), the offset range of -15 to +15 can still produce negative-looking wrong answers (e.g., -10) that get filtered. In rare cases, the while loop may take many iterations to find 3 valid wrong answers.

---

## CODE QUALITY NOTES

1. **Redundant `game.isWorking = false`** in `updatePlayer()` — property is never true, remove it
2. **`drawWorkOverlay()`** — 56 lines of dead code, safe to delete
3. **NPC sprite rendering** uses a long if/else chain in `drawNPC()` — consider a sprite data table
4. **Enemy rendering** duplicates zombie sprite code between `drawEnemy()` and `drawNPC()` for Andrew
5. **Magic numbers** throughout — tile distances like `T * 1.8`, `T * 0.8` etc. should be named constants
6. **Global scope** — all functions and variables are global, consider using a module pattern or namespacing for future scalability
