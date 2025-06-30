export interface RateLimitOptions {
  limit: number;
  interval: number; // milliseconds
}

const counters = new Map<string, { count: number; timestamp: number }>();

export function checkRateLimit(key: string, options: RateLimitOptions): boolean {
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
