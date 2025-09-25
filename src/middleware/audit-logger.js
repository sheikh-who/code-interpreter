const logger = require('../utils/logger');

function createAuditLogger() {
  return {
    record(event, data) {
      logger.info(`audit:${event}`, data);
    }
  };
}

module.exports = {
  createAuditLogger
};
