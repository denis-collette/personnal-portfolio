export default class Master {
  constructor(name) {
    this.name = name;
    this.collection = [];
    this.healingItems = 5;
    this.reviveItems = 3;
    this.pokeballs = 10;
    this.coins = 50;
    this.alive = true;
  }

  showCollection() {
    if (this.collection.length === 0) {
      return "Your collection is empty.";
    }
    let collectionString = "";
    for (let i = 0; i < this.collection.length; i++) {
      const p = this.collection[i];
      collectionString += `${i + 1}. ${p.name} | HP: ${p.healthPool}/${p.initialHealthPool} | ATK: ${p.attackRange} | DEF: ${p.defenseRange}\n`;
    }
    return collectionString;
  }

  healPokemilton(pokemilton) {
    if (pokemilton.healthPool <= 0) {
      return `You can't heal ${pokemilton.name}, they are knocked out.\n----------`;
    }
    if (pokemilton.healthPool >= pokemilton.initialHealthPool) {
      return `${pokemilton.name}'s HP is already full.\n----------`;
    }
    if (this.healingItems <= 0) {
      return "No healing items left!\n----------";
    }

    pokemilton.healthPool = pokemilton.initialHealthPool;
    this.healingItems--;
    return `${pokemilton.name} has been healed!\n----------`;
  }

  revivePokemilton(pokemilton) {
    if (this.reviveItems <= 0) {
      return "No revive items left!\n----------";
    }
    if (pokemilton.healthPool > 0) {
      return `You can't revive ${pokemilton.name}, they still have HP.\n----------`;
    }

    pokemilton.healthPool = Math.floor(pokemilton.initialHealthPool / 2);
    this.reviveItems--;
    return `${pokemilton.name} has been revived!\n----------`;
  }

  catchPokemilton(pokemilton) {
    if (this.collection.length >= 10) {
      return "Your collection is full! You can't catch any more.";
    }
    pokemilton.healthPool = pokemilton.initialHealthPool; // Heal the caught Pokemilton
    this.collection.push(pokemilton);
    return `You caught ${pokemilton.name}! It has been added to your collection.`;
  }

  renamePokemilton(pokemilton, newName) {
    const oldName = pokemilton.name;
    pokemilton.name = newName;
    return `${oldName} is now named ${newName}!\n----------`;
  }

  releasePokemilton(pokemilton) {
    const index = this.collection.indexOf(pokemilton);
    this.collection.splice(index, 1);

    if (this.collection.length === 1 && this.collection[0].healthPool <= 0) {
      this.collection[0].healthPool = 1;
    }
    return `${pokemilton.name} has been released!\n----------`;
  }

  injectFighter(arena) {
    if (this.collection[arena.indexFighter]) {
      this.collection[arena.indexFighter] = { ...arena.fighter };
    }
  }
}