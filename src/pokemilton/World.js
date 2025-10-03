export default class World {
  constructor() {
    this.day = 1;
    this.log = [];
    this.status = true; 
  }

  displayLog() {
    let logMessage = "--- Game Log ---\n";
    if (this.log.length === 0) {
      logMessage += "Nothing has happened yet...";
    } else {
      // Display up to the last 6 entries
      const entries = this.log.slice(0, 6).reverse();
      logMessage += entries.join('\n');
    }
    return logMessage;
  }

  randomizeEvent() {
    return Math.random() > 0.25;
  }

  addLog(newLog) {
    const logEntry = `Day ${this.day}: ${newLog}`;
    this.log.unshift(logEntry); // Add to the beginning of the log array
    if (this.log.length > 10) { // Keep the log from getting too big
      this.log.pop();
    }
    return `----------\n${logEntry}`; // Return the message to display now
  }

  oneDayPasses() {
    this.day++;
    return `End of day ${this.day - 1}!\n----------`;
  }
}