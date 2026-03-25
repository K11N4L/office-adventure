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
  player.inventory = [null, null];
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
  } else {
    // Level 2: Office → Lobby → Toilet Hall → Stairwell → Toilet Area (5 rooms)
    rooms.lobby.doors[1] = { x: 13, y: 0, toRoom: 'toiletHall', toX: 7, toY: 10, label: 'Toilet Hallway' };
    rooms.toiletArea.doors[0] = { x: 7, y: 9, toRoom: 'stairwell', toX: 7, toY: 9, label: 'Back to Stairwell' };
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

  if (keys['e'] && isNearComputer() && !game.officeDoorUnlocked) {
    game.isWorking = true;
    const workRate = game.energyDrinkWorkTimer > 0 ? game.workFillRate * 3 : game.workFillRate;
    game.workMeter = Math.min(game.maxWork, game.workMeter + workRate * dt);
    // Rotate funny work task descriptions
    game.workTaskTimer -= dt;
    if (game.workTaskTimer <= 0 || !game.workTask) {
      game.workTaskTimer = 1.8 + Math.random() * 2;
      const tasks = [
        'Updating spreadsheet nobody reads...',
        'Replying all to a chain of 47 emails...',
        'Renaming final_v2_FINAL_actual.docx...',
        'Attending meeting that could\'ve been an email...',
        'Filling in timesheet... creatively...',
        'Writing passive-aggressive Slack message...',
        'Pretending to understand the Jira board...',
        'Moving tickets to "In Progress"...',
        'Googling error message on Stack Overflow...',
        'Nodding along in standup...',
        'Copy-pasting from ChatGPT...',
        'Making the logo bigger...',
        'Clearing 200 unread notifications...',
        'Submitting expense report from 6 months ago...',
        'Restarting computer for the 3rd time...',
        'Watching progress bar... watching you...',
        'Doing "synergy" on the "deliverables"...',
        'Aligning boxes in PowerPoint...',
        'Pretending VPN works...',
        'Deleting emails without reading them...',
        'Writing unit tests... LOL just kidding...',
        'Calculating how long until lunch...',
        'Staring at code you wrote last Friday...',
        'Wondering who approved this codebase...',
      ];
      game.workTask = tasks[Math.floor(Math.random() * tasks.length)];
    }
    if (game.workMeter >= game.workThreshold && !game.officeDoorUnlocked) {
      game.officeDoorUnlocked = true;
      game.state = 'interact';
      game.dialogueQueue = [];
      game.currentDialogue = "You've done enough work! The office door is now UNLOCKED. Time to make your escape to the toilet...";
    }
    player.walking = false;
    return;
  }
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
  const actualSpeed = player._coffeeBoost > 0 ? speed * 1.8 : speed;
  const nx = player.x + dx * actualSpeed * SCALE;
  const ny = player.y + dy * actualSpeed * SCALE;
  if (canMoveTo(nx, player.y, player.w, player.h)) player.x = nx;
  if (canMoveTo(player.x, ny, player.w, player.h)) player.y = ny;
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

  if (player._coffeeBoost > 0) player._coffeeBoost -= dt;
  if (player._headphoneTimer > 0) player._headphoneTimer -= dt;

  player.canInteract = null;
  const room = rooms[game.currentRoom];

  if (isNearFridge() && game.fridgeItems.length > 0) {
    player.canInteract = { type: 'fridge' };
  }

  if (isNearComputer() && !game.officeDoorUnlocked) {
    player.canInteract = { type: 'computer' };
  }

  for (const door of room.doors) {
    const doorX = door.x * T + T / 2, doorY = door.y * T + T / 2;
    const dist = Math.hypot(player.x + player.w / 2 - doorX, player.y + player.h / 2 - doorY);
    if (dist < T * 1.5) {
      if (door.locked && !game.officeDoorUnlocked) {
        player.canInteract = { type: 'lockedDoor', data: door };
      } else {
        player.canInteract = { type: 'door', data: door };
      }
    }
  }

  if (room.npcs) {
    for (const npc of room.npcs) {
      const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
      if (dist < T * 1.8) player.canInteract = { type: 'npc', data: npc };
    }
  }

  if (room.items) {
    for (const item of room.items) {
      if (item.collected) continue;
      const dist = Math.hypot(player.x - item.x, player.y - item.y);
      if (dist < T * 1.5) player.canInteract = { type: 'item', data: item };
    }
  }

  if (room.winTiles) {
    for (const wt of room.winTiles) {
      const wtx = wt.x * T, wty = wt.y * T;
      if (Math.hypot(player.x + player.w/2 - wtx - T/2, player.y + player.h/2 - wty - T/2) < T) {
        game.state = 'win';
        return;
      }
    }
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
        continue;
      }

      // Check if player is hiding and invisible via headphones
      if (player.isHiding && player._headphoneTimer > 0) {
        // Enemy can't detect hiding player, roam randomly instead
        if (!enemy.roamTarget || Math.hypot(enemy.x - enemy.roamTarget.x, enemy.y - enemy.roamTarget.y) < 4) {
          enemy.roamTarget = {
            x: Math.random() * (14 * T - 4 * T) + 4 * T,
            y: Math.random() * (10 * T - 3 * T) + 3 * T
          };
        }
        const dist = Math.hypot(enemy.roamTarget.x - enemy.x, enemy.roamTarget.y - enemy.y);
        if (dist > 4) {
          const speed = enemy.speed * SCALE * 0.3;
          moveEnemyTowardTarget(enemy, enemy.roamTarget.x, enemy.roamTarget.y, speed);
        }
        continue;
      }

      const cdx = player.x - enemy.x, cdy = player.y - enemy.y;
      const cdist = Math.hypot(cdx, cdy);
      if (cdist > 0) {
        const zombieSpeed = enemy.speed * SCALE * 0.3;
        moveEnemyTowardTarget(enemy, player.x, player.y, zombieSpeed);
      }

      if (playerDist < T * 0.7) {
        game.state = 'pub';
        game.gameOverReason = enemy.caught;
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

function updateNpcMovement(dt) {
  const room = rooms[game.currentRoom];
  if (!room.npcs) return;
  for (const npc of room.npcs) {
    if (npc.chasePlayer) {
      const dx = player.x - npc.x, dy = player.y - npc.y;
      const dist = Math.hypot(dx, dy);
      if (dist > T * 0.8) {
        const speed = (npc.chaseSpeed || 0.15) * SCALE;
        moveEnemyTowardTarget(npc, player.x, player.y, speed);
      }
    }
    if (npc.roaming && !npc.chasePlayer) {
      npc.roamTimer -= dt;
      if (npc.roamTimer <= 0 || !npc.roamTarget) {
        const minX = 2 * T, maxX = 14 * T;
        const minY = 3 * T, maxY = 10 * T;
        npc.roamTarget = {
          x: minX + Math.random() * (maxX - minX),
          y: minY + Math.random() * (maxY - minY),
        };
        npc.roamTimer = 4 + Math.random() * 5;
      }
      const dx = npc.roamTarget.x - npc.x, dy = npc.roamTarget.y - npc.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 4) {
        moveEnemyTowardTarget(npc, npc.roamTarget.x, npc.roamTarget.y, npc.roamSpeed * SCALE);
      }
    }
  }

  // Sleeping Kunal - sends player back to office (works in any room)
  for (const npc of room.npcs) {
    if (npc.sleeping) {
      const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
      if (dist < T * 1.5) {
        game.workMeter = 0;
        game.officeDoorUnlocked = false;
        game.currentRoom = 'office';
        const start = rooms.office.playerStart;
        player.x = start.x; player.y = start.y;
        game.state = 'interact';
        game.dialogueQueue = [
          "Kunal: *wakes up startled* BRAYDEN?! What are you doing here?!",
          "Kunal: You're supposed to be WORKING! Come on, back to the office.",
          "Kunal: *drags you back to your desk*",
          "*Your work meter has been reset to 0! Toilet meter unchanged.*",
        ];
        game.currentDialogue = game.dialogueQueue.shift();
        return;
      }
    }
  }

  if (game.currentRoom === 'lobby') {
    for (const npc of room.npcs) {
      if (npc.interactType === 'lax_lobby' && npc.chasePlayer) {
        const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
        if (dist < T * 0.8) {
          game.time = Math.max(0, game.time - 90);
          for (const k of room.npcs) {
            if (k.sleeping) k.sleeping = false;
          }
          game.state = 'interact';
          game.dialogueQueue = [
            "Lax: Bro you look hungry. *shoves sandwich in your face*",
            "Brayden: I don't have time for-",
            "Lax: Just eat. Trust me.",
            "*You ate Lax's sandwich. You lost 1:30 off the clock.*",
            "Kunal: *wakes up from the sofa* What's going on? ...FOOD?!",
            "*Kunal is now awake! Watch out...*",
          ];
          game.currentDialogue = game.dialogueQueue.shift();
          npc.chasePlayer = false;
          npc.x = npc.originX;
          npc.y = npc.originY;
          return;
        }
      }
    }
  }

  if (game.currentRoom === 'lobby') {
    for (const npc of room.npcs) {
      if (npc.interactType === 'boss_patrol') {
        npc.catchCooldown -= dt;
        if (npc.catchCooldown <= 0) {
          const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
          if (dist < npc.detectionRange && !player.isHiding && player._headphoneTimer <= 0) {
            game.time -= 120;
            game.workMeter = 0;
            game.officeDoorUnlocked = false;
            npc.catchCooldown = 30;
            game.state = 'interact';
            game.dialogueQueue = [...npc.dialogue];
            game.currentDialogue = game.dialogueQueue.shift();
            return;
          }
        }
      }
    }
  }

  if (game.currentRoom === 'toiletHall') {
    for (const npc of room.npcs) {
      if ((npc.interactType === 'kunal_hall' || npc.interactType === 'lax_hall') && npc.chasePlayer) {
        const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
        if (dist < T * 0.8) {
          game.state = 'pub';
          game.gameOverReason = `${npc.name} caught up to you in the hallway. "${npc.name === 'Kunal' ? "Come on mate, the pub's right there!" : "Bro just come with us, forget the toilet..."}" And just like that, you're at the pub.`;
          return;
        }
      }
      if (npc.interactType === 'karen_block' && !npc.interacted) {
        const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
        if (dist < npc.autoRange && !player.isHiding) {
          npc.interacted = true;
          game.time -= 30;
          game.state = 'interact';
          game.dialogueQueue = [...npc.dialogue];
          game.currentDialogue = game.dialogueQueue.shift();
          return;
        }
      }
      if (npc.interactType === 'greg_story' && !npc.storyActive) {
        const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
        if (dist < npc.autoRange && !player.isHiding) {
          npc.storyActive = true;
          game.time -= 30;
          game.state = 'interact';
          game.dialogueQueue = [...npc.dialogue];
          game.currentDialogue = game.dialogueQueue.shift();
          return;
        }
      }
    }
  }

  if (game.currentRoom === 'stairwell') {
    for (const npc of room.npcs) {
      if (npc.interactType === 'delivery_driver' && game.deliveryDriverMoved) {
        npc.x = 2 * T;
      }
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
