const { WorkerPool } = require('../core/worker-pool');

class PoolManager {
  constructor(options = {}) {
    this.pool = new WorkerPool(options.size || 2);
  }

  run(task) {
    return this.pool.run(task);
  }
}

module.exports = {
  PoolManager
};
