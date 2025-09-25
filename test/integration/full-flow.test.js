const { createSandbox } = require('../../src/core/sandbox');

describe('integration: full flow', () => {
  it('executes code with context', async () => {
    const sandbox = await createSandbox();
    const result = await sandbox.interpret('return context.value * 2;', { value: 10 });
    expect(result).toBe(20);
    await sandbox.kill();
  });
});
