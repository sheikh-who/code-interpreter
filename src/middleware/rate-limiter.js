function createRateLimiter({ maxExecutionsPerMinute = 60 } = {}) {
  const windowMs = 60 * 1000;
  let executions = 0;
  let windowStart = Date.now();

  return {
    check() {
      const now = Date.now();
      if (now - windowStart > windowMs) {
        windowStart = now;
        executions = 0;
      }

      if (executions >= maxExecutionsPerMinute) {
        throw new Error('Rate limit exceeded');
      }

      executions += 1;
    }
  };
}

module.exports = {
  createRateLimiter
};
