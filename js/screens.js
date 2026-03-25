function drawTitleCharacter(cx, cy, who, scale) {
  const s = scale || 1.8;
  const pr = (x, y, w, h, c) => drawPixelRect(cx + x * s, cy + y * s, w * s, h * s, c);
  if (who === 'brayden') {
    // Shoes
    pr(3, 38, 7, 4, C.playerShoes); pr(18, 38, 7, 4, C.playerShoes);
    // Trousers
    pr(3, 26, 7, 13, C.playerTrousers); pr(18, 26, 7, 13, C.playerTrousers);
    // Belt
    pr(2, 25, 24, 3, '#6a5a3a'); pr(12, 25, 4, 3, '#8a7a4a');
    // Shirt
    pr(2, 12, 24, 14, C.playerShirt);
    pr(4, 12, 4, 3, '#d0e8f8'); pr(20, 12, 4, 3, '#d0e8f8');
    // Tie
    pr(12, 14, 3, 10, C.playerTie); pr(11, 23, 5, 3, C.playerTie);
    // Head
    pr(5, 2, 18, 14, C.playerSkin);
    // Hair
    pr(3, -3, 22, 8, C.playerHair); pr(4, -5, 20, 5, C.playerHair);
    pr(2, 0, 4, 6, C.playerHair); pr(22, -1, 4, 6, C.playerHair);
    pr(6, -4, 8, 3, '#e0c460');
    // Eyes
    pr(8, 8, 3, 3, '#4a2a0a'); pr(17, 8, 3, 3, '#4a2a0a');
    // Mouth (grimacing)
    pr(10, 13, 8, 2, '#c87a5a');
    pr(10, 14, 2, 1, '#fff'); pr(13, 14, 2, 1, '#fff'); pr(16, 14, 2, 1, '#fff');
    // Arms
    pr(0, 14, 3, 10, C.playerShirt); pr(25, 14, 3, 10, C.playerShirt);
    pr(0, 23, 3, 3, C.playerSkin); pr(25, 23, 3, 3, C.playerSkin);
    // Toilet roll in hand
    pr(-3, 22, 5, 5, '#fff'); pr(-2, 23, 3, 3, '#eee'); pr(-1, 24, 1, 1, '#ccc');
  } else if (who === 'kunal') {
    const skin = '#b08860', hair = '#2a2a2a', hoodie = '#3a8a3a', hoodieDk = '#2a6a2a';
    pr(3, 38, 8, 5, '#eee'); pr(17, 38, 8, 5, '#eee');
    pr(4, 28, 7, 11, '#3a3a3a'); pr(17, 28, 7, 11, '#3a3a3a');
    pr(1, 12, 26, 18, hoodie);
    pr(9, 22, 10, 5, hoodieDk);
    pr(10, 13, 2, 6, '#ddd'); pr(16, 13, 2, 6, '#ddd');
    pr(3, 0, 22, 3, hoodieDk);
    pr(5, 2, 18, 14, skin);
    pr(5, 0, 18, 5, hair);
    pr(8, 8, 3, 3, '#1a1a1a'); pr(17, 8, 3, 3, '#1a1a1a');
    pr(10, 12, 6, 2, '#8a6040');
  } else if (who === 'lax') {
    const skin = '#7a5a3a', hair = '#2a1a0a', hoodie = '#3a3a3a', hoodieDk = '#2a2a2a';
    pr(3, 38, 8, 5, '#eee'); pr(17, 38, 8, 5, '#eee');
    pr(4, 27, 7, 12, '#8aaabb'); pr(17, 27, 7, 12, '#8aaabb');
    pr(2, 12, 24, 17, hoodie);
    pr(10, 12, 8, 4, '#ddd');
    pr(13, 15, 2, 12, '#555');
    pr(5, 2, 18, 14, skin);
    pr(5, 0, 18, 5, hair); pr(6, -2, 16, 3, hair);
    pr(6, 12, 16, 4, '#2a1a0a'); // beard
    pr(8, 8, 3, 2, '#111'); pr(17, 8, 3, 2, '#111');
    // Headphones
    pr(3, -1, 22, 3, '#555');
    pr(2, 2, 5, 8, '#444'); pr(21, 2, 5, 8, '#444');
    pr(3, 3, 3, 6, '#333'); pr(22, 3, 3, 6, '#333');
  } else if (who === 'andrew') {
    const skin = '#d8c8b0', hair = '#6a5a3a', shirt = '#7a7a8a';
    pr(3, 38, 8, 5, '#3a2a1a'); pr(17, 38, 8, 5, '#3a2a1a');
    pr(4, 27, 7, 12, '#4a4a4a'); pr(17, 27, 7, 12, '#4a4a4a');
    pr(2, 12, 24, 17, shirt);
    pr(5, 2, 18, 14, skin);
    pr(4, -2, 20, 6, hair);
    pr(3, 0, 4, 4, hair); pr(21, -1, 4, 5, hair);
    // Zombie eyes
    pr(7, 7, 4, 4, '#fff'); pr(17, 7, 4, 4, '#fff');
    pr(8, 8, 2, 2, '#222'); pr(18, 8, 2, 2, '#222');
    pr(7, 11, 4, 2, '#b0a090'); pr(17, 11, 4, 2, '#b0a090');
    // Mouth
    pr(10, 13, 6, 2, '#8a6a5a');
    // Arms out zombie-style
    pr(-4, 14, 6, 4, shirt); pr(26, 14, 6, 4, shirt);
    pr(-6, 14, 3, 3, skin); pr(30, 14, 3, 3, skin);
    // Speech bubble
    pr(27, -8, 22, 10, '#fff');
    ctx.fillStyle = '#333'; ctx.font = `bold ${8 * s}px monospace`;
    ctx.fillText('Pub?', cx + 28 * s, cy - 1 * s);
  }
}

function drawTitleDesk(x, y, s) {
  // Desk surface
  drawPixelRect(x, y, 40 * s, 20 * s, '#8a7050');
  drawPixelRect(x + 1 * s, y + 1 * s, 38 * s, 2 * s, '#a08860');
  // Legs
  drawPixelRect(x + 2 * s, y + 18 * s, 3 * s, 10 * s, '#6a5a40');
  drawPixelRect(x + 35 * s, y + 18 * s, 3 * s, 10 * s, '#6a5a40');
  // Monitor
  drawPixelRect(x + 12 * s, y - 18 * s, 18 * s, 14 * s, '#333');
  drawPixelRect(x + 13 * s, y - 17 * s, 16 * s, 11 * s, '#4488aa');
  // Screen glow / text lines
  drawPixelRect(x + 15 * s, y - 14 * s, 10 * s, 1 * s, '#66aacc');
  drawPixelRect(x + 15 * s, y - 11 * s, 8 * s, 1 * s, '#66aacc');
  drawPixelRect(x + 15 * s, y - 8 * s, 12 * s, 1 * s, '#66aacc');
  // Monitor stand
  drawPixelRect(x + 18 * s, y - 4 * s, 6 * s, 5 * s, '#444');
  drawPixelRect(x + 15 * s, y, 12 * s, 2 * s, '#555');
  // Keyboard
  drawPixelRect(x + 10 * s, y + 4 * s, 14 * s, 5 * s, '#ddd');
  drawPixelRect(x + 11 * s, y + 5 * s, 12 * s, 3 * s, '#ccc');
  // Mouse
  drawPixelRect(x + 28 * s, y + 5 * s, 4 * s, 6 * s, '#eee');
  // Coffee mug
  drawPixelRect(x + 2 * s, y + 2 * s, 6 * s, 7 * s, '#ddd');
  drawPixelRect(x + 3 * s, y + 3 * s, 4 * s, 4 * s, '#6a3a1a');
  drawPixelRect(x + 7 * s, y + 4 * s, 2 * s, 3 * s, '#ddd');
}

function drawTitlePapers(x, y, s) {
  // Scattered papers
  drawPixelRect(x, y, 10 * s, 13 * s, '#f0ead8');
  drawPixelRect(x + 1 * s, y + 2 * s, 7 * s, 1 * s, '#bbb');
  drawPixelRect(x + 1 * s, y + 4 * s, 6 * s, 1 * s, '#bbb');
  drawPixelRect(x + 1 * s, y + 6 * s, 8 * s, 1 * s, '#bbb');
  // Second sheet slightly rotated
  drawPixelRect(x + 4 * s, y + 3 * s, 10 * s, 13 * s, '#e8e2d0');
  drawPixelRect(x + 5 * s, y + 5 * s, 7 * s, 1 * s, '#aaa');
  drawPixelRect(x + 5 * s, y + 7 * s, 5 * s, 1 * s, '#aaa');
  drawPixelRect(x + 5 * s, y + 9 * s, 8 * s, 1 * s, '#aaa');
}

function drawTitleFridge(x, y, s) {
  drawPixelRect(x, y, 16 * s, 30 * s, '#d0d8e0');
  drawPixelRect(x + 1 * s, y + 1 * s, 14 * s, 16 * s, '#bcc4cc');
  drawPixelRect(x + 1 * s, y + 18 * s, 14 * s, 11 * s, '#b0b8c0');
  drawPixelRect(x + 12 * s, y + 5 * s, 2 * s, 8 * s, '#999');
  drawPixelRect(x + 12 * s, y + 20 * s, 2 * s, 6 * s, '#999');
  // Magnets
  drawPixelRect(x + 3 * s, y + 3 * s, 3 * s, 3 * s, '#e44');
  drawPixelRect(x + 7 * s, y + 6 * s, 3 * s, 3 * s, '#44e');
  drawPixelRect(x + 4 * s, y + 10 * s, 3 * s, 3 * s, '#4a4');
}

function drawTitleToilet(x, y, s) {
  // Glow
  ctx.shadowColor = '#d8c0f0';
  ctx.shadowBlur = 16 + Math.sin(game.frameCount * 0.04) * 6;
  // Tank
  drawPixelRect(x + 6 * s, y, 16 * s, 8 * s, '#e8e0f8');
  ctx.shadowBlur = 0;
  drawPixelRect(x + 8 * s, y + 2 * s, 12 * s, 4 * s, '#d0c0e8');
  // Flush handle
  drawPixelRect(x + 20 * s, y + 2 * s, 4 * s, 2 * s, '#ccc');
  // Seat
  drawPixelRect(x + 4 * s, y + 8 * s, 20 * s, 3 * s, '#f0eaf8');
  // Bowl
  drawPixelRect(x + 2 * s, y + 8 * s, 24 * s, 16 * s, '#e8e0f8');
  drawPixelRect(x + 4 * s, y + 10 * s, 20 * s, 12 * s, '#d0c0e8');
  drawPixelRect(x + 7 * s, y + 12 * s, 14 * s, 6 * s, '#b0a0d0');
  // Water
  drawPixelRect(x + 9 * s, y + 13 * s, 10 * s, 3 * s, 'rgba(100, 150, 220, 0.35)');
  // Base
  drawPixelRect(x + 4 * s, y + 22 * s, 20 * s, 5 * s, '#dcd4ec');
  drawPixelRect(x + 6 * s, y + 25 * s, 16 * s, 4 * s, '#ccc4dc');
  // Sparkle
  if (Math.sin(game.frameCount * 0.08) > 0) {
    ctx.fillStyle = '#fff'; ctx.font = `${10 * s}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('*', x - 2 * s, y + 6 * s);
    ctx.fillText('*', x + 28 * s, y + 2 * s);
  }
  // Stink
  const so = Math.sin(game.frameCount * 0.06) * 3 * s;
  ctx.fillStyle = 'rgba(140, 200, 80, 0.3)'; ctx.font = `${10 * s}px monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('~', x + 6 * s, y - 4 * s + so);
  ctx.fillText('~', x + 16 * s, y - 8 * s + so * 0.6);
  ctx.fillText('~', x + 24 * s, y - 2 * s + so * 1.2);
}

function drawTitleChair(x, y, s) {
  // Seat
  drawPixelRect(x, y, 12 * s, 4 * s, '#3a5a8a');
  // Back
  drawPixelRect(x + 1 * s, y - 10 * s, 10 * s, 11 * s, '#3a5a8a');
  drawPixelRect(x + 2 * s, y - 9 * s, 8 * s, 8 * s, '#4a6a9a');
  // Legs
  drawPixelRect(x + 2 * s, y + 4 * s, 2 * s, 6 * s, '#666');
  drawPixelRect(x + 8 * s, y + 4 * s, 2 * s, 6 * s, '#666');
  // Wheels
  drawPixelRect(x, y + 9 * s, 3 * s, 2 * s, '#555');
  drawPixelRect(x + 9 * s, y + 9 * s, 3 * s, 2 * s, '#555');
}

function drawTitlePlant(x, y, s) {
  // Pot
  drawPixelRect(x + 2 * s, y + 8 * s, 8 * s, 8 * s, '#a06030');
  drawPixelRect(x + 1 * s, y + 7 * s, 10 * s, 3 * s, '#b07040');
  // Leaves
  drawPixelRect(x + 3 * s, y, 6 * s, 10 * s, '#3a8a3a');
  drawPixelRect(x, y + 2 * s, 4 * s, 6 * s, '#2a7a2a');
  drawPixelRect(x + 8 * s, y + 1 * s, 4 * s, 7 * s, '#4a9a3a');
  drawPixelRect(x + 4 * s, y - 3 * s, 4 * s, 5 * s, '#3a8a2a');
}

function drawTitleBraydenAnimated(bx, by, s, frame, facingLeft) {
  // Animated Brayden with clenching walk cycle
  const pr = (x, y, w, h, c) => drawPixelRect(bx + x * s, by + y * s, w * s, h * s, c);
  const legAnim = Math.sin(frame * 0.06) * 2.5;
  const bob = Math.abs(Math.sin(frame * 0.06)) * 1.2;
  const clench = Math.sin(frame * 0.25) * 1; // shudder/clench
  const bY = bob + clench;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(bx + 14 * s, by + 43 * s, 12 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shoes (animated)
  pr(3, 38 + legAnim * 0.3, 7, 4, C.playerShoes);
  pr(18, 38 - legAnim * 0.3, 7, 4, C.playerShoes);
  // Trousers (animated legs)
  pr(3, 26, 7, 12 + legAnim * 0.3, C.playerTrousers);
  pr(18, 26, 7, 12 - legAnim * 0.3, C.playerTrousers);
  // Belt
  pr(2, 25 + bY, 24, 3, '#6a5a3a'); pr(12, 25 + bY, 4, 3, '#8a7a4a');
  // Shirt
  pr(2, 12 + bY, 24, 14, C.playerShirt);
  pr(4, 12 + bY, 4, 3, '#d0e8f8'); pr(20, 12 + bY, 4, 3, '#d0e8f8');
  // Tie
  pr(12, 14 + bY, 3, 10, C.playerTie); pr(11, 23 + bY, 5, 3, C.playerTie);
  // Head
  pr(5, 2 + bY, 18, 14, C.playerSkin);
  // Hair
  pr(3, -3 + bY, 22, 8, C.playerHair); pr(4, -5 + bY, 20, 5, C.playerHair);
  pr(2, 0 + bY, 4, 6, C.playerHair); pr(22, -1 + bY, 4, 6, C.playerHair);
  pr(6, -4 + bY, 8, 3, '#e0c460');
  // Eyes — looking in walk direction, sweating
  if (facingLeft) {
    pr(6, 8 + bY, 3, 3, '#4a2a0a');
    pr(14, 8 + bY, 3, 3, '#4a2a0a');
  } else {
    pr(10, 8 + bY, 3, 3, '#4a2a0a');
    pr(19, 8 + bY, 3, 3, '#4a2a0a');
  }
  // Grimacing mouth — teeth gritted
  pr(9, 13 + bY, 10, 2, '#c87a5a');
  pr(10, 13 + bY, 2, 2, '#fff'); pr(13, 13 + bY, 2, 2, '#fff'); pr(16, 13 + bY, 2, 2, '#fff');
  // Sweat drops
  const sweatDrop = Math.sin(frame * 0.08) * 2;
  pr(24, 4 + bY + sweatDrop, 2, 3, '#88ccff');
  if (Math.sin(frame * 0.06) > 0.3) pr(0, 6 + bY + sweatDrop * 0.7, 2, 2, '#88ccff');
  // Arms — clenched fists at sides, tense
  pr(0, 14 + bY, 3, 10, C.playerShirt); pr(25, 14 + bY, 3, 10, C.playerShirt);
  pr(0, 23 + bY, 3, 3, C.playerSkin); pr(25, 23 + bY, 3, 3, C.playerSkin);
  // Toilet roll clutched in one hand
  if (facingLeft) {
    pr(-3, 21 + bY, 5, 5, '#fff'); pr(-2, 22 + bY, 3, 3, '#eee');
  } else {
    pr(26, 21 + bY, 5, 5, '#fff'); pr(27, 22 + bY, 3, 3, '#eee');
  }
}

function drawTitle() {

function drawTitle() {
  const W = canvas.width, H = canvas.height;
  const cx = W / 2;
  const floorY = H * 0.45;

  // ---- OFFICE WALL ----
  ctx.fillStyle = '#3a4468';
  ctx.fillRect(0, 0, W, floorY);
  ctx.strokeStyle = 'rgba(60, 70, 110, 0.25)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath(); ctx.moveTo(0, i * 15); ctx.lineTo(W, i * 15); ctx.stroke();
  }
  // Skirting board
  drawPixelRect(0, floorY - 5, W, 5, '#2a2a3a');

  // ---- OFFICE FLOOR ----
  ctx.fillStyle = '#4a506a';
  ctx.fillRect(0, floorY, W, H - floorY);
  ctx.strokeStyle = 'rgba(70, 76, 100, 0.4)';
  for (let r = 0; r < 12; r++) {
    const fy = floorY + r * 20;
    ctx.beginPath(); ctx.moveTo(0, fy); ctx.lineTo(W, fy); ctx.stroke();
  }
  for (let c = 0; c < 18; c++) {
    ctx.beginPath(); ctx.moveTo(c * 50, floorY); ctx.lineTo(c * 50, H); ctx.stroke();
  }

  // ---- OFFICE FURNITURE ----
  const fs = 2;

  // Back wall furniture (above floor line)
  // Left desk
  drawTitleDesk(10, floorY - 6, fs);
  drawTitlePapers(20, floorY + 4, fs * 0.7);
  // Right desk
  drawTitleDesk(W - 110, floorY - 6, fs);
  drawTitlePapers(W - 72, floorY + 2, fs * 0.7);
  // Fridge far left
  drawTitleFridge(8, floorY - 72, fs);
  // Plant far right
  drawTitlePlant(W - 40, floorY - 44, fs);
  // Second plant left
  drawTitlePlant(120, floorY - 36, fs * 0.8);

  // Water cooler right
  const wcx = W - 82, wcy = floorY - 55;
  drawPixelRect(wcx, wcy + 10 * fs, 8 * fs, 18 * fs, '#ccc');
  drawPixelRect(wcx - 1 * fs, wcy + 8 * fs, 10 * fs, 4 * fs, '#ddd');
  drawPixelRect(wcx + 1 * fs, wcy, 6 * fs, 10 * fs, 'rgba(100, 180, 220, 0.4)');

  // Chairs on floor
  drawTitleChair(50, floorY + 22, fs);
  drawTitleChair(W - 84, floorY + 22, fs);

  // Centre back — the glowing TOILET
  const toiletS = 2.6;
  const toiletX = cx - 14 * toiletS, toiletY = floorY - 28 * toiletS + 16;
  drawTitleToilet(toiletX, toiletY, toiletS);

  // Toilet roll on floor near toilet
  const trx = toiletX + 26 * toiletS, trY = toiletY + 20 * toiletS;
  drawPixelRect(trx, trY, 5 * toiletS, 5 * toiletS, '#fff');
  drawPixelRect(trx + toiletS, trY + toiletS, 3 * toiletS, 3 * toiletS, '#eee');
  // Paper trail
  drawPixelRect(trx + 4 * toiletS, trY + 2 * toiletS, 10 * toiletS, 2 * toiletS, '#f8f4e8');

  // ---- BRAYDEN PACING BACK AND FORTH ----
  // Brayden walks left and right across the floor, clenching
  const paceRange = 280; // total pixels of pacing
  const paceSpeed = 0.003;
  const paceCycle = (game.frameCount * paceSpeed) % 2; // 0->1 = right, 1->2 = left
  const facingLeft = paceCycle >= 1;
  const paceT = paceCycle < 1 ? paceCycle : 2 - paceCycle; // 0 to 1 and back
  const braydenX = cx - paceRange / 2 + paceT * paceRange;
  const braydenY = floorY + 50;
  const braydenS = 2.6;

  drawTitleBraydenAnimated(braydenX - 14 * braydenS, braydenY, braydenS, game.frameCount, facingLeft);

  // Thought bubble above Brayden (rotating clenching quips)
  const quips = [
    'Must... not... shit...',
    'Touching cloth!!',
    'CLENCH!!!',
    'Why is the toilet so far?!',
    'Prairie dogging...',
    'This is CODE BROWN!',
    'I need that cubicle NOW',
    'NOT. YET.',
  ];
  const qIdx = Math.floor(game.frameCount / 120) % quips.length;
  const bubX = braydenX, bubY = braydenY - 16;
  ctx.textAlign = 'center';
  // Thought dots
  drawPixelRect(bubX - 4, bubY + 4, 4, 4, '#fff');
  drawPixelRect(bubX - 10, bubY - 2, 6, 6, '#fff');
  // Bubble
  const quipText = quips[qIdx];
  ctx.font = 'bold 10px monospace';
  const tw = ctx.measureText(quipText).width;
  const bubW = tw + 16, bubH = 20;
  drawPixelRect(bubX - bubW / 2, bubY - bubH - 8, bubW, bubH, '#fff');
  ctx.strokeStyle = '#aaa'; ctx.lineWidth = 1;
  ctx.strokeRect(bubX - bubW / 2, bubY - bubH - 8, bubW, bubH);
  ctx.fillStyle = '#333';
  ctx.fillText(quipText, bubX, bubY - bubH + 5);

  // ---- TITLE PANEL (top, clean) ----
  drawPixelRect(cx - 250, 10, 500, 90, 'rgba(0, 0, 0, 0.75)');
  ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2;
  ctx.strokeRect(cx - 250, 10, 500, 90);
  ctx.lineWidth = 1;

  ctx.fillStyle = '#000'; ctx.font = 'bold 32px monospace';
  ctx.fillText("BRAYDEN'S TOILET", cx + 2, 44);
  ctx.fillText("ADVENTURE", cx + 2, 74);
  ctx.fillStyle = '#ffd700'; ctx.font = 'bold 32px monospace';
  ctx.fillText("BRAYDEN'S TOILET", cx, 42);
  ctx.fillText("ADVENTURE", cx, 72);
  ctx.fillStyle = '#cc3333'; ctx.font = 'bold 12px monospace';
  ctx.fillText("THE TOILET QUEST", cx, 92);

  // ---- BOTTOM INFO PANEL ----
  drawPixelRect(cx - 270, H - 148, 540, 138, 'rgba(0, 0, 0, 0.75)');
  ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
  ctx.strokeRect(cx - 270, H - 148, 540, 138);

  // ---- LEVEL SELECT ----
  const levels = [
    { name: 'LEVEL 1 - Quick Dash', desc: '3 rooms  |  Get to the toilet ASAP!' },
    { name: 'LEVEL 2 - The Gauntlet', desc: '5 rooms  |  Stealth, items & more chaos' },
    { name: 'FREE ROAM - Open World', desc: 'Explore, quests, pub visits & trade!' },
  ];
  const selY = H - 140;
  ctx.fillStyle = '#ddd'; ctx.font = 'bold 14px monospace';
  ctx.fillText('SELECT LEVEL', cx, selY + 12);

  for (let i = 0; i < levels.length; i++) {
    const ly = selY + 24 + i * 26;
    const selected = game.levelSelectIndex === i;
    if (selected) {
      drawPixelRect(cx - 200, ly - 10, 400, 24, 'rgba(255, 215, 0, 0.15)');
      ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 1;
      ctx.strokeRect(cx - 200, ly - 10, 400, 24);
      ctx.fillStyle = '#ffd700'; ctx.font = 'bold 13px monospace';
      ctx.fillText('> ' + levels[i].name + ' <', cx, ly + 4);
      ctx.fillStyle = '#ccc'; ctx.font = '10px monospace';
      ctx.fillText(levels[i].desc, cx, ly + 15);
    } else {
      ctx.fillStyle = '#888'; ctx.font = '13px monospace';
      ctx.fillText(levels[i].name, cx, ly + 4);
    }
  }

  ctx.fillStyle = '#999'; ctx.font = '10px monospace';
  ctx.fillText('WASD - Move  |  SHIFT - Sneak  |  E - Interact  |  SPACE - Throw Salt', cx, H - 50);
  ctx.fillText('Hold E near computer to work  |  1/2 - Use Items  |  H - Hide  |  Q - Paper Ball', cx, H - 36);

  // Flavour text
  const flavourTexts = [
    '"I should NOT have had that curry..." - Brayden',
    '"Pub?" - Andrew, every 3 seconds',
    '"You look rough mate" - Kunal',
    '"Chill bro, just hold it in" - Lax',
    'This is a CODE BROWN situation.',
    'Prairie dogging level: CRITICAL',
    'The toilet is SO close... yet so far.',
    'Andrew approaches... "Pub?"',
  ];
  const flavIdx = Math.floor(game.frameCount / 180) % flavourTexts.length;
  ctx.fillStyle = '#777'; ctx.font = 'italic 10px monospace';
  ctx.fillText(flavourTexts[flavIdx], cx, H - 20);

  // Blink prompt
  game.titleBlink += 0.05;
  if (Math.sin(game.titleBlink) > 0) {
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 14px monospace';
    ctx.fillText('W/S TO SELECT  |  ENTER TO START', cx, H - 4);
  }
  ctx.textAlign = 'left';
}

// --- PUB SCREEN ---
function drawPubScreen() {

function drawPubScreen() {
  // Warm pub background
  ctx.fillStyle = '#1a0e06';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Pub wall (warm wood tones)
  const wallGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.55);
  wallGrad.addColorStop(0, '#2a1a0a');
  wallGrad.addColorStop(1, '#3a2510');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.55);

  // Hanging pub sign
  drawPixelRect(canvas.width / 2 - 60, 16, 120, 36, '#5a3a1a');
  drawPixelRect(canvas.width / 2 - 58, 18, 116, 32, '#7a5a2a');
  ctx.fillStyle = '#ffd700'; ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center';
  ctx.fillText('THE SLIPPERY', canvas.width / 2, 34);
  ctx.fillText('TOILET SEAT', canvas.width / 2, 48);

  // Bar counter (thick wood)
  drawPixelRect(30, canvas.height * 0.52, canvas.width - 60, 28, '#5a3a1a');
  drawPixelRect(32, canvas.height * 0.52 + 2, canvas.width - 64, 10, '#8a6a3a');
  drawPixelRect(32, canvas.height * 0.52 + 14, canvas.width - 64, 4, '#7a5a2a');

  // Beer taps
  for (let i = 0; i < 3; i++) {
    const tapX = canvas.width / 2 - 60 + i * 60, tapY = canvas.height * 0.52 - 36;
    drawPixelRect(tapX, tapY, 6, 30, '#888');
    drawPixelRect(tapX - 4, tapY - 4, 14, 8, '#aaa');
    drawPixelRect(tapX - 2, tapY + 26, 10, 6, '#666');
  }

  // Beer glasses on counter (animated bubbles)
  for (let i = 0; i < 6; i++) {
    const gx = 80 + i * 100, gy = canvas.height * 0.52 - 26;
    drawPixelRect(gx, gy, 18, 26, 'rgba(200, 200, 255, 0.2)');
    drawPixelRect(gx + 2, gy + 6, 14, 18, '#daa520');
    drawPixelRect(gx + 2, gy + 2, 14, 6, '#fffde0');
    // Bubbles
    const bubOff = (game.frameCount * 0.5 + i * 7) % 14;
    ctx.fillStyle = 'rgba(255,255,200,0.3)';
    ctx.fillRect(gx + 6, gy + 20 - bubOff, 2, 2);
    ctx.fillRect(gx + 10, gy + 18 - bubOff * 0.7, 2, 2);
  }

  // Floor
  ctx.fillStyle = '#2a1a0a';
  ctx.fillRect(0, canvas.height * 0.55 + 28, canvas.width, canvas.height);

  // Characters at the bar!
  const charBarY = canvas.height * 0.52 - 62;
  drawTitleCharacter(canvas.width / 2 - 120, charBarY, 'brayden', 1.3);
  drawTitleCharacter(canvas.width / 2 - 30, charBarY, 'kunal', 1.3);
  drawTitleCharacter(canvas.width / 2 + 50, charBarY, 'lax', 1.3);
  drawTitleCharacter(canvas.width / 2 + 130, charBarY, 'andrew', 1.3);

  // Title
  ctx.fillStyle = '#000'; ctx.font = 'bold 32px monospace';
  ctx.fillText('YOU ENDED UP AT THE PUB!', canvas.width / 2 + 2, 82);
  ctx.fillStyle = '#ff4444'; ctx.font = 'bold 32px monospace';
  ctx.fillText('YOU ENDED UP AT THE PUB!', canvas.width / 2, 80);

  // Game over reason (word-wrapped)
  ctx.fillStyle = '#ffcc66'; ctx.font = '13px monospace';
  const words = game.gameOverReason.split(' ');
  let line = '', ly = 106;
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > canvas.width - 140) {
      ctx.fillText(line, canvas.width / 2, ly); line = word + ' '; ly += 18;
    } else line = test;
  }
  ctx.fillText(line, canvas.width / 2, ly);

  // Funny quips at bottom
  const pubQuips = [
    "Your bowels will remember this betrayal.",
    "The toilet weeps alone tonight.",
    "Andrew raises his glass: 'Told you so.'",
    "Your colon is filing a formal complaint.",
    "Somewhere, a toilet cubicle sits empty... waiting.",
    "Achievement Unlocked: Pint Over Porcelain",
    "Your arse: 'We had a DEAL, Brayden!'",
    "The curry from last night sends its regards.",
  ];
  const qIdx = Math.floor(game.frameCount / 150) % pubQuips.length;
  ctx.fillStyle = '#888'; ctx.font = 'italic 11px monospace';
  ctx.fillText(pubQuips[qIdx], canvas.width / 2, canvas.height - 70);

  // Stats
  const timeUsed = game.maxTime - game.time;
  const timeMin = Math.floor(timeUsed / 60);
  const timeSec = Math.floor(timeUsed % 60);
  ctx.fillStyle = '#666'; ctx.font = '10px monospace';
  ctx.fillText(`Survived: ${timeMin}:${timeSec.toString().padStart(2, '0')}  |  Toilet Desperation: ${Math.floor(game.toiletMeter)}%  |  Pints: Too many`, canvas.width / 2, canvas.height - 50);

  if (game.frameCount % 50 < 30) {
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 16px monospace';
    ctx.fillText('PRESS SPACE TO TRY AGAIN', canvas.width / 2, canvas.height - 24);
  }
  ctx.textAlign = 'left';
}

// --- WIN SCREEN ---
function drawWinScreen() {

function drawWinScreen() {
  // Heavenly bathroom glow
  ctx.fillStyle = '#060e1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Angelic light rays from the toilet
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + game.frameCount * 0.005;
    const rayLen = 180 + Math.sin(game.frameCount * 0.03 + i) * 30;
    ctx.save();
    ctx.translate(canvas.width / 2, 180);
    ctx.rotate(angle);
    ctx.fillStyle = `rgba(255, 215, 0, ${0.04 + Math.sin(game.frameCount * 0.05 + i) * 0.02})`;
    ctx.beginPath();
    ctx.moveTo(-8, 0); ctx.lineTo(-15, rayLen); ctx.lineTo(15, rayLen); ctx.lineTo(8, 0);
    ctx.fill();
    ctx.restore();
  }

  // Confetti!
  for (let i = 0; i < 40; i++) {
    const cx = (Math.sin(game.frameCount * 0.015 + i * 2.1) * 0.5 + 0.5) * canvas.width;
    const cy = (game.frameCount * 0.4 + i * 30) % (canvas.height + 20) - 10;
    const colors = ['#ffd700', '#ff6b6b', '#4a9a4a', '#4a7abc', '#ff69b4', '#ff8c00'];
    ctx.fillStyle = colors[i % colors.length];
    const size = 2 + (i % 3);
    ctx.fillRect(cx, cy, size, size);
  }

  // Glowing toilet (the holy grail)
  const toiletX = canvas.width / 2 - 24, toiletY = 135;
  // Glow
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = 20 + Math.sin(game.frameCount * 0.05) * 8;
  drawPixelRect(toiletX, toiletY, 48, 36, '#f0e8ff');
  ctx.shadowBlur = 0;
  drawPixelRect(toiletX + 4, toiletY + 4, 40, 22, '#d8c0f0');
  drawPixelRect(toiletX + 12, toiletY - 8, 24, 12, '#f0e8ff');
  drawPixelRect(toiletX + 16, toiletY - 6, 16, 8, '#d8c0f0');
  drawPixelRect(toiletX + 8, toiletY + 28, 32, 10, '#e8e0f0');
  // Sparkles
  const sparkle = Math.sin(game.frameCount * 0.1) > 0;
  if (sparkle) {
    ctx.fillStyle = '#fff'; ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('*', toiletX - 8, toiletY + 5);
    ctx.fillText('*', toiletX + 56, toiletY - 2);
    ctx.fillText('*', toiletX + 24, toiletY - 18);
  }

  // Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000'; ctx.font = 'bold 34px monospace';
  ctx.fillText('SWEET RELIEF!', canvas.width / 2 + 2, 52);
  ctx.fillStyle = '#4aff4a'; ctx.font = 'bold 34px monospace';
  ctx.fillText('SWEET RELIEF!', canvas.width / 2, 50);

  ctx.fillStyle = '#ffd700'; ctx.font = 'bold 16px monospace';
  ctx.fillText('MISSION ACCOMPLISHED', canvas.width / 2, 76);

  // Brayden sitting triumphant (on the toilet)
  drawTitleCharacter(canvas.width / 2 - 22, 195, 'brayden', 1.4);

  // Funny win messages
  ctx.fillStyle = '#ccc'; ctx.font = '13px monospace';
  ctx.fillText('Against all odds, Brayden made it to the cubicle!', canvas.width / 2, 290);
  ctx.fillText('The most heroic journey in office history is complete.', canvas.width / 2, 310);

  const winQuips = [
    '"The relief was... indescribable." - Brayden',
    'Andrew is still outside the door muttering "Pub?"',
    'Your colon thanks you for your service.',
    'This dump will go down in office legend.',
    'Kunal: "Is he... is he singing in there?"',
    'Lax: *puts headphones on* "That\'s nasty bro"',
    'HR has been notified. Worth it.',
    'Achievement Unlocked: The Porcelain Throne',
  ];
  const wIdx = Math.floor(game.frameCount / 150) % winQuips.length;
  ctx.fillStyle = '#888'; ctx.font = 'italic 11px monospace';
  ctx.fillText(winQuips[wIdx], canvas.width / 2, 342);

  // Stats
  const timeUsed = game.maxTime - game.time;
  const timeMin = Math.floor(timeUsed / 60);
  const timeSec = Math.floor(timeUsed % 60);
  ctx.fillStyle = '#ffd700'; ctx.font = 'bold 13px monospace';
  ctx.fillText(`Time: ${timeMin}:${timeSec.toString().padStart(2, '0')}  |  Desperation: ${Math.floor(game.toiletMeter)}%  |  Dignity: 0%`, canvas.width / 2, 390);

  // Rating
  const rating = game.toiletMeter > 90 ? 'PHOTO FINISH' : game.toiletMeter > 70 ? 'CLOSE CALL' : game.toiletMeter > 50 ? 'CUTTING IT FINE' : 'CASUAL STROLL';
  ctx.fillStyle = game.toiletMeter > 90 ? '#ff4444' : game.toiletMeter > 70 ? '#ffaa44' : game.toiletMeter > 50 ? '#ffff44' : '#44ff44';
  ctx.font = 'bold 14px monospace';
  ctx.fillText(`Rating: ${rating}`, canvas.width / 2, 414);

  if (game.frameCount % 50 < 30) {
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 16px monospace';
    ctx.fillText('PRESS SPACE TO PLAY AGAIN', canvas.width / 2, 468);
  }
  ctx.textAlign = 'left';
}



function drawEffects() {
