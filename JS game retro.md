# Office Adventure: The Toilet Quest — Game Build Blueprint

**Version:** v2.1 "Bugslayer"
**Last Updated:** 2026-03-27
**Purpose:** Dense reference document for an AI assistant to rebuild or extend this game with zero rework. Every magic number, color, formula, and draw call is explicit.

---

## 1. GAME IDENTITY & CONCEPT

**Title:** Office Adventure: The Toilet Quest
**Genre:** Comedic top-down 2D arcade stealth
**Premise:** Brayden The Adventurer desperately needs the toilet at work. Navigate from your office through increasingly chaotic rooms to reach the bathroom — while avoiding Andrew (the zombie pub enthusiast), the Boss, Karen, Greg, and other workplace hazards.
**Tone:** British workplace comedy. All game-over states end at the pub.
**Canvas:** 800×600px, centered in viewport, pixelated rendering (`image-rendering: pixelated`)

### Game Modes

| Mode | Level | Rooms | Time | Toilet | Door Lock |
|------|-------|-------|------|--------|-----------|
| Level 1 | `game.level = 1` | 3 (office → lobby → toiletArea) | 600s | Rising at 0.28/s | Locked until work ≥ 60% |
| Level 2 | `game.level = 2` | 5 (office → lobby → toiletHall → stairwell → toiletArea) | 600s | Rising at 0.28/s | Locked until work ≥ 60% |
| Free Roam | `game.level = 3` | All 6 rooms + pub | 9999s (no pressure) | 0 rise rate | Always open |

### Win/Lose Conditions

- **Win:** Step onto any unoccupied toilet win tile (`toiletArea.winTiles`: `{x:2,y:1}`, `{x:6,y:1}`, `{x:10,y:1}`) — proximity check `< T` from tile center
- **Lose (pub screen):** Caught by Andrew, caught by Boss, toilet meter hits 100%, time runs out, exit building, convinced by NPC to leave, drink beer from fridge
- **Free Roam catch:** Andrew drags you to pub room (not game over — door exits back)

---

## 2. ARCHITECTURE & STATE

### Technology

- Single-page HTML5 Canvas, zero frameworks, pure vanilla JS
- 15 JS modules loaded via `<script>` tags in global scope (no ES modules, no bundler)
- All state is global: `game`, `player`, `rooms`, `keys`, `justPressed`, `QUIPS`, `C`, tile constants

### File Load Order (Critical — dependency order)

```html
<script src="js/constants.js"></script>   <!-- Canvas, TILE, SCALE, T, colors, tile types -->
<script src="js/rooms.js"></script>       <!-- Room definitions (depends on T, tile constants) -->
<script src="js/state.js"></script>       <!-- game, player, QUIPS, input handler, FRIDGE_ITEM_INFO -->
<script src="js/collision.js"></script>   <!-- isSolid, getTile, canMoveTo -->
<script src="js/rendering.js"></script>   <!-- drawPixelRect, drawTile, drawRoom -->
<script src="js/player.js"></script>      <!-- drawPlayer -->
<script src="js/npcs.js"></script>        <!-- drawNPC, updateNpcMovement -->
<script src="js/enemies.js"></script>     <!-- drawEnemy -->
<script src="js/items.js"></script>       <!-- drawItem, drawSaltProjectiles -->
<script src="js/logic.js"></script>       <!-- startGame, updatePlayer, updateEnemies, updateTimers, work mini-game -->
<script src="js/interactions.js"></script><!-- tryInteract, advanceDialogue, selectDialogueChoice, useItem -->
<script src="js/ui.js"></script>          <!-- drawUI, drawFridgeMenu, drawNpcMenu, drawVendorMenu, drawDialogue, etc. -->
<script src="js/effects.js"></script>     <!-- drawEffects, random events, emails, quips, speech bubbles, room transitions -->
<script src="js/screens.js"></script>     <!-- drawTitle, drawPubScreen, drawWinScreen -->
<script src="js/main.js"></script>        <!-- Game loop (must be last) -->
```

### Core Constants (`constants.js`)

```
TILE = 16          // Logical tile size
SCALE = 3          // Pixel scaling factor
T = TILE * SCALE   // = 48px, actual rendered tile size
COLS = canvas.width / T   // = 16.67, effectively 16 columns
ROWS = canvas.height / T  // = 12.5, effectively 12 rows
```

### State Machine

States: `title`, `playing`, `paused`, `interact`, `dialogueChoice`, `fridgeMenu`, `npcMenu`, `vendorMenu`, `workScreen`, `questLog`, `pub`, `win`

```
title ──[Space/Enter]──→ playing
playing ──[Escape]──→ paused
playing ──[E on fridge]──→ fridgeMenu
playing ──[E on computer]──→ workScreen
playing ──[E on NPC menu type]──→ npcMenu
playing ──[E on NPC talk type]──→ interact
playing ──[E on door]──→ playing (with roomTransition)
playing ──[E on locked door]──→ interact
playing ──[caught/time/toilet]──→ pub
playing ──[reach win tile]──→ win
interact ──[Space/Enter/E]──→ playing (or dialogueChoice if choice node)
dialogueChoice ──[Enter/E]──→ interact (with effects applied)
workScreen ──[answer/timeout/Escape]──→ playing
fridgeMenu ──[E select/Escape]──→ playing (or interact)
npcMenu ──[E select/Escape]──→ playing (or interact/vendorMenu)
vendorMenu ──[E buy/Escape]──→ playing (or interact)
paused ──[Escape/Resume]──→ playing
paused ──[Quest Log]──→ questLog
paused ──[Back to Menu]──→ title
questLog ──[Escape]──→ paused
pub ──[Space/Enter]──→ title (resetGame)
win ──[Space/Enter]──→ title (resetGame)
```

### Game State Object (`game`)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `state` | string | `'title'` | Current state machine state |
| `currentRoom` | string | `'office'` | Key into `rooms` object |
| `level` | number | `1` | 1, 2, or 3 |
| `levelSelectIndex` | number | `0` | Title screen selection (0=L1, 1=L2, 2=FR) |
| `time` | number | `600` | Seconds remaining (9999 in Free Roam) |
| `maxTime` | number | `600` | Max time for bar calculation |
| `workMeter` | number | `0` | Current work progress (0–300) |
| `maxWork` | number | `300` | Maximum work meter value |
| `workThreshold` | number | `60` | % needed to unlock door (60 out of 300 = 20% of bar) |
| `workFillRate` | number | `5` | Unused (mini-game gives fixed +10/+30) |
| `workDecayRate` | number | `0.8` | Work decay per second when not working |
| `toiletMeter` | number | `0` | Urgency (0–100) |
| `maxToilet` | number | `100` | Toilet meter cap |
| `toiletRiseRate` | number | `0.28` | Base toilet rise per second (0 in Free Roam) |
| `officeDoorUnlocked` | bool | `false` | Whether office locked door is open |
| `frameCount` | number | `0` | Monotonic frame counter (animations) |
| `dialogueQueue` | array | `[]` | Remaining dialogue lines/choice objects |
| `currentDialogue` | string/null | `null` | Currently displayed line |
| `dialogueChoices` | object/null | `null` | `{prompt, choices, choiceIndex}` |
| `gameOverReason` | string | `''` | Pub screen text |
| `saltAmmo` | number | `0` | Current salt ammo (max 10) |
| `saltMax` | number | `10` | Salt ammo cap |
| `saltProjectiles` | array | `[]` | `{x, y, dx, dy, life}` |
| `fridgeItems` | array | `['salt','beer','energy_drink']` | Available fridge items |
| `fridgeMenuIndex` | number | `0` | Fridge menu cursor |
| `energyDrinkWorkTimer` | number | `0` | Seconds of work boost remaining |
| `energyDrinkToiletTimer` | number | `0` | Seconds of toilet rush remaining |
| `speechBubbles` | array | `[]` | `{text, x, y, timer, color, follow?, followNpc?, followEnemy?}` |
| `quipTimer` | number | `0` | Countdown to next quip batch |
| `paperBalls` | array | `[]` | `{x, y, dx, dy, timer, landed, landX, landY, distractTimer}` |
| `paperBallAmmo` | number | `0` | Paper ball ammo (bought from vendor, 5 per purchase) |
| `randomEventTimer` | number | `30` | Countdown to next random event |
| `currentEvent` | object/null | `null` | `{type, timer}` — fireDrill (10s) or phoneRing (8s) |
| `emailNotifications` | array | `[]` | `{text, timer}` |
| `emailTimer` | number | `20` | Countdown to next email |
| `deliveryDriverMoved` | bool | `false` | Whether driver has been interacted with |
| `occupiedCubicle` | number | `-1` | Index of blocked win tile (L2 only, randomized on entry) |
| `mode` | string | `'normal'` | `'normal'` or `'freeroam'` |
| `quests` | array | `[]` | `{id, name, description, itemNeeded, giver, completed, reward, rewardDesc}` |
| `activeQuest` | object/null | `null` | Currently tracked quest |
| `questLog` | array | `[]` | Unused (display uses `quests` directly) |
| `gold` | number | `0` | Work points currency (Free Roam) |
| `vendorItems` | array | `[]` | Current vendor stock |
| `vendorMenuIndex` | number | `0` | Vendor cursor |
| `pauseMenuIndex` | number | `0` | Pause menu cursor (0=Resume, 1=Quest Log, 2=Back to Menu) |
| `questLogIndex` | number | `0` | Quest log scroll position |
| `roomTransition` | object/null | `null` | `{toRoom, toX, toY, timer, maxTime:0.3, phase:'fadeOut'/'fadeIn'}` |

### Player State Object (`player`)

| Property | Default | Description |
|----------|---------|-------------|
| `x, y` | From room.playerStart | Pixel position (top-left corner) |
| `w` | `T * 0.6` = 28.8 | Collision width |
| `h` | `T * 0.85` = 40.8 | Collision height |
| `speed` | `1.0` | Normal movement speed multiplier |
| `sneakSpeed` | `0.5` | Sneaking speed multiplier |
| `facing` | `'down'` | `'up'/'down'/'left'/'right'` |
| `sneaking` | `false` | Shift held and stamina > 0 |
| `stamina` | `100` | Current sneak stamina |
| `maxStamina` | `100` | Stamina cap |
| `staminaDrain` | `15` | Stamina drain per second while sneaking |
| `staminaRegen` | `8` | Stamina regen per second when not sneaking |
| `inventory` | `[null, null]` | 2 slots (normal) or 4 slots (Free Roam) |
| `walking` | `false` | Movement input active |
| `canInteract` | `null` | `{type, data}` — current interactable |
| `_coffeeBoost` | `0` | Seconds of coffee speed boost remaining |
| `_headphoneTimer` | `0` | Seconds of headphone invisibility |
| `isHiding` | `false` | Crouching behind desk |
| `imodiumTimer` | `0` | Seconds of imodium toilet slowdown |
| `vx, vy` | `0` | Velocity (acceleration-based movement) |

---

## 3. GRAPHICS & RENDERING

### Color Palette (`C` object)

```javascript
floor: '#c8b88a'         floorAlt: '#bfae7f'
wall: '#6b6b6b'          wallTop: '#7a7a7a'          wallDark: '#4a4a4a'
door: '#d4a017'          doorFrame: '#8b7300'         doorLocked: '#8a4a3a'
desk: '#6b3a1f'          deskTop: '#8b5a2b'
monitor: '#2a2a2a'       monitorScreen: '#3a7a3a'     monitorScreenOff: '#1a3a1a'
chair: '#666'            chairSeat: '#555'
fridge: '#2a5a2a'        fridgeLight: '#3a7a3a'       fridgeHandle: '#888'
player: '#b8d4e8'        playerShirt: '#b8d4e8'       playerTie: '#c8952a'
playerTrousers: '#c8b878' playerSkin: '#f0c8a0'       playerHair: '#d4b050'
playerSneak: '#8aaabb'   playerShoes: '#4a3a2a'
shadow: 'rgba(0,0,0,0.15)'
uiBg: 'rgba(0,0,0,0.8)' uiBorder: '#666'
stamina: '#4a9a4a'       staminaLow: '#9a4a4a'
workMeter: '#4a6a9a'     workMeterLow: '#9a4a2a'
toiletMeter: '#9a6a2a'   toiletMeterHigh: '#cc3333'
```

### Tile Types (19 total)

```
TILE_FLOOR = 0      TILE_WALL = 1       TILE_DESK = 2        TILE_CHAIR = 3
TILE_DOOR = 4       TILE_MONITOR = 5    TILE_FRIDGE = 6       TILE_CORR_FLOOR = 7
TILE_TOILET = 8     TILE_SINK = 9       TILE_KITCHEN = 10     TILE_CARPET = 11
TILE_DOOR_LOCKED = 12  TILE_PLANT = 13  TILE_WATER_COOLER = 14  TILE_COPIER = 15
TILE_SOFA = 16      TILE_EXIT_DOOR = 17  TILE_WET_FLOOR = 18
```

### Solid Tiles (block movement)

`WALL, DESK, FRIDGE, KITCHEN, MONITOR, SINK, COPIER, SOFA, PLANT, WATER_COOLER, WET_FLOOR`
Plus `DOOR_LOCKED` when `!game.officeDoorUnlocked`

### Core Rendering Helper

```javascript
function drawPixelRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}
```

ALL pixel art in this game is composed exclusively of `drawPixelRect` calls — no sprites, no images, no external assets.

### Tile Rendering Details (`drawTile`)

- **Floor:** Checkerboard pattern `(px + py) % 2 === 0 ? C.floor : C.floorAlt`
- **Wall:** 3-layer: dark base (full tile), mid (T, T-4), highlight strip (x+2, y+2, T-4, 4)
- **Desk:** Floor background + outer (x+2, y+4, T-4, T-8, desk) + inner (x+4, y+6, T-8, T-12, deskTop)
- **Door:** Gold pulsing glow `Math.sin(frameCount * 0.05) > 0` → 15% gold overlay
- **Locked Door:** When locked: red door + padlock graphic (arc for shackle). When unlocked: same as regular door
- **Monitor:** Screen flickers via `Math.sin(frameCount * 0.03 + px)` between green/dark green
- **Fridge:** Proximity glow when `< T * 2` distance, gold pulse `Math.sin(frameCount * 0.1) * 0.15 + 0.15`
- **Corridor Floor:** `#9a8a7a` with subtle border stroke
- **Toilet:** White bowl on tan background with golden glow `Math.sin(frameCount * 0.08)`
- **Copier:** Blinks red/green every 120 frames: `frameCount % 120 < 10`
- **Exit Door:** Red door with bold "EXIT" text, red pulse `Math.sin(frameCount * 0.08)`
- **Wet Floor:** Yellow warning triangle on carpet-colored base

### Draw Order (per frame, in `gameLoop`)

```
1. ctx.clearRect(0, 0, canvas.width, canvas.height)
2. drawRoom()           — tiles
3. drawItem() per item  — collectibles
4. drawEnemy() per enemy — enemies (before player)
5. drawNPC() per NPC    — NPCs
6. drawSaltProjectiles() — salt ammo in flight
7. drawPaperBalls()     — paper ball distractions
8. drawPlayer()         — player character (on top of enemies/NPCs)
9. drawUI()             — HUD bars, inventory, controls text
10. drawEffects()       — active buff indicators (top-left)
11. drawInteractionHints() — [E] prompts
12. drawSpeechBubbles() — floating text
13. drawEventOverlay()  — fire drill flash
14. drawEmailNotifications() — email popups (top-right)
15. [State overlays:]
    - interact: drawDialogue()
    - dialogueChoice: drawDialogueChoice()
    - fridgeMenu: drawFridgeMenu()
    - npcMenu: drawNpcMenu()
    - vendorMenu: drawVendorMenu()
    - questLog: drawQuestLog()
    - workScreen: drawWorkScreen()
    - paused: drawPauseMenu()
16. drawRoomTransition() — fade-to-black (LAST — covers everything)
```

### NPC Sprite Colors

| Character | Skin | Hair | Top | Bottom | Shoes | Details |
|-----------|------|------|-----|--------|-------|---------|
| Brayden (player) | `#f0c8a0` | `#d4b050` | `#b8d4e8` (shirt) | `#c8b878` (trousers) | `#4a3a2a` | Tie `#c8952a`, highlight `#e0c460` |
| Kunal | `#b08860` | `#2a2a2a` | `#3a8a3a` (hoodie) | `#3a3a3a` | `#eee` (white) | Hoodie pocket `#2a6a2a`, zip `#ddd` |
| Lax | `#7a5a3a` | `#2a1a0a` | `#3a3a3a` (dark hoodie) | `#8aaabb` (jeans) | `#eee` | Beard `#2a1a0a`, headphones `#555`/`#444`/`#333`, chain `#555` |
| Andrew (NPC) | `#d8c8b0` | `#6a5a3a` | `#7a7a8a` (grey shirt) | `#4a4a4a` | `#3a2a1a` | Eye bags `#b0a090`, outstretched arms, grin `#8a6a5a` |
| Andrew (enemy) | Same as NPC | Same | Same | Same | Same | Detection circle, HP bar, distraction "?" |
| Boss | `#d4a88c` | `#1a1a1a` | `#2a2a3a` (dark suit) | `#3a3a4a` | `#2a2a1a` | Red tie `#cc3333` |
| Karen | `#d4a88c` | `#8a6a4a` | `#6a6a7a` (blazer) | `#5a5a6a` | `#4a3a2a` | Glasses `#888` with bridge |
| Greg | `#d4a88c` | `#8a7a6a` | `#4a8a4a` (green shirt) | `#5a5a6a` | `#4a3a2a` | |
| Delivery Guy | `#d4a88c` | `#8a7a6a` | `#aaa` (shirt) + `#cc9900` (vest) | `#5a5a5a` | `#4a3a2a` | Hi-vis vest overlay |
| Karin | `#e0b090` | `#ddb860` (blonde) | `#cc6688` (pink) | `#4a4a5a` (skirt) | `#6a4a3a` | Blue eyes `#4a7aaa`, eyelashes, lipstick `#cc5566`, highlights `#e8d080` |
| Rebecca | `#c89870` | `#2a1a1a` (dark curly) | `#4a6aaa` (blue blouse) | `#3a3a4a` (skirt) | `#5a3a2a` | White buttons `#ddd`, gold earrings `#daa520`, brown eyes `#6a4a2a`, curl texture `#3a2a2a` |

### NPC Draw Size

- NPC bounding box: `w = T * 0.7` (33.6), `h = T * 0.9` (43.2)
- Bob animation: `Math.sin(frameCount * 0.05 + npc.x) * 1`
- Shadow ellipse: `(x + w/2, y + h, w/2, 4)`
- Name label: black rect behind white bold 10px text, positioned at `y - 14`
- Sleeping Z's: three Z's at decreasing sizes (14px, 11px, 9px) with sin wave offset

### Enemy Draw Size

- Enemy bounding box: `w = T * 0.7` (33.6), `h = T * 0.8` (38.4)
- Bob animation: `Math.sin(frameCount * 0.08 + enemy.x * 0.1) * 2`
- Detection circle: `rgba(255, 50, 50, 0.1)` stroke at `enemy.range` radius
- HP bar: shown when `hp < maxHp`, green above 50%, red below
- Name: red-tinted `rgba(180, 40, 40, 0.8)` bold 9px

### Player Rendering

- Shadow ellipse at feet
- Sneaking: `globalAlpha = 0.7`, crouch offset `sneakCrouch = 6`
- Walking bob: `Math.sin(frameCount * 0.3) * 2`
- Leg animation: `Math.sin(frameCount * 0.3) * 3`
- Hiding: `globalAlpha = 0.3`, smaller crouching sprite, "HIDING" label
- Working: "Working..." with animated dots `(frameCount / 15) % 3` at `rgba(100, 200, 255, 0.6)`
- "BRAYDEN" gold label above head always
- Eyes change based on `player.facing`
- Coffee cup drawn when `facing === 'down'` or `'left'`

---

## 4. INTERACTION & INPUT

### Controls

| Key | State | Action |
|-----|-------|--------|
| WASD / Arrows | playing | Move (acceleration-based) |
| Shift | playing | Sneak (while held, drains stamina) |
| E | playing | Interact (context-sensitive) |
| Space | playing | Fire salt (if ammo > 0) |
| H | playing | Toggle hiding behind desk |
| Q | playing | Throw paper ball (if ammo > 0) |
| 1/2/3/4 | playing | Use inventory item |
| Escape | playing | Pause |
| W/S or Arrows | menus | Navigate menu |
| E/Enter | menus | Select |
| Escape | menus | Close/back |
| Space/Enter | interact | Advance dialogue |
| Space/Enter | pub/win | Return to title |

### Movement Physics

```
accel = 12          // Acceleration factor
friction = 8        // Deceleration factor
normalSpeed = 1.0 * SCALE = 3.0   // pixels/frame target velocity
sneakSpeed = 0.5 * SCALE = 1.5
coffeeSpeed = normalSpeed * 1.8 = 5.4
diagonal = speed * 0.707           // Normalize diagonal

// Per frame:
targetVx = dx * targetSpeed
player.vx += (targetVx - player.vx) * min(1, accel * dt)
// No input → friction:
player.vx *= max(0, 1 - friction * dt)
// Stop threshold:
if (|vx| < 0.1) vx = 0
```

### Collision Detection

```
margin = 4   // Inset from each corner
4-corner check: (nx+margin, ny+margin), (nx+w-margin, ny+margin),
                (nx+margin, ny+h-margin), (nx+w-margin, ny+h-margin)
Wall-sliding: Try X+Y → Try X only → Try Y only → Stop
Clamped to canvas bounds: [0, canvas.width - player.w] × [0, canvas.height - player.h]
```

### Interaction Priority System

When multiple interactables overlap, sorted by:
1. **NPC** (priority 0) — range: `< T * 1.8`
2. **Item / Door** (priority 1) — items: `< T * 1.5`, doors: `< T * 1.5`
3. **Fridge / Computer** (priority 2) — fridge: `< T * 1.8`, computer: adjacent tile check
Within same priority, sorted by distance (closest wins).

### Dialogue System

- `game.dialogueQueue`: array of strings OR choice objects
- Choice object format:
```javascript
{
  prompt: "Question text...",
  choices: [
    { label: "Option A", next: ["line1", "line2"], effect: { timeLoss: 15 } },
    { label: "Option B", next: ["line1"], effect: { timeLoss: 5 } }
  ]
}
```
- `advanceDialogue()`: if next in queue is string → show it; if choice object → transition to `dialogueChoice` state
- `selectDialogueChoice()`: apply effect, prepend `next` lines to queue, return to `interact`
- Effect keys: `timeLoss`, `workBoost`, `goldReward`, `toiletChange`, `workReset`

---

## 5. GAME MECHANICS

### Work Mini-Game

- Triggered by pressing E near a monitor (TILE_MONITOR, 1-tile adjacency check)
- Generates random math: `+` (10–59 + 10–59), `-` (30–79 − 5–34), `*` (2–13 × 2–13)
- 4 multiple choice options (correct + 3 wrong), shuffled
- Wrong answers: `±10` for `*`, `±15` for `+/-`, filtered to ≥0 and unique
- Timer: 5 seconds, countdown bar
- Navigation: WASD/Arrows move 2×2 grid, E/Enter/Space to confirm
- Escape exits without penalty

**Outcomes:**
- Correct: `+10` work (or `+30` with energy drink boost)
- Wrong/timeout: `+20` toilet meter
- Door unlock check: if `workMeter >= workThreshold` → `officeDoorUnlocked = true`
- Result display: 1.2 seconds

**Critical:** Timers (time, toilet, work decay) continue ticking during workScreen state. Guard in `updateTimers()`: `if (game.state !== 'playing' && game.state !== 'workScreen') return`

### Work Meter Economy

```
workThreshold = 60     (the percentage mark, displayed as "60/60%")
maxWork = 300          (actual max value — bar goes to 300)
workDecayRate = 0.8/s  (NOT in Free Roam)
Re-lock: if workMeter drops below workThreshold → officeDoorUnlocked = false
Free Roam: work decay disabled, door always open
```

### Toilet Meter

```
base rate: 0.28/s
energy drink: rate * 3 for 15s
imodium: rate * 0.3 for 20s
wrong answer: +20 instant
100% = game over
Free Roam: rate = 0 (no urgency)
```

### Zombie AI (3-state)

```
States: idle → suspicious → hunting

IDLE:
  - Roam to random points within (4T–14T, 3T–10T)
  - Speed: enemy.speed * SCALE * 0.15

SUSPICIOUS:
  - Triggered when hunting → loses sight / player working / player interacting
  - Moves to lastSeenX/Y at speed * SCALE * 0.21
  - searchTimer counts down → return to idle

HUNTING:
  - Triggered when canSeePlayer (LOS + distance < T*8 + not hidden)
  - Speed: enemy.speed * SCALE * 0.45
  - Tracks player.x/y directly
  - Catch radius: T * 0.7

Detection immunity:
  - player.isHiding && player._headphoneTimer > 0 → fully hidden
  - player._headphoneTimer > 0 → invisible to non-zombie enemies
  - player.sneaking → detection range * 0.4 for non-zombie enemies
  - game.state === 'workScreen' → hunting downgrades to suspicious
  - game.state is interact/npcMenu/fridgeMenu → enemies retreat and downgrade

Line of sight: raycast in T/2 steps (max 20 checks), blocked by isSolid() tiles
```

### Salt Weapon

```
Ammo: max 10, gained from fridge (10 shots) or not at all in normal play
Fire: Space key, directional based on player.facing
Projectile speed: dx/dy * 6 per frame
Lifetime: 1.5 seconds
Hit radius: T * 0.5
Damage: 1 HP per hit, enemy has 3 HP (maxHp)
On hit (not dead): enemy.distracted = true for 1s, alerted = false
On kill: enemy.dead = true (removed from play)
```

### Paper Balls

```
Ammo: game.paperBallAmmo, bought from vendor (5 per purchase, cost 8 gold)
Throw: Q key, directional
Speed: 4 px/frame in facing direction
Flight time: 1.5s or until wall hit
After landing: creates distraction zone for 4 seconds
Distraction radius: T * 5
Effect: enemies within range get distracted, move toward landing point
```

### Items & Consumables

| Item | Source | Effect |
|------|--------|--------|
| Coffee | Lobby pickup / Vendor (10g) | Speed × 1.8 for 8 seconds (`_coffeeBoost = 8`) |
| Headphones | ToiletHall/Stairwell pickup / Vendor (12g) | Invisible for 6 seconds (`_headphoneTimer = 6`) |
| Imodium | ToiletHall pickup / Vendor (20g) | Toilet rate × 0.3 for 20 seconds (`imodiumTimer = 20`) |
| Air Freshener | Lobby pickup / Vendor (10g) | Repels nearby enemies 5 tiles for 8 seconds |
| Energy Drink | Fridge / Vendor (15g) | Work answers give +30 (10s) BUT toilet rate ×3 (15s) |
| Salt (fridge) | Fridge only | Gives 10 salt ammo |
| Beer (fridge) | Fridge only | Instant game over (pub) |
| Paper Balls ×5 | Vendor only (8g) | +5 paper ball ammo |

### Random Events

- **Fire Drill:** 15% chance when timer hits 0, lasts 10s. All enemies de-alert, red screen flash. Timer reset: 25 + random(20) seconds.
- **Phone Ring:** 10% chance (roll 0.15–0.25), forces interact state, -15 seconds, lasts 8s. Extended warranty joke.
- Only trigger outside office room.

### Email Notifications

- Pop up every 15 + random(20) seconds
- Display for 4 seconds, fade out over last 0.5s
- 10 humorous email subjects
- Only outside office room
- Visual: dark box top-right, blue "EMAIL" label + text

### Quests

**Level 1:** Coffee Emergency — find coffee, auto-complete on pickup
**Level 2:** Emergency Supplies — find imodium, auto-complete on pickup

**Free Roam (6 quests):**

| Quest | Item | Giver | Reward |
|-------|------|-------|--------|
| Karin's Coffee Run | coffee | Karin | 20 gold |
| Rebecca's Headphones | headphones | Rebecca | 25 gold |
| Karin's Pub Snacks | pub_snacks | Karin | 30 gold |
| Rebecca's Collection | beer_mat | Rebecca | 20 gold |
| Karin's Emergency | imodium | Karin | 35 gold |
| Rebecca's Darts Night | dart | Rebecca | 15 gold |

Quest turn-in: bring item to NPC, auto-detected on interaction.
L1/L2 quests: auto-complete on item pickup (giver = 'Survival', no NPC exists).

### Vendor (Free Roam Only)

Kunal becomes vendor in office. Stock:
```
Coffee:       10 gold, "Speed boost for 8 seconds"
Energy Drink: 15 gold, "Reduce toilet meter by 30"
Headphones:   12 gold, "Ignore phone rings for 6 seconds"
Imodium:      20 gold, "Slow toilet urgency for 20 seconds"
Paper Balls:  8 gold,  "Distraction ammo" (+5 ammo)
Air Freshener:10 gold, "Enemy repellent"
```

---

## 6. ROOM DEFINITIONS

### Room Structure

Each room: `{ name, grid (16×12 2D array), doors[], npcs[], items[], enemies[], optional: playerStart, winTiles }`

### Room Map (6 rooms)

**Office ("Your Office")**
- 16×12, walled, 4 desk rows with monitors/chairs
- Fridge at grid (1,6)
- Locked door at grid (2,1) → lobby
- Kunal at (12T, 2.5T), Lax at (12T, 7.5T)
- Andrew enemy at (7T, 9T), speed 0.05, range T*20, HP 3
- Plants at (13,2) and (13,6)
- Player start: (6.5T, 5T)

**Lobby ("Communal Area")**
- Maze layout with sofas, copiers, plants, water coolers
- Door at (3,10) → office, Door at (13,0) → varies by level
- Sleeping Kunal at (5T,4T), chasing Lax at (10T,6T), Boss patrol at (8T,5T)
- Boss detection range: T*3, has catchCooldown
- Items: Coffee at (2T,8T), Air Freshener at (12T,3T)
- Andrew enemy at (2T,2T)
- Free Roam adds: Biscuits at (7T,2T), Stapler at (14T,8T)

**Toilet Hallway ("Toilet Hallway")**
- Carpet floor (TILE_CARPET = 11) with plants, desks, copier
- Door at (7,10) → lobby, Door at (7,2) → stairwell, Exit at (12,10) → pub_exit (game over) or pub (Free Roam)
- Karen at (5T,5T) — auto-interact range T*2, branching dialogue
- Greg at (10T,7T) — auto-interact range T*2, branching dialogue
- Sleeping Kunal at (3T,8T), Lax at (13T,9T)
- Items: Imodium at (3T,5T), Headphones at (11T,3T)
- Andrew enemy at (7T,3T)
- Free Roam adds: Toilet Roll at (8T,8T)

**Stairwell ("Stairwell")**
- Mix of carpet, walls creating narrow corridors, desks, chairs, plants
- Door at (7,1) → toiletHall, Door at (7,9) → toiletArea
- Sleeping Kunal at (5T,7T)
- Delivery driver at (7T,5T) — blocking NPC, dialogue advances to move
- Items: Coffee at (2T,3T), Headphones at (13T,7T)
- Andrew enemy at (12T,3T) with patrol to (3T,8T), speed 0.04

**Toilet Area ("THE BATHROOM")**
- Cubicle partitions (walls), sinks in top-right, open floor below
- Win tiles: `[{x:2,y:1},{x:6,y:1},{x:10,y:1}]`
- Door at (7,9) → stairwell (or lobby in L1)
- Level 2: one random cubicle marked "OCCUPIED" (blocked from winning)
- Andrew enemy at (8T,6T), speed 0.03

**Pub ("The Pub")**
- Bar counter (desk row at y=2), tables with chairs, plants
- Door at (7,9) → lobby
- Andrew NPC (friendly) at (3T,3T), roaming
- Lax NPC at (10T,5T)
- Items: Pub Snacks at (12T,7T), Beer Mat at (2T,5T), Dart at (7T,1T)

### Door Routing by Level

```
Level 1: lobby.doors[1] → toiletArea (skip toiletHall/stairwell)
          toiletArea.doors[0] → lobby
Level 2: lobby.doors[1] → toiletHall (full 5-room route)
          toiletArea.doors[0] → stairwell
Level 3: Same as L2, plus toiletHall.doors[2] → pub (exit door)
```

---

## 7. STYLING & UI

### HUD Layout (top bar, 52px height)

```
Y=0–52: Black semi-transparent bar (rgba(0,0,0,0.8))

Row 1 (y≈13):
  Left:   Room name (#aaa, bold 11px)
  Middle: "DOOR OPEN"/#4a4 or "DOOR LOCKED"/#a66 (when in office)
  Right:  "TIME M:SS" (color: <60s=#ff4444, <120s=#ffaa44, else=#ffdd44)
          Time bar below: x=688, 100px wide, 4px tall

Row 2 (y≈28):
  "SNEAK" bar: x=48, 80px wide, 6px tall, green>30%/#4a9a4a, red≤30%/#9a4a4a
  "WORK" bar:  x=174, 80px wide, 6px tall, green when ≥threshold, blue when below
               Gold threshold marker (2px wide, #ffd700) at threshold position
  "TOILET" bar: x=306, 80px wide, 6px tall, brown/#9a6a2a, red>70%/#cc3333
               "URGENT!!" flashing red text when >80%

Row 3 (y≈42):
  "SALT: N/10 [SPACE]" when ammo > 0
```

### Inventory Bar (bottom center)

```
Dynamic width: invSlots * 50 + (invSlots-1) * 8 + 12
Y: canvas.height - 44, height 40
Each slot: 50×32, dark bg (#2a2a2a), border (#555)
Key label: [1] [2] [3] [4] in grey
Item name: gold #ffd700, truncated to 7 chars + "."
```

### Controls Hint (bottom-left, y = canvas.height - 6)

```
"WASD:Move  SHIFT:Sneak  E:Interact  1-4:Use Item  SPACE:Salt"
(or "1/2:Use Item" when only 2 slots)
rgba(255,255,255,0.3), 9px monospace
```

### Free Roam HUD Additions

- Gold display: top-right, "#ffd700 bold 11px", "Work Points: N"
- Active quest box: 210×40 at top-right, dark bg
- Quest counter: bottom-right, "Quests: N/6"

### Dialogue Box

```
Position: y = canvas.height - boxH - 50, x=20, w=canvas.width-40, h=110
Background: rgba(0,0,0,0.9), border #666
Speaker name: #ffdd44, bold 12px (parsed from "Name: text" format)
Action text (*italics*): #66aaff, italic 11px
Normal text: #ddd, 12px
Word wrap: manual at 96 chars per line
Advance prompt: "▼ [Space/Enter/E]" bottom-right, pulsing
```

### Choice Dialogue

```
Centered box, 400px wide
Prompt: #ccc, 12px, word-wrapped
Choices: listed with ">" indicator
Selected: #ffd700 (gold), bold
Unselected: #aaa
```

---

## 8. AUDIO & JUICE

This game has **no audio** — all "juice" is visual:

### Animation Frequencies

| Animation | Formula | Rate |
|-----------|---------|------|
| Player walk bob | `sin(frameCount * 0.3) * 2` | ~5.3 Hz |
| Player leg animation | `sin(frameCount * 0.3) * 3` | ~5.3 Hz |
| NPC idle bob | `sin(frameCount * 0.05 + npc.x) * 1` | ~0.9 Hz |
| Enemy bob | `sin(frameCount * 0.08 + enemy.x * 0.1) * 2` | ~1.4 Hz |
| Door pulse | `sin(frameCount * 0.05) > 0` | ~0.9 Hz toggle |
| Monitor flicker | `sin(frameCount * 0.03 + px) > 0` | ~0.5 Hz |
| Fridge proximity glow | `sin(frameCount * 0.1) * 0.15 + 0.15` | ~1.8 Hz |
| Toilet glow | `sin(frameCount * 0.08) * 0.15 + 0.15` | ~1.4 Hz |
| Item float | `sin(frameCount * 0.06 + item.x) * 3` | ~1.1 Hz |
| Item glow | `sin(frameCount * 0.08) * 0.2 + 0.3` | ~1.4 Hz |
| Interaction hint pulse | `sin(frameCount * 0.1) * 0.3 + 0.7` | ~1.8 Hz |
| Copier LED blink | `frameCount % 120 < 10` | Every 2s for 0.17s |
| Fire drill flash | `frameCount % 30 < 15` | 1Hz toggle |
| Toilet urgent flash | `frameCount % 30 < 15` | 1Hz toggle |
| Energy drink toilet flash | `frameCount % 20 < 10` | 1.5Hz toggle |
| Sleeping Z float | `sin(frameCount * 0.06) * 3` | ~1.1 Hz |

### Speech Bubbles

- Spawn every 2.5–5.5 seconds (`quipTimer = 2.5 + random(3)`)
- Brayden: 50% chance, yellow `#ffdd44`, 2.2s duration
- NPCs: 30% chance each, white `#fff`, 2s duration
- Andrew enemies: 40% chance, grey `#aaa`, 2s, distance-based quip selection
  - Close (< T*3): aggressive ("PUB!!!", "I CAN SMELL YOU!")
  - Medium (< T*6): casual ("Puuuub?", "Fancy a pint?")
  - Far: ominous ("...pub...", "...thirsty...")
- Float upward: `y - (2 - timer) * 8`
- Fade out: `alpha = min(1, timer / 0.5)`
- Rounded rect background with colored border and tail triangle

### Room Transitions

- Two-phase: fadeOut (0.3s) → switch room → fadeIn (0.3s)
- Full-screen black overlay with alpha interpolation
- Player velocity reset to 0, canInteract cleared
- Occupied cubicle randomized on entering toiletArea in Level 2

---

## 9. BUGS & PREVENTION (Lessons Learned)

### Bug Categories Found (v2.1)

**Critical (3):**
1. Timer guard too restrictive — `if (state !== 'playing')` blocked workScreen timer updates. Fix: `state !== 'playing' && state !== 'workScreen'`
2. Auto-interact firing before player input — Karen's proximity trigger set `interacted = true` with linear-only dialogue. Fix: merge branching into auto-interact
3. UI hardcoding inventory slots — displayed 2 of 4 Free Roam slots. Fix: dynamic `player.inventory.length`

**High (4):**
4. Dead boolean `game.isWorking` — never set true after refactor. Fix: replace with `game.state === 'workScreen'` everywhere
5. Stale UI text — "Hold [E]" from pre-refactor. Fix: update to "Press [E]"
6. Quest giver doesn't exist — 'Survival' NPC for L1/L2 quests. Fix: auto-complete on item pickup
7. No ammo check — infinite paper balls. Fix: check `game.paperBallAmmo > 0` and decrement

**Medium (5):**
8. Win condition on occupied cubicle — Fix: skip `game.occupiedCubicle` index in win-tile loop
9. Dead code (56 lines) — `drawWorkOverlay()` from old hold-E system. Fix: delete
10. Work decay in Free Roam — drained quest reward currency. Fix: `game.mode !== 'freeroam'` guard
11. LOS only checks walls — enemies see through furniture. Fix: use `isSolid()` instead of `=== TILE_WALL`
12. Greg double time deduction — both auto and manual deducted 30s. Fix: branching dialogue in both paths

### Prevention Rules

1. **Guard clauses:** When adding new game states, audit ALL `if (state === X)` and `if (state !== X)` guards
2. **State property cleanup:** When refactoring mechanics, grep for ALL references to removed properties
3. **UI–data parity:** Inventory/slot counts must derive from data (`player.inventory.length`), never hardcode
4. **Quest completion paths:** Every quest must have a reachable turn-in mechanism
5. **Resource checks:** Every resource-consuming action (throw, fire, buy) must check quantity first
6. **Win condition exclusions:** Any tile that modifies the win zone must be checked in the win loop
7. **LOS consistency:** All visibility checks should use the same solid-tile function
8. **Dialogue merging:** When auto-interact exists, ALL dialogue (including branches) must go through it
9. **Dead code removal:** After any refactor, search for all functions/properties from the old system
10. **Test per level:** Each fix must be verified in L1, L2, AND Free Roam separately

---

## 10. BUILD SEQUENCE

### From-Scratch Build Order

```
Step 1:  constants.js    — Canvas setup, TILE/SCALE/T, colors (C), tile type constants
Step 2:  rooms.js        — All 6 room grids (16×12 arrays), doors, NPC/item/enemy definitions
Step 3:  state.js        — game object, player object, QUIPS, FRIDGE_ITEM_INFO, full keydown/keyup handler
Step 4:  collision.js    — isSolid(), getTile(), canMoveTo()
Step 5:  rendering.js    — drawPixelRect(), drawTile() (18-case switch), drawRoom()
Step 6:  player.js       — drawPlayer() with all states (normal, hiding, sneaking, working)
Step 7:  npcs.js         — drawNPC() (10 sprite types), updateNpcMovement() (sleeping, roaming, chasing, auto-interact, boss detection, delivery driver)
Step 8:  enemies.js      — drawEnemy() (zombie + generic types with HP bars)
Step 9:  items.js        — drawItem() (floating glow), drawSaltProjectiles()
Step 10: logic.js        — startGame() with per-level config, movement physics, 3-state zombie AI, hasLineOfSight(), updateTimers(), salt/paperball systems, work mini-game
Step 11: interactions.js  — tryInteract() (all NPC types, items, doors, fridge, computer), dialogue system, choice handling, vendor, quest turn-in, useItem()
Step 12: ui.js           — HUD, all menus (fridge, NPC, vendor, quest log, pause), dialogue rendering
Step 13: effects.js      — Active effect indicators, random events, emails, speech bubbles, interaction hints, room transitions
Step 14: screens.js      — Title screen (with character sprites), pub screen, win screen
Step 15: main.js         — Game loop with state-based update/draw routing

Step 16: index.html      — Canvas element + script tags in exact order above
```

### Validation Checklist

```
[ ] All 15 JS files pass `node --check` (syntax validation)
[ ] Title screen renders with level selection (WASD + Enter)
[ ] Level 1: Office door locks at start, work mini-game unlocks it, 3-room path to toilet
[ ] Level 2: 5-room path, occupied cubicle blocks one toilet, Karen/Greg have branching dialogue
[ ] Free Roam: 4 inventory slots, Kunal vendor, Karin/Rebecca quest NPCs, pub accessible
[ ] Timers tick during work mini-game (toilet rises, time counts down)
[ ] Enemies can't see through furniture (isSolid LOS check)
[ ] Paper balls require ammo (purchased from vendor)
[ ] Work meter doesn't decay in Free Roam
[ ] All quest items can be found and turned in
[ ] Room transitions fade correctly
[ ] Hiding behind desk works (H key near desk/copier)
[ ] Salt kills enemies in 3 hits
[ ] Beer from fridge = instant pub
[ ] Pause menu → Quest Log → Back works
```

### Extension Points

- **New room:** Add to `rooms` object, add door routing in `startGame()` per level, add to transition system
- **New NPC:** Add sprite case to `drawNPC()`, add interactType handler to `tryInteract()`, define dialogue
- **New item:** Add itemType to `useItem()`, add to room items or vendor, add pickup rendering to `drawItem()`
- **New enemy type:** Add case in `drawEnemy()`, add AI behavior in `updateEnemies()`
- **New quest:** Add to quest array in `startGame()` level 3 section, ensure giver NPC exists
- **New tile type:** Add constant, add to `isSolid()` if blocking, add rendering case to `drawTile()`
- **Audio:** No audio system exists. Would need: audio context init, sound effect triggers in game events, music loop management

---

## APPENDIX: FILE SIZE REFERENCE

| File | Lines | Primary Responsibility |
|------|-------|----------------------|
| constants.js | 36 | Canvas, constants, colors, tile types |
| rooms.js | 275 | 6 room definitions with grids/NPCs/items/enemies |
| state.js | 267 | Game state, player state, input handling, QUIPS |
| collision.js | 28 | Solid check, tile lookup, 4-corner movement |
| rendering.js | 189 | drawPixelRect, tile rendering, room drawing |
| player.js | 111 | Player sprite rendering |
| npcs.js | ~463 | NPC sprites (10 types) + NPC movement AI |
| enemies.js | 65 | Enemy sprite rendering |
| items.js | 41 | Item + salt projectile rendering |
| logic.js | ~832 | Game init, player movement, enemy AI, timers, weapons, work mini-game |
| interactions.js | ~474 | All interaction handlers, dialogue, vendor, quests |
| ui.js | ~535 | HUD, all menu renders, dialogue display |
| effects.js | ~293 | Buffs, events, emails, quips, bubbles, hints, transitions |
| screens.js | ~650 | Title, pub, win screens with decorative sprites |
| main.js | 72 | Game loop |
| **TOTAL** | **~4,331** | |
