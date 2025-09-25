const { createMetricsTracker } = require('../../../src/utils/metrics');

describe('metrics tracker', () => {
  it('records executions', () => {
    const tracker = createMetricsTracker();
    tracker.recordSuccess(10);
    tracker.recordFailure();
    const snapshot = tracker.snapshot();
    expect(snapshot.executions.total).toBe(2);
    expect(snapshot.executions.successful).toBe(1);
    expect(snapshot.executions.failed).toBe(1);
  });
});
