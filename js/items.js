function drawItem(item) {
  if (item.collected) return;
  const x = item.x, y = item.y;
  const floatY = Math.sin(game.frameCount * 0.06 + item.x) * 3;
  const glowAlpha = Math.sin(game.frameCount * 0.08) * 0.2 + 0.3;
  ctx.fillStyle = `rgba(255, 215, 0, ${glowAlpha})`;
  ctx.beginPath();
  ctx.arc(x + 12, y + 12 + floatY, 16, 0, Math.PI * 2);
  ctx.fill();
  const ix = x + 2, iy = y + 2 + floatY;

  if (item.type === 'headphones') {
    drawPixelRect(ix + 2, iy + 4, 16, 3, '#333');
    drawPixelRect(ix + 2, iy + 4, 4, 12, '#444');
    drawPixelRect(ix + 14, iy + 4, 4, 12, '#444');
  } else if (item.type === 'coffee') {
    drawPixelRect(ix + 4, iy + 2, 12, 16, '#8a5a2a');
    drawPixelRect(ix + 6, iy + 4, 8, 6, '#4a2a0a');
  }

  const dist = Math.hypot(player.x - item.x, player.y - item.y);
  if (dist < T * 1.5) {
    const pulse = Math.sin(game.frameCount * 0.1) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`;
    ctx.font = 'bold 10px monospace';
    ctx.fillText('[E] ' + item.name, x - 10, y - 8 + floatY);
  }
}

// --- SALT PROJECTILE RENDERING ---
function drawSaltProjectiles() {
  for (const p of game.saltProjectiles) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(p.x - p.dx * 3, p.y - p.dy * 3, 4, 4);
    ctx.fillStyle = '#fff';
    ctx.fillRect(p.x, p.y, 5, 5);
    ctx.fillStyle = '#ddd';
    ctx.fillRect(p.x + 1, p.y + 1, 3, 3);
  }
}

