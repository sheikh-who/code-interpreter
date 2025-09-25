'use strict';

const vm = require('vm');

const DEFAULT_TIMEOUT_MS = 1000;

class SandboxTimeoutError extends Error {
  constructor(timeoutMs, cause) {
    const normalized = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS;
    super(`Script execution timed out after ${normalized}ms`);
    this.name = 'SandboxTimeoutError';
    this.code = 'SANDBOX_TIMEOUT';
    this.timeoutMs = normalized;
    if (cause !== undefined) {
      this.cause = cause;
    }
  }
}

function normalizeTimeout(timeoutMs) {
  if (timeoutMs === undefined || timeoutMs === null) {
    return DEFAULT_TIMEOUT_MS;
  }

  const numeric = Number(timeoutMs);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return Infinity;
  }

  return numeric;
}

function createTimeoutManager(timeoutMs, { onTimeout } = {}) {
  const normalizedTimeout = normalizeTimeout(timeoutMs);

  if (!Number.isFinite(normalizedTimeout) || normalizedTimeout <= 0) {
    return {
      wrap: (promise) => Promise.resolve(promise),
      dispose: () => {},
    };
  }

  let timer = null;
  let settled = false;
  let timeoutError;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutError = new SandboxTimeoutError(normalizedTimeout);
    timer = setTimeout(() => {
      if (settled) {
        return;
      }

      if (typeof onTimeout === 'function') {
        try {
          onTimeout(timeoutError);
        } catch {
          // Intentionally ignore listener errors to avoid masking the timeout.
        }
      }

      reject(timeoutError);
    }, normalizedTimeout);

    if (typeof timer.unref === 'function') {
      timer.unref();
    }
  });

  timeoutPromise.catch(() => {});

  return {
    async wrap(workPromise) {
      const awaitedPromise = Promise.resolve(workPromise);
      awaitedPromise.catch(() => {});

      try {
        return await Promise.race([awaitedPromise, timeoutPromise]);
      } finally {
        settled = true;
        if (timer) {
          clearTimeout(timer);
        }
      }
    },
    dispose() {
      settled = true;
      if (timer) {
        clearTimeout(timer);
      }
    },
  };
}

async function runInSandbox(code, { timeoutMs, globals = {}, filename = 'user-code.js' } = {}) {
  if (typeof code !== 'string') {
    throw new TypeError('Code executed inside the sandbox must be a string.');
  }

  const normalizedTimeout = normalizeTimeout(timeoutMs);

  const context = vm.createContext({
    console,
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    ...globals,
  });

  const wrappedSource = `(async () => {\n${code}\n})()`;
  const script = new vm.Script(wrappedSource, {
    filename,
    displayErrors: true,
  });

  const runOptions = {};
  if (Number.isFinite(normalizedTimeout) && normalizedTimeout > 0) {
    runOptions.timeout = normalizedTimeout;
  }

  let executionResult;
  try {
    executionResult = script.runInContext(context, runOptions);
  } catch (error) {
    if (Number.isFinite(normalizedTimeout) && normalizedTimeout > 0) {
      const message = typeof error?.message === 'string' ? error.message : '';
      if (/timed out/i.test(message)) {
        throw new SandboxTimeoutError(normalizedTimeout, error);
      }
    }

    throw error;
  }

  const executionPromise = Promise.resolve(executionResult);

  if (!Number.isFinite(normalizedTimeout) || normalizedTimeout <= 0) {
    return executionPromise;
  }

  const timeoutManager = createTimeoutManager(normalizedTimeout);

  try {
    return await timeoutManager.wrap(executionPromise);
  } catch (error) {
    if (error instanceof SandboxTimeoutError) {
      throw error;
    }

    const message = typeof error?.message === 'string' ? error.message : '';
    if (/timed out/i.test(message)) {
      throw new SandboxTimeoutError(normalizedTimeout, error);
    }

    throw error;
  } finally {
    timeoutManager.dispose();
  }
}

module.exports = {
  runInSandbox,
  SandboxTimeoutError,
  createTimeoutManager,
};
