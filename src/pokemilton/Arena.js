import Pokemilton from './Pokemilton.js';

export default class Arena {
  constructor() {
    this.fighter = null;
    this.indexFighter = 0;
    this.wild = null;
    this.status = "quit";
  }

  setFighter(choice) {
    this.fighter = choice;
  }

  tryToFlee() {
    if (Math.random() > 0.25) {
      this.status = "quit"; return "You managed to flee!";
    } else {
      return "You failed to flee...";
    }
  }

  startBattle() {
    this.status = "ongoing"; return `${this.fighter.name}, go!\n"${this.fighter.catchPhrase}"`;
  }

  tryToCatch(master) {
    master.pokeballs--;
    let message = "You threw a Pokeball...";

    // The weaker the wild Pokemilton, the higher the chance of capture.
    const catchChance = 1 - (this.wild.healthPool / this.wild.initialHealthPool);

    if (Math.random() <= catchChance) {
      this.status = "capture";
      message += `\nGotcha! ${this.wild.name} was caught!`;
    } else {
      message += `\nOh no! The Pokemilton broke free!`;
    }
    return message;
  }

  wildPokemiltonAction() {
    if (this.status === "ongoing" && this.wild.healthPool > 0) {
      return this.wild.attack(this.fighter);
    }
    return null;
  }

  endBattle(master) {
    let prize = Math.floor(Math.random() * 10 + 1) * this.wild.level;
    if (this.status === "win") {
      master.coins += prize;
      return `${this.fighter.gainExperience(this.wild.level)}\nYou won and found ${prize} coins!`;
    } else if (this.status === "loose") {
      return `You lost...`;
    } else if (this.status === "capture") {
      return `${this.fighter.gainExperience(this.wild.level)}\nYou successfully captured ${this.wild.name}!`;
    }
    return `You fled the battle.`;
  }

  checkStatus(master) {
    master.alive = master.collection.some(p => p.healthPool > 0);
    if (!master.alive) this.status = "loose";
    else if (this.wild.healthPool <= 0) this.status = "win";
    else if (this.fighter.healthPool <= 0) this.status = "starting";
  }
}