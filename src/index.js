const { createSandbox } = require('./core/sandbox');
const { quickInterpret } = require('./legacy/interpreter');

module.exports = {
  createSandbox,
  quickInterpret
};
