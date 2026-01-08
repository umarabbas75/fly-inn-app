import { NextRequest } from "next/server";

// Simple in-memory rate limiter (use Redis in production for multiple servers)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Max requests per interval
}

export function rateLimit(config: RateLimitConfig) {
  const { interval, maxRequests } = config;

  return async (
    request: NextRequest
  ): Promise<{ success: boolean; remaining: number }> => {
    // Get identifier (IP address or session)
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const key = `${ip}`;

    // Get current rate limit data
    const rateLimitData = rateLimitMap.get(key);

    if (!rateLimitData) {
      // First request from this IP
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + interval,
      });
      return { success: true, remaining: maxRequests - 1 };
    }

    // Check if the time window has passed
    if (now > rateLimitData.resetTime) {
      // Reset the counter
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + interval,
      });
      return { success: true, remaining: maxRequests - 1 };
    }

    // Check if limit is exceeded
    if (rateLimitData.count >= maxRequests) {
      return { success: false, remaining: 0 };
    }

    // Increment counter
    rateLimitData.count++;
    rateLimitMap.set(key, rateLimitData);

    return {
      success: true,
      remaining: maxRequests - rateLimitData.count,
    };
  };
}

// Cleanup old entries every 1 hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 60 * 1000);
