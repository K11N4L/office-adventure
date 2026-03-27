# Office Adventure: The Toilet Quest — Patch Notes

**Version:** v2.0
**Date:** 2026-03-27
**Codename:** "Brayden Work"

---

## NEW FEATURES

### Pause Menu System
- Press **ESC** during gameplay to pause
- Three menu options: **Resume**, **Quest Log**, **Back to Menu**
- Navigate with W/S, confirm with Enter/Space
- ESC also resumes from pause

### Work Mini-Game ("Brayden Work")
- **Replaced** the old hold-E work mechanic entirely
- Press **E** near any computer monitor to open the work screen
- Styled as a retro "BRAYDEN WORK v2.0" monitor overlay with title bar and close button
- Random math questions: addition, subtraction, and multiplication
- **5-second timer** with color-changing countdown bar (green → yellow → red)
- **4 answer options** in a 2x2 grid, navigable with W/A/S/D
- Correct answer: **+10 work progress** (+30 with energy drink boost)
- Wrong answer or timeout: **+20 toilet urgency**
- Funny task labels rotate each question (e.g., "Renaming final_v2_FINAL_actual.docx...")
- Funny result messages for both correct and incorrect answers
- Mini work meter display shows current/threshold/max
- Press ESC to quit back to gameplay

### Branching Dialogue System
- Dialogue entries can now be **choice nodes** with multiple options
- Each choice can have **effects**: time loss, work boost, gold reward, toilet change, work reset
- Navigate choices with W/S, confirm with E/Enter
- Highlighted selection with gold accent styling

### Branching Dialogues Added
- **Karen (Toilet Hall):** "Schedule a meeting about the meeting" — 3 choices with varying time penalties (5s to 45s)
- **Kunal (Office, Talk):** Tabs vs. spaces debate — agree (+15 work points), double down (work reset + 60s lost), or change subject
- **Lax (Office, Talk):** Join chat (2 min lost + work reset), excuse yourself, or ask for help (+10 work, -30s)

### Quest System
- **Quest Log** accessible from pause menu (ESC → Quest Log)
- Navigate quests with W/S, ESC to close
- Shows quest name, status (Active/Complete), giver, item needed, and reward
- **Level 1 Quest:** Coffee Emergency — find coffee in the lobby
- **Level 2 Quest:** Emergency Supplies — find Imodium
- **Free Roam Quests (6 total):**
  - Karin's Coffee Run (+20 work points)
  - Rebecca's Headphones (+25 work points)
  - Karin's Pub Snacks (+30 work points)
  - Rebecca's Collection - Beer Mat (+20 work points)
  - Karin's Emergency - Imodium (+35 work points)
  - Rebecca's Darts Night (+15 work points)

### New Characters
- **Karin** — Blonde hair, pink top, blue eyes, eyelashes, lipstick. Quest giver in Free Roam office
- **Rebecca** — Dark curly hair with volume, blue blouse with white buttons, gold earrings, warm brown eyes. Quest giver in Free Roam office

### Kunal's Vendor Shop (Free Roam)
- Kunal becomes a vendor in Free Roam mode
- Sells: Coffee (10pts), Energy Drink (15pts), Headphones (12pts), Imodium (20pts), Paper Balls x5 (8pts), Air Freshener (10pts)
- Work points earned from quests and dialogue choices

### Room Transition Animations
- Smooth **fade-to-black** transitions between rooms
- Two-phase system: fadeOut (0.3s) → room switch → fadeIn (0.3s)
- Player input blocked during transitions to prevent glitches

---

## GAMEPLAY IMPROVEMENTS

### Movement & Feel
- **Acceleration-based movement** replaces instant velocity changes
- Configurable `accel` (12) and `friction` (8) parameters
- **Wall-sliding**: player slides along walls when moving diagonally into them
- Smoother start/stop with velocity interpolation (`player.vx`, `player.vy`)
- Dead zone threshold (< 0.1 velocity → stop) prevents drift

### Enemy AI Upgrade (Zombie Andrew)
- **3-state AI system**: Idle → Suspicious → Hunting
- **Line-of-sight detection** via raycasting (`hasLineOfSight()`)
- **Idle:** Slow roaming to random points (0.15x speed)
- **Suspicious:** Moves to last-seen player position (0.7x speed), then returns to idle
- **Hunting:** Direct pursuit at 1.5x speed when player is visible
- Enemies retreat from player during dialogue/menu interactions
- Hiding + headphones makes player invisible to zombie detection
- Fire drill event confuses all enemies (resets alerted state)

### Interaction Priority System
- Interactables now sorted by **priority** then **distance**
- Priority order: NPC > Item/Door > Fridge/Computer
- Fixes issues where players couldn't interact with the closest relevant object

### Work Meter Overhaul
- **Max capacity raised to 300** (5x the 60% threshold) — allows building a buffer
- **Work decay**: meter slowly drops at 0.8/second when not actively working
- Door **re-locks** if work drops below threshold
- Computer hint text updates: "[E] Build buffer" when door is already open

---

## UI IMPROVEMENTS

### HUD Enhancements
- Work meter bar now shows **threshold marker** (gold line at 60%)
- Bar turns **green** when above threshold
- "DOOR OPEN" / "DOOR LOCKED" indicator in office room
- Free Roam: Work Points display, active quest tracker, quest completion counter

### Dialogue Box Improvements
- **Speaker names** parsed and rendered in gold (#ffdd44)
- Action text (starting with *) rendered in light blue (#aaddff)
- Word-wrapping for long dialogue lines
- Blinking "Press [E] or [SPACE] to continue..." prompt

### Email Notifications
- Pop-up email notifications appear during gameplay
- 10 different funny emails rotate randomly
- Fade-in/fade-out animation with semi-transparent background

### Speech Bubbles
- NPCs and enemies now have floating speech bubbles
- Bubbles follow their source (player, NPC, or enemy)
- Float upward and fade out over 2 seconds
- Distance-based Andrew quips (far/medium/close variations)

---

## TECHNICAL CHANGES

### Code Architecture
- Game split into **15 modular JS files** loaded via script tags:
  - `constants.js` — Canvas, tile types, colors
  - `state.js` — Game state object, player, input, quips
  - `rooms.js` — Room definitions (6 rooms)
  - `collision.js` — Tile collision, movement checks
  - `rendering.js` — Tile rendering, drawRoom
  - `player.js` — Player sprite rendering
  - `enemies.js` — Enemy sprite rendering
  - `items.js` — Item rendering, salt projectiles
  - `npcs.js` — NPC sprites, NPC movement AI
  - `logic.js` — Core game logic, player update, enemy AI, combat, work mini-game
  - `interactions.js` — Interact handlers, fridge, dialogue, vendor, quest turn-in
  - `effects.js` — Status effects HUD, random events, room transitions
  - `ui.js` — HUD, menus, dialogue boxes, work screen, quest log
  - `screens.js` — Title screen, pub screen, win screen
  - `main.js` — Game loop

### New Game States
- `workScreen` — Math mini-game overlay
- `dialogueChoice` — Branching dialogue selection
- `questLog` — Quest log overlay
- `vendorMenu` — Kunal's shop in Free Roam

### New Functions Added
- `generateWorkQuestion()` — Creates random math question with shuffled options
- `answerWorkQuestion()` — Validates answer, applies rewards/penalties
- `updateWorkScreen(dt)` — Timer countdown, auto-fail, result display
- `drawWorkScreen()` — Full monitor-styled overlay with timer, question, options grid
- `selectDialogueChoice()` — Processes branching choice effects
- `drawDialogueChoice()` — Renders choice selection UI
- `drawQuestLog()` — Quest log overlay
- `drawPauseMenu()` — Pause menu with 3 options
- `drawVendorMenu()` — Vendor shop UI
- `updateRoomTransition(dt)` — Fade animation state machine
- `drawRoomTransition()` — Black overlay with alpha
- `hasLineOfSight(x1, y1, x2, y2)` — Raycast through tile grid
- `moveEnemyTowardTarget(enemy, x, y, speed)` — Wall-aware movement

---

## KNOWN ISSUES

See `BUG_REPORT.md` for the full list. Key items:

- Toilet meter does not rise during work mini-game (guard in updateTimers)
- Karen's branching dialogue is unreachable (auto-interact fires first)
- Free Roam inventory is 4 slots but UI only shows 2
- Level 1/2 quests have no turn-in NPC
- Paper balls have unlimited ammo
- Occupied cubicle in Level 2 doesn't block win condition
- `game.isWorking` is dead state after mini-game refactor
