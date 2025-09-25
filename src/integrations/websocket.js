const { createSandbox } = require('../core/sandbox');

async function attachToWebSocket(server, options = {}) {
  const sandbox = await createSandbox(options.sandboxOptions);
  server.on('connection', socket => {
    socket.on('execute', async payload => {
      try {
        const result = await sandbox.interpret(payload.code, payload.context, payload.options);
        socket.emit('result', { success: true, result });
      } catch (error) {
        socket.emit('result', { success: false, error: error.message });
      }
    });
  });
}

module.exports = {
  attachToWebSocket
};
