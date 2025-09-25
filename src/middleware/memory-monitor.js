function createMemoryMonitor({ limitMB = 128 } = {}) {
  const limitBytes = limitMB * 1024 * 1024;
  return {
    check() {
      const usage = process.memoryUsage();
      if (usage.heapUsed > limitBytes) {
        const error = new Error('Memory limit exceeded');
        error.code = 'MEMORY_LIMIT';
        throw error;
      }
    }
  };
}

module.exports = {
  createMemoryMonitor
};
