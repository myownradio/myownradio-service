module.exports = function throwIfAppNotConfigured(config) {
  if (Array.isArray(config)) {
    return config.every(isAppConfigured);
  }
  if (typeof config === 'object') {
    return Object.keys(config).every(isAppConfigured);
  }
  return config !== 'CHANGE_ME';
};
