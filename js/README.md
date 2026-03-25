# Office Adventure - JS Module Structure

All game code has been successfully split into modular JavaScript files from the backup.

## Module Files

### Core Setup
- **constants.js** - Canvas, tile constants, colors, and global configuration
- **state.js** - Game state object, QUIPS, player object, input handlers, and FRIDGE_ITEM_INFO

### Game World
- **rooms.js** - Room definitions (office, lobby, stairwell, toilet hallway, toilets, pub)
- **collision.js** - Collision detection (isSolid, getTile, canMoveTo)

### Rendering
- **rendering.js** - Core rendering functions (drawPixelRect, drawTile, drawRoom)
- **player.js** - Player rendering (drawPlayer)
- **npcs.js** - NPC rendering and movement (drawNPC, updateNpcMovement)
- **enemies.js** - Enemy rendering (drawEnemy)
- **items.js** - Item and projectile rendering (drawItem, drawSaltProjectiles)
- **ui.js** - UI drawing (drawUI, drawFridgeMenu, drawNpcMenu, drawVendorMenu, drawDialogue, drawPauseMenu)

### Game Systems
- **effects.js** - Visual effects, events, notifications (drawEffects, updateRandomEvents, updateQuips, updateEmailNotifications, drawSpeechBubbles, drawInteractionHints, drawEventOverlay, drawWorkOverlay)
- **interactions.js** - Player interactions (tryInteract, pickFromFridge, advanceDialogue, handleNpcMenuSelect, useItem, handleVendorBuy)
- **logic.js** - Core game logic (startGame, resetGame, updatePlayer, updateEnemies, updateTimers, updateSaltProjectiles, fireSalt, toggleHiding, etc.)
- **screens.js** - Screen rendering (drawTitle, drawPubScreen, drawWinScreen and title screen helper functions)

### Execution
- **main.js** - Game loop with pause menu support

## Pause Menu Implementation

Added pause menu feature with the following changes:
1. Added `pauseMenuIndex: 0` to game object in state.js
2. Added Escape key handler in 'playing' state to enter pause menu
3. Added new 'paused' state handler with menu navigation (W/S keys) and selection (Enter)
4. Added drawPauseMenu() function in ui.js
5. Updated main.js game loop to handle 'paused' state and render pause menu

## File Organization

Files are organized by function:
- Rendering: rendering.js, player.js, npcs.js, enemies.js, items.js, ui.js, screens.js
- Logic: logic.js, interactions.js
- Data: state.js, rooms.js, constants.js
- Systems: effects.js, collision.js
- Main: main.js

Total: 15 module files
Total code: ~3,700 lines (from 3,471-line backup)
