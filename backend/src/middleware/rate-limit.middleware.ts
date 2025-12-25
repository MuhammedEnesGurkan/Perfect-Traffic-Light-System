import { Request, Response, NextFunction } from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

/**
 * Custom rate limit error handler
 */
const rateLimitHandler = (req: Request, res: Response): void => {
  res.status(429).json({
    error: 'TOO_MANY_REQUESTS',
    message: 'Rate limit exceeded. Please try again later.',
    retryAfter: res.getHeader('Retry-After')
  });
};

/**
 * Key generator for rate limiting - uses IP address and optional user ID
 */
const keyGenerator = (req: Request): string => {
  const userId = (req as any).user?.id;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  return userId ? `${userId}` : `ip:${ip}`;
};

/**
 * General API rate limiter (100 requests per 15 minutes)
 */
export const generalRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many requests, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator
});

/**
 * Strict rate limiter for sensitive operations (10 requests per 15 minutes)
 */
export const strictRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator
});

/**
 * Login/Authentication rate limiter (5 attempts per 15 minutes)
 */
export const authRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator: (req) => req.ip || 'unknown',
  skipSuccessfulRequests: true
});

/**
 * Emergency preemption rate limiter (20 requests per minute)
 */
export const emergencyRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: 'Emergency request rate limit exceeded.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator
});

/**
 * Configuration update rate limiter (30 requests per hour)
 */
export const configRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: 'Configuration update rate limit exceeded.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator
});

/**
 * Sensor data submission rate limiter (1000 requests per minute)
 */
export const sensorDataRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: 'Sensor data submission rate limit exceeded.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator
});

/**
 * Custom rate limiter factory
 */
export const createCustomRateLimiter = (
  windowMs: number,
  maxRequests: number,
  prefix: string
): RateLimitRequestHandler => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    keyGenerator
  });
};