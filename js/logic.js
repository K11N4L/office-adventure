function startGame() {
  game.state = 'playing';
  game.currentRoom = 'office';
  game.time = game.maxTime;
  game.workMeter = 0;
  game.toiletMeter = 0;
  game.officeDoorUnlocked = false;
  game.isWorking = false;
  game.saltAmmo = 0;
  game.saltProjectiles = [];
  game.fridgeItems = ['salt', 'beer', 'energy_drink'];
  game.fridgeMenuIndex = 0;
  game.energyDrinkWorkTimer = 0;
  game.energyDrinkToiletTimer = 0;
  game.npcMenuOptions = [];
  game.npcMenuIndex = 0;
  game.npcMenuTarget = null;

  const start = rooms.office.playerStart;
  player.x = start.x; player.y = start.y;
  player.stamina = player.maxStamina;
  player.inventory = game.level === 3 ? [null, null, null, null] : [null, null];
  player._coffeeBoost = 0;
  player._headphoneTimer = 0;
  player.isHiding = false;
  player.imodiumTimer = 0;

  game.paperBalls = [];
  game.randomEventTimer = 30;
  game.currentEvent = null;
  game.emailNotifications = [];
  game.emailTimer = 20;
  game.deliveryDriverMoved = false;
  game.occupiedCubicle = -1;
  game.speechBubbles = [];
  game.quipTimer = 0;

  for (const roomKey in rooms) {
    const r = rooms[roomKey];
    if (r.items) r.items.forEach(i => i.collected = false);
    if (r.enemies) r.enemies.forEach(e => {
      e.patrolIndex = 0; e.alerted = false;
      e.distracted = false; e.distractTimer = 0;
      e.hp = e.maxHp; e.dead = false;
      if (e.startX !== undefined) { e.x = e.startX; e.y = e.startY; }
      // Initialize alert state for zombies
      if (e.type === 'zombie') {
        e.alertState = 'idle';
        e.lastSeenX = 0;
        e.lastSeenY = 0;
        e.searchTimer = 0;
        e.roamTarget = null;
      }
    });
    if (r.npcs) r.npcs.forEach(n => {
      if (n.originX !== undefined) {
        n.x = n.originX; n.y = n.originY;
      }
      if (n.roaming) { n.roamTarget = null; n.roamTimer = 0; }
      if (n.chasePlayer !== undefined) n.chasePlayer = true;
      if (n.sleeping !== undefined) n.sleeping = true;
      if (n.interacted !== undefined) n.interacted = false;
      if (n.storyActive !== undefined) n.storyActive = false;
      if (n.catchCooldown !== undefined) n.catchCooldown = 0;
    });
  }
  if (rooms.lobby.npcs) {
    rooms.lobby.npcs.forEach(n => {
      if (n.interactType === 'kunal_lobby') n.sleeping = true;
      if (n.interactType === 'lax_lobby') n.chasePlayer = true;
    });
  }

  // Configure door routing based on level
  if (game.level === 1) {
    // Level 1: Office → Lobby → Toilet Area (3 rooms)
    // Lobby top door goes straight to toiletArea
    rooms.lobby.doors[1] = { x: 13, y: 0, toRoom: 'toiletArea', toX: 7, toY: 9, label: 'To the Toilets!' };
    // toiletArea back door goes to lobby
    rooms.toiletArea.doors[0] = { x: 7, y: 9, toRoom: 'lobby', toX: 13, toY: 1, label: 'Back to Communal Area' };
  } else if (game.level === 2) {
    // Level 2: Office → Lobby → Toilet Hall → Stairwell → Toilet Area (5 rooms)
    rooms.lobby.doors[1] = { x: 13, y: 0, toRoom: 'toiletHall', toX: 7, toY: 10, label: 'Toilet Hallway' };
    rooms.toiletArea.doors[0] = { x: 7, y: 9, toRoom: 'stairwell', toX: 7, toY: 9, label: 'Back to Stairwell' };
    // Level 2 quests
    game.quests = [
      { id: 'find_imodium', name: 'Emergency Supplies', description: 'Find Imodium to slow your urgency',
        itemNeeded: 'imodium', giver: 'Survival', completed: false, reward: 0,
        rewardDesc: 'Slows toilet meter' }
    ];
    game.activeQuest = null;
  }

  // Add quests for Level 1
  if (game.level === 1) {
    game.quests = [
      { id: 'quick_coffee', name: 'Coffee Emergency', description: 'Find the coffee near the lobby',
        itemNeeded: 'coffee', giver: 'Survival', completed: false, reward: 0,
        rewardDesc: 'Speed boost for 5s' }
    ];
    game.activeQuest = null;
  }

  if (game.level === 3) {
    game.mode = 'freeroam';
    game.time = 9999; // no time pressure
    game.toiletRiseRate = 0; // no toilet urgency
    game.maxTime = 9999;
    game.officeDoorUnlocked = true; // doors always open
    game.gold = 0;

    // Set up door routing - lobby connects to pub via exit
    rooms.lobby.doors[1] = { x: 13, y: 0, toRoom: 'toiletHall', toX: 7, toY: 10, label: 'Toilet Hallway' };
    rooms.toiletArea.doors[0] = { x: 7, y: 9, toRoom: 'stairwell', toX: 7, toY: 9, label: 'Back to Stairwell' };

    // toiletHall exit door leads to pub instead of game over
    rooms.toiletHall.doors[2] = { x: 12, y: 10, toRoom: 'pub', toX: 7, toY: 9, label: 'Go to the Pub' };

    // Remove sleeping behavior from all Kunals - he's a vendor in free roam
    for (const roomKey in rooms) {
      const r = rooms[roomKey];
      if (r.npcs) r.npcs.forEach(n => {
        if (n.sleeping) n.sleeping = false;
      });
    }

    // Set up quests
    game.quests = [
      { id: 'coffee_run', name: "Karin's Coffee Run", description: 'Find Coffee and bring it to Karin', itemNeeded: 'coffee', giver: 'Karin', completed: false, reward: 20, rewardDesc: '+20 Work Points' },
      { id: 'lost_headphones', name: "Rebecca's Headphones", description: 'Find Headphones and return them to Rebecca', itemNeeded: 'headphones', giver: 'Rebecca', completed: false, reward: 25, rewardDesc: '+25 Work Points' },
      { id: 'pub_snacks', name: "Karin's Pub Snacks", description: 'Get Pub Snacks from the pub for Karin', itemNeeded: 'pub_snacks', giver: 'Karin', completed: false, reward: 30, rewardDesc: '+30 Work Points' },
      { id: 'beer_mat', name: "Rebecca's Collection", description: 'Find the rare Beer Mat in the pub', itemNeeded: 'beer_mat', giver: 'Rebecca', completed: false, reward: 20, rewardDesc: '+20 Work Points' },
      { id: 'imodium_quest', name: "Karin's Emergency", description: 'Find Imodium for Karin (she ate the curry too)', itemNeeded: 'imodium', giver: 'Karin', completed: false, reward: 35, rewardDesc: '+35 Work Points' },
      { id: 'dart_quest', name: "Rebecca's Darts Night", description: 'Get a Dart from the pub for tonight', itemNeeded: 'dart', giver: 'Rebecca', completed: false, reward: 15, rewardDesc: '+15 Work Points' },
    ];
    game.activeQuest = null;

    // Add Karin and Rebecca NPCs to office
    rooms.office.npcs.push(
      { x: 1 * T, y: 3 * T, name: 'Karin', type: 'coworker', interactType: 'karin_quest',
        roaming: false, originX: 1 * T, originY: 3 * T, sprite: 'karin',
        dialogue: ["Karin: Hey Brayden! I've got some tasks for you if you're bored..."] },
      { x: 1 * T, y: 7 * T, name: 'Rebecca', type: 'coworker', interactType: 'rebecca_quest',
        roaming: false, originX: 1 * T, originY: 7 * T, sprite: 'rebecca',
        dialogue: ["Rebecca: Oh Brayden, perfect timing! I need a favour..."] }
    );

    // Change office Kunal to vendor
    rooms.office.npcs.forEach(n => {
      if (n.name === 'Kunal') {
        n.interactType = 'kunal_vendor';
        n.dialogue = ["Kunal: Yo! Want to buy something? I accept work progress as payment."];
      }
    });

    // Add more items scattered around rooms for free roam
    rooms.lobby.items.push(
      { x: 7 * T, y: 2 * T, name: 'Biscuits', type: 'pickup', itemType: 'biscuits', collected: false },
      { x: 14 * T, y: 8 * T, name: 'Stapler', type: 'pickup', itemType: 'stapler', collected: false }
    );
    rooms.toiletHall.items.push(
      { x: 8 * T, y: 8 * T, name: 'Toilet Roll', type: 'pickup', itemType: 'toilet_roll', collected: false }
    );
  }
}


function resetGame() { game.state = 'title'; game.levelSelectIndex = game.level - 1; }

function isNearComputer() {
  if (game.currentRoom !== 'office') return false;
  const room = rooms.office;
  const pgx = Math.floor((player.x + player.w / 2) / T);
  const pgy = Math.floor((player.y + player.h / 2) / T);
  for (let oy = -1; oy <= 1; oy++) {
    for (let ox = -1; ox <= 1; ox++) {
      const tx = pgx + ox, ty = pgy + oy;
      if (ty >= 0 && ty < ROWS && tx >= 0 && tx < COLS) {
        if (room.grid[ty][tx] === TILE_MONITOR) return true;
      }
    }
  }
  return false;
}


function isNearFridge() {
  if (game.currentRoom !== 'office') return false;
  const fridgeX = 1 * T + T/2, fridgeY = 6 * T + T/2;
  return Math.hypot(player.x + player.w/2 - fridgeX, player.y + player.h/2 - fridgeY) < T * 1.8;
}


function getNearestDesk() {
  const room = rooms[game.currentRoom];
  let nearest = null, minDist = Infinity;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (room.grid[y][x] === TILE_DESK || room.grid[y][x] === TILE_COPIER) {
        const dx = player.x + player.w/2 - (x * T + T/2);
        const dy = player.y + player.h/2 - (y * T + T/2);
        const dist = Math.hypot(dx, dy);
        if (dist < T * 1.8 && dist < minDist) { nearest = {x: x*T, y: y*T}; minDist = dist; }
      }
    }
  }
  return nearest;
}


function toggleHiding() {
  if (player.isHiding) {
    player.isHiding = false;
    return;
  }
  const desk = getNearestDesk();
  if (desk) {
    player.isHiding = true;
    player.x = desk.x + T/2 - player.w/2;
    player.y = desk.y + T/2 - player.h/2;
  }
}


function throwPaperBall() {
  const dirs = { up: {dx:0,dy:-1}, down: {dx:0,dy:1}, left: {dx:-1,dy:0}, right: {dx:1,dy:0} };
  const d = dirs[player.facing] || dirs.down;
  game.paperBalls.push({
    x: player.x + player.w/2, y: player.y + player.h/2,
    dx: d.dx * 4, dy: d.dy * 4, timer: 1.5, landed: false,
    landX: 0, landY: 0, distractTimer: 4
  });
}


function updatePaperBalls(dt) {
  const room = rooms[game.currentRoom];
  for (let i = game.paperBalls.length - 1; i >= 0; i--) {
    const pb = game.paperBalls[i];
    if (!pb.landed) {
      pb.x += pb.dx; pb.y += pb.dy;
      pb.timer -= dt;
      // Check wall collision
      const tx = Math.floor(pb.x / T), ty = Math.floor(pb.y / T);
      if (tx < 0 || tx >= COLS || ty < 0 || ty >= ROWS || isSolid(room.grid[ty]?.[tx])) {
        pb.landed = true; pb.landX = pb.x; pb.landY = pb.y;
      }
      if (pb.timer <= 0) { pb.landed = true; pb.landX = pb.x; pb.landY = pb.y; }
    } else {
      pb.distractTimer -= dt;
      // Distract nearby enemies
      if (room.enemies) {
        for (const e of room.enemies) {
          if (e.dead) continue;
          const dist = Math.hypot(e.x - pb.landX, e.y - pb.landY);
          if (dist < T * 5) {
            e.distracted = true; e.distractTimer = Math.max(e.distractTimer, pb.distractTimer);
            e.distractX = pb.landX; e.distractY = pb.landY;
          }
        }
      }
      if (pb.distractTimer <= 0) game.paperBalls.splice(i, 1);
    }
  }
}


function drawPaperBalls() {
  for (const pb of game.paperBalls) {
    ctx.fillStyle = '#d4c8a0';
    ctx.beginPath();
    const px = pb.landed ? pb.landX : pb.x;
    const py = pb.landed ? pb.landY : pb.y;
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
    if (pb.landed) {
      // Noise rings
      const alpha = pb.distractTimer / 4;
      ctx.strokeStyle = `rgba(255, 200, 100, ${alpha * 0.4})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px, py, (4 - pb.distractTimer) * 15, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}


function updatePlayer(dt) {
  if (game.state !== 'playing') return;

  // Block movement during room transitions
  if (game.roomTransition) return;

  game.isWorking = false;

  if (player.isHiding) {
    player.walking = false;
    return;
  }

  let dx = 0, dy = 0;
  if (keys['w'] || keys['arrowup']) { dy = -1; player.facing = 'up'; }
  if (keys['s'] || keys['arrowdown']) { dy = 1; player.facing = 'down'; }
  if (keys['a'] || keys['arrowleft']) { dx = -1; player.facing = 'left'; }
  if (keys['d'] || keys['arrowright']) { dx = 1; player.facing = 'right'; }
  if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

  player.walking = dx !== 0 || dy !== 0;
  player.sneaking = keys['shift'] && player.stamina > 0;
  if (player.sneaking && player.walking) {
    player.stamina = Math.max(0, player.stamina - player.staminaDrain * dt);
  } else if (!player.sneaking) {
    player.stamina = Math.min(player.maxStamina, player.stamina + player.staminaRegen * dt);
  }

  const speed = player.sneaking ? player.sneakSpeed : player.speed;
  const targetSpeed = (player._coffeeBoost > 0 ? speed * 1.8 : speed) * SCALE;
  const accel = 12;
  const friction = 8;

  // Accelerate toward target velocity
  const targetVx = dx * targetSpeed;
  const targetVy = dy * targetSpeed;
  player.vx += (targetVx - player.vx) * Math.min(1, accel * dt);
  player.vy += (targetVy - player.vy) * Math.min(1, accel * dt);

  // Apply friction when no input
  if (dx === 0) player.vx *= Math.max(0, 1 - friction * dt);
  if (dy === 0) player.vy *= Math.max(0, 1 - friction * dt);

  // Stop if very slow
  if (Math.abs(player.vx) < 0.1) player.vx = 0;
  if (Math.abs(player.vy) < 0.1) player.vy = 0;

  // Apply movement with wall-sliding
  const nx = player.x + player.vx;
  const ny = player.y + player.vy;
  if (canMoveTo(nx, ny, player.w, player.h)) {
    player.x = nx;
    player.y = ny;
  } else if (canMoveTo(nx, player.y, player.w, player.h)) {
    player.x = nx;
    player.vy = 0; // wall slide on X axis
  } else if (canMoveTo(player.x, ny, player.w, player.h)) {
    player.y = ny;
    player.vx = 0; // wall slide on Y axis
  } else {
    player.vx = 0;
    player.vy = 0;
  }
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

  if (player._coffeeBoost > 0) player._coffeeBoost -= dt;
  if (player._headphoneTimer > 0) player._headphoneTimer -= dt;

  player.canInteract = null;
  const room = rooms[game.currentRoom];

  // Check win tiles first (highest priority - immediate win)
  if (room.winTiles) {
    for (const wt of room.winTiles) {
      const wtx = wt.x * T, wty = wt.y * T;
      if (Math.hypot(player.x + player.w/2 - wtx - T/2, player.y + player.h/2 - wty - T/2) < T) {
        game.state = 'win';
        return;
      }
    }
  }

  // Collect all interactables with their distances
  const interactables = [];

  // High priority: NPCs (closest)
  if (room.npcs) {
    for (const npc of room.npcs) {
      const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
      if (dist < T * 1.8) {
        interactables.push({ priority: 'npc', dist, type: 'npc', data: npc });
      }
    }
  }

  // Medium priority: Items (closest)
  if (room.items) {
    for (const item of room.items) {
      if (item.collected) continue;
      const dist = Math.hypot(player.x - item.x, player.y - item.y);
      if (dist < T * 1.5) {
        interactables.push({ priority: 'item', dist, type: 'item', data: item });
      }
    }
  }

  // Medium priority: Doors (closest)
  for (const door of room.doors) {
    const doorX = door.x * T + T / 2, doorY = door.y * T + T / 2;
    const dist = Math.hypot(player.x + player.w / 2 - doorX, player.y + player.h / 2 - doorY);
    if (dist < T * 1.5) {
      if (door.locked && !game.officeDoorUnlocked) {
        interactables.push({ priority: 'door', dist, type: 'lockedDoor', data: door });
      } else {
        interactables.push({ priority: 'door', dist, type: 'door', data: door });
      }
    }
  }

  // Low priority: Fridge
  if (isNearFridge() && game.fridgeItems.length > 0) {
    const fridgeX = 1 * T + T/2, fridgeY = 6 * T + T/2;
    const dist = Math.hypot(player.x + player.w/2 - fridgeX, player.y + player.h/2 - fridgeY);
    interactables.push({ priority: 'fridge', dist, type: 'fridge' });
  }

  // Low priority: Computer (always available for working)
  if (isNearComputer()) {
    interactables.push({ priority: 'computer', dist: 0, type: 'computer' });
  }

  // Sort by priority (npc > item/door > fridge/computer) then by distance
  const priorityOrder = { 'npc': 0, 'item': 1, 'door': 1, 'fridge': 2, 'computer': 2 };
  interactables.sort((a, b) => {
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pDiff !== 0) return pDiff;
    return a.dist - b.dist;
  });

  if (interactables.length > 0) {
    const best = interactables[0];
    player.canInteract = { type: best.type, data: best.data };
  }
}


function moveEnemyTowardTarget(enemy, targetX, targetY, maxSpeed) {
  const dx = targetX - enemy.x, dy = targetY - enemy.y;
  const dist = Math.hypot(dx, dy);
  if (dist > 2) {
    const speed = Math.min(maxSpeed, dist);
    enemy.x += (dx / dist) * speed;
    enemy.y += (dy / dist) * speed;
    // Try sliding along walls
    if (!canMoveTo(enemy.x, enemy.y, T * 0.7, T * 0.8)) {
      enemy.x -= (dx / dist) * speed;
      if (canMoveTo(enemy.x, enemy.y + (dy / dist) * speed, T * 0.7, T * 0.8)) {
        enemy.y += (dy / dist) * speed;
      } else {
        enemy.y -= (dy / dist) * speed;
        if (canMoveTo(enemy.x + (dx / dist) * speed, enemy.y, T * 0.7, T * 0.8)) {
          enemy.x += (dx / dist) * speed;
        }
      }
    }
  }
}


function hasLineOfSight(x1, y1, x2, y2) {
  const room = rooms[game.currentRoom];
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) / (T / 2);
  const numChecks = Math.min(Math.ceil(steps), 20);
  for (let i = 1; i < numChecks; i++) {
    const t = i / numChecks;
    const cx = x1 + (x2 - x1) * t;
    const cy = y1 + (y2 - y1) * t;
    const gx = Math.floor(cx / T), gy = Math.floor(cy / T);
    if (gx < 0 || gx >= COLS || gy < 0 || gy >= ROWS) return false;
    if (room.grid[gy][gx] === TILE_WALL) return false;
  }
  return true;
}


function updateEnemies(dt) {
  const room = rooms[game.currentRoom];
  if (!room.enemies) return;

  if (game.currentEvent?.type === 'fireDrill') {
    for (const enemy of room.enemies) {
      if (!enemy.dead) enemy.alerted = false;
    }
    return;
  }

  for (const enemy of room.enemies) {
    if (enemy.dead) continue;
    if (enemy.distracted) {
      enemy.distractTimer -= dt;
      if (enemy.distractTimer <= 0) enemy.distracted = false;
      // Move toward distraction
      if (enemy.distractX !== undefined && enemy.distractY !== undefined) {
        const dist = Math.hypot(enemy.distractX - enemy.x, enemy.distractY - enemy.y);
        if (dist > 4) {
          const speed = enemy.speed * SCALE * 0.3;
          moveEnemyTowardTarget(enemy, enemy.distractX, enemy.distractY, speed);
        }
      }
      continue;
    }

    if (enemy.type === 'zombie') {
      const playerDist = Math.hypot(
        player.x + player.w / 2 - enemy.x - T * 0.35,
        player.y + player.h / 2 - enemy.y - T * 0.4
      );

      if (game.isWorking) {
        if (enemy.alertState === 'hunting') enemy.alertState = 'suspicious';
        continue;
      }

      const isInteracting = game.state === 'interact' || game.state === 'npcMenu' || game.state === 'fridgeMenu';
      if (isInteracting) {
        const cdx = player.x - enemy.x, cdy = player.y - enemy.y;
        const cdist = Math.hypot(cdx, cdy);
        if (cdist > 0 && cdist < T * 8) {
          const retreatSpeed = enemy.speed * SCALE * 0.2;
          moveEnemyTowardTarget(enemy, enemy.x - (cdx / cdist) * T * 4, enemy.y - (cdy / cdist) * T * 4, retreatSpeed);
        }
        if (enemy.alertState === 'hunting') enemy.alertState = 'suspicious';
        continue;
      }

      // Check if player is hiding and invisible via headphones
      const hidden = player.isHiding && player._headphoneTimer > 0;

      // Detect player with line of sight check
      let canSeePlayer = false;
      if (!hidden && playerDist < T * 8) {
        canSeePlayer = hasLineOfSight(enemy.x, enemy.y, player.x + player.w / 2, player.y + player.h / 2);
      }

      // State machine for zombie AI
      if (canSeePlayer) {
        // Transition to hunting
        enemy.alertState = 'hunting';
        enemy.lastSeenX = player.x;
        enemy.lastSeenY = player.y;
        enemy.searchTimer = 0;
      }

      if (enemy.alertState === 'hunting') {
        const huntSpeed = enemy.speed * SCALE * 0.45; // 1.5x normal
        moveEnemyTowardTarget(enemy, player.x, player.y, huntSpeed);
      } else if (enemy.alertState === 'suspicious') {
        // Move to last seen position and search
        enemy.searchTimer -= dt;
        const suspDist = Math.hypot(enemy.lastSeenX - enemy.x, enemy.lastSeenY - enemy.y);
        if (suspDist > 4) {
          const suspSpeed = enemy.speed * SCALE * 0.21; // 0.7x normal
          moveEnemyTowardTarget(enemy, enemy.lastSeenX, enemy.lastSeenY, suspSpeed);
        } else if (enemy.searchTimer <= 0) {
          // Search done, return to idle
          enemy.alertState = 'idle';
        }
      } else {
        // Idle: roam slowly to random points
        if (!enemy.roamTarget || Math.hypot(enemy.x - enemy.roamTarget.x, enemy.y - enemy.roamTarget.y) < 4) {
          enemy.roamTarget = {
            x: Math.random() * (14 * T - 4 * T) + 4 * T,
            y: Math.random() * (10 * T - 3 * T) + 3 * T
          };
        }
        const dist = Math.hypot(enemy.roamTarget.x - enemy.x, enemy.roamTarget.y - enemy.y);
        if (dist > 4) {
          const idleSpeed = enemy.speed * SCALE * 0.15; // slow roaming
          moveEnemyTowardTarget(enemy, enemy.roamTarget.x, enemy.roamTarget.y, idleSpeed);
        }
      }

      if (playerDist < T * 0.7) {
        if (game.mode === 'freeroam') {
          game.currentRoom = 'pub';
          player.x = 7 * T; player.y = 9 * T;
          game.state = 'interact';
          game.dialogueQueue = ["Andrew dragged you to the pub! 'Just one pint!'", "*You're now at the pub. Find the door to get back!*"];
          game.currentDialogue = game.dialogueQueue.shift();
        } else {
          game.state = 'pub';
          game.gameOverReason = enemy.caught;
        }
      }
      continue;
    }

    if (!enemy.patrolIndex) enemy.patrolIndex = 0;
    const target = enemy.patrol[enemy.patrolIndex];
    const edx = target.x - enemy.x, edy = target.y - enemy.y;
    const edist = Math.hypot(edx, edy);
    if (edist < 4) {
      enemy.patrolIndex = (enemy.patrolIndex + 1) % enemy.patrol.length;
    } else {
      enemy.x += (edx / edist) * enemy.speed * SCALE * 0.5;
      enemy.y += (edy / edist) * enemy.speed * SCALE * 0.5;
    }

    const playerDist = Math.hypot(
      player.x + player.w / 2 - enemy.x - T * 0.35,
      player.y + player.h / 2 - enemy.y - T * 0.4
    );
    const detectionRange = player.sneaking ? enemy.range * 0.4 : enemy.range;
    const invisible = player._headphoneTimer > 0;

    if (playerDist < detectionRange && !invisible) {
      enemy.alerted = true;
      const cdx = player.x - enemy.x, cdy = player.y - enemy.y;
      const cdist = Math.hypot(cdx, cdy);
      if (cdist > 0) {
        enemy.x += (cdx / cdist) * enemy.speed * SCALE * 0.8;
        enemy.y += (cdy / cdist) * enemy.speed * SCALE * 0.8;
      }
      if (playerDist < T * 0.6) {
        game.state = 'pub';
        game.gameOverReason = enemy.caught;
      }
    } else {
      enemy.alerted = false;
    }
  }
}


function updateSaltProjectiles(dt) {
  const room = rooms[game.currentRoom];
  for (let i = game.saltProjectiles.length - 1; i >= 0; i--) {
    const p = game.saltProjectiles[i];
    p.x += p.dx * 6;
    p.y += p.dy * 6;
    p.life -= dt;

    if (room.enemies) {
      for (const enemy of room.enemies) {
        if (enemy.dead) continue;
        const dist = Math.hypot(p.x - enemy.x - T * 0.35, p.y - enemy.y - T * 0.4);
        if (dist < T * 0.5) {
          enemy.hp--;
          if (enemy.hp <= 0) {
            enemy.dead = true;
          } else {
            enemy.distracted = true;
            enemy.distractTimer = 1;
            enemy.alerted = false;
          }
          game.saltProjectiles.splice(i, 1);
          break;
        }
      }
    }

    if (p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
      game.saltProjectiles.splice(i, 1);
    }
  }
}


function updateTimers(dt) {
  if (game.state !== 'playing') return;

  game.time -= dt;
  if (game.time <= 0) {
    game.time = 0;
    game.state = 'pub';
    game.gameOverReason = "Time's up! You took too long and your bladder couldn't hold. Straight to the pub to drown your sorrows...";
  }

  if (game.energyDrinkWorkTimer > 0) {
    game.energyDrinkWorkTimer -= dt;
  }
  if (game.energyDrinkToiletTimer > 0) {
    game.energyDrinkToiletTimer -= dt;
  }

  if (player.imodiumTimer > 0) {
    player.imodiumTimer -= dt;
  }

  // Work meter decay - slowly drops when not working
  if (!game.isWorking && game.workMeter > 0) {
    game.workMeter = Math.max(0, game.workMeter - game.workDecayRate * dt);
    // Re-lock door if work drops below threshold
    if (game.workMeter < game.workThreshold && game.officeDoorUnlocked) {
      game.officeDoorUnlocked = false;
    }
  }

  let toiletRate = game.energyDrinkToiletTimer > 0 ? game.toiletRiseRate * 3 : game.toiletRiseRate;
  if (player.imodiumTimer > 0) {
    toiletRate *= 0.3;
  }
  game.toiletMeter = Math.min(game.maxToilet, game.toiletMeter + toiletRate * dt);
  if (game.toiletMeter >= game.maxToilet) {
    game.state = 'pub';
    game.gameOverReason = "Your toilet meter hit 100%! You didn't make it in time... Embarrassed, you fled straight to the pub.";
  }
}


function fireSalt() {
  if (game.saltAmmo <= 0) return;
  game.saltAmmo--;
  let dx = 0, dy = 0;
  if (player.facing === 'up') dy = -1;
  else if (player.facing === 'down') dy = 1;
  else if (player.facing === 'left') dx = -1;
  else dx = 1;

  game.saltProjectiles.push({
    x: player.x + player.w / 2,
    y: player.y + player.h / 2,
    dx, dy,
    life: 1.5,
  });
}


// --- WORK MINI-GAME ---
function generateWorkQuestion() {
  const ops = ['+', '-', '*'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === '+') {
    a = Math.floor(Math.random() * 50) + 10;
    b = Math.floor(Math.random() * 50) + 10;
    answer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * 50) + 30;
    b = Math.floor(Math.random() * 30) + 5;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 12) + 2;
    b = Math.floor(Math.random() * 12) + 2;
    answer = a * b;
  }

  const text = a + ' ' + op + ' ' + b + ' = ?';

  // Generate 4 options including the correct answer
  const options = [answer];
  while (options.length < 4) {
    let wrong;
    if (op === '*') {
      wrong = answer + (Math.floor(Math.random() * 20) - 10);
    } else {
      wrong = answer + (Math.floor(Math.random() * 30) - 15);
    }
    if (wrong !== answer && wrong >= 0 && !options.includes(wrong)) {
      options.push(wrong);
    }
  }
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = options[i]; options[i] = options[j]; options[j] = tmp;
  }

  // Pick a funny task label
  const tasks = [
    'Updating spreadsheet nobody reads...',
    'Replying all to a chain of 47 emails...',
    'Renaming final_v2_FINAL_actual.docx...',
    'Filling in timesheet... creatively...',
    'Pretending to understand the Jira board...',
    'Moving tickets to "In Progress"...',
    'Googling error message on Stack Overflow...',
    'Copy-pasting from ChatGPT...',
    'Making the logo bigger...',
    'Doing "synergy" on the "deliverables"...',
    'Aligning boxes in PowerPoint...',
    'Writing unit tests... LOL just kidding...',
    'Calculating how long until lunch...',
    'Wondering who approved this codebase...',
  ];

  game.workQuestion = {
    text: text,
    answer: answer,
    options: options,
    selectedIndex: 0,
    timer: 5,
    maxTimer: 5,
    answered: false,
    correct: false,
    resultTimer: 0,
    taskLabel: tasks[Math.floor(Math.random() * tasks.length)],
  };
  game.state = 'workScreen';
}

function answerWorkQuestion() {
  if (!game.workQuestion || game.workQuestion.answered) return;
  const wq = game.workQuestion;
  wq.answered = true;
  if (wq.options[wq.selectedIndex] === wq.answer) {
    wq.correct = true;
    const bonus = game.energyDrinkWorkTimer > 0 ? 30 : 10;
    game.workMeter = Math.min(game.maxWork, game.workMeter + bonus);
    // Check door unlock
    if (game.workMeter >= game.workThreshold && !game.officeDoorUnlocked) {
      game.officeDoorUnlocked = true;
    }
  } else {
    wq.correct = false;
    game.toiletMeter = Math.min(game.maxToilet, game.toiletMeter + 20);
  }
  wq.resultTimer = 1.2; // show result for 1.2 seconds
}

function updateWorkScreen(dt) {
  if (!game.workQuestion) return;
  const wq = game.workQuestion;
  if (wq.answered) {
    wq.resultTimer -= dt;
    if (wq.resultTimer <= 0) {
      game.workQuestion = null;
      game.state = 'playing';
    }
    return;
  }
  wq.timer -= dt;
  if (wq.timer <= 0) {
    // Time ran out — counts as wrong
    wq.answered = true;
    wq.correct = false;
    game.toiletMeter = Math.min(game.maxToilet, game.toiletMeter + 20);
    wq.resultTimer = 1.2;
  }
}
