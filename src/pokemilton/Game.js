import Pokemilton from './Pokemilton.js';
import Master from './Master.js';
import Arena from './Arena.js';
import World from './World.js';

export default class Game {
  constructor(display, ask) {
    this.display = display;
    this.ask = ask;
    this.master = null;
    this.world = null;
    this.arena = null;
    this.savefile = {};
  }

  load() {
    const savedData = localStorage.getItem("pokemiltonSave");
    if (!savedData) return { Master: {} };
    this.savefile = JSON.parse(savedData);

    if (this.savefile.Master && this.savefile.Master.collection) {
      this.savefile.Master.collection = this.savefile.Master.collection.map(plainPoke => {
        const pokeInstance = new Pokemilton();
        Object.assign(pokeInstance, plainPoke);
        return pokeInstance;
      });
    }
    return this.savefile;
  }

  save() {
    this.savefile = { saved_on: new Date().toLocaleString(), Master: { name: this.master.name, collection: this.master.collection, healingItems: this.master.healingItems, reviveItems: this.master.reviveItems, pokeballs: this.master.pokeballs, coins: this.master.coins, alive: this.master.alive }, World: { day: this.world.day, log: this.world.log, status: true } };
    localStorage.setItem("pokemiltonSave", JSON.stringify(this.savefile, null, 2));
    this.display("Game saved!");
  }

  async askForName() {
    const name = await this.ask("Welcome to the wonderful world of Pokemilton!\nWhat is your name?");
    this.master = new Master(name || "Trainer");
  }

  async proposeFirstPokemilton() {
    const c1 = new Pokemilton(), c2 = new Pokemilton(), c3 = new Pokemilton();
    const text = `Choose your first starter:\n` +
      `1. ${c1.name} (HP: ${c1.healthPool}, ATK: ${c1.attackRange}, DEF: ${c1.defenseRange})\n` +
      `2. ${c2.name} (HP: ${c2.healthPool}, ATK: ${c2.attackRange}, DEF: ${c2.defenseRange})\n` +
      `3. ${c3.name} (HP: ${c3.healthPool}, ATK: ${c3.attackRange}, DEF: ${c3.defenseRange})`;
    let chosen;
    while (!chosen) {
      const a = await this.ask(text);
      if (a === "1") chosen = c1; 
      else if (a === "2") chosen = c2; 
      else if (a === "3") chosen = c3; 
      else this.display("Invalid choice.");
    }
    this.master.collection.push(chosen);
    this.display(`You chose ${chosen.name}!`);
  }

  async menuDay() {
    this.display(`--- Starting Day ${this.world.day} ---`);

    // Check if the current day is a multiple of 10
    if (this.world.day > 1 && this.world.day % 10 === 0) {
      this.display("You reached a Poke-Center, all your Pokemiltons are now in great shape!");
      for (const poke of this.master.collection) {
        // Revive and fully heal each Pokemilton
        poke.healthPool = poke.initialHealthPool;
      }
      // Ensure the player's status is updated
      this.master.alive = true;
    }

    while (this.world.status) {
      const choice = await this.ask(`What's next?\n1. Collection\n2. Shop\n3. Advance to Next Day\n4. Options`);
      if (choice === "1") await this.menuPoke();
      else if (choice === "2") await this.menuShop();
      else if (choice === "3") break;
      else if (choice === "4") await this.menuOptions();
      else this.display("Invalid choice.");
    }
  }

  async menuPoke() {
    this.display(this.master.showCollection());
    if (this.master.collection.length === 0) return;
    const choice = await this.ask("Select a Pokemilton by number (or type 'back').");
    if (choice.toLowerCase() === 'back') return;
    const index = parseInt(choice) - 1;
    if (index >= 0 && index < this.master.collection.length) {
      const poke = this.master.collection[index];
      
      const action = await this.ask(`What to do with ${poke.name}?\n1. Heal (${this.master.healingItems})\n2. Revive (${this.master.reviveItems})\n3. Rename\n4. Release\n5. Back`);
      
      if (action === "1") this.display(this.master.healPokemilton(poke));
      else if (action === "2") this.display(this.master.revivePokemilton(poke));
      else if (action === "3") {
        const newName = await this.ask(`New name for ${poke.name}:`);
        if (newName) this.display(this.master.renamePokemilton(poke, newName));
      } 
      else if (action === "4") {
        if (this.master.collection.length <= 1) {
          this.display("You can't release your last Pokemilton!");
        } else {
          const confirm = await this.ask(`Are you sure you want to release ${poke.name}? This cannot be undone. (yes/no)`);
          if (confirm.toLowerCase() === 'yes') {
            this.display(this.master.releasePokemilton(poke));
          } else {
            this.display("Release cancelled.");
          }
        }
      }
      // Note: The "Back" option is now implicitly handled if no other action is chosen.
    } else { this.display("Invalid selection."); }
  }

  async menuShop() {
    while (true) {
      const choice = await this.ask(`Welcome! You have ${this.master.coins} coins.\n1. Heal Potion (20c)\n2. Revive Potion (50c)\n3. Pokeball (75c)\n4. Back`);
      if (choice === '1' && this.master.coins >= 20) { this.master.coins -= 20; this.master.healingItems++; this.display("Bought a Heal Potion."); }
      else if (choice === '2' && this.master.coins >= 50) { this.master.coins -= 50; this.master.reviveItems++; this.display("Bought a Revive Potion."); }
      else if (choice === '3' && this.master.coins >= 75) { this.master.coins -= 75; this.master.pokeballs++; this.display("Bought a Pokeball."); }
      else if (choice === '4') break;
      else this.display("Invalid choice or not enough coins.");
    }
  }

  async menuOptions() {
    let inOptions = true;
    while (inOptions) {
      const choice = await this.ask(`--- Options ---\n1. Show Log\n2. Save\n3. Quit Game\n4. Back`);
      if (choice === '1') this.display(this.world.displayLog());
      else if (choice === '2') this.save();
      else if (choice === '3') { if ((await this.ask("Are you sure? (yes/no)")).toLowerCase() === 'yes') { this.world.status = false; inOptions = false; } }
      else if (choice === '4') inOptions = false;
      else this.display("Invalid choice.");
    }
  }

  async menuBattleItems() {
    let itemUsed = false;
    const choice = await this.ask(`Which item?\n1. Heal Potion (${this.master.healingItems})\n2. Revive Potion (${this.master.reviveItems})\n3. Pokeball (${this.master.pokeballs})\n4. Back`);

    switch (choice) {
      case '1':
        if (this.master.healingItems > 0) {
          // Display the collection so the player can see HP
          this.display(this.master.showCollection());
          const healChoice = await this.ask("Which Pokemilton would you like to heal? (or 'back')");

          if (healChoice.toLowerCase() === 'back') {
            break; // Go back to the item menu without using a turn
          }

          const index = parseInt(healChoice) - 1;
          if (index >= 0 && index < this.master.collection.length) {
            const pokeToHeal = this.master.collection[index];
            this.display(this.master.healPokemilton(pokeToHeal));
            itemUsed = true; // Using a potion counts as a turn
          } else {
            this.display("Invalid selection.");
          }
        } else {
          this.display("You don't have any Heal Potions!");
        }
        break;
      case '2':
        if (this.master.reviveItems > 0) {
          const fainted = this.master.collection.filter(p => p.healthPool <= 0);
          if (fainted.length === 0) {
            this.display("None of your Pokemiltons need reviving!");
            break;
          }
          let reviveMenuText = "Which Pokemilton to revive?\n";
          this.display(this.master.showCollection());
          const reviveChoice = await this.ask("Which fainted Pokemilton would you like to revive? (or 'back')");

          if (reviveChoice.toLowerCase() === 'back') {
            break;
          }

          const index = parseInt(reviveChoice) - 1;
          const targetPoke = this.master.collection[index];

          // Check if the chosen Pokemilton is actually fainted
          if (targetPoke && targetPoke.healthPool <= 0) {
            this.display(this.master.revivePokemilton(targetPoke));
            itemUsed = true;
          } else {
            this.display("Invalid selection or that Pokemilton is not fainted.");
          }
        } else {
          this.display("You don't have any Revive Potions!");
        }
        break;
      case '3':
        if (this.master.pokeballs > 0) {
          this.display(this.arena.tryToCatch(this.master));
          itemUsed = true;
        } else {
          this.display("You're out of Pokeballs!");
        }
        break;
      case '4':
        break;
      default:
        this.display("Invalid item choice.");
        break;
    }
    return itemUsed;
  }

  // --- BATTLE LOGIC ---
  async startEncounter() {
    this.arena = new Arena();
    this.arena.wild = new Pokemilton();

    const wild = this.arena.wild;
    const appearanceMessage = `A wild ${wild.name} appeared!\n(LVL: ${wild.level} | HP: ${wild.healthPool} | ATK: ${wild.attackRange} | DEF: ${wild.defenseRange})`;
    this.display(this.world.addLog(appearanceMessage));

    const choice = await this.ask("What will you do?\n1. Fight\n2. Flee");

    if (choice !== '1') {
      const fleeMessage = this.arena.tryToFlee();
      this.display(fleeMessage);

      if (fleeMessage === "You managed to flee!") {
        this.display(this.world.addLog("Successfully fled."));
        return;
      } else {
        this.display(this.world.addLog("Couldn't get away!"));
        const choseFighter = await this.chooseFighterForBattle();
        if (!choseFighter) return;

        this.display(this.arena.wildPokemiltonAction());
        this.arena.checkStatus(this.master);
      }
    }

    if (!this.arena.fighter) {
      const choseFighter = await this.chooseFighterForBattle();
      if (!choseFighter) return;
    }

    this.display(this.arena.startBattle());

    while (["ongoing", "starting"].includes(this.arena.status)) {
      if (this.arena.status === "starting") {
        this.display(`${this.arena.fighter.name} has fainted!`);
        const choseNewFighter = await this.chooseFighterForBattle();
        if (!choseNewFighter) {
          this.arena.status = "loose";
          break;
        }
        this.arena.status = "ongoing";
        this.display(`${this.arena.fighter.name}, go!`);

        this.display(this.arena.wildPokemiltonAction());
        this.arena.checkStatus(this.master);
        continue;
      }

      this.display(`--- Battle ---\n${this.arena.fighter.name} (HP: ${this.arena.fighter.healthPool}) vs ${this.arena.wild.name} (HP: ${this.arena.wild.healthPool})`);

      const action = await this.ask(`Action:\n1. Attack\n2. Item\n3. Flee\n4. Switch Pokemilton`);

      let playerTurnOver = false;
      if (action === '1') {
        this.display(this.arena.fighter.attack(this.arena.wild));
        playerTurnOver = true;
      } else if (action === '2') {
        playerTurnOver = await this.menuBattleItems();
      } else if (action === '3') {
        const fleeMsg = this.arena.tryToFlee();
        this.display(fleeMsg);
        if (this.arena.status === 'quit') break;
        playerTurnOver = true;
      } else if (action === '4') {
        const oldFighterName = this.arena.fighter.name;
        const switchSuccess = await this.chooseFighterForBattle();
        if (switchSuccess && this.arena.fighter.name !== oldFighterName) {
          this.display(`${oldFighterName}, come back! Go, ${this.arena.fighter.name}!`);
          playerTurnOver = true;
        } else {
          this.display(`Switch cancelled.`);
        }
      }

      if (playerTurnOver) {
        this.arena.checkStatus(this.master);
        if (this.arena.status === 'ongoing') {
          this.display(this.arena.wildPokemiltonAction());
          this.arena.checkStatus(this.master);
        }
      }
    }

    if (this.arena.status === "capture") {
      this.display(this.master.catchPokemilton(this.arena.wild));
    }

    this.master.injectFighter(this.arena);
    this.display(this.world.addLog(this.arena.endBattle(this.master)));
  }

  async chooseFighterForBattle() {
    while (true) {
      // Check if there are any usable Pokemilton left
      const availableFighters = this.master.collection.filter(p => p.healthPool > 0);
      if (availableFighters.length === 0) {
        this.display("You have no more Pokemilton that can fight!");
        return false; // Indicate that no fighter could be chosen
      }

      this.display(this.master.showCollection());
      const pokeChoice = await this.ask("Choose your next Pokemilton!");
      const index = parseInt(pokeChoice) - 1;

      if (index >= 0 && index < this.master.collection.length) {
        if (this.master.collection[index].healthPool > 0) {
          this.arena.setFighter(this.master.collection[index]);
          this.arena.indexFighter = index;
          return true; // Indicate success
        } else { this.display("That Pokemilton can't battle!"); }
      } else { this.display("Invalid choice."); }
    }
  }

  // --- MAIN GAME RUNNER ---
  async run() {
    let playAgain = true;
    while (playAgain) {
      this.master = new Master();
      this.world = new World();
      this.load();

      if (this.savefile?.Master?.name) {
        const choice = await this.ask(`Welcome back, ${this.savefile.Master.name}!\n1. Continue\n2. New Game`);
        if (choice === '1') {
          Object.assign(this.master, this.savefile.Master);
          Object.assign(this.world, this.savefile.World);
        } else { await this.askForName(); }
      } else { await this.askForName(); }

      if (this.master.collection.length === 0) await this.proposeFirstPokemilton();

      this.display(`----------\nGet ready, ${this.master.name}!\nYour team:\n` + this.master.showCollection());

      while (this.world.status) {
        await this.menuDay();
        if (!this.world.status) break;

        if (this.world.randomizeEvent()) await this.startEncounter();
        else this.display(this.world.addLog("The day passed peacefully."));

        this.display(this.world.oneDayPasses());

        if (!this.master.alive) {
          this.display(this.world.addLog("All your Pokemiltons have fainted!"));
          this.world.status = false;
        }
      }

      this.display("--- GAME OVER ---");
      const finalChoice = await this.ask("Play again?\n1. New Game\n2. Load from Save\n3. Exit");
      if (finalChoice === '3') {
        playAgain = false;
        this.display("Thanks for playing!");
      }
    }
  }
}