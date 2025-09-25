'use strict';

const { runInSandbox, SandboxTimeoutError } = require('../../../src/core/sandbox');

describe('runInSandbox timeouts', () => {
  jest.setTimeout(2000);

  it('aborts synchronous infinite loops using the VM timeout', async () => {
    expect.assertions(3);
    const start = Date.now();

    await expect(
      runInSandbox('while (true) {}', {
        timeoutMs: 50,
      }),
    ).rejects.toBeInstanceOf(SandboxTimeoutError);

    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40);
    expect(elapsed).toBeLessThan(1000);
  });

  it('aborts async hangs that yield to the event loop', async () => {
    expect.assertions(3);
    const start = Date.now();

    await expect(
      runInSandbox('await new Promise(() => {});', {
        timeoutMs: 60,
      }),
    ).rejects.toBeInstanceOf(SandboxTimeoutError);

    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40);
    expect(elapsed).toBeLessThan(1000);
  });
});
