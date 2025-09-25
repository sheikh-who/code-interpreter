const { createSandbox } = require('../../../src/core/sandbox');

describe('Sandbox', () => {
  it('executes code and returns result', async () => {
    const sandbox = await createSandbox();
    const result = await sandbox.interpret('return 21 * 2;');
    expect(result).toBe(42);
    await sandbox.kill();
  });

  it('tracks metrics', async () => {
    const sandbox = await createSandbox();
    await sandbox.interpret('return 1 + 1;');
    const metrics = sandbox.getMetrics();
    expect(metrics.executions.total).toBe(1);
    await sandbox.kill();
  });
});
