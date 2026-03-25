function drawPlayer() {
  const px = player.x, py = player.y, w = player.w, h = player.h;

  if (player.isHiding) {
    ctx.globalAlpha = 0.3;
    // Draw smaller crouching version
    drawPixelRect(px + 4, py + 15, player.w - 8, player.h - 15, C.playerShirt);
    drawPixelRect(px + 6, py + 12, player.w - 12, 8, C.playerSkin);
    drawPixelRect(px + 5, py + 10, player.w - 10, 5, C.playerHair);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(100, 200, 255, 0.7)'; ctx.font = 'bold 10px monospace';
    ctx.fillText('HIDING', px - 2, py + 6);
    return;
  }

  ctx.fillStyle = C.shadow;
  ctx.beginPath();
  ctx.ellipse(px + w/2, py + h, w/2, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = player.sneaking ? 0.7 : 1;
  const bob = player.walking ? Math.sin(game.frameCount * 0.3) * 2 : 0;
  const sneakCrouch = player.sneaking ? 6 : 0;
  const bY = py + bob + sneakCrouch;

  const shoeY = py + h - 4;
  if (player.walking) {
    const legAnim = Math.sin(game.frameCount * 0.3) * 3;
    drawPixelRect(px + 3, shoeY, 7, 4, C.playerShoes);
    drawPixelRect(px + w - 10, shoeY + legAnim * 0.5, 7, 4, C.playerShoes);
  } else {
    drawPixelRect(px + 3, shoeY, 7, 4, C.playerShoes);
    drawPixelRect(px + w - 10, shoeY, 7, 4, C.playerShoes);
  }

  const trouserTop = bY + 22;
  const trouserH = h - 26 - sneakCrouch;
  if (player.walking) {
    const legAnim = Math.sin(game.frameCount * 0.3) * 3;
    drawPixelRect(px + 3, trouserTop, 7, trouserH, C.playerTrousers);
    drawPixelRect(px + w - 10, trouserTop + legAnim * 0.3, 7, trouserH, C.playerTrousers);
  } else {
    drawPixelRect(px + 3, trouserTop, 7, trouserH, C.playerTrousers);
    drawPixelRect(px + w - 10, trouserTop, 7, trouserH, C.playerTrousers);
  }

  drawPixelRect(px + 2, trouserTop - 1, w - 4, 3, '#6a5a3a');
  drawPixelRect(px + w/2 - 2, trouserTop - 1, 4, 3, '#8a7a4a');

  drawPixelRect(px + 2, bY + 10, w - 4, 13, C.playerShirt);
  drawPixelRect(px + 4, bY + 10, 4, 3, '#d0e8f8');
  drawPixelRect(px + w - 8, bY + 10, 4, 3, '#d0e8f8');

  drawPixelRect(px + w/2 - 2, bY + 12, 3, 10, C.playerTie);
  drawPixelRect(px + w/2 - 3, bY + 21, 5, 3, C.playerTie);

  drawPixelRect(px + 4, bY, w - 8, 14, C.playerSkin);

  drawPixelRect(px + 2, bY - 4, w - 4, 8, C.playerHair);
  drawPixelRect(px + 3, bY - 6, w - 6, 5, C.playerHair);
  drawPixelRect(px + 1, bY - 2, 4, 6, C.playerHair);
  drawPixelRect(px + w - 5, bY - 2, 4, 6, C.playerHair);
  drawPixelRect(px + 5, bY - 5, 6, 3, '#e0c460');

  const eyeY = bY + 7;
  if (player.facing === 'left') {
    drawPixelRect(px + 5, eyeY, 3, 3, '#4a2a0a');
  } else if (player.facing === 'right') {
    drawPixelRect(px + w - 8, eyeY, 3, 3, '#4a2a0a');
  } else if (player.facing !== 'up') {
    drawPixelRect(px + 7, eyeY, 3, 2, '#4a2a0a');
    drawPixelRect(px + w - 10, eyeY, 3, 2, '#4a2a0a');
    drawPixelRect(px + 8, eyeY + 4, 6, 1, '#c87a5a');
  }

  drawPixelRect(px, bY + 12, 3, 10 - sneakCrouch/2, C.playerShirt);
  drawPixelRect(px + w - 3, bY + 12, 3, 10 - sneakCrouch/2, C.playerShirt);
  drawPixelRect(px, bY + 21 - sneakCrouch/2, 3, 3, C.playerSkin);
  drawPixelRect(px + w - 3, bY + 21 - sneakCrouch/2, 3, 3, C.playerSkin);

  if (player.facing === 'down' || player.facing === 'left') {
    drawPixelRect(px - 2, bY + 20 - sneakCrouch/2, 5, 5, '#fff');
    drawPixelRect(px - 1, bY + 21 - sneakCrouch/2, 3, 3, '#eee');
  }

  if (player.sneaking) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px monospace';
    ctx.fillText('shh', px + w/2 - 8, bY - 10);
  }

  ctx.fillStyle = 'rgba(255,215,0,0.7)';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BRAYDEN', px + w/2, bY - 8);
  ctx.textAlign = 'left';

  if (game.isWorking) {
    ctx.fillStyle = 'rgba(100, 200, 255, 0.6)';
    ctx.font = 'bold 10px monospace';
    const dots = '.'.repeat((Math.floor(game.frameCount / 15) % 3) + 1);
    ctx.fillText('Working' + dots, px - 8, bY - 14);
  }

  ctx.globalAlpha = 1;
}

// --- NPC RENDERING ---


