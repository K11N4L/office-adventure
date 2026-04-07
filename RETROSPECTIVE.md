# Office Adventure Retrospective

## Purpose

This document captures what worked in the current codebase, what slowed us down, and what should become the reusable foundation for future games. The goal is not to clone this exact game again. The goal is to preserve the parts of the structure that made development fast, readable, and expandable, then make the next project quicker to build even if the theme, story, and mechanics change.

## Current Foundation At A Glance

- Platform: static HTML5 canvas game with plain JavaScript and no package/build dependency.
- Rendering model: pixel-art visuals drawn directly in code with canvas helpers rather than external sprite assets.
- World model: fixed-size tile rooms that fill the whole canvas, with room-to-room transitions instead of continuous camera scrolling.
- Runtime model: one central `game` state object, one `player` object, and a frame loop that updates systems and then renders.
- Content model: rooms, doors, NPCs, enemies, items, and win tiles are defined as data objects and arrays inside the codebase.
- Deployment model: source is split into `js/`, there is a deploy-ready mirrored copy, a single-file deploy build, and a legacy monolithic HTML backup.
- Support tooling: a separate `debug.html` exists, which is a strong pattern worth keeping.

## What Worked Well

### 1. The game is easy to run and easy to move around in

The current project has almost zero setup cost. Open `index.html` and the game runs. That is a huge advantage for fast prototypes, internal demos, and rapid iteration. For small games, removing tooling overhead speeds up decision making and reduces friction.

This also made the project easy to split into modules later. The codebase can still be understood as a sequence of systems rather than a heavy framework.

### 2. The modular split is the right direction

Breaking the game into files such as `constants.js`, `state.js`, `rooms.js`, `logic.js`, `interactions.js`, `ui.js`, `effects.js`, and `main.js` was a good move. It gives the project a clear mental model:

- constants and shared configuration
- state and input
- room/world data
- movement/collision/AI logic
- rendering
- menus and overlays
- game loop

That structure is generic enough to reuse in other games, even if the content changes completely.

### 3. Fixed-screen rooms were a strong choice for this game

Each room fits the screen, the player is clamped to the canvas, and movement between spaces happens through door-triggered fades. For this game, that worked very well because it gave:

- very predictable layout composition
- simple collision and positioning
- strong pacing, because every room can be designed as a self-contained obstacle or joke
- low rendering complexity, because there is no camera math to maintain
- easy balancing of encounters, since the player always sees the whole room

For short-form games with puzzle pressure, stealth pressure, or room-based progression, this is a very efficient structure.

### 4. The tile-based room format is reusable

The room definitions are data-driven enough to be productive. A room contains:

- a tile grid
- door destinations
- NPC placements
- enemy placements
- item placements
- optional win tiles and start positions

This is a good format because the same runtime can support many different room types. Future games can keep the same structure and only swap the tiles, objects, interactions, and rules.

### 5. Mechanics layer cleanly on top of one another

The strongest gameplay lesson in this project is that the game gets a lot of mileage from combining simple systems:

- movement and stamina
- time pressure
- toilet urgency / failure meter
- work progress / gating meter
- sneaking and hiding
- item pickup and use
- NPC interaction and dialogue choices
- enemy chase/search states
- room transitions
- random events and ambient distractions

None of these systems are especially complex on their own, but together they create tension, humor, and decision-making. This is exactly the kind of design pattern that scales well to future small games.

### 6. Interaction prioritization is a useful reusable pattern

The player can stand near multiple interactables, but the game resolves that to one best interaction target based on type and distance. That is a very good pattern to keep.

It prevents prompt clutter, keeps controls simple, and lets new content be added without redesigning the input model every time.

### 7. State-driven overlays made feature growth easier

The game uses explicit states for title, playing, paused, interaction, menus, dialogue choices, quest log, work screen, win, and pub/game-over outcomes. This was effective because it made it easy to add new overlays and mini-flows without rebuilding the whole loop.

This is a solid base for future games. New game-specific mechanics can often be added as another state plus update/draw handlers.

### 8. Code-drawn art was fast

Rendering tiles, characters, UI, and title art directly in code kept the art pipeline lightweight. For a prototype or stylized pixel game, this is a real strength:

- no asset-loading pipeline
- no sprite-sheet management
- fast visual edits
- easy palette changes
- easy reuse of drawing helpers

For future projects with a similar scope, this approach is worth keeping. For larger games, it may need to evolve into a real asset pipeline.

### 9. Debug support is already pointing in the right direction

Having a dedicated debug page with teleporting, stat changes, and item/enemy controls is one of the most valuable practices in the repo. Small games benefit massively from developer shortcuts because balance issues are usually found through repeated scenario testing.

This should become standard in any future starter template.

## Build Structure Lessons

### What Worked

- No-build static delivery kept setup trivial.
- Splitting the source into focused JS files improved maintainability.
- Having both modular and single-file deploy targets shows the project can support different publishing needs.

### What Slowed Us Down

- Script loading depends on manual order in `index.html`, so files are coupled through globals and load sequence.
- `deploy-ready/` duplicates the source tree, which creates a sync risk.
- `deploy-single/` is useful for shipping, but it is another artifact that can drift if not generated automatically.
- `office-adventure.html` acts as a backup/legacy monolith, which is helpful historically but adds another version of the game to reason about.
- There is no automated build, validation, or packaging step.

### Recommendation For Future Games

Keep the low-overhead spirit, but automate the output.

The best next version of this structure is:

1. One editable source tree.
2. One simple build/export step that generates deploy-ready and single-file outputs.
3. No manual copying of files between source and deploy folders.
4. A content validation pass that checks doors, room names, item types, and required properties.

This can still stay lightweight. It does not need a heavy framework. Even a very small export script would remove a lot of manual risk.

## Scrolling, Camera, And Navigation Lessons

### What The Current Game Does

This game does not really use scrolling in the usual sense. It uses full-screen rooms. The player moves inside a room, then doors trigger a short fade transition into the next room.

That means:

- no camera follow system
- no world offset math in rendering
- no streaming of large maps
- no partial-room visibility management

### Why That Worked Here

This design was a good fit because the game is about pressure, routing, room reads, and short tactical decisions. The player benefits from seeing the entire room immediately. It also makes comedy beats, hazards, and NPC placements more readable.

### Limits Of This Approach

This structure becomes less flexible when a future game needs:

- large continuous environments
- long chase sequences across one shared map
- platforming or vertical navigation
- camera reveals or cinematic framing
- exploration where partial visibility matters

### Recommendation For Future Games

Use fixed-screen rooms as the default starter format for fast games, but introduce a camera abstraction early even if the camera stays at `(0, 0)` for now.

That gives us a clean upgrade path:

- Starter mode: room-based, no scrolling, fastest to build.
- Mid-size mode: larger rooms with camera follow.
- Advanced mode: connected world sections with streaming or chunked loading.

The important lesson is not "always use scrolling" or "never use scrolling." The lesson is to pick navigation structure based on game type, and to keep rendering code ready for a future camera if needed.

## Mechanics And Interaction Patterns Worth Reusing

### Pressure Loops

The combination of time, stamina, progress, and failure meters worked well because it gave the player more than one thing to manage at once. This is broadly reusable. Future games should keep a generic meter system where each project can rename and rebalance the meters.

### Gating Through Activity

The work meter unlocking progress is a useful generic pattern: "perform risky or inconvenient action to unlock advancement." In another game, the same structure could be focus, heat, energy, suspicion, battery charge, spell charge, or reputation.

### Risk/Reward Items

Items that help in one dimension while hurting another created strong decisions. This is worth preserving as a reusable design rule: avoid items that are only positive if the game benefits more from trade-offs.

### Interaction Menus And Dialogue Choices

Dialogue, choice prompts, vendor menus, fridge menus, and quest log overlays all reuse the same general model: pause or branch the core loop, present options, apply effects, return to play. That pattern is highly reusable.

### Simple AI State Machines

Enemies and NPCs are driven by readable states such as roaming, chasing, searching, sleeping, distracted, or auto-triggered. This is a good level of complexity for small games. It gives enough behavior variety without needing pathfinding-heavy systems.

### Room Transition Effects

The fade-out/fade-in transition is simple, readable, and cheap. It is a good default for room-based games and should stay in the template.

### Environmental Storytelling Through Objects

Doors, desks, plants, fridges, toilets, sinks, copiers, exit doors, and other tile types do more than decorate the map. They communicate affordances, risk, and tone. That is worth keeping as a principle: environment pieces should either clarify navigation, carry interaction value, or reinforce the game joke/theme.

## What Slowed Future Reuse Down

### 1. Systems and content are still tightly mixed

A lot of narrative copy, quest logic, item behavior, and special-case NPC logic lives directly inside interaction/update functions. This worked for shipping quickly, but it will slow down future reuse because the engine layer and the game-specific content layer are not fully separated.

### 2. There are duplicate patterns across files

Some interaction sequences and special-case behaviors are handled in more than one place. As more content was added, logic became split between room data, NPC updates, and interaction handlers. That is a sign that the next version should move toward content-driven event definitions.

### 3. Global mutable state makes extension easy but coupling high

The central state object is productive, but it also means almost every system can touch almost everything. That speeds early development and slows later refactoring. For the next reusable base, the state can stay centralized, but subsystems should have clearer ownership over the parts they mutate.

### 4. Content schemas are implied rather than formal

Rooms, items, NPCs, enemies, quests, and vendor entries are all usable, but their expected fields live mostly in the code rather than in an explicit schema. That makes it easier to introduce inconsistent data when building new games quickly.

### 5. The current structure is excellent for room games, but not yet generic enough for all navigation types

Because the room model is tightly tied to canvas-sized spaces, future games with larger worlds or different movement rules would need some refactoring before they can reuse the engine cleanly.

## Recommended Reusable Blueprint

### Keep As The Core Template

- Canvas setup, constants, render helpers, and frame loop.
- Central game state plus player state.
- Tile-based room/world definitions.
- Collision and movement helpers.
- Interactable resolution system.
- Menu/dialogue overlay pattern.
- Meter system.
- Item system with timed effects.
- NPC/enemy behavior profiles.
- Room transition system.
- Debug page and quick action tools.

### Extract Into More Generic Data Contracts

Future projects should formalize these content types:

- `room`: id, name, grid, doors, items, npcs, enemies, spawn points, exits, scripted triggers
- `door`: source position, destination room, destination spawn, label, conditions
- `item`: id, name, world position, inventory behavior, effect payload, icon/render type
- `npc`: id, sprite/render type, default behavior, dialogue tree, menu actions, trigger rules
- `enemy`: id, behavior type, speed, detection rules, damage/failure rule, patrol or roam definition
- `quest` or `objective`: id, start condition, completion condition, rewards, log text
- `event`: trigger condition, effect, UI copy, duration, cooldown

Once these are standardized, a new game becomes much more about authoring data and much less about adding one-off logic branches.

### Separate Engine From Game-Specific Content

The next reusable version should aim for:

- engine code that knows how to run rooms, interactions, meters, overlays, and simple AI
- content files that define theme, dialogue, items, objectives, and special events
- minimal direct hard-coding of story-specific behavior inside core systems

That separation is the single biggest change that will reduce development time on future games.

## Fastest Path To Building Future Games Faster

### Phase 1: Turn This Project Into A Starter Kit

Create a clean reusable base from this codebase with:

- one source folder
- one debug build
- one export step
- example rooms
- example NPCs, enemies, items, and objectives

### Phase 2: Replace Manual Deploy Duplication

Automate creation of:

- modular deploy output
- single-file deploy output
- optional archived snapshot

This removes a class of errors immediately.

### Phase 3: Make Content Configurable

Move dialogue trees, quest definitions, item effects, and room connections toward structured data. Keep special scripting hooks available, but make them the exception rather than the default.

### Phase 4: Add Validation And Balance Tools

The next starter should include:

- room and door validation
- missing property checks
- spawn-point checks
- item type checks
- optional balance controls for timers, speeds, and detection ranges

### Phase 5: Add A Camera Wrapper Before It Is Needed

Even if the next game still uses fixed rooms, introduce a camera object and world-to-screen helper so future scrolling games do not require a rendering rewrite.

## Practical Rules For Future Projects

- Start with the smallest navigation model that fits the game. For short comedy/pressure games, fixed rooms are still the best default.
- Reuse system patterns, not game theme. Keep meters, interactions, AI states, and overlays generic.
- Push story copy and content data out of core logic early.
- Treat debug tooling as part of the game, not an optional extra.
- Avoid multiple editable source versions of the same game.
- Prefer a small number of composable mechanics over many bespoke mechanics.
- Build for quick variation: the next game should mostly change room data, event data, item data, and narrative tone.

## Summary

The strongest takeaway from Office Adventure is that we already have the beginnings of a reusable small-game engine. The best parts are the fixed-room tile structure, state-driven overlays, layered pressure mechanics, simple AI, and low-friction canvas rendering approach.

The main improvements needed before the next game are structural, not creative:

- automate packaging
- separate engine from content
- formalize data schemas
- preserve debug tooling
- add a camera abstraction

If we do those five things, future games can start from a stable template and spend more time on ideas, pacing, art direction, and content rather than rebuilding core systems.
