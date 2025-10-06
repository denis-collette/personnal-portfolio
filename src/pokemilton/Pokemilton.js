const students = ['al', 'ex', 'and', 'ré', 'rii', 'bas', 'tien', 'bry', 'an', 'char', 'lotte', 'den', 'is', 'émi', 'lie', 'emma', 'nuel', 'fré', 'déric', 'gui', 'llaume', 'hu', 'go', 'ja', 'âd', 'jam', 'aldinne', 'jus', 'tine', 'luc', 'as', 'mar', 'ie', 'tin', 'meh', 'di', 'naj', 'ib', 'nic', 'olas', 'pi', 'erre', 'quen', 'rob', 'in', 'sco', 'tt'];

export default class Pokemilton {
  constructor(level = 1) {
    this.name = this.generateRandomName();
    this.level = level;
    this.experienceMeter = 0;

    // Generate base stats first
    const baseAttack = this.getRandomNumber(4, 8);
    const baseDefense = this.getRandomNumber(1, 3);
    const baseHealth = this.getRandomNumber(20, 30);

    // Scale stats based on the level. Higher levels get significant boosts.
    this.attackRange = baseAttack + Math.floor((level - 1) * 1.5);
    this.defenseRange = baseDefense + (level - 1);
    this.initialHealthPool = baseHealth + ((level - 1) * 5);
    this.healthPool = this.initialHealthPool;
    
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
    // We'll use the level to make attacks slightly stronger
    const damage = Math.max(0, this.getRandomNumber(this.attackRange, this.attackRange + this.level) - defender.defenseRange);
    defender.healthPool -= damage;
    let message = `${this.name} attacked ${defender.name} and dealt ${damage} damage!`;
    if (defender.healthPool <= 0) {
      defender.healthPool = 0;
      message += `\n${defender.name} was knocked out!`;
    }
    return message;
  }

  gainExperience(opponentLevel) {
    // XP gain is based on the opponent's level
    const experienceGain = this.getRandomNumber(5, 10) * opponentLevel;
    this.experienceMeter += experienceGain;
    let message = `${this.name} gained ${experienceGain} experience points!`;

    // Check if the Pokemilton can level up
    const xpForNextLevel = this.getXpForNextLevel();
    if (this.experienceMeter >= xpForNextLevel) {
      this.experienceMeter -= xpForNextLevel; // Subtract the cost and keep the remainder
      message += `\n${this.levelUp()}`; // Call the level up method
    }
    return message;
  }

  // This calculates how much XP is needed for the next level
  getXpForNextLevel() {
    // A formula that makes it progressively harder to level up
    return Math.floor(20 * (this.level ** 1.5));
  }

  levelUp(levels = 1) {
    this.level += levels;
    const attackIncrease = this.getRandomNumber(1, 3) * levels;
    const defenseIncrease = this.getRandomNumber(1, 2) * levels;
    const healthIncrease = this.getRandomNumber(5, 10) * levels;

    this.attackRange += attackIncrease;
    this.defenseRange += defenseIncrease;
    this.initialHealthPool += healthIncrease;
    this.healthPool = this.initialHealthPool; // Fully heal on level up

    return `Ding! ${this.name} grew to Level ${this.level}!`;
  }

  sayCatchPhrase() {
    return `${this.name} says: "${this.catchPhrase}"`;
  }
}