function createCircuitBreaker({ failureThreshold = 5, resetTimeMs = 30000 } = {}) {
  let failures = 0;
  let lastFailureTime = 0;
  let open = false;

  return {
    canExecute() {
      if (!open) {
        return true;
      }
      if (Date.now() - lastFailureTime > resetTimeMs) {
        open = false;
        failures = 0;
        return true;
      }
      return false;
    },
    recordSuccess() {
      failures = 0;
      open = false;
    },
    recordFailure() {
      failures += 1;
      lastFailureTime = Date.now();
      if (failures >= failureThreshold) {
        open = true;
      }
    }
  };
}

module.exports = {
  createCircuitBreaker
};
