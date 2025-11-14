require('dotenv').config();
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

const QUEUE_KEY = 'events:queue';

// push event object (JSON)
async function pushEvent(event) {
  await redis.rpush(QUEUE_KEY, JSON.stringify(event));
}

// pop with blocking timeout (for worker)
async function popEvent(timeout = 5) {
  // BLPOP returns [key, value] or null
  const res = await redis.blpop(QUEUE_KEY, timeout);
  if (!res) return null;
  return JSON.parse(res[1]);
}

module.exports = {
  pushEvent,
  popEvent,
  redis,
  QUEUE_KEY
};
