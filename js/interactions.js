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

    // Free roam quest givers
    if (data.interactType === 'karin_quest' || data.interactType === 'rebecca_quest') {
      const giverName = data.interactType === 'karin_quest' ? 'Karin' : 'Rebecca';
      // Check if player has a quest item to turn in
      const turnInQuest = game.quests.find(q => !q.completed && q.giver === giverName &&
        player.inventory.some(inv => inv && inv.itemType === q.itemNeeded));
      if (turnInQuest) {
        // Turn in quest
        const invIdx = player.inventory.findIndex(inv => inv && inv.itemType === turnInQuest.itemNeeded);
        player.inventory[invIdx] = null;
        turnInQuest.completed = true;
        game.gold += turnInQuest.reward;
        game.state = 'interact';
        game.dialogueQueue = [
          giverName + ": Oh perfect, you found it! Thank you so much!",
          "*Quest Complete: " + turnInQuest.name + "!*",
          "*Reward: +" + turnInQuest.reward + " Work Points! (Total: " + game.gold + ")*",
        ];
        game.currentDialogue = game.dialogueQueue.shift();
        return;
      }
      // Offer available quests
      const available = game.quests.filter(q => !q.completed && q.giver === giverName);
      if (available.length > 0) {
        game.state = 'npcMenu';
        game.npcMenuTarget = data;
        game.npcMenuIndex = 0;
        game.npcMenuOptions = available.map(q => ({
          label: q.name, desc: q.description + ' (' + q.rewardDesc + ')', action: 'accept_quest_' + q.id
        }));
        game.npcMenuOptions.push({ label: 'Never mind', desc: 'Leave', action: 'cancel' });
        return;
      } else {
        game.state = 'interact';
        game.dialogueQueue = [];
        game.currentDialogue = giverName + ": Thanks for all the help! I've got nothing else right now.";
        return;
      }
    }

    // Kunal vendor
    if (data.interactType === 'kunal_vendor') {
      game.state = 'vendorMenu';
      game.vendorMenuIndex = 0;
      game.vendorItems = [
        { name: 'Coffee', itemType: 'coffee', cost: 10, desc: 'Speed boost for 8 seconds' },
        { name: 'Energy Drink', itemType: 'energy_drink', cost: 15, desc: 'Reduce toilet meter by 30' },
        { name: 'Headphones', itemType: 'headphones', cost: 12, desc: 'Ignore phone rings for 6 seconds' },
        { name: 'Imodium', itemType: 'imodium', cost: 20, desc: 'Slow toilet urgency for 20 seconds' },
        { name: 'Paper Balls x5', itemType: 'paper_balls', cost: 8, desc: 'Distraction ammo' },
        { name: 'Air Freshener', itemType: 'air_freshener', cost: 10, desc: 'Enemy repellent' },
      ];
      return;
    }

    // Andrew in pub
    if (data.interactType === 'andrew_pub') {
      game.state = 'interact';
      game.dialogueQueue = ["Andrew: *holding 3 pints* PUB! This is the life!", "Andrew: Want one? Go on... just one pint...", "Brayden: I'm working Andrew! ...sort of."];
      game.currentDialogue = game.dialogueQueue.shift();
      return;
    }
    if (data.interactType === 'lax_pub') {
      game.state = 'interact';
      game.dialogueQueue = ["Lax: *nursing a beer* Bro... you made it.", "Lax: Pull up a stool. Relax.", "Brayden: I should probably get back to work...", "Lax: Work can wait. Life is short bro."];
      game.currentDialogue = game.dialogueQueue.shift();
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

function advanceDialogue() {
  if (game.dialogueQueue.length > 0) {
    game.currentDialogue = game.dialogueQueue.shift();
  } else {
    game.currentDialogue = null;
    game.state = 'playing';
  }
}

function handleNpcMenuSelect() {

function handleNpcMenuSelect() {
  if (game.npcMenuOptions.length === 0) return;
  const option = game.npcMenuOptions[game.npcMenuIndex];

  if (option.action === 'cancel') {
    game.state = 'playing';
    return;
  }

  if (option.action.startsWith('accept_quest_')) {
    const questId = option.action.replace('accept_quest_', '');
    const quest = game.quests.find(q => q.id === questId);
    if (quest) {
      game.activeQuest = quest;
      game.state = 'interact';
      game.dialogueQueue = [
        quest.giver + ": " + quest.description,
        "*New Quest: " + quest.name + "*",
        "*Find: " + quest.itemNeeded.replace(/_/g, ' ') + "*",
      ];
      game.currentDialogue = game.dialogueQueue.shift();
    }
    return;
  }

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

function handleVendorBuy() {
  if (game.vendorItems.length === 0) return;
  const item = game.vendorItems[game.vendorMenuIndex];

  // Special handling for paper balls
  if (item.itemType === 'paper_balls') {
    if (game.gold >= item.cost) {
      game.gold -= item.cost;
      game.paperBallAmmo = (game.paperBallAmmo || 0) + 5;
      game.state = 'interact';
      game.dialogueQueue = [];
      game.currentDialogue = "Kunal: Here's 5 paper balls. Go cause some chaos!";
      return;
    } else {
      game.state = 'interact';
      game.dialogueQueue = [];
      game.currentDialogue = "Kunal: You can't afford that mate! Need " + item.cost + " work points, you've got " + game.gold + ".";
      return;
    }
  }

  if (game.gold >= item.cost) {
    game.gold -= item.cost;
    // Give player the item
    const emptySlot = player.inventory.indexOf(null);
    if (emptySlot !== -1) {
      player.inventory[emptySlot] = { name: item.name, itemType: item.itemType, type: 'pickup' };
      game.state = 'interact';
      game.dialogueQueue = [];
      game.currentDialogue = "Kunal: Nice doing business! Here's your " + item.name + ".";
    } else {
      game.state = 'interact';
      game.dialogueQueue = [];
      game.currentDialogue = "Your pockets are full! Use or drop an item first.";
    }
  } else {
    game.state = 'interact';
    game.dialogueQueue = [];
    game.currentDialogue = "Kunal: You can't afford that mate! Need " + item.cost + " work points, you've got " + game.gold + ".";
  }
}


function tryInteract() {
