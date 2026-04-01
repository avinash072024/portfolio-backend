const NodeCache = require('node-cache');

// default TTL 30 seconds for list endpoints
const defaultTtl = 30;
const cache = new NodeCache({ stdTTL: defaultTtl, checkperiod: 60 });

module.exports = {
  get: (key) => cache.get(key),
  set: (key, value, ttl = defaultTtl) => cache.set(key, value, ttl),
  del: (key) => cache.del(key),
  flush: () => cache.flushAll(),
};
