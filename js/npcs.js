function drawNPC(npc) {
  const x = npc.x, y = npc.y, w = T * 0.7, h = T * 0.9;
  ctx.fillStyle = C.shadow;
  ctx.beginPath();
  ctx.ellipse(x + w/2, y + h, w/2, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  const bob = Math.sin(game.frameCount * 0.05 + npc.x) * 1;

  if (npc.sprite === 'kunal') {
    const skinCol = '#b08860', hairCol = '#2a2a2a', hoodieCol = '#3a8a3a', hoodieDark = '#2a6a2a';
    const trouserCol = '#3a3a3a', shoeCol = '#eee';

    drawPixelRect(x + 3, y + h - 4, 8, 5, shoeCol);
    drawPixelRect(x + w - 11, y + h - 4, 8, 5, shoeCol);
    drawPixelRect(x + 4, y + h - 12, 7, 10, trouserCol);
    drawPixelRect(x + w - 11, y + h - 12, 7, 10, trouserCol);
    drawPixelRect(x + 1, y + 10 + bob, w - 2, h - 24, hoodieCol);
    drawPixelRect(x + w/2 - 5, y + 20 + bob, 10, 5, hoodieDark);
    drawPixelRect(x + w/2 - 3, y + 11 + bob, 2, 6, '#ddd');
    drawPixelRect(x + w/2 + 1, y + 11 + bob, 2, 6, '#ddd');
    drawPixelRect(x + 3, y + bob - 1, w - 6, 5, hoodieDark);
    drawPixelRect(x + 5, y + bob, w - 10, 14, skinCol);
    drawPixelRect(x + 5, y + bob - 2, w - 10, 5, hairCol);
    drawPixelRect(x + 8, y + 6 + bob, 3, 3, '#1a1a1a');
    drawPixelRect(x + w - 11, y + 6 + bob, 3, 3, '#1a1a1a');
    drawPixelRect(x + 10, y + 10 + bob, 5, 1, '#8a6040');

  } else if (npc.sprite === 'lax') {
    const skinCol = '#7a5a3a', hairCol = '#2a1a0a', hoodieCol = '#3a3a3a', hoodieDark = '#2a2a2a';
    const jeanCol = '#8aaabb', shoeCol = '#eee', beardCol = '#2a1a0a';
    const headphoneCol = '#555', headphonePad = '#444';

    drawPixelRect(x + 3, y + h - 4, 8, 5, shoeCol);
    drawPixelRect(x + w - 11, y + h - 4, 8, 5, shoeCol);
    drawPixelRect(x + 4, y + h - 13, 7, 11, '#8aaabb');
    drawPixelRect(x + w - 11, y + h - 13, 7, 11, '#8aaabb');
    drawPixelRect(x + 2, y + 10 + bob, w - 4, h - 25, hoodieCol);
    drawPixelRect(x + w/2 - 4, y + 10 + bob, 8, 4, '#ddd');
    drawPixelRect(x + w/2 - 1, y + 13 + bob, 2, 12, '#555');
    drawPixelRect(x + 5, y + bob, w - 10, 14, skinCol);
    drawPixelRect(x + 5, y + bob - 2, w - 10, 5, hairCol);
    drawPixelRect(x + 6, y + bob - 3, w - 12, 3, hairCol);
    drawPixelRect(x + 6, y + 10 + bob, w - 12, 4, beardCol);
    drawPixelRect(x + 8, y + 6 + bob, 3, 2, '#111');
    drawPixelRect(x + w - 11, y + 6 + bob, 3, 2, '#111');
    drawPixelRect(x + 3, y + bob - 2, w - 6, 3, headphoneCol);
    drawPixelRect(x + 2, y + bob + 1, 5, 8, headphonePad);
    drawPixelRect(x + w - 7, y + bob + 1, 5, 8, headphonePad);
    drawPixelRect(x + 3, y + bob + 2, 3, 6, '#333');
    drawPixelRect(x + w - 6, y + bob + 2, 3, 6, '#333');

  } else if (npc.sprite === 'andrew') {
    const skinCol = '#d8c8b0', hairCol = '#6a5a3a', shirtCol = '#7a7a8a', trouserCol = '#4a4a4a';
    drawPixelRect(x + 3, y + h - 4, 8, 5, '#3a2a1a');
    drawPixelRect(x + w - 11, y + h - 4, 8, 5, '#3a2a1a');
    drawPixelRect(x + 4, y + h - 13, 7, 11, trouserCol);
    drawPixelRect(x + w - 11, y + h - 13, 7, 11, trouserCol);
    drawPixelRect(x + 2, y + 10 + bob, w - 4, h - 25, shirtCol);
    drawPixelRect(x + 4, y + h - 15, 5, 3, '#8a8a9a');
    drawPixelRect(x + 5, y + bob, w - 10, 14, skinCol);
    drawPixelRect(x + 4, y + bob - 3, w - 8, 6, hairCol);
    drawPixelRect(x + 3, y + bob - 1, 4, 4, hairCol);
    drawPixelRect(x + w - 7, y + bob - 2, 4, 5, hairCol);
    drawPixelRect(x + 7, y + 5 + bob, 4, 4, '#fff');
    drawPixelRect(x + w - 11, y + 5 + bob, 4, 4, '#fff');
    drawPixelRect(x + 8, y + 6 + bob, 2, 2, '#222');
    drawPixelRect(x + w - 10, y + 6 + bob, 2, 2, '#222');
    drawPixelRect(x + 7, y + 9 + bob, 4, 2, '#b0a090');
    drawPixelRect(x + w - 11, y + 9 + bob, 4, 2, '#b0a090');
    drawPixelRect(x + 10, y + 11 + bob, 5, 2, '#8a6a5a');
    drawPixelRect(x - 3, y + 12 + bob, 6, 4, shirtCol);
    drawPixelRect(x + w - 3, y + 12 + bob, 6, 4, shirtCol);
    drawPixelRect(x - 5, y + 12 + bob, 3, 3, skinCol);
    drawPixelRect(x + w + 1, y + 12 + bob, 3, 3, skinCol);

  } else if (npc.sprite === 'boss') {
    const skinCol = '#d4a88c', hairCol = '#1a1a1a', suitCol = '#2a2a3a', tieCol = '#cc3333';
    drawPixelRect(x + 3, y + h - 4, 8, 5, '#2a2a1a');
    drawPixelRect(x + w - 11, y + h - 4, 8, 5, '#2a2a1a');
    drawPixelRect(x + 4, y + h - 13, 7, 11, '#3a3a4a');
    drawPixelRect(x + w - 11, y + h - 13, 7, 11, '#3a3a4a');
    drawPixelRect(x + 1, y + 10 + bob, w - 2, h - 24, suitCol);
    drawPixelRect(x + w/2 - 2, y + 13 + bob, 4, 10, tieCol);
    drawPixelRect(x + 5, y + bob, w - 10, 14, skinCol);
    drawPixelRect(x + 5, y + bob - 2, w - 10, 5, hairCol);
    drawPixelRect(x + 6, y + bob - 3, w - 12, 3, hairCol);
    drawPixelRect(x + 8, y + 6 + bob, 3, 3, '#111');
    drawPixelRect(x + w - 11, y + 6 + bob, 3, 3, '#111');

  } else if (npc.sprite === 'karen') {
    const skinCol = '#d4a88c', hairCol = '#8a6a4a', blazerCol = '#6a6a7a', glassesCol = '#888';
    drawPixelRect(x + 3, y + h - 4, 8, 5, '#4a3a2a');
    drawPixelRect(x + w - 11, y + h - 4, 8, 5, '#4a3a2a');
    drawPixelRect(x + 4, y + h - 13, 7, 11, '#5a5a6a');
    drawPixelRect(x + w - 11, y + h - 13, 7, 11, '#5a5a6a');
    drawPixelRect(x + 2, y + 10 + bob, w - 4, h - 25, blazerCol);
    drawPixelRect(x + 5, y + bob, w - 10, 14, skinCol);
    drawPixelRect(x + 4, y + bob - 3, w - 8, 6, hairCol);
    drawPixelRect(x + 3, y + bob - 1, 4, 4, hairCol);
    drawPixelRect(x + w - 7, y + bob - 2, 4, 5, hairCol);
    drawPixelRect(x + 6, y + 6 + bob, 3, 3, glassesCol);
    drawPixelRect(x + w - 9, y + 6 + bob, 3, 3, glassesCol);
    drawPixelRect(x + 9, y + 7 + bob, 2, 1, glassesCol);

  } else if (npc.sprite === 'greg') {
    const skinCol = '#d4a88c', shirtCol = '#4a8a4a', trouserCol = '#5a5a6a';
    drawPixelRect(x + 3, y + h - 4, 8, 5, '#4a3a2a');
    drawPixelRect(x + w - 11, y + h - 4, 8, 5, '#4a3a2a');
    drawPixelRect(x + 4, y + h - 13, 7, 11, trouserCol);
    drawPixelRect(x + w - 11, y + h - 13, 7, 11, trouserCol);
    drawPixelRect(x + 2, y + 10 + bob, w - 4, h - 25, shirtCol);
    drawPixelRect(x + 5, y + bob, w - 10, 14, skinCol);
    drawPixelRect(x + 4, y + bob - 3, w - 8, 6, '#8a7a6a');
    drawPixelRect(x + 3, y + bob - 1, 4, 4, '#8a7a6a');
    drawPixelRect(x + w - 7, y + bob - 2, 4, 5, '#8a7a6a');
    drawPixelRect(x + 8, y + 6 + bob, 3, 3, '#111');
    drawPixelRect(x + w - 11, y + 6 + bob, 3, 3, '#111');

  } else if (npc.sprite === 'delivery') {
    const skinCol = '#d4a88c', vestCol = '#cc9900', trouserCol = '#5a5a5a';
    drawPixelRect(x + 3, y + h - 4, 8, 5, '#4a3a2a');
    drawPixelRect(x + w - 11, y + h - 4, 8, 5, '#4a3a2a');
    drawPixelRect(x + 4, y + h - 13, 7, 11, trouserCol);
    drawPixelRect(x + w - 11, y + h - 13, 7, 11, trouserCol);
    drawPixelRect(x + 2, y + 10 + bob, w - 4, h - 25, '#aaa');
    drawPixelRect(x + 4, y + 12 + bob, w - 8, 8, vestCol);
    drawPixelRect(x + 5, y + bob, w - 10, 14, skinCol);
    drawPixelRect(x + 4, y + bob - 3, w - 8, 6, '#8a7a6a');
    drawPixelRect(x + 3, y + bob - 1, 4, 4, '#8a7a6a');
    drawPixelRect(x + w - 7, y + bob - 2, 4, 5, '#8a7a6a');
    drawPixelRect(x + 8, y + 6 + bob, 3, 3, '#111');
    drawPixelRect(x + w - 11, y + 6 + bob, 3, 3, '#111');

  } else if (npc.sprite === 'karin') {
    // Karin - blonde hair, pink top, dark skirt, blue eyes
    const skinCol = '#e0b090', hairCol = '#ddb860', topCol = '#cc6688', topDark = '#aa5570';
    const skirtCol = '#4a4a5a', shoeCol = '#6a4a3a';
    // Shoes
    drawPixelRect(x + 3, y + h - 4, 8, 5, shoeCol);
    drawPixelRect(x + w - 11, y + h - 4, 8, 5, shoeCol);
    // Skirt
    drawPixelRect(x + 3, y + h - 13, w - 6, 10, skirtCol);
    // Top
    drawPixelRect(x + 2, y + 10 + bob, w - 4, h - 25, topCol);
    drawPixelRect(x + w/2 - 4, y + 18 + bob, 8, 3, topDark);
    // Arms (skin-toned)
    drawPixelRect(x - 1, y + 12 + bob, 4, 10, topCol);
    drawPixelRect(x + w - 3, y + 12 + bob, 4, 10, topCol);
    drawPixelRect(x - 1, y + 21 + bob, 4, 3, skinCol);
    drawPixelRect(x + w - 3, y + 21 + bob, 4, 3, skinCol);
    // Head
    drawPixelRect(x + 5, y + bob, w - 10, 14, skinCol);
    // Hair - blonde, flowing past shoulders
    drawPixelRect(x + 4, y + bob - 4, w - 8, 7, hairCol);
    drawPixelRect(x + 3, y + bob - 2, 4, 8, hairCol);
    drawPixelRect(x + w - 7, y + bob - 2, 4, 8, hairCol);
    // Hair flowing down sides
    drawPixelRect(x + 2, y + bob + 5, 3, 12, hairCol);
    drawPixelRect(x + w - 5, y + bob + 5, 3, 12, hairCol);
    // Highlights
    drawPixelRect(x + 6, y + bob - 3, 3, 2, '#e8d080');
    // Eyes - blue with eyelashes
    drawPixelRect(x + 7, y + 5 + bob, 1, 1, '#2a2a2a'); // lash
    drawPixelRect(x + w - 8, y + 5 + bob, 1, 1, '#2a2a2a'); // lash
    drawPixelRect(x + 7, y + 6 + bob, 3, 3, '#4a7aaa');
    drawPixelRect(x + w - 10, y + 6 + bob, 3, 3, '#4a7aaa');
    drawPixelRect(x + 8, y + 7 + bob, 1, 1, '#1a1a3a'); // pupil
    drawPixelRect(x + w - 9, y + 7 + bob, 1, 1, '#1a1a3a'); // pupil
    // Smile with lipstick
    drawPixelRect(x + 9, y + 11 + bob, 6, 2, '#cc5566');
    drawPixelRect(x + 10, y + 12 + bob, 4, 1, '#e06070');

  } else if (npc.sprite === 'rebecca') {
    // Rebecca - dark curly hair, blue blouse, gold earrings, warm brown eyes
    const skinCol = '#c89870', hairCol = '#2a1a1a', blouseCol = '#4a6aaa', blouseDark = '#3a5a8a';
    const skirtCol = '#3a3a4a', shoeCol = '#5a3a2a';
    // Shoes
    drawPixelRect(x + 3, y + h - 4, 8, 5, shoeCol);
    drawPixelRect(x + w - 11, y + h - 4, 8, 5, shoeCol);
    // Skirt
    drawPixelRect(x + 3, y + h - 13, w - 6, 10, skirtCol);
    // Blouse
    drawPixelRect(x + 2, y + 10 + bob, w - 4, h - 25, blouseCol);
    // Buttons
    drawPixelRect(x + w/2 - 1, y + 14 + bob, 2, 2, '#ddd');
    drawPixelRect(x + w/2 - 1, y + 18 + bob, 2, 2, '#ddd');
    drawPixelRect(x + w/2 - 1, y + 22 + bob, 2, 2, '#ddd');
    // Arms
    drawPixelRect(x - 1, y + 12 + bob, 4, 10, blouseCol);
    drawPixelRect(x + w - 3, y + 12 + bob, 4, 10, blouseCol);
    drawPixelRect(x - 1, y + 21 + bob, 4, 3, skinCol);
    drawPixelRect(x + w - 3, y + 21 + bob, 4, 3, skinCol);
    // Head
    drawPixelRect(x + 5, y + bob, w - 10, 14, skinCol);
    // Curly dark hair - volume and texture
    drawPixelRect(x + 3, y + bob - 5, w - 6, 8, hairCol);
    drawPixelRect(x + 2, y + bob - 3, 4, 10, hairCol);
    drawPixelRect(x + w - 6, y + bob - 3, 4, 10, hairCol);
    // Hair volume on top
    drawPixelRect(x + 4, y + bob - 6, w - 8, 4, hairCol);
    // Curly texture highlights
    drawPixelRect(x + 5, y + bob - 4, 2, 2, '#3a2a2a');
    drawPixelRect(x + w - 8, y + bob - 5, 2, 2, '#3a2a2a');
    drawPixelRect(x + 3, y + bob + 3, 2, 2, '#3a2a2a');
    drawPixelRect(x + w - 5, y + bob + 2, 2, 2, '#3a2a2a');
    // Hair flowing down
    drawPixelRect(x + 1, y + bob + 6, 3, 10, hairCol);
    drawPixelRect(x + w - 4, y + bob + 6, 3, 10, hairCol);
    // Eyes - warm brown with eyelashes
    drawPixelRect(x + 7, y + 5 + bob, 1, 1, '#2a2a2a'); // lash
    drawPixelRect(x + w - 8, y + 5 + bob, 1, 1, '#2a2a2a'); // lash
    drawPixelRect(x + 7, y + 6 + bob, 3, 3, '#6a4a2a');
    drawPixelRect(x + w - 10, y + 6 + bob, 3, 3, '#6a4a2a');
    drawPixelRect(x + 8, y + 7 + bob, 1, 1, '#1a1a0a'); // pupil
    drawPixelRect(x + w - 9, y + 7 + bob, 1, 1, '#1a1a0a'); // pupil
    // Gold earrings
    drawPixelRect(x + 4, y + 8 + bob, 2, 3, '#daa520');
    drawPixelRect(x + w - 6, y + 8 + bob, 2, 3, '#daa520');
    // Smile
    drawPixelRect(x + 9, y + 11 + bob, 6, 2, '#b07060');
    drawPixelRect(x + 10, y + 12 + bob, 4, 1, '#c08070');
  }

  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.font = 'bold 10px monospace';
  const nameWidth = ctx.measureText(npc.name).width;
  drawPixelRect(x + w/2 - nameWidth/2 - 3, y - 14, nameWidth + 6, 13, 'rgba(0,0,0,0.6)');
  ctx.fillStyle = '#fff';
  ctx.fillText(npc.name, x + w/2 - nameWidth/2, y - 4);

  if (npc.sleeping) {
    const zOff = Math.sin(game.frameCount * 0.06) * 3;
    ctx.fillStyle = 'rgba(200, 200, 255, 0.8)';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('Z', x + w + 2, y - 6 + zOff);
    ctx.font = 'bold 11px monospace';
    ctx.fillText('z', x + w + 10, y - 14 + zOff * 0.7);
    ctx.font = 'bold 9px monospace';
    ctx.fillText('z', x + w + 16, y - 20 + zOff * 0.5);
  }

  if (npc.interactType === 'lax_lobby') {
    drawPixelRect(x + w + 2, y + 14, 8, 6, '#c8a060');
    drawPixelRect(x + w + 3, y + 15, 6, 2, '#4a8a2a');
    drawPixelRect(x + w + 3, y + 17, 6, 2, '#dd6644');
  }

  // Speech bubble for Andrew - always visible
  if (npc.sprite === 'andrew') {
    const bubbleX = x + w + 4, bubbleY = y - 16;
    drawPixelRect(bubbleX, bubbleY, 38, 18, '#fff');
    drawPixelRect(bubbleX + 2, bubbleY + 2, 34, 14, '#fff');
    drawPixelRect(bubbleX - 2, bubbleY + 12, 4, 4, '#fff');
    drawPixelRect(bubbleX - 4, bubbleY + 14, 3, 3, '#fff');
    ctx.fillStyle = '#333';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('Pub?', bubbleX + 5, bubbleY + 13);
  }

  const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
  if (dist < T * 1.8 && !npc.sleeping) {
    const pulse = Math.sin(game.frameCount * 0.1) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`;
    ctx.font = 'bold 12px monospace';
    ctx.fillText('[E] Talk', x - 4, y - 20);
  }
  if (dist < T * 1.8 && npc.sleeping) {
    ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('DANGER! Stay away!', x - 20, y - 22);
  }
}

// --- ENEMY RENDERING ---



// --- NPC MOVEMENT ---

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
          game.state = 'interact';
          game.dialogueQueue = [
            ...npc.dialogue,
            {
              prompt: "Karen wants to schedule a meeting about the meeting...",
              choices: [
                { label: "Politely decline", next: [
                  "Brayden: I'm really sorry Karen, I've got a deadline.",
                  "Karen: A DEADLINE? We need to discuss deadline management!",
                  "*You escaped with only 15 seconds lost.*"
                ], effect: { timeLoss: 15 } },
                { label: "Run away", next: [
                  "Brayden: Sorry gotta go bye!",
                  "*Karen is offended. She'll remember this...*"
                ], effect: { timeLoss: 5 } },
                { label: "Accept the meeting", next: [
                  "Karen: Perfect! I'll send a Teams invite for tomorrow at...",
                  "Karen: ...actually, let me check everyone's calendar...",
                  "Karen: ...hmm, Wednesday works, no wait...",
                  "*You stood there for 45 seconds while Karen checked calendars.*"
                ], effect: { timeLoss: 45 } }
              ]
            }
          ];
          game.currentDialogue = game.dialogueQueue.shift();
          return;
        }
      }
      if (npc.interactType === 'greg_story' && !npc.storyActive) {
        const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
        if (dist < npc.autoRange && !player.isHiding) {
          npc.storyActive = true;
          game.state = 'interact';
          game.dialogueQueue = [
            ...npc.dialogue,
            {
              prompt: "Greg is still talking... what do you do?",
              choices: [
                { label: "Politely listen", next: [
                  "Greg: ...and THAT'S why you never trust a man with two watches.",
                  "*Greg talked your ear off. Lost 30 seconds!*"
                ], effect: { timeLoss: 30 } },
                { label: "Walk away mid-story", next: [
                  "Brayden: Sorry Greg, gotta run!",
                  "Greg: ...but I hadn't got to the punchline yet!",
                  "*You escaped but still lost 10 seconds.*"
                ], effect: { timeLoss: 10 } }
              ]
            }
          ];
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

