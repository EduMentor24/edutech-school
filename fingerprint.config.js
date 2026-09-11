module.exports = {
  concurrentIoLimit: require('os').availableParallelism?.() ?? 4,
};