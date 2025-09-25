const { createSandbox } = require('../core/sandbox');

function createExpressRouter(expressInstance, options = {}) {
  const router = expressInstance.Router();
  const sandboxPromise = createSandbox(options.sandboxOptions);

  router.post('/execute', async (req, res) => {
    try {
      const sandbox = await sandboxPromise;
      const result = await sandbox.interpret(req.body.code, req.body.context, req.body.options);
      res.json({ success: true, result });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  return router;
}

module.exports = {
  createExpressRouter
};
