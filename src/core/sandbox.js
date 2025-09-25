const { EventEmitter } = require('events');
const fs = require('fs/promises');
const path = require('path');
const vm = require('vm');
const { validateCode, sanitizeOptions } = require('./security');
const { createVmContext } = require('./vm-context');
const { withPerformanceMeasure } = require('../utils/performance');
const { createMetricsTracker } = require('../utils/metrics');
const { generateId } = require('../utils/crypto-utils');
const logger = require('../utils/logger');

const DEFAULT_OPTIONS = {
  timeoutMs: 30000,
  memoryLimitMB: 64,
  securityLevel: 'strict',
  enableLogging: false,
  allowedModules: []
};

class Sandbox extends EventEmitter {
  constructor(options = {}) {
    super();
    this.id = options.id || generateId();
    this.options = sanitizeOptions({ ...DEFAULT_OPTIONS, ...options });
    this.isActive = true;
    this.createdAt = Date.now();
    this.executionCount = 0;
    this.metrics = createMetricsTracker();
  }

  async interpret(code, context = {}, executionOptions = {}) {
    this.#ensureActive();
    const options = { ...this.options, ...executionOptions };
    validateCode(code, options.securityLevel);

    const executionId = generateId();
    this.emit('execution:start', { executionId });

    const run = async () => {
      const vmContext = createVmContext({ context }, options);
      const wrapped = `(async (context) => { ${code}\n})`;
      const script = new vm.Script(wrapped, { displayErrors: true });
      const callable = script.runInContext(vmContext, {
        timeout: options.maxExecutionTime || options.timeout || options.timeoutMs
      });
      return callable(context);
    };

    try {
      const { duration, result } = await withPerformanceMeasure(run);
      this.executionCount += 1;
      this.metrics.recordSuccess(duration);
      this.emit('execution:complete', { executionId, duration, result });
      return result;
    } catch (error) {
      this.metrics.recordFailure();
      this.emit('execution:error', { executionId, error });
      throw error;
    }
  }

  async interpretFile(filePath, context = {}, executionOptions = {}) {
    const absolutePath = path.resolve(filePath);
    const code = await fs.readFile(absolutePath, 'utf8');
    return this.interpret(code, context, executionOptions);
  }

  async kill(graceful = true) {
    if (!this.isActive) {
      return;
    }
    this.isActive = false;
    this.emit('killed', graceful ? 'graceful' : 'force');
  }

  getStatus() {
    return {
      id: this.id,
      isActive: this.isActive,
      executionCount: this.executionCount,
      uptime: Date.now() - this.createdAt,
      options: { ...this.options }
    };
  }

  getMetrics() {
    return this.metrics.snapshot();
  }

  #ensureActive() {
    if (!this.isActive) {
      const error = new Error('Sandbox has been terminated');
      logger.error('Attempted to execute on a dead sandbox', { sandboxId: this.id });
      throw error;
    }
  }
}

async function createSandbox(options = {}) {
  const sandbox = new Sandbox(options);
  sandbox.emit('ready', { id: sandbox.id });
  return sandbox;
}

module.exports = {
  Sandbox,
  createSandbox
};
