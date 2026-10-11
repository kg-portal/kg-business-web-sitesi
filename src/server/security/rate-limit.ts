/**
 * Gleitendes Zeitfenster im Arbeitsspeicher. Schlüssel sind gehashte IPs
 * (täglich rotierendes Salz) – es werden keine Klartext-IPs gehalten.
 * Für eine einzelne Server-Instanz ausgelegt (siehe docs/DECISIONS.md).
 */
export class RateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
    private readonly maxKeys = 50_000,
  ) {}

  /** Registriert einen Zugriff. Gibt zurück, ob er erlaubt ist, und ggf. die Wartezeit. */
  hit(key: string, now = Date.now()): { allowed: boolean; retryAfterSeconds: number; remaining: number } {
    const since = now - this.windowMs;
    const list = (this.hits.get(key) ?? []).filter((t) => t > since);
    if (list.length >= this.max) {
      this.hits.set(key, list);
      const retry = Math.max(1, Math.ceil((list[0]! + this.windowMs - now) / 1000));
      return { allowed: false, retryAfterSeconds: retry, remaining: 0 };
    }
    list.push(now);
    this.hits.set(key, list);
    if (this.hits.size > this.maxKeys) this.prune(now);
    return { allowed: true, retryAfterSeconds: 0, remaining: this.max - list.length };
  }

  /** Prüft, ohne einen Zugriff zu registrieren. */
  check(key: string, now = Date.now()): { allowed: boolean; retryAfterSeconds: number } {
    const since = now - this.windowMs;
    const list = (this.hits.get(key) ?? []).filter((t) => t > since);
    if (list.length >= this.max) return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((list[0]! + this.windowMs - now) / 1000)) };
    return { allowed: true, retryAfterSeconds: 0 };
  }

  prune(now = Date.now()): void {
    const since = now - this.windowMs;
    for (const [k, list] of this.hits) {
      const fresh = list.filter((t) => t > since);
      if (fresh.length === 0) this.hits.delete(k);
      else this.hits.set(k, fresh);
    }
  }

  size(): number {
    return this.hits.size;
  }
}
