// --- GAME STATE ---
const game = {
  state: 'title',
  currentRoom: 'office',
  level: 1,
  levelSelectIndex: 0, // 0 = Level 1, 1 = Level 2, 2 = Free Roam
  time: 600,
  maxTime: 600,
  workMeter: 0,
  maxWork: 300,
  workThreshold: 60,
  workFillRate: 5,
  workDecayRate: 0.8, // work meter decays per second when not working
  // Work mini-game
  workQuestion: null, // { text, answer, options, selectedIndex, timer, maxTimer, answered, correct }
  toiletMeter: 0,
  maxToilet: 100,
  toiletRiseRate: 0.28,
  officeDoorUnlocked: false,
  frameCount: 0,
  dialogueQueue: [],
  currentDialogue: null,
  dialogueChoices: null, // {prompt, choices, choiceIndex}
  gameOverReason: '',
  titleBlink: 0,
  saltAmmo: 0,
  saltMax: 10,
  saltProjectiles: [],
  fridgeItems: ['salt', 'beer', 'energy_drink'],
  fridgeMenuIndex: 0,
  energyDrinkWorkTimer: 0,
  energyDrinkToiletTimer: 0,
  npcMenuOptions: [],
  npcMenuIndex: 0,
  npcMenuTarget: null,
  // Speech bubble quips
  speechBubbles: [], // {text, x, y, timer, color}
  quipTimer: 0,
  // Stealth & distractions
  paperBalls: [], // {x, y, dx, dy, timer}
  // Random events
  randomEventTimer: 30,
  currentEvent: null, // {type, timer, data}
  // Email popups
  emailNotifications: [], // {text, timer}
  emailTimer: 20,
  // Delivery driver
  deliveryDriverMoved: false,
  // Occupied cubicle
  occupiedCubicle: -1, // index of occupied winTile, -1 = none
  // Free roam mode
  mode: 'normal', // 'normal' or 'freeroam'
  quests: [], // [{id, name, description, itemNeeded, giver, completed, reward, rewardDesc}]
  activeQuest: null,
  questLog: [],
  gold: 0, // work progress currency for vendor
  // Vendor
  vendorItems: [],
  vendorMenuIndex: 0,
  pauseMenuIndex: 0,
  questLogIndex: 0,
  // Room transitions
  roomTransition: null, // {toRoom, toX, toY, timer, maxTime, phase}
};

// --- RANDOM QUIPS ---
const QUIPS = {
  brayden: [
    "I'm touching cloth...", "This is an EMERGENCY!", "Why is every toilet so far?!",
    "I should NOT have had that curry...", "Clench... CLENCH!!", "If I don't make it...",
    "My kingdom for a toilet!", "Prairie dogging it!", "Not now, not here...",
    "Sweet mother of bowels...", "I can feel it moving...", "Hold it together Brayden!",
    "Why did I eat that kebab?!", "This is code brown!", "Turtle heading...",
  ],
  andrew: {
    close: ["PUB!!!", "I CAN SMELL YOU!", "ONE PINT WON'T HURT!"],
    medium: ["Puuuub?", "Fancy a pint?", "Just one drink?"],
    far: ["...pub...", "...thirsty...", "*shuffles toward you*"],
  },
  kunal: [
    "You look rough mate", "Is that sweat?!", "Bro why you walking like that?",
    "You alright? You've gone pale", "Mate you're clenching", "Your face is green bro",
    "Are you... waddling?", "Bro just go outside", "You smell weird",
  ],
  lax: [
    "Chill bro", "Want some food?", "You're walking funny", "Bro relax",
    "Take a breather", "Have a sandwich", "Why the rush?", "Bro sit down",
    "You need fibre in your diet", "Is that a sweat patch?",
  ],
};

// --- PLAYER ---
const player = {
  x: 0, y: 0,
  w: T * 0.6, h: T * 0.85,
  speed: 1.0, sneakSpeed: 0.5,
  facing: 'down',
  sneaking: false,
  stamina: 100, maxStamina: 100,
  staminaDrain: 15, staminaRegen: 8,
  inventory: [null, null],
  walking: false,
  canInteract: null,
  _coffeeBoost: 0,
  _headphoneTimer: 0,
  isHiding: false,
  imodiumTimer: 0,
  vx: 0, vy: 0,
};

// --- INPUT ---
const keys = {};
const justPressed = {};
window.addEventListener('keydown', e => {
  if (!keys[e.code]) justPressed[e.code] = true;
  keys[e.key.toLowerCase()] = true;
  keys[e.code] = true;

  // Snapshot the state so that a state change mid-handler doesn't cascade
  const st = game.state;

  if (st === 'title') {
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      game.levelSelectIndex = (game.levelSelectIndex - 1 + 3) % 3;
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      game.levelSelectIndex = (game.levelSelectIndex + 1) % 3;
    } else if (e.code === 'Space' || e.code === 'Enter') {
      if (game.levelSelectIndex === 2) {
        game.level = 3;
      } else {
        game.level = game.levelSelectIndex + 1;
      }
      startGame();
    }
  } else if (st === 'playing') {
    if (e.code === 'Escape') {
      game.state = 'paused';
      game.pauseMenuIndex = 0;
    }
    if (e.code === 'KeyE') tryInteract();
    if (e.code === 'Digit1') useItem(0);
    if (e.code === 'Digit2') useItem(1);
    if (e.code === 'Digit3') useItem(2);
    if (e.code === 'Digit4') useItem(3);
    if (e.code === 'Space' && game.saltAmmo > 0) fireSalt();
    if (e.code === 'KeyH') toggleHiding();
    if (e.code === 'KeyQ') throwPaperBall();
  } else if (st === 'paused') {
    if (e.code === 'Escape') {
      game.state = 'playing';
    }
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      game.pauseMenuIndex = (game.pauseMenuIndex - 1 + 3) % 3;
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      game.pauseMenuIndex = (game.pauseMenuIndex + 1) % 3;
    }
    if (e.code === 'Enter' || e.code === 'Space') {
      if (game.pauseMenuIndex === 0) {
        game.state = 'playing';
      } else if (game.pauseMenuIndex === 1) {
        game.state = 'questLog';
        game.questLogIndex = 0;
      } else {
        resetGame();
      }
    }
  } else if (st === 'workScreen') {
    if (game.workQuestion && !game.workQuestion.answered) {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        game.workQuestion.selectedIndex = (game.workQuestion.selectedIndex - 1 + 4) % 4;
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        game.workQuestion.selectedIndex = (game.workQuestion.selectedIndex + 1) % 4;
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        game.workQuestion.selectedIndex = (game.workQuestion.selectedIndex - 1 + 4) % 4;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        game.workQuestion.selectedIndex = (game.workQuestion.selectedIndex + 1) % 4;
      }
      if (e.code === 'Enter' || e.code === 'KeyE' || e.code === 'Space') {
        answerWorkQuestion();
      }
      if (e.code === 'Escape') {
        game.workQuestion = null;
        game.state = 'playing';
      }
    }
  } else if (st === 'questLog') {
    if (e.code === 'Escape') {
      game.state = 'paused';
    }
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      game.questLogIndex = Math.max(0, game.questLogIndex - 1);
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      game.questLogIndex = Math.min(game.quests.length - 1, game.questLogIndex + 1);
    }
  } else if (st === 'dialogueChoice') {
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      game.dialogueChoices.choiceIndex = (game.dialogueChoices.choiceIndex - 1 + game.dialogueChoices.choices.length) % game.dialogueChoices.choices.length;
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      game.dialogueChoices.choiceIndex = (game.dialogueChoices.choiceIndex + 1) % game.dialogueChoices.choices.length;
    }
    if (e.code === 'Enter' || e.code === 'KeyE') {
      selectDialogueChoice();
    }
  } else if (st === 'interact' && (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE')) {
    advanceDialogue();
  } else if (st === 'fridgeMenu') {
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      game.fridgeMenuIndex = (game.fridgeMenuIndex - 1 + game.fridgeItems.length) % game.fridgeItems.length;
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      game.fridgeMenuIndex = (game.fridgeMenuIndex + 1) % game.fridgeItems.length;
    }
    if (e.code === 'Enter' || e.code === 'KeyE') {
      pickFromFridge();
    }
    if (e.code === 'Escape') {
      game.state = 'playing';
    }
  } else if (st === 'npcMenu') {
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      game.npcMenuIndex = (game.npcMenuIndex - 1 + game.npcMenuOptions.length) % game.npcMenuOptions.length;
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      game.npcMenuIndex = (game.npcMenuIndex + 1) % game.npcMenuOptions.length;
    }
    if (e.code === 'Enter' || e.code === 'KeyE') {
      handleNpcMenuSelect();
    }
    if (e.code === 'Escape') {
      game.state = 'playing';
    }
  } else if (st === 'vendorMenu') {
    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      game.vendorMenuIndex = (game.vendorMenuIndex - 1 + game.vendorItems.length) % game.vendorItems.length;
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      game.vendorMenuIndex = (game.vendorMenuIndex + 1) % game.vendorItems.length;
    }
    if (e.code === 'Enter' || e.code === 'KeyE') {
      handleVendorBuy();
    }
    if (e.code === 'Escape') {
      game.state = 'playing';
    }
  } else if ((st === 'pub' || st === 'win') && (e.code === 'Space' || e.code === 'Enter')) {
    resetGame();
  }
  e.preventDefault();
});
window.addEventListener('keyup', e => {
  keys[e.key.toLowerCase()] = false;
  keys[e.code] = false;
});

// --- FRIDGE ITEM DEFINITIONS ---
const FRIDGE_ITEM_INFO = {
  salt: { name: 'Table Salt', desc: 'Ranged weapon - 10 shots (SPACE to fire, 3 hits kills)', color: '#eee' },
  beer: { name: 'Beer', desc: 'WARNING: You WILL end up at the pub', color: '#daa520' },
  energy_drink: { name: 'Energy Drink', desc: 'Work faster (10s) + toilet fills faster (15s)', color: '#2a8a2a' },
};
