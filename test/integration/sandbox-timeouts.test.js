'use strict';

const { runInSandbox, SandboxTimeoutError } = require('../../src/core/sandbox');

describe('sandbox integration', () => {
  jest.setTimeout(2000);

  it('resolves results within the configured timeout', async () => {
    const result = await runInSandbox(
      `
        const value = await new Promise((resolve) => {
          setTimeout(() => resolve(42), 10);
        });
        return value;
      `,
      { timeoutMs: 200 },
    );

    expect(result).toBe(42);
  });

  it('rejects when async operations overrun the timeout', async () => {
    await expect(
      runInSandbox(
        `
          await new Promise((resolve) => {
            setTimeout(resolve, 500);
          });
        `,
        { timeoutMs: 50 },
      ),
    ).rejects.toBeInstanceOf(SandboxTimeoutError);
  });
});
