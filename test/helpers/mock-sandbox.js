class MockSandbox {
  constructor() {
    this.executions = [];
  }

  async interpret(code) {
    this.executions.push(code);
    return null;
  }
}

module.exports = { MockSandbox };
