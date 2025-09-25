function handleMessage(message, sandbox) {
  if (!message || typeof message !== 'object') {
    throw new TypeError('Invalid message');
  }

  if (message.type === 'execute') {
    return sandbox.interpret(message.code, message.context, message.options);
  }

  throw new Error(`Unknown message type: ${message.type}`);
}

module.exports = {
  handleMessage
};
