const BLOCKED_PATTERNS = {
  strict: [
    /require\s*\(/,
    /import\s+/,
    /process\./,
    /global\./,
    /Function\s*\(/,
    /eval\s*\(/
  ],
  moderate: [/process\./, /Function\s*\(/, /eval\s*\(/],
  permissive: [/process\.exit/]
};

const ALLOWED_LEVELS = new Set(['strict', 'moderate', 'permissive', 'custom']);

function validateCode(code, level = 'strict') {
  if (typeof code !== 'string') {
    throw new TypeError('Code must be a string');
  }

  const patterns = BLOCKED_PATTERNS[level] || BLOCKED_PATTERNS.strict;
  for (const pattern of patterns) {
    if (pattern.test(code)) {
      const error = new Error(`Code rejected by security policy: ${pattern}`);
      error.code = 'SECURITY_VIOLATION';
      throw error;
    }
  }
}

function sanitizeOptions(options) {
  const sanitized = { ...options };
  if (!ALLOWED_LEVELS.has(sanitized.securityLevel)) {
    sanitized.securityLevel = 'strict';
  }

  sanitized.timeoutMs = normalizeNumber(sanitized.timeoutMs, 30000);
  sanitized.memoryLimitMB = normalizeNumber(sanitized.memoryLimitMB, 64);
  sanitized.maxExecutionTime = normalizeNumber(
    sanitized.maxExecutionTime,
    sanitized.timeoutMs
  );

  return sanitized;
}

function normalizeNumber(value, fallback) {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return fallback;
  }
  return value;
}

module.exports = {
  validateCode,
  sanitizeOptions
};
