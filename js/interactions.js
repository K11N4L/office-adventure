function tryInteract() {
  if (!player.canInteract) return;
  const { type, data } = player.canInteract;

  if (type === 'fridge') {
    game.state = 'fridgeMenu';
    game.fridgeMenuIndex = 0;
    return;
  }

  if (type === 'computer') {
    // Don't open dialogue — holding E handles working directly in updatePlayer
    return;
  }

  if (type === 'lockedDoor') {
    game.state = 'interact';
    game.dialogueQueue = [];
    const pct = Math.floor(game.workMeter);
    game.currentDialogue = `The door is LOCKED! You need to do more work first. (${pct}/${game.workThreshold}%) Hold [E] near a computer to work.`;
    return;
  }

  if (type === 'door') {
    if (data.toRoom === 'pub_exit') {
      game.state = 'pub';
      game.gameOverReason = "You walked right out the building! Fresh air hit you and you thought... why not the pub? Your mates would be proud.";
      return;
    }
    game.currentRoom = data.toRoom;
    player.x = data.toX * T; player.y = data.toY * T;
    player.canInteract = null;
    // Set occupied cubicle when entering toiletArea (Level 2 only - one cubicle is occupied)
    if (data.toRoom === 'toiletArea') {
      if (game.level === 2) {
        const wt = rooms.toiletArea.winTiles;
        game.occupiedCubicle = Math.floor(Math.random() * wt.length);
      } else {
        game.occupiedCubicle = -1; // Level 1: all cubicles are available
      }
    }
    return;
  }

  if (type === 'npc') {
    if (data.interactType === 'kunal_menu') {
      game.state = 'npcMenu';
      game.npcMenuTarget = data;
      game.npcMenuIndex = 0;
      game.npcMenuOptions = [
        { label: 'Talk', desc: 'Have a chat (you two always end up arguing...)', action: 'kunal_talk' },
        { label: 'Go to the Pub', desc: 'Sod it, let\'s go to the pub', action: 'pub' },
      ];
      return;
    }
    if (data.interactType === 'lax_menu') {
      game.state = 'npcMenu';
      game.npcMenuTarget = data;
      game.npcMenuIndex = 0;
      game.npcMenuOptions = [
        { label: 'Talk', desc: 'Chat (Kunal always joins in...)', action: 'lax_talk' },
        { label: 'Tell Them to Work', desc: 'Maybe Lax has some advice...', action: 'lax_work' },
        { label: 'Go to the Pub', desc: 'Forget work, pub time', action: 'pub' },
      ];
      return;
    }
    if (data.interactType === 'kunal_lobby') {
      game.state = 'interact';
      game.dialogueQueue = ["Kunal: *snoring*... zzz..."];
      game.currentDialogue = game.dialogueQueue.shift();
      return;
    }
    if (data.interactType === 'lax_lobby') {
      game.state = 'interact';
      game.dialogueQueue = [
        "Lax: *holding sandwich* You want some?",
        "Brayden: I really don't have time-",
        "Lax: Just eat. You look pale.",
      ];
      game.currentDialogue = game.dialogueQueue.shift();
      return;
    }
    if (data.interactType === 'kunal_hall' || data.interactType === 'lax_hall') {
      game.state = 'pub';
      game.gameOverReason = `${data.name} convinced you to leave through the exit. "The pub's just round the corner!" And off you went...`;
      return;
    }
    if (data.interactType === 'delivery_driver') {
      game.deliveryDriverMoved = true;
      game.state = 'interact';
      game.dialogueQueue = [...data.dialogue];
      game.currentDialogue = game.dialogueQueue.shift();
      return;
    }
    if (data.interactType === 'boss_patrol') {
      game.state = 'pub';
      game.gameOverReason = "The boss caught you! 'My office. NOW.' ...off to the pub to drown your sorrows.";
      return;
    }
    if (data.interactType === 'karen_block') {
      if (!data.interacted) {
        data.interacted = true;
        game.time -= 30;
        game.state = 'interact';
        game.dialogueQueue = [...data.dialogue];
        game.currentDialogue = game.dialogueQueue.shift();
      }
      return;
    }
    if (data.interactType === 'greg_story') {
      if (!data.storyActive) {
        data.storyActive = true;
        game.time -= 30;
        game.state = 'interact';
        game.dialogueQueue = [...data.dialogue];
        game.currentDialogue = game.dialogueQueue.shift();
      }
      return;
    }
    game.state = 'interact';
    game.dialogueQueue = [...data.dialogue];
    game.currentDialogue = game.dialogueQueue.shift();
    return;
  }

  if (type === 'item') {
    const emptySlot = player.inventory.indexOf(null);
    if (emptySlot !== -1) {
      player.inventory[emptySlot] = { ...data };
      data.collected = true;
      player.canInteract = null;
    } else {
      game.state = 'interact';
      game.dialogueQueue = [];
      game.currentDialogue = "Your pockets are full! You can only carry 2 items. Use one first with [1] or [2].";
    }
    return;
  }
}

function pickFromFridge() {
  if (game.fridgeItems.length === 0) return;
  const itemType = game.fridgeItems[game.fridgeMenuIndex];

  if (itemType === 'salt') {
    game.saltAmmo = game.saltMax;
    game.fridgeItems.splice(game.fridgeMenuIndex, 1);
    game.state = 'interact';
    game.dialogueQueue = [];
    game.currentDialogue = "You grabbed the salt! 10 shots loaded. Press [SPACE] to fire in the direction you're facing. 3 hits to defeat Andrew!";
  } else if (itemType === 'beer') {
    game.fridgeItems.splice(game.fridgeMenuIndex, 1);
    game.state = 'pub';
    game.gameOverReason = "You drank a beer from the office fridge. One turned into two... two into five... and now you're at the pub. Classic.";
  } else if (itemType === 'energy_drink') {
    game.energyDrinkWorkTimer = 10;
    game.energyDrinkToiletTimer = 15;
    game.fridgeItems.splice(game.fridgeMenuIndex, 1);
    game.state = 'interact';
    game.dialogueQueue = [];
    game.currentDialogue = "You chugged the energy drink! Work speed BOOSTED for 10 seconds! But watch out... your toilet meter will fill faster for 15 seconds!";
  }

  if (game.fridgeMenuIndex >= game.fridgeItems.length) {
    game.fridgeMenuIndex = Math.max(0, game.fridgeItems.length - 1);
  }
}

function advanceDialogue() {
  if (game.dialogueQueue.length > 0) {
    game.currentDialogue = game.dialogueQueue.shift();
  } else {
    game.currentDialogue = null;
    game.state = 'playing';
  }
}

function handleNpcMenuSelect() {
  if (game.npcMenuOptions.length === 0) return;
  const option = game.npcMenuOptions[game.npcMenuIndex];

  if (option.action === 'pub') {
    game.state = 'pub';
    game.gameOverReason = "You and your mates decided work can wait. Off to the pub! Cheers!";
    return;
  }

  if (option.action === 'kunal_talk') {
    game.workMeter = 0;
    game.officeDoorUnlocked = false;
    game.time = Math.max(0, game.time - 60);
    game.state = 'interact';
    game.dialogueQueue = [
      "Kunal: Bro, I'm telling you, tabs are better than spaces!",
      "Brayden: Are you INSANE? Spaces are the standard!",
      "Kunal: Standard?! Your code looks like a ransom note!",
      "Brayden: At least I don't push to main on a Friday!",
      "Kunal: That was ONE time! And the server survived... mostly.",
      "*You've been arguing for a while... Work meter dropped to 0 and you lost 1 minute!*",
    ];
    game.currentDialogue = game.dialogueQueue.shift();
    return;
  }

  if (option.action === 'lax_talk') {
    game.workMeter = 0;
    game.officeDoorUnlocked = false;
    game.time = Math.max(0, game.time - 120);
    game.state = 'interact';
    game.dialogueQueue = [
      "Lax: *takes off one headphone* What's good?",
      "Brayden: Just trying to get some work done...",
      "Kunal: *walks over* Oh, we're having a meeting? Nice.",
      "Lax: So anyway, did you see that new show on Netflix?",
      "Kunal: Bro yes! The one with the time travel?",
      "Brayden: Guys... I really need to work...",
      "Lax: Relax man, the deadline's not for... *checks phone* ...oh.",
      "Kunal: Yeah we should probably let him work.",
      "*The three of you chatted for way too long... Work meter dropped to 0 and you lost 2 minutes!*",
    ];
    game.currentDialogue = game.dialogueQueue.shift();
    return;
  }

  if (option.action === 'lax_work') {
    game.workMeter = Math.max(0, game.workMeter * 0.5);
    if (game.workMeter < game.workThreshold) game.officeDoorUnlocked = false;
    game.state = 'interact';
    game.dialogueQueue = [
      "Brayden: Lax, come on mate, we need to actually do some work.",
      "Lax: *slowly puts headphones down* ...Work?",
      "Lax: Bro, you're the one who came to talk to ME.",
      "Lax: If you wanna work, go sit at your desk instead of chatting.",
      "Lax: Actually... you should work LESS. You look stressed.",
      "*Lax's 'advice' has demotivated you. Work meter dropped by 50%!*",
    ];
    game.currentDialogue = game.dialogueQueue.shift();
    return;
  }
}

function useItem(slot) {
  const item = player.inventory[slot];
  if (!item) return;
  const itemType = item.itemType || item.type;
  switch (itemType) {
    case 'coffee': player._coffeeBoost = 8; break;
    case 'headphones': player._headphoneTimer = 6; break;
    case 'imodium': player.imodiumTimer = 20; break;
    case 'air_freshener': throwPaperBall(); break;
    case 'energy_drink':
      game.toiletMeter = Math.max(0, game.toiletMeter - 30);
      break;
  }
  player.inventory[slot] = null;
}
