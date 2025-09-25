module.exports = function execute(code, contextFactory) {
  const context = contextFactory();
  // eslint-disable-next-line no-new-func
  const fn = new Function('context', `with (context) { return (async () => { ${code} })(); }`);
  return fn(context);
};
