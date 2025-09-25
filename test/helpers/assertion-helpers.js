function expectRejected(promise, message) {
  return promise
    .then(() => {
      throw new Error('Expected promise to reject');
    })
    .catch(error => {
      if (message && !error.message.includes(message)) {
        throw new Error(`Expected error message to include ${message}`);
      }
    });
}

module.exports = {
  expectRejected
};
