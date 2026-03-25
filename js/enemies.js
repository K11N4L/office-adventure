function drawEnemy(enemy) {
  if (enemy.dead) return;
  const x = enemy.x, y = enemy.y, w = T * 0.7, h = T * 0.8;
  ctx.strokeStyle = 'rgba(255, 50, 50, 0.1)';
  ctx.beginPath();
  ctx.arc(x + w/2, y + h/2, enemy.range, 0, Math.PI * 2);
  ctx.stroke();

  if (enemy.distracted) {
    ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
    ctx.font = '14px monospace';
    ctx.fillText('?', x + w/2 - 3, y - 8);
  }

  if (enemy.hp < enemy.maxHp) {
    const hpRatio = enemy.hp / enemy.maxHp;
    drawPixelRect(x, y - 6, w, 4, '#333');
    drawPixelRect(x + 1, y - 5, (w - 2) * hpRatio, 2, hpRatio > 0.5 ? '#4a4' : '#a44');
  }

  const bob = Math.sin(game.frameCount * 0.08 + enemy.x * 0.1) * 2;

  if (enemy.type === 'zombie') {
    const skinCol = '#d8c8b0', hairCol = '#6a5a3a', shirtCol = '#7a7a8a', trouserCol = '#4a4a4a';
    drawPixelRect(x + 3, y + h - 4 + bob, 8, 5, '#3a2a1a');
    drawPixelRect(x + w - 11, y + h - 4 + bob, 8, 5, '#3a2a1a');
    drawPixelRect(x + 4, y + h - 13 + bob, 7, 11, trouserCol);
    drawPixelRect(x + w - 11, y + h - 13 + bob, 7, 11, trouserCol);
    drawPixelRect(x + 2, y + 10 + bob, w - 4, h - 25, shirtCol);
    drawPixelRect(x + 4, y + h - 15 + bob, 5, 3, '#8a8a9a');
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
  } else {
    let col = enemy.type === 'hr' ? '#6a2a6a' : enemy.type === 'chatty' ? '#3a6a3a' : '#3a3a6a';
    drawPixelRect(x + 4, y + h - 10 + bob, 6, 10, '#3a3a4a');
    drawPixelRect(x + w - 10, y + h - 10 + bob, 6, 10, '#3a3a4a');
    drawPixelRect(x + 2, y + 10 + bob, w - 4, h - 22, col);
    drawPixelRect(x + 4, y + bob, w - 8, 14, '#f0c8a0');
    drawPixelRect(x + 4, y + bob, w - 8, 5, '#5a3a1a');
    drawPixelRect(x + 7, y + 6 + bob, 3, 3, '#222');
    drawPixelRect(x + w - 10, y + 6 + bob, 3, 3, '#222');
  }

  ctx.fillStyle = 'rgba(180, 40, 40, 0.8)';
  ctx.font = 'bold 9px monospace';
  const nw = ctx.measureText(enemy.name).width;
  ctx.fillText(enemy.name, x + w/2 - nw/2, y - 8);
}

