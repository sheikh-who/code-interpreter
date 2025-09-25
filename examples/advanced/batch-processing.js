const { createSandbox } = require('../..');

async function batchProcess(snippets) {
  const sandbox = await createSandbox();
  try {
    return Promise.all(snippets.map(code => sandbox.interpret(code)));
  } finally {
    await sandbox.kill();
  }
}

module.exports = { batchProcess };
