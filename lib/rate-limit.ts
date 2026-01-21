// Simple in-memory rate limiter
// Note: This resets on server restart. For production, consider using Upstash Redis.

interface RateLimitEntry {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime < now) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  interval: number // in milliseconds
  maxRequests: number
}

export function rateLimit(
  key: string,
  config: RateLimitConfig = { interval: 15000, maxRequests: 5 }
): { success: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetTime < now) {
    // Create new entry
    store.set(key, {
      count: 1,
      resetTime: now + config.interval,
    })
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: config.interval,
    }
  }

  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    }
  }

  // Increment count
  entry.count++
  store.set(key, entry)

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  }
}

// Rate limit for heartbeat - allow 1 request per 10 seconds per visitor
export function heartbeatRateLimit(token: string, visitorId: string): boolean {
  const key = `heartbeat:${token}:${visitorId}`
  const result = rateLimit(key, { interval: 10000, maxRequests: 1 })
  return result.success
}

// Rate limit for API endpoints - allow 100 requests per minute per IP
export function apiRateLimit(ip: string): boolean {
  const key = `api:${ip}`
  const result = rateLimit(key, { interval: 60000, maxRequests: 100 })
  return result.success
}
