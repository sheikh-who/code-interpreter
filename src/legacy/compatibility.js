const { createSandbox } = require('../core/sandbox');

async function createLegacySandbox(options = {}) {
  return createSandbox({ ...options, securityLevel: options.securityLevel || 'moderate' });
}

module.exports = {
  createLegacySandbox
};
