/**
 * In-memory rate limiter for API routes
 * Production deployment should use Redis-based rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs?: number;
  maxRequests?: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

// In-memory store: Map<IP, RateLimitEntry>
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval to prevent memory leaks
const CLEANUP_INTERVAL_MS = 60000; // 1 minute

// Default configurations
export const RATE_LIMIT_CONFIGS = {
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
};

/**
 * Check if a request should be rate limited
 * @param ip - Client IP address
 * @param config - Rate limit configuration (defaults to general config)
 * @returns Rate limit result with allowed status, remaining requests, and reset time
 */
export function checkRateLimit(
  ip: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.general
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowMs ?? RATE_LIMIT_CONFIGS.general.windowMs;
  const maxRequests = config.maxRequests ?? RATE_LIMIT_CONFIGS.general.maxRequests;

  const entry = rateLimitStore.get(ip);

  // No entry or window expired - create new entry
  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    rateLimitStore.set(ip, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(ip, entry);

  // Check if limit exceeded
  const allowed = entry.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - entry.count);

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Cleanup expired entries to prevent memory leaks
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  const toDelete: string[] = [];

  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      toDelete.push(ip);
    }
  }

  toDelete.forEach(ip => rateLimitStore.delete(ip));
}

// Start periodic cleanup
if (typeof window === 'undefined') {
  // Only run cleanup on server-side
  setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL_MS);
}

/**
 * Reset rate limit for a specific IP (useful for testing)
 */
export function resetRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}

/**
 * Clear all rate limit entries (useful for testing)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}
