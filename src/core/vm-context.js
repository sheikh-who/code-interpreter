const vm = require('vm');

const DEFAULT_GLOBALS = {
  console,
  Math,
  Date,
  JSON,
  Object,
  Array,
  String,
  Number,
  Boolean,
  RegExp,
  parseInt,
  parseFloat,
  isNaN,
  isFinite
};

function createVmContext(context = {}, options = {}) {
  const sandboxGlobals = { ...DEFAULT_GLOBALS };

  if (options.customGlobals && typeof options.customGlobals === 'object') {
    Object.assign(sandboxGlobals, options.customGlobals);
  }

  const merged = Object.create(null);
  Object.assign(merged, sandboxGlobals, context);
  return vm.createContext(merged, {
    codeGeneration: { strings: false, wasm: false }
  });
}

module.exports = {
  createVmContext
};
