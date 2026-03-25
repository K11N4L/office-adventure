function drawEffects() {
  let effectY = 56;
  if (player._coffeeBoost > 0) {
    ctx.fillStyle = '#ffa500'; ctx.font = 'bold 10px monospace';
    ctx.fillText(`COFFEE BOOST: ${Math.ceil(player._coffeeBoost)}s`, 8, effectY); effectY += 14;
  }
  if (player._headphoneTimer > 0) {
    ctx.fillStyle = '#66aaff'; ctx.font = 'bold 10px monospace';
    ctx.fillText(`INVISIBLE: ${Math.ceil(player._headphoneTimer)}s`, 8, effectY); effectY += 14;
  }
  if (game.energyDrinkWorkTimer > 0) {
    ctx.fillStyle = '#2a8a2a'; ctx.font = 'bold 10px monospace';
    ctx.fillText(`WORK BOOST: ${Math.ceil(game.energyDrinkWorkTimer)}s`, 8, effectY); effectY += 14;
  }
  if (game.energyDrinkToiletTimer > 0) {
    const flash = game.frameCount % 20 < 10;
    ctx.fillStyle = flash ? '#ff4444' : '#cc3333'; ctx.font = 'bold 10px monospace';
    ctx.fillText(`TOILET RUSH: ${Math.ceil(game.energyDrinkToiletTimer)}s`, 8, effectY); effectY += 14;
  }
}

// --- RANDOM EVENTS ---
function updateRandomEvents(dt) {
  if (game.currentRoom === 'office') return;
  if (game.currentEvent) {
    game.currentEvent.timer -= dt;
    if (game.currentEvent.timer <= 0) game.currentEvent = null;
    return;
  }
  game.randomEventTimer -= dt;
  if (game.randomEventTimer <= 0) {
    game.randomEventTimer = 25 + Math.random() * 20;
    const roll = Math.random();
    if (roll < 0.15) triggerFireDrill();
    else if (roll < 0.25) triggerPhoneRing();
  }
}

function triggerFireDrill() {
  game.currentEvent = { type: 'fireDrill', timer: 10 };
}

function triggerPhoneRing() {
  game.currentEvent = { type: 'phoneRing', timer: 8 };
  game.state = 'interact';
  game.dialogueQueue = [
    "*RING RING* Your phone is going off...",
    "Unknown: Hi, I'm calling about your car's extended warranty...",
    "*You just lost 15 seconds listening to that!*"
  ];
  game.currentDialogue = game.dialogueQueue.shift();
  game.time -= 15;
}

function drawEventOverlay() {
  if (!game.currentEvent) return;
  if (game.currentEvent.type === 'fireDrill') {
    const flash = game.frameCount % 30 < 15;
    ctx.fillStyle = flash ? 'rgba(255, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff4444'; ctx.font = 'bold 16px monospace';
    ctx.fillText('FIRE DRILL - EVERYONE EVACUATE', canvas.width/2, 70);
    ctx.fillStyle = '#ffa'; ctx.font = '11px monospace';
    ctx.fillText(`${Math.ceil(game.currentEvent.timer)}s remaining - enemies confused!`, canvas.width/2, 88);
    ctx.textAlign = 'left';
  }
}

// --- EMAIL NOTIFICATIONS ---
function updateEmailNotifications(dt) {
  if (game.currentRoom === 'office') return;
  game.emailTimer -= dt;
  if (game.emailTimer <= 0) {
    game.emailTimer = 15 + Math.random() * 20;
    const emails = [
      'RE: RE: RE: RE: Lunch??',
      'From HR: Mandatory Fun Day Tomorrow',
      'URGENT: Who left milk in the microwave?!',
      'From Boss: Where are the TPS reports?',
      'Slack: Andrew posted in #pub-plans',
      'From Kunal: tabs > spaces. Fight me.',
      'Teams: You missed 3 meetings today',
      'From Greg: FW: FW: FW: FW: Funny joke',
      'Calendar: Performance Review in 5 min',
      'IT: Your password expires in 0 days',
    ];
    game.emailNotifications.push({
      text: emails[Math.floor(Math.random() * emails.length)],
      timer: 4
    });
  }
  for (let i = game.emailNotifications.length - 1; i >= 0; i--) {
    game.emailNotifications[i].timer -= dt;
    if (game.emailNotifications[i].timer <= 0) game.emailNotifications.splice(i, 1);
  }
}

function drawEmailNotifications() {
  for (let i = 0; i < game.emailNotifications.length; i++) {
    const email = game.emailNotifications[i];
    const alpha = Math.min(1, email.timer / 0.5);
    const ey = 58 + i * 28;
    ctx.globalAlpha = alpha;
    drawPixelRect(canvas.width - 260, ey, 252, 24, 'rgba(30, 40, 60, 0.9)');
    ctx.strokeStyle = '#4a6a9a'; ctx.lineWidth = 1;
    ctx.strokeRect(canvas.width - 260, ey, 252, 24);
    ctx.fillStyle = '#88aadd'; ctx.font = 'bold 9px monospace';
    ctx.fillText('EMAIL', canvas.width - 254, ey + 10);
    ctx.fillStyle = '#ccc'; ctx.font = '9px monospace';
    ctx.fillText(email.text, canvas.width - 220, ey + 10);
    ctx.globalAlpha = 1;
  }
}

// --- SPEECH BUBBLES / QUIPS ---
function updateQuips(dt) {
  game.quipTimer -= dt;
  if (game.quipTimer <= 0) {
    game.quipTimer = 2.5 + Math.random() * 3; // every 2.5-5.5 seconds
    // Brayden quip (always)
    if (Math.random() < 0.5) {
      const q = QUIPS.brayden[Math.floor(Math.random() * QUIPS.brayden.length)];
      game.speechBubbles.push({ text: q, x: player.x, y: player.y - 20, timer: 2.2, color: '#ffdd44', follow: 'player' });
    }
    // NPC quips
    const room = rooms[game.currentRoom];
    if (room.npcs) {
      for (const npc of room.npcs) {
        if (Math.random() < 0.3) {
          const key = npc.name.toLowerCase();
          const quipList = QUIPS[key];
          if (quipList) {
            const q = quipList[Math.floor(Math.random() * quipList.length)];
            game.speechBubbles.push({ text: q, x: npc.x, y: npc.y - 20, timer: 2, color: '#fff', followNpc: npc });
          }
        }
      }
    }
    // Andrew quips from enemies
    if (room.enemies) {
      for (const e of room.enemies) {
        if (e.dead) continue;
        if (e.type === 'zombie' && Math.random() < 0.4) {
          let quipList = QUIPS.andrew.far;
          const dist = Math.hypot(player.x - e.x, player.y - e.y);
          if (dist < T * 3) quipList = QUIPS.andrew.close;
          else if (dist < T * 6) quipList = QUIPS.andrew.medium;
          const q = quipList[Math.floor(Math.random() * quipList.length)];
          game.speechBubbles.push({ text: q, x: e.x, y: e.y - 20, timer: 2, color: '#aaa', followEnemy: e });
        }
      }
    }
  }
  // Update existing bubbles
  for (let i = game.speechBubbles.length - 1; i >= 0; i--) {
    const b = game.speechBubbles[i];
    b.timer -= dt;
    if (b.follow === 'player') { b.x = player.x; b.y = player.y - 20; }
    if (b.followNpc) { b.x = b.followNpc.x; b.y = b.followNpc.y - 20; }
    if (b.followEnemy) { b.x = b.followEnemy.x; b.y = b.followEnemy.y - 20; }
    if (b.timer <= 0) game.speechBubbles.splice(i, 1);
  }
}

function drawRoundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawSpeechBubbles() {
  for (const b of game.speechBubbles) {
    const alpha = Math.min(1, b.timer / 0.5); // fade out
    const bx = b.x, by = b.y - (2 - b.timer) * 8; // float upward
    ctx.globalAlpha = alpha;
    ctx.font = 'bold 9px monospace';
    const textW = ctx.measureText(b.text).width;
    const padX = 6, padY = 4;
    const bubbleW = textW + padX * 2, bubbleH = 14 + padY * 2;
    const bxC = bx - bubbleW / 2 + 15;
    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    drawRoundRect(bxC, by - bubbleH, bubbleW, bubbleH, 4);
    ctx.fill();
    // Border
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 1;
    drawRoundRect(bxC, by - bubbleH, bubbleW, bubbleH, 4);
    ctx.stroke();
    // Tail
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.beginPath();
    ctx.moveTo(bx + 10, by);
    ctx.lineTo(bx + 15, by + 6);
    ctx.lineTo(bx + 20, by);
    ctx.fill();
    // Text
    ctx.fillStyle = b.color;
    ctx.fillText(b.text, bxC + padX, by - padY - 3);
    ctx.globalAlpha = 1;
  }
}

// --- INTERACTION HINTS ---
function drawInteractionHints() {
  if (!player.canInteract) return;
  const { type, data } = player.canInteract;

  if (type === 'fridge') {
    const fx = 1 * T, fy = 6 * T;
    const pulse = Math.sin(game.frameCount * 0.1) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`;
    ctx.font = 'bold 11px monospace';
    ctx.fillText('[E] Open Fridge', fx - 10, fy - 8);
  }

  if (type === 'computer') {
    ctx.fillStyle = 'rgba(100, 200, 255, 0.8)';
    ctx.font = 'bold 11px monospace';
    const workHint = game.officeDoorUnlocked ? '[Hold E] Build buffer' : '[Hold E] Work';
    ctx.fillText(workHint, player.x - 12, player.y - 8);
  }

  if (type === 'door') {
    ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`[E] ${data.label}`, data.x * T + T/2, data.y * T - 8);
    ctx.textAlign = 'left';
  }

  if (type === 'lockedDoor') {
    ctx.fillStyle = 'rgba(255, 80, 80, 0.9)';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    const pct = Math.floor(game.workMeter);
    ctx.fillText(`LOCKED (${pct}/${game.workThreshold}%)`, data.x * T + T/2, data.y * T - 8);
    ctx.textAlign = 'left';
  }
}

// --- WORK OVERLAY ---
function drawWorkOverlay() {
  const W = canvas.width, H = canvas.height;
  const pct = Math.floor(game.workMeter);
  const needed = game.workThreshold;
  const ratio = game.workMeter / game.maxWork;

  // Dark overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(0, 0, W, H);

  // Central work panel
  const panelW = 380, panelH = 140;
  const px = W / 2 - panelW / 2, py = H / 2 - panelH / 2 - 20;
  drawPixelRect(px, py, panelW, panelH, 'rgba(0, 20, 40, 0.9)');
  ctx.strokeStyle = '#4a6a9a'; ctx.lineWidth = 2;
  ctx.strokeRect(px, py, panelW, panelH);
  ctx.lineWidth = 1;

  ctx.textAlign = 'center';

  // "WORKING..." title with animated dots
  const dots = '.'.repeat((Math.floor(game.frameCount / 20) % 3) + 1);
  ctx.fillStyle = '#6ab4ff'; ctx.font = 'bold 18px monospace';
  ctx.fillText('WORKING' + dots, W / 2, py + 30);

  // Task text
  if (game.workTask) {
    ctx.fillStyle = '#aaa'; ctx.font = '12px monospace';
    ctx.fillText(game.workTask, W / 2, py + 50);
  }

  // Progress bar
  const barW = 300, barH = 20;
  const barX = W / 2 - barW / 2, barY = py + 65;
  drawPixelRect(barX, barY, barW, barH, '#1a1a2a');
  const fillW = barW * ratio;
  const barColor = pct >= needed ? '#4a8' : '#4a6a9a';
  if (fillW > 0) drawPixelRect(barX, barY, fillW, barH, barColor);
  ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);

  // Percentage text
  ctx.fillStyle = '#fff'; ctx.font = 'bold 13px monospace';
  ctx.fillText(pct + '% / ' + needed + '% needed', W / 2, barY + barH + 20);

  // Energy drink boost indicator
  if (game.energyDrinkWorkTimer > 0) {
    ctx.fillStyle = '#2a8a2a'; ctx.font = '11px monospace';
    ctx.fillText('ENERGY BOOST! (' + Math.ceil(game.energyDrinkWorkTimer) + 's)', W / 2, barY + barH + 38);
  }

  // Hold E hint
  ctx.fillStyle = '#666'; ctx.font = '10px monospace';
  ctx.fillText('Hold [E] to keep working...', W / 2, py + panelH - 10);

  ctx.textAlign = 'left';
}

// --- ROOM TRANSITIONS ---
function updateRoomTransition(dt) {
  if (!game.roomTransition) return;
  const rt = game.roomTransition;
  rt.timer -= dt;
  if (rt.timer <= 0) {
    if (rt.phase === 'fadeOut') {
      // Switch room
      game.currentRoom = rt.toRoom;
      player.x = rt.toX * T;
      player.y = rt.toY * T;
      player.canInteract = null;
      player.vx = 0;
      player.vy = 0;
      // Handle occupied cubicle for Level 2
      if (rt.toRoom === 'toiletArea') {
        if (game.level === 2) {
          game.occupiedCubicle = Math.floor(Math.random() * rooms.toiletArea.winTiles.length);
        } else {
          game.occupiedCubicle = -1;
        }
      }
      rt.phase = 'fadeIn';
      rt.timer = 0.3;
    } else {
      game.roomTransition = null;
    }
  }
}

function drawRoomTransition() {
  if (!game.roomTransition) return;
  const rt = game.roomTransition;
  let alpha;
  if (rt.phase === 'fadeOut') {
    alpha = 1 - (rt.timer / rt.maxTime); // 0 → 1
  } else {
    alpha = rt.timer / rt.maxTime; // 1 → 0
  }
  ctx.fillStyle = `rgba(0,0,0,${alpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
