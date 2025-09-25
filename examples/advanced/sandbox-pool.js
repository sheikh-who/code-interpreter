const { createSandbox } = require('../..');

class SandboxPool {
  constructor(size = 2) {
    this.size = size;
    this.pool = [];
  }

  async acquire() {
    if (this.pool.length < this.size) {
      const sandbox = await createSandbox();
      this.pool.push(sandbox);
      return sandbox;
    }
    return this.pool[0];
  }
}

module.exports = { SandboxPool };
