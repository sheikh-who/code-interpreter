const { createSandbox } = require('../..');

async function createCustomSandbox() {
  return createSandbox({
    securityLevel: 'custom',
    customGlobals: { now: () => new Date().toISOString() }
  });
}

module.exports = { createCustomSandbox };
