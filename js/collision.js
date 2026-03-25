function isSolid(tileType) {
  return [TILE_WALL, TILE_DESK, TILE_FRIDGE, TILE_KITCHEN, TILE_MONITOR, TILE_SINK, TILE_COPIER, TILE_SOFA, TILE_PLANT, TILE_WATER_COOLER, TILE_WET_FLOOR].includes(tileType)
    || (tileType === TILE_DOOR_LOCKED && !game.officeDoorUnlocked);
}

function getTile(room, px, py) {
  const gx = Math.floor(px / T), gy = Math.floor(py / T);
  if (gy < 0 || gy >= ROWS || gx < 0 || gx >= COLS) return TILE_WALL;
  return room.grid[gy][gx];
}

function canMoveTo(nx, ny, w, h) {
  const room = rooms[game.currentRoom];
  const margin = 4;
  const points = [
    { x: nx + margin, y: ny + margin },
    { x: nx + w - margin, y: ny + margin },
    { x: nx + margin, y: ny + h - margin },
    { x: nx + w - margin, y: ny + h - margin },
  ];
  for (const p of points) {
    if (isSolid(getTile(room, p.x, p.y))) return false;
  }
  return true;
}
