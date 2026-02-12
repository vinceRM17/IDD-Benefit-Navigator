/**
 * Security headers configuration
 * Provides HTTP security headers equivalent to helmet.js for Next.js middleware
 */

export function getSecurityHeaders(): Record<string, string> {
  return {
    // Content Security Policy - restricts resource loading
    'Content-Security-Policy': [
      "default-src 'self'",
      "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; '),

    // Force HTTPS connections
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Disable legacy XSS protection (CSP is the modern approach)
    'X-XSS-Protection': '0',

    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Restrict feature access
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}
