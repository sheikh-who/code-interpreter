const { EventEmitter } = require('events');

class EnhancedEventEmitter extends EventEmitter {
  emit(event, ...args) {
    super.emit(event, ...args);
    super.emit('*', event, ...args);
    return true;
  }
}

module.exports = {
  EnhancedEventEmitter
};
