const students = ['al', 'ex', 'and', 'ré', 'rii', 'bas', 'tien', 'bry', 'an', 'char', 'lotte', 'den', 'is', 'émi', 'lie', 'emma', 'nuel', 'fré', 'déric', 'gui', 'llaume', 'hu', 'go', 'ja', 'âd', 'jam', 'aldinne', 'jus', 'tine', 'luc', 'as', 'mar', 'ie', 'tin', 'meh', 'di', 'naj', 'ib', 'nic', 'olas', 'pi', 'erre', 'quen', 'rob', 'in', 'sco', 'tt'];

export default class Pokemilton {
  constructor() {
    this.name = this.generateRandomName();
    this.level = 1;
    this.experienceMeter = 0;
    this.attackRange = this.getRandomNumber(4, 8);
    this.defenseRange = this.getRandomNumber(1, 3);
    this.healthPool = this.getRandomNumber(20, 30);
    this.initialHealthPool = this.healthPool;
    this.catchPhrase = this.generateCatchPhrase();
  }

  generateRandomName() {
    const s1 = students[Math.floor(Math.random() * students.length)];
    const s2 = students[Math.floor(Math.random() * students.length)];
    return s1.charAt(0).toUpperCase() + s1.slice(1) + s2;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateCatchPhrase() {
    const phrases = ["I choose you!", "Let the battle begin!", "Pokemilton, go!"];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  attack(defender) {
    const damage = Math.max(0, this.getRandomNumber(this.attackRange, this.attackRange * this.level) - defender.defenseRange);
    defender.healthPool -= damage;

    let message = `${this.name} attacked ${defender.name} and dealt ${damage} damage!`;

    if (defender.healthPool <= 0) {
      defender.healthPool = 0;
      message += `\n${defender.name} was knocked out!`;
    }
    return message;
  }

  gainExperience(opponentLevel) {
    const experienceGain = this.getRandomNumber(5, 10) * opponentLevel;
    this.experienceMeter += experienceGain;

    let message = `${this.name} gained ${experienceGain} experience points!`;

    if (this.experienceMeter >= this.level * 20) {
      message += `\n${this.evolve()}`; // Append the evolution message
    }
    return message;
  }

  evolve(levels = 1) {
    this.level += levels;
    const attackIncrease = this.getRandomNumber(1, 3) * levels;
    const defenseIncrease = this.getRandomNumber(1, 2) * levels;
    const healthIncrease = this.getRandomNumber(5, 10) * levels;

    this.attackRange += attackIncrease;
    this.defenseRange += defenseIncrease;
    this.initialHealthPool += healthIncrease;
    this.healthPool = this.initialHealthPool; // Fully heal on evolution

    return `${this.name} evolved to Level ${this.level}!`;
  }

  sayCatchPhrase() {
    return `${this.name} says: "${this.catchPhrase}"`;
  }
}