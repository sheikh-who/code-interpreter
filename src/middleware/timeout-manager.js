function createTimeoutManager({ maxExecutionTime = 1000 } = {}) {
  return {
    wrap(promise) {
      return Promise.race([
        promise,
        new Promise((_, reject) => {
          const timer = setTimeout(() => {
            clearTimeout(timer);
            const error = new Error('Execution timed out');
            error.code = 'TIMEOUT';
            reject(error);
          }, maxExecutionTime);
        })
      ]);
    }
  };
}

module.exports = {
  createTimeoutManager
};
