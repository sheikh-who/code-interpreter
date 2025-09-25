const vm = require('vm');
const { validateCode } = require('../core/security');

function quickInterpret(code, options = {}) {
  validateCode(code, options.securityLevel || 'strict');
  const script = new vm.Script(code);
  return script.runInNewContext({}, { timeout: options.timeout || 1000 });
}

module.exports = {
  quickInterpret
};
