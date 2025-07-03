import Redis from 'ioredis';

export interface RateLimitOptions {
  limit: number;
  interval: number; // milliseconds
}

const redisUrl = process.env.REDIS_URL;
const redis = redisUrl ? new Redis(redisUrl) : null;

const counters = new Map<string, { count: number; timestamp: number }>();

export async function checkRateLimit(
  key: string,
  options: RateLimitOptions
): Promise<boolean> {
  if (redis) {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.pexpire(key, options.interval);
    }
    return count <= options.limit;
  }

  const now = Date.now();
  const entry = counters.get(key);
  if (!entry) {
    counters.set(key, { count: 1, timestamp: now });
    return true;
  }
  if (now - entry.timestamp > options.interval) {
    counters.set(key, { count: 1, timestamp: now });
    return true;
  }
  if (entry.count >= options.limit) {
    return false;
  }
  entry.count += 1;
  return true;
}
