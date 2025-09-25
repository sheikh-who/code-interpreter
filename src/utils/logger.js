const LOG_LEVELS = ['error', 'warn', 'info', 'debug'];
const DEFAULT_LEVEL = process.env.LOG_LEVEL || 'info';

function log(level, message, meta = {}) {
  if (LOG_LEVELS.indexOf(level) > LOG_LEVELS.indexOf(DEFAULT_LEVEL)) {
    return;
  }
  const payload = { level, message, ...meta, timestamp: new Date().toISOString() };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
}

module.exports = {
  error(message, meta) {
    log('error', message, meta);
  },
  warn(message, meta) {
    log('warn', message, meta);
  },
  info(message, meta) {
    log('info', message, meta);
  },
  debug(message, meta) {
    log('debug', message, meta);
  }
};
