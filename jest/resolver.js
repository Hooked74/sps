module.exports = (path, options) =>
  options.defaultResolver(path, {
    ...options,
    conditions: Array.isArray(options.conditions)
      ? [...new Set(["require", "node", ...options.conditions])]
      : options.conditions,
  });
