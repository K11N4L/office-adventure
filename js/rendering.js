function drawPixelRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

function drawTile(tileType, px, py) {
  const x = px * T, y = py * T;
  switch(tileType) {
    case TILE_FLOOR:
      drawPixelRect(x, y, T, T, (px + py) % 2 === 0 ? C.floor : C.floorAlt);
      break;
    case TILE_WALL:
      drawPixelRect(x, y, T, T, C.wallDark);
      drawPixelRect(x, y, T, T - 4, C.wall);
      drawPixelRect(x + 2, y + 2, T - 4, 4, C.wallTop);
      break;
    case TILE_DESK:
      drawPixelRect(x, y, T, T, (px + py) % 2 === 0 ? C.floor : C.floorAlt);
      drawPixelRect(x + 2, y + 4, T - 4, T - 8, C.desk);
      drawPixelRect(x + 4, y + 6, T - 8, T - 12, C.deskTop);
      break;
    case TILE_CHAIR:
      drawPixelRect(x, y, T, T, (px + py) % 2 === 0 ? C.floor : C.floorAlt);
      drawPixelRect(x + 10, y + 8, T - 20, T - 12, C.chair);
      drawPixelRect(x + 12, y + 10, T - 24, T - 16, C.chairSeat);
      drawPixelRect(x + 8, y + T - 8, 4, 4, '#444');
      drawPixelRect(x + T - 12, y + T - 8, 4, 4, '#444');
      break;
    case TILE_DOOR:
      drawPixelRect(x, y, T, T, (px + py) % 2 === 0 ? C.floor : C.floorAlt);
      drawPixelRect(x + 4, y, T - 8, T, C.doorFrame);
      drawPixelRect(x + 6, y + 2, T - 12, T - 4, C.door);
      drawPixelRect(x + T - 14, y + T/2 - 2, 4, 6, '#888');
      if (Math.sin(game.frameCount * 0.05) > 0) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
        ctx.fillRect(x, y, T, T);
      }
      break;
    case TILE_DOOR_LOCKED:
      drawPixelRect(x, y, T, T, (px + py) % 2 === 0 ? C.floor : C.floorAlt);
      drawPixelRect(x + 4, y, T - 8, T, C.doorFrame);
      if (game.officeDoorUnlocked) {
        drawPixelRect(x + 6, y + 2, T - 12, T - 4, C.door);
        if (Math.sin(game.frameCount * 0.05) > 0) {
          ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
          ctx.fillRect(x, y, T, T);
        }
      } else {
        drawPixelRect(x + 6, y + 2, T - 12, T - 4, C.doorLocked);
        drawPixelRect(x + T/2 - 4, y + T/2 - 6, 8, 10, '#666');
        drawPixelRect(x + T/2 - 2, y + T/2 - 4, 4, 6, '#444');
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + T/2, y + T/2 - 6, 5, Math.PI, 0);
        ctx.stroke();
        ctx.lineWidth = 1;
      }
      drawPixelRect(x + T - 14, y + T/2 - 2, 4, 6, '#888');
      break;
    case TILE_MONITOR:
      drawPixelRect(x, y, T, T, (px + py) % 2 === 0 ? C.floor : C.floorAlt);
      drawPixelRect(x + 10, y + 6, T - 20, T - 18, C.monitor);
      const screenColor = Math.sin(game.frameCount * 0.03 + px) > 0 ? C.monitorScreen : C.monitorScreenOff;
      drawPixelRect(x + 12, y + 8, T - 24, T - 24, screenColor);
      drawPixelRect(x + T/2 - 3, y + T - 12, 6, 8, '#444');
      break;
    case TILE_FRIDGE:
      drawPixelRect(x, y, T, T, C.fridge);
      drawPixelRect(x + 2, y + 2, T - 4, T/2 - 2, C.fridgeLight);
      drawPixelRect(x + 2, y + T/2 + 2, T - 4, T/2 - 4, C.fridgeLight);
      drawPixelRect(x + T - 8, y + 8, 3, T - 16, C.fridgeHandle);
      const fridgeDist = Math.hypot(player.x - x, player.y - y);
      if (fridgeDist < T * 2 && game.state === 'playing' && game.currentRoom === 'office') {
        const pulse = Math.sin(game.frameCount * 0.1) * 0.15 + 0.15;
        ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`;
        ctx.fillRect(x, y, T, T);
      }
      break;
    case TILE_CORR_FLOOR:
      drawPixelRect(x, y, T, T, '#9a8a7a');
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.strokeRect(x + 1, y + 1, T - 2, T - 2);
      break;
    case TILE_TOILET:
      drawPixelRect(x, y, T, T, '#e8e0d0');
      drawPixelRect(x + 8, y + 4, T - 16, T - 8, '#fff');
      drawPixelRect(x + 10, y + 6, T - 20, T - 14, '#e0e8ff');
      drawPixelRect(x + 10, y + 2, T - 20, 6, '#eee');
      const glow = Math.sin(game.frameCount * 0.08) * 0.15 + 0.15;
      ctx.fillStyle = `rgba(255, 255, 100, ${glow})`;
      ctx.fillRect(x, y, T, T);
      break;
    case TILE_SINK:
      drawPixelRect(x, y, T, T, '#e8e0d0');
      drawPixelRect(x + 6, y + 6, T - 12, T - 12, '#ccc');
      drawPixelRect(x + 10, y + 10, T - 20, T - 20, '#aacaee');
      drawPixelRect(x + T/2 - 2, y + 4, 4, 8, '#999');
      break;
    case TILE_CARPET:
      drawPixelRect(x, y, T, T, '#e8e0d0');
      break;
    case TILE_PLANT:
      drawPixelRect(x, y, T, T, '#9a8a7a');
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.strokeRect(x + 1, y + 1, T - 2, T - 2);
      drawPixelRect(x + 12, y + T - 16, T - 24, 14, '#8a5a2a');
      drawPixelRect(x + 8, y + 6, T - 16, T - 22, '#2a8a2a');
      drawPixelRect(x + 14, y + 2, T - 28, 8, '#3a9a3a');
      break;
    case TILE_WATER_COOLER:
      drawPixelRect(x, y, T, T, '#9a8a7a');
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.strokeRect(x + 1, y + 1, T - 2, T - 2);
      drawPixelRect(x + 12, y + 10, T - 24, T - 14, '#ccc');
      drawPixelRect(x + 14, y + 2, T - 28, 12, '#aaddff');
      drawPixelRect(x + 16, y + 0, T - 32, 4, '#99ccee');
      break;
    case TILE_COPIER:
      drawPixelRect(x, y, T, T, '#9a8a7a');
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.strokeRect(x + 1, y + 1, T - 2, T - 2);
      drawPixelRect(x + 4, y + 8, T - 8, T - 12, '#555');
      drawPixelRect(x + 6, y + 10, T - 12, 10, '#3a3a3a');
      drawPixelRect(x + 8, y + T - 8, T - 16, 6, '#eee');
      const copierBlink = game.frameCount % 120 < 10;
      drawPixelRect(x + T - 12, y + 12, 4, 4, copierBlink ? '#f44' : '#4a4');
      break;
    case TILE_SOFA:
      drawPixelRect(x, y, T, T, '#9a8a7a');
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.strokeRect(x + 1, y + 1, T - 2, T - 2);
      drawPixelRect(x + 2, y + 8, T - 4, T - 12, '#6a4a2a');
      drawPixelRect(x + 4, y + 10, T - 8, T - 18, '#8a6a3a');
      drawPixelRect(x + 2, y + 4, T - 4, 8, '#5a3a1a');
      drawPixelRect(x, y + 6, 4, T - 14, '#5a3a1a');
      drawPixelRect(x + T - 4, y + 6, 4, T - 14, '#5a3a1a');
      break;
    case TILE_EXIT_DOOR:
      drawPixelRect(x, y, T, T, '#9a8a7a');
      drawPixelRect(x + 4, y, T - 8, T, '#8b7300');
      drawPixelRect(x + 6, y + 2, T - 12, T - 4, '#aa3333');
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('EXIT', x + T/2, y + T/2 + 3);
      ctx.textAlign = 'left';
      drawPixelRect(x + T - 14, y + T/2 - 2, 4, 6, '#888');
      if (Math.sin(game.frameCount * 0.08) > 0) {
        ctx.fillStyle = 'rgba(255, 60, 60, 0.12)';
        ctx.fillRect(x, y, T, T);
      }
      break;
    case TILE_WET_FLOOR:
      drawPixelRect(x, y, T, T, '#e8e0d0');
      // Yellow warning triangle
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.moveTo(x + T/2, y + 2);
      ctx.lineTo(x + T - 2, y + T - 2);
      ctx.lineTo(x + 2, y + T - 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#cc9900';
      ctx.lineWidth = 1;
      ctx.stroke();
      break;
  }
}

function drawRoom() {
  const room = rooms[game.currentRoom];
  for (let py = 0; py < ROWS; py++)
    for (let px = 0; px < COLS; px++)
      if (room.grid[py] && room.grid[py][px] !== undefined)
        drawTile(room.grid[py][px], px, py);

  // Draw occupied cubicle markers
  if (game.currentRoom === 'toiletArea' && room.winTiles && game.occupiedCubicle >= 0) {
    const wt = room.winTiles[game.occupiedCubicle];
    const x = wt.x * T, y = wt.y * T;
    ctx.fillStyle = '#cc3333';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('OCCUPIED', x + T/2, y + T - 4);
    ctx.textAlign = 'left';
  }
}



function drawPlayer() {
