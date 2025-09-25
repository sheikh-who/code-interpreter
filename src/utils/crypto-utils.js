const crypto = require('crypto');

function generateId(size = 16) {
  return crypto.randomBytes(size).toString('hex');
}

module.exports = {
  generateId
};
