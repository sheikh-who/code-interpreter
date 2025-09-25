const { createSandbox } = require('../..');

async function runWithMetrics(code) {
  const sandbox = await createSandbox();
  try {
    await sandbox.interpret(code);
    return sandbox.getMetrics();
  } finally {
    await sandbox.kill();
  }
}

module.exports = { runWithMetrics };
