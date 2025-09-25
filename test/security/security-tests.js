const { validateCode } = require('../../src/core/security');

function runSecurityChecks() {
  const disallowed = ['require("fs")', 'process.exit()', 'eval("1+1")'];
  for (const code of disallowed) {
    try {
      validateCode(code, 'strict');
      throw new Error(`Security validation allowed: ${code}`);
    } catch (error) {
      if (error.code !== 'SECURITY_VIOLATION') {
        throw error;
      }
    }
  }
  // eslint-disable-next-line no-console
  console.log('Security checks passed');
}

runSecurityChecks();
