const { createSandbox } = require('../../src/core/sandbox');

(async () => {
  const sandbox = await createSandbox();
  console.time('benchmark');
  for (let i = 0; i < 10; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await sandbox.interpret('return Math.sqrt(144);');
  }
  console.timeEnd('benchmark');
  await sandbox.kill();
})();
