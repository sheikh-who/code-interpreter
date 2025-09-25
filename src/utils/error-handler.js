function normalizeError(error) {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack, name: error.name };
  }
  return { message: String(error) };
}

module.exports = {
  normalizeError
};
