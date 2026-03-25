const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const TILE = 16;
const SCALE = 3;
const T = TILE * SCALE;
const COLS = Math.floor(canvas.width / T);
const ROWS = Math.floor(canvas.height / T);

// --- COLORS ---
const C = {
  floor: '#c8b88a', floorAlt: '#bfae7f',
  wall: '#6b6b6b', wallTop: '#7a7a7a', wallDark: '#4a4a4a',
  door: '#d4a017', doorFrame: '#8b7300', doorLocked: '#8a4a3a',
  desk: '#6b3a1f', deskTop: '#8b5a2b',
  monitor: '#2a2a2a', monitorScreen: '#3a7a3a', monitorScreenOff: '#1a3a1a',
  chair: '#666', chairSeat: '#555',
  fridge: '#2a5a2a', fridgeLight: '#3a7a3a', fridgeHandle: '#888',
  player: '#b8d4e8', playerShirt: '#b8d4e8', playerTie: '#c8952a', playerTrousers: '#c8b878',
  playerSkin: '#f0c8a0', playerHair: '#d4b050', playerSneak: '#8aaabb',
  playerShoes: '#4a3a2a',
  shadow: 'rgba(0,0,0,0.15)',
  uiBg: 'rgba(0,0,0,0.8)', uiBorder: '#666',
  stamina: '#4a9a4a', staminaLow: '#9a4a4a',
  workMeter: '#4a6a9a', workMeterLow: '#9a4a2a',
  toiletMeter: '#9a6a2a', toiletMeterHigh: '#cc3333',
};

// --- TILE TYPES ---
const TILE_FLOOR = 0, TILE_WALL = 1, TILE_DESK = 2, TILE_CHAIR = 3;
const TILE_DOOR = 4, TILE_MONITOR = 5, TILE_FRIDGE = 6;
const TILE_CORR_FLOOR = 7, TILE_TOILET = 8, TILE_SINK = 9;
const TILE_KITCHEN = 10, TILE_CARPET = 11, TILE_DOOR_LOCKED = 12;
const TILE_PLANT = 13, TILE_WATER_COOLER = 14, TILE_COPIER = 15, TILE_SOFA = 16, TILE_EXIT_DOOR = 17;
const TILE_WET_FLOOR = 18;
