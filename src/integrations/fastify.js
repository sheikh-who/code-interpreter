const { createSandbox } = require('../core/sandbox');

async function createFastifyPlugin(fastify, options = {}) {
  const sandbox = await createSandbox(options.sandboxOptions);
  fastify.post('/execute', async request => {
    const { code, context, execOptions } = request.body;
    return sandbox.interpret(code, context, execOptions);
  });
}

module.exports = {
  createFastifyPlugin
};
