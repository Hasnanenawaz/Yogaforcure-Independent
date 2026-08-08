// Simple in-memory sliding-window limiter, scoped to a single serverless
// instance's lifetime. Not a distributed guarantee on Vercel (each cold
// instance starts with an empty map) — a soft deterrent against casual
// brute-forcing, not a hard limit. Swap for a KV-backed limiter if this
// site's login traffic ever justifies it.
const attempts = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number,
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const windowStart = now - windowMs;
  const recent = (attempts.get(key) ?? []).filter((t) => t > windowStart);

  if (recent.length >= maxAttempts) {
    const retryAfterMs = recent[0] + windowMs - now;
    attempts.set(key, recent);
    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 0) };
  }

  recent.push(now);
  attempts.set(key, recent);
  return { allowed: true, retryAfterMs: 0 };
}
