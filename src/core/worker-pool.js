class WorkerPool {
  constructor(size = 1) {
    this.size = size;
    this.queue = [];
  }

  async run(task) {
    return task();
  }
}

module.exports = {
  WorkerPool
};
