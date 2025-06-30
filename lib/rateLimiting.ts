interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );

    if (validRequests.length >= this.config.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const userRequests = this.requests.get(identifier) || [];
    const now = Date.now();
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );

    return Math.max(0, this.config.maxRequests - validRequests.length);
  }
}

export const publicApiLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 50,
});

export const authApiLimiter = new RateLimiter({
  windowMs: 5 * 60 * 1000,
  maxRequests: 5,
});

export const fileUploadLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 10,
});

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

export function createErrorResponse(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export function createSuccessResponse(data: any, message?: string) {
  return new Response(
    JSON.stringify({ success: true, data, ...(message && { message }) }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateTrackingId(trackingId: string): boolean {
  const trackingIdRegex = /^TRK-[A-Z0-9]+-[A-Z0-9]+$/;
  return trackingIdRegex.test(trackingId);
}

export function sanitizeSearchQuery(query: string): string {
  return query.replace(/[<>"'%;()&+]/g, '').trim().substring(0, 100);
}

export async function executeWithRetry<T>(operation: () => Promise<T>, maxRetries: number = 3): Promise<T> {
  let lastError: Error;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`Operation failed (attempt ${i + 1}/${maxRetries}):`, error);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  throw lastError!;
}

import { z } from 'zod';

export const TrackingQuerySchema = z.object({
  trackingId: z.string().min(1, 'กรุณาระบุรหัสติดตาม').regex(/^TRK-[A-Z0-9]+-[A-Z0-9]+$/, 'รหัสติดตามไม่ถูกต้อง'),
});

export const ComplaintQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
  search: z.string().max(100).optional(),
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ARCHIVED']).optional(),
  category: z.enum([
    'TECHNICAL',
    'PERSONNEL',
    'ENVIRONMENT',
    'EQUIPMENT',
    'SAFETY',
    'FINANCIAL',
    'STRUCTURE_SYSTEM',
    'WELFARE_SERVICES',
    'PROJECT_IDEA',
    'OTHER',
  ]).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'priority', 'status', 'title']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export function withRateLimit(limiter: RateLimiter) {
  return function (handler: Function) {
    return async function (request: Request, ...args: any[]) {
      const clientIP = getClientIP(request);
      if (!limiter.isAllowed(clientIP)) {
        return createErrorResponse('Too many requests. Please try again later.', 429);
      }
      return handler(request, ...args);
    };
  };
}
