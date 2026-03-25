let lastTime = 0;
function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;
  game.frameCount++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const k in justPressed) delete justPressed[k];
  switch (game.state) {
    case 'title':
      drawTitle();
      break;
    case 'paused':
    case 'playing':
    case 'interact':
    case 'fridgeMenu':
    case 'npcMenu':
    case 'vendorMenu':
      if (game.state === 'playing') {
        updatePlayer(dt);
        updateEnemies(dt);
        updateNpcMovement(dt);
        updateSaltProjectiles(dt);
        updatePaperBalls(dt);
        updateTimers(dt);
        updateQuips(dt);
        updateRandomEvents(dt);
        updateEmailNotifications(dt);
      }
      drawRoom();
      const room = rooms[game.currentRoom];
      if (room.items) room.items.forEach(drawItem);
      if (room.enemies) room.enemies.forEach(drawEnemy);
      if (room.npcs) room.npcs.forEach(drawNPC);
      drawSaltProjectiles();
      drawPaperBalls();
      drawPlayer();
      drawUI();
      drawEffects();
      drawInteractionHints();
      drawSpeechBubbles();
      drawEventOverlay();
      drawEmailNotifications();
      if (game.isWorking) drawWorkOverlay();
      if (game.state === 'interact') drawDialogue();
      if (game.state === 'fridgeMenu') drawFridgeMenu();
      if (game.state === 'npcMenu') drawNpcMenu();
      if (game.state === 'vendorMenu') drawVendorMenu();
      if (game.state === 'paused') drawPauseMenu();
      break;
    case 'pub':
      drawPubScreen();
      break;
    case 'win':
      drawWinScreen();
      break;
  }
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
