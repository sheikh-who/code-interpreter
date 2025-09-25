const { createSandbox } = require('../..');

(async () => {
  const sandbox = await createSandbox();
  const result = await sandbox.interpret('return 6 * 7;');
  console.log('Answer:', result);
  await sandbox.kill();
})();
