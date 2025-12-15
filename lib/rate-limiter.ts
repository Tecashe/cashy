interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  async checkLimit(key: string): Promise<boolean> {
    const now = Date.now()
    const entry = this.limits.get(key)

    if (!entry || entry.resetAt < now) {
      this.limits.set(key, {
        count: 1,
        resetAt: now + this.config.windowMs,
      })
      return true
    }

    if (entry.count >= this.config.maxRequests) {
      return false
    }

    entry.count++
    return true
  }

  getRemainingRequests(key: string): number {
    const entry = this.limits.get(key)
    if (!entry || entry.resetAt < Date.now()) {
      return this.config.maxRequests
    }
    return Math.max(0, this.config.maxRequests - entry.count)
  }

  getResetTime(key: string): Date | null {
    const entry = this.limits.get(key)
    if (!entry) return null
    return new Date(entry.resetAt)
  }

  cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.limits.entries()) {
      if (entry.resetAt < now) {
        this.limits.delete(key)
      }
    }
  }
}

// Instagram's rate limits are more complex, but we'll use conservative defaults
export const instagramRateLimiter = new RateLimiter({
  maxRequests: 200, // Per hour per user
  windowMs: 3600000, // 1 hour
})

// Clean up expired entries every 5 minutes
setInterval(() => {
  instagramRateLimiter.cleanup()
}, 300000)

export async function checkInstagramRateLimit(userId: string): Promise<void> {
  const allowed = await instagramRateLimiter.checkLimit(userId)
  if (!allowed) {
    const resetTime = instagramRateLimiter.getResetTime(userId)
    throw new Error(`Rate limit exceeded. Try again at ${resetTime?.toLocaleTimeString() || "later"}.`)
  }
}
