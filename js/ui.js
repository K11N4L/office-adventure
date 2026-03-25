function drawUI() {
  drawPixelRect(0, 0, canvas.width, 52, C.uiBg);

  ctx.fillStyle = '#aaa';
  ctx.font = 'bold 11px monospace';
  ctx.fillText(rooms[game.currentRoom].name, 8, 13);

  const timeMin = Math.floor(game.time / 60);
  const timeSec = Math.floor(game.time % 60);
  const timeColor = game.time < 60 ? '#ff4444' : game.time < 120 ? '#ffaa44' : '#ffdd44';
  ctx.fillStyle = timeColor;
  ctx.font = 'bold 12px monospace';
  ctx.fillText(`TIME ${timeMin}:${timeSec.toString().padStart(2, '0')}`, canvas.width - 110, 13);
  const timeRatio = game.time / game.maxTime;
  drawPixelRect(canvas.width - 112, 17, 104, 6, '#333');
  drawPixelRect(canvas.width - 110, 18, 100 * timeRatio, 4, timeColor);

  ctx.fillStyle = '#aaa'; ctx.font = '9px monospace';
  ctx.fillText('SNEAK', 8, 28);
  const stamRatio = player.stamina / player.maxStamina;
  drawPixelRect(48, 21, 82, 8, '#333');
  drawPixelRect(49, 22, 80 * stamRatio, 6, stamRatio > 0.3 ? C.stamina : C.staminaLow);

  const workRatio = game.workMeter / game.maxWork;
  const workColor = workRatio >= (game.workThreshold / game.maxWork) ? '#4a9a4a' : C.workMeter;
  ctx.fillStyle = '#aaa';
  ctx.fillText('WORK', 140, 28);
  drawPixelRect(174, 21, 82, 8, '#333');
  drawPixelRect(175, 22, 80 * workRatio, 6, workColor);
  const threshX = 175 + 80 * (game.workThreshold / game.maxWork);
  drawPixelRect(threshX - 1, 19, 2, 12, '#ffd700');

  if (game.currentRoom === 'office') {
    ctx.fillStyle = game.officeDoorUnlocked ? '#4a4' : '#a66';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(game.officeDoorUnlocked ? 'DOOR OPEN' : 'DOOR LOCKED', 140, 13);
  }

  const toiletRatio = game.toiletMeter / game.maxToilet;
  const toiletColor = toiletRatio > 0.7 ? C.toiletMeterHigh : C.toiletMeter;
  ctx.fillStyle = '#aaa';
  ctx.fillText('TOILET', 266, 28);
  drawPixelRect(306, 21, 82, 8, '#333');
  drawPixelRect(307, 22, 80 * toiletRatio, 6, toiletColor);
  if (toiletRatio > 0.8 && game.frameCount % 30 < 15) {
    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('URGENT!!', 266, 13);
  }

  if (game.saltAmmo > 0) {
    ctx.fillStyle = '#eee';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`SALT: ${game.saltAmmo}/${game.saltMax} [SPACE]`, 8, 42);
  }

  drawPixelRect(canvas.width / 2 - 60, canvas.height - 44, 120, 40, C.uiBg);
  ctx.strokeStyle = C.uiBorder;
  ctx.strokeRect(canvas.width / 2 - 60, canvas.height - 44, 120, 40);
  for (let i = 0; i < 2; i++) {
    const slotX = canvas.width / 2 - 54 + i * 58, slotY = canvas.height - 40;
    drawPixelRect(slotX, slotY, 50, 32, '#2a2a2a');
    ctx.strokeStyle = '#555';
    ctx.strokeRect(slotX, slotY, 50, 32);
    ctx.fillStyle = '#666'; ctx.font = '9px monospace';
    ctx.fillText(`[${i + 1}]`, slotX + 2, slotY + 10);
    if (player.inventory[i]) {
      ctx.fillStyle = '#ffd700'; ctx.font = 'bold 9px monospace';
      const sn = player.inventory[i].name;
      ctx.fillText(sn.length > 8 ? sn.substring(0, 7) + '.' : sn, slotX + 2, slotY + 24);
    }
  }

  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '9px monospace';
  ctx.fillText('WASD:Move  SHIFT:Sneak  E:Interact  1/2:Use Item  SPACE:Salt', 8, canvas.height - 6);

  // Free roam quest tracker
  if (game.mode === 'freeroam') {
    // Gold display
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 11px monospace';
    ctx.fillText('Work Points: ' + game.gold, canvas.width - 150, 20);

    // Active quest
    if (game.activeQuest && !game.activeQuest.completed) {
      const q = game.activeQuest;
      drawPixelRect(canvas.width - 220, 30, 210, 40, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = '#ffd700'; ctx.font = 'bold 9px monospace';
      ctx.fillText('QUEST: ' + q.name, canvas.width - 214, 44);
      ctx.fillStyle = '#ccc'; ctx.font = '9px monospace';
      ctx.fillText('Find: ' + q.itemNeeded.replace(/_/g, ' '), canvas.width - 214, 58);
    }

    // Quest completion count
    const done = game.quests.filter(q => q.completed).length;
    ctx.fillStyle = '#aaa'; ctx.font = '9px monospace';
    ctx.fillText('Quests: ' + done + '/' + game.quests.length, canvas.width - 150, canvas.height - 10);
  }
}

// --- FRIDGE MENU ---
function drawFridgeMenu() {
  drawPixelRect(canvas.width/2 - 150, 100, 300, 300, 'rgba(0,0,0,0.92)');
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.strokeRect(canvas.width/2 - 150, 100, 300, 300);
  ctx.lineWidth = 1;

  ctx.textAlign = 'center';
  ctx.fillStyle = C.fridgeLight;
  ctx.font = 'bold 18px monospace';
  ctx.fillText('FRIDGE', canvas.width/2, 130);

  ctx.fillStyle = '#888';
  ctx.font = '11px monospace';
  ctx.fillText('W/S to browse, E to take, ESC to close', canvas.width/2, 150);

  const items = game.fridgeItems;
  for (let i = 0; i < items.length; i++) {
    const info = FRIDGE_ITEM_INFO[items[i]];
    const yPos = 180 + i * 60;
    const selected = i === game.fridgeMenuIndex;

    if (selected) {
      drawPixelRect(canvas.width/2 - 130, yPos - 10, 260, 50, 'rgba(255,215,0,0.15)');
      ctx.strokeStyle = '#ffd700';
      ctx.strokeRect(canvas.width/2 - 130, yPos - 10, 260, 50);
    }

    ctx.fillStyle = selected ? '#ffd700' : '#aaa';
    ctx.font = selected ? 'bold 14px monospace' : '13px monospace';
    ctx.fillText(info.name, canvas.width/2, yPos + 8);

    ctx.fillStyle = selected ? '#ccc' : '#666';
    ctx.font = '10px monospace';
    ctx.fillText(info.desc, canvas.width/2, yPos + 24);
  }

  ctx.textAlign = 'left';
}

// --- NPC MENU RENDERING ---
function drawNpcMenu() {
  const menuW = 320, menuH = 60 + game.npcMenuOptions.length * 55;
  const menuX = canvas.width/2 - menuW/2, menuY = canvas.height/2 - menuH/2;

  drawPixelRect(menuX, menuY, menuW, menuH, 'rgba(0,0,0,0.92)');
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.strokeRect(menuX, menuY, menuW, menuH);
  ctx.lineWidth = 1;

  ctx.textAlign = 'center';
  const npcName = game.npcMenuTarget ? game.npcMenuTarget.name : 'NPC';
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(npcName, canvas.width/2, menuY + 25);

  ctx.fillStyle = '#888';
  ctx.font = '10px monospace';
  ctx.fillText('W/S to browse, E to select, ESC to close', canvas.width/2, menuY + 42);

  for (let i = 0; i < game.npcMenuOptions.length; i++) {
    const opt = game.npcMenuOptions[i];
    const yPos = menuY + 55 + i * 55;
    const selected = i === game.npcMenuIndex;

    if (selected) {
      drawPixelRect(menuX + 10, yPos - 5, menuW - 20, 48, 'rgba(255,215,0,0.15)');
      ctx.strokeStyle = '#ffd700';
      ctx.strokeRect(menuX + 10, yPos - 5, menuW - 20, 48);
    }

    ctx.fillStyle = selected ? '#ffd700' : '#aaa';
    ctx.font = selected ? 'bold 14px monospace' : '13px monospace';
    ctx.fillText(opt.label, canvas.width/2, yPos + 14);

    ctx.fillStyle = selected ? '#ccc' : '#666';
    ctx.font = '10px monospace';
    ctx.fillText(opt.desc, canvas.width/2, yPos + 30);
  }

  ctx.textAlign = 'left';
}

// --- VENDOR MENU ---
function drawVendorMenu() {
  const mx = 100, my = 80, mw = canvas.width - 200, mh = 380;
  drawPixelRect(mx, my, mw, mh, 'rgba(0, 0, 0, 0.92)');
  ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2;
  ctx.strokeRect(mx, my, mw, mh);
  ctx.lineWidth = 1;

  ctx.fillStyle = '#ffd700'; ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText("KUNAL'S SHOP", canvas.width / 2, my + 24);
  ctx.fillStyle = '#aaa'; ctx.font = '11px monospace';
  ctx.fillText('Work Points: ' + game.gold, canvas.width / 2, my + 42);
  ctx.textAlign = 'left';

  const items = game.vendorItems;
  for (let i = 0; i < items.length; i++) {
    const iy = my + 60 + i * 44;
    const selected = i === game.vendorMenuIndex;
    if (selected) {
      drawPixelRect(mx + 10, iy - 4, mw - 20, 40, 'rgba(255, 215, 0, 0.12)');
      ctx.strokeStyle = '#ffd700';
      ctx.strokeRect(mx + 10, iy - 4, mw - 20, 40);
    }
    const canAfford = game.gold >= items[i].cost;
    ctx.fillStyle = selected ? '#fff' : '#aaa'; ctx.font = 'bold 13px monospace';
    ctx.fillText((selected ? '> ' : '  ') + items[i].name, mx + 20, iy + 12);
    ctx.fillStyle = canAfford ? '#4a9a4a' : '#aa4444'; ctx.font = '11px monospace';
    ctx.fillText('Cost: ' + items[i].cost + ' pts', mx + 240, iy + 12);
    ctx.fillStyle = '#888'; ctx.font = '10px monospace';
    ctx.fillText(items[i].desc, mx + 20, iy + 28);
  }

  ctx.fillStyle = '#666'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
  ctx.fillText('[W/S] Browse  |  [E/Enter] Buy  |  [ESC] Close', canvas.width / 2, my + mh - 12);
  ctx.textAlign = 'left';
}

// --- DIALOGUE ---
function drawDialogue() {
  if (!game.currentDialogue) return;
  const boxH = 100, boxY = canvas.height - boxH - 50;
  drawPixelRect(20, boxY, canvas.width - 40, boxH, 'rgba(0,0,0,0.9)');
  ctx.strokeStyle = '#666'; ctx.lineWidth = 2;
  ctx.strokeRect(20, boxY, canvas.width - 40, boxH);
  ctx.lineWidth = 1;

  ctx.fillStyle = '#eee'; ctx.font = '13px monospace';
  const maxWidth = canvas.width - 80;
  const words = game.currentDialogue.split(' ');
  let line = '', lineY = boxY + 25;
  for (const word of words) {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth) {
      ctx.fillText(line, 40, lineY); line = word + ' '; lineY += 18;
    } else line = testLine;
  }
  ctx.fillText(line, 40, lineY);

  if (game.frameCount % 40 < 25) {
    ctx.fillStyle = '#aaa'; ctx.font = '10px monospace';
    ctx.fillText('Press [E] or [SPACE] to continue...', 40, boxY + boxH - 12);
  }
}

// --- PAUSE MENU ---
function drawPauseMenu() {
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const mw = 300, mh = 180;
  const mx = (canvas.width - mw) / 2, my = (canvas.height - mh) / 2;
  drawPixelRect(mx, my, mw, mh, 'rgba(30,30,40,0.95)');
  ctx.strokeStyle = '#888'; ctx.lineWidth = 2;
  ctx.strokeRect(mx, my, mw, mh);
  ctx.lineWidth = 1;
  ctx.fillStyle = '#ffdd44'; ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', canvas.width / 2, my + 35);
  const options = ['Resume', 'Back to Menu'];
  for (let i = 0; i < options.length; i++) {
    const oy = my + 70 + i * 40;
    const selected = i === game.pauseMenuIndex;
    if (selected) {
      drawPixelRect(mx + 30, oy - 14, mw - 60, 30, 'rgba(255,221,68,0.15)');
      ctx.fillStyle = '#ffdd44';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('> ' + options[i] + ' <', canvas.width / 2, oy + 5);
    } else {
      ctx.fillStyle = '#aaa';
      ctx.font = '14px monospace';
      ctx.fillText(options[i], canvas.width / 2, oy + 5);
    }
  }
  ctx.fillStyle = '#666'; ctx.font = '10px monospace';
  ctx.fillText('[W/S] Select  |  [Enter] Confirm  |  [ESC] Resume', canvas.width / 2, my + mh - 15);
  ctx.textAlign = 'left';
}
