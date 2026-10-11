import { retention } from "@/lib/retention";
import { getConfig } from "../config";
import { RateLimiter } from "./rate-limit";

const WINDOW = retention.rateLimitMinutes * 60_000;
let limiters: { tokens: RateLimiter; attempts: RateLimiter; created: RateLimiter; sharedCreated: RateLimiter; sharedAttempts: RateLimiter } | null = null;

/** Prozessweite Limiter (eine Server-Instanz). */
export function getLimiters() {
  if (limiters) return limiters;
  const { env } = getConfig();
  limiters = {
    tokens: new RateLimiter(env.RATE_LIMIT_TOKENS_PER_HOUR, WINDOW),
    attempts: new RateLimiter(Math.max(20, env.RATE_LIMIT_SUBMISSIONS_PER_HOUR * 6), WINDOW),
    created: new RateLimiter(env.RATE_LIMIT_SUBMISSIONS_PER_HOUR, WINDOW),
    // Ohne ermittelbare Client-IP teilen sich alle Besucher einen Bucket → großzügiges Limit
    sharedCreated: new RateLimiter(env.RATE_LIMIT_SUBMISSIONS_PER_HOUR * 20, WINDOW),
    sharedAttempts: new RateLimiter(Math.max(200, env.RATE_LIMIT_SUBMISSIONS_PER_HOUR * 60), WINDOW),
  };
  return limiters;
}
