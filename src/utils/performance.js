async function withPerformanceMeasure(fn) {
  const start = process.hrtime.bigint();
  const result = await fn();
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1e6;
  return { duration, result };
}

module.exports = {
  withPerformanceMeasure
};
