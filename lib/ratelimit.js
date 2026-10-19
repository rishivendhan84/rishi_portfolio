// Fixed-window rate limits per client key (IP): per minute and per day.
//
// With UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN set, counters live in
// Upstash Redis and are shared by every serverless instance. Without them the
// counters are in process memory: fine for local dev, leaky on Vercel (each
// instance counts separately). The OpenAI project budget is the real backstop.

export function limitsFromEnv(env = process.env) {
  return [
    { name: 'minute', windowSec: 60, max: Number(env.RATE_PER_MINUTE || 10) },
    { name: 'day', windowSec: 86400, max: Number(env.RATE_PER_DAY || 50) },
  ];
}

function memoryStore() {
  const counts = new Map();
  return {
    kind: 'memory',
    async incr(key, windowSec) {
      const n = (counts.get(key) || 0) + 1;
      counts.set(key, n);
      if (counts.size > 10000) counts.clear(); // crude cap; windows are short
      return n;
    },
  };
}

function upstashStore(url, token) {
  return {
    kind: 'upstash',
    async incr(key, windowSec) {
      const res = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, String(windowSec), 'NX'],
        ]),
      });
      if (!res.ok) throw new Error(`Upstash HTTP ${res.status}`);
      const [incr] = await res.json();
      return Number(incr.result);
    },
  };
}

export function createRateLimiter({ limits = limitsFromEnv(), env = process.env, now = () => Date.now() } = {}) {
  const fallback = memoryStore();
  const store =
    env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
      ? upstashStore(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN)
      : fallback;

  return {
    kind: store.kind,
    // Returns { ok: true } or { ok: false, limit, retryAfter } (seconds).
    async check(clientKey) {
      for (const l of limits) {
        const t = Math.floor(now() / 1000);
        const window = Math.floor(t / l.windowSec);
        const key = `rl:${l.name}:${window}:${clientKey}`;
        let n;
        try {
          n = await store.incr(key, l.windowSec);
        } catch {
          // Redis down: keep serving, counted per instance.
          n = await fallback.incr(key, l.windowSec);
        }
        if (n > l.max) return { ok: false, limit: l.name, retryAfter: (window + 1) * l.windowSec - t };
      }
      return { ok: true };
    },
  };
}
