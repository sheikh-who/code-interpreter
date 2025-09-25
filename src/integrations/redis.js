const { createSandbox } = require('../core/sandbox');

async function createRedisBackedExecutor(redisClient, options = {}) {
  const sandbox = await createSandbox(options.sandboxOptions);

  redisClient.subscribe(options.channel || 'code:execute');
  redisClient.on('message', async (channel, message) => {
    if (channel !== (options.channel || 'code:execute')) {
      return;
    }
    const payload = JSON.parse(message);
    try {
      const result = await sandbox.interpret(payload.code, payload.context, payload.execOptions);
      if (payload.replyTo) {
        redisClient.publish(
          payload.replyTo,
          JSON.stringify({ success: true, result, id: payload.id })
        );
      }
    } catch (error) {
      if (payload.replyTo) {
        redisClient.publish(
          payload.replyTo,
          JSON.stringify({ success: false, error: error.message, id: payload.id })
        );
      }
    }
  });

  return sandbox;
}

module.exports = {
  createRedisBackedExecutor
};
