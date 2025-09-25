function createMetricsTracker() {
  let totalExecutions = 0;
  let successfulExecutions = 0;
  let failedExecutions = 0;
  let totalDuration = 0;

  return {
    recordSuccess(duration) {
      totalExecutions += 1;
      successfulExecutions += 1;
      totalDuration += duration;
    },
    recordFailure() {
      totalExecutions += 1;
      failedExecutions += 1;
    },
    snapshot() {
      return {
        executions: {
          total: totalExecutions,
          successful: successfulExecutions,
          failed: failedExecutions,
          averageTime: successfulExecutions
            ? totalDuration / successfulExecutions
            : 0
        }
      };
    }
  };
}

module.exports = {
  createMetricsTracker
};
