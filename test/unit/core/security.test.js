const { validateCode } = require('../../../src/core/security');

describe('security.validateCode', () => {
  it('rejects use of require in strict mode', () => {
    try {
      validateCode('require("fs")', 'strict');
      throw new Error('Expected security violation');
    } catch (error) {
      expect(error.code).toBe('SECURITY_VIOLATION');
    }
  });

  it('allows simple math', () => {
    expect(() => validateCode('1 + 1', 'strict')).not.toThrow();
  });
});
