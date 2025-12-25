import cors, { CorsOptions } from 'cors';
import { Request } from 'express';

// Environment-based configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Allowed origins for CORS
 * In production: Use environment variable
 * In development: Allow localhost and common dev ports
 */
const getAllowedOrigins = (): string[] => {
  if (isProduction) {
    // Production: Use comma-separated list from environment
    const envOrigins = process.env.ALLOWED_ORIGINS || '';
    return envOrigins.split(',').filter(origin => origin.trim());
  }
  
  // Development: Allow common localhost ports
  return [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4200',
    'http://localhost:5000',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000'
  ];
};

const allowedOrigins = getAllowedOrigins();

/**
 * Origin validation function
 */
const corsOriginValidator = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
  // Allow requests with no origin (like mobile apps, curl, Postman)
  if (!origin) {
    return callback(null, true);
  }

  if (allowedOrigins.includes(origin)) {
    callback(null, true);
  } else if (isDevelopment) {
    // In development, allow all origins but log warning
    console.warn(`CORS: Origin ${origin} not in whitelist, but allowed in development mode`);
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

/**
 * Main CORS configuration
 */
export const corsOptions: CorsOptions = {
  origin: corsOriginValidator,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key',
    'Accept',
    'Origin'
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page',
    'X-Per-Page',
    'RateLimit-Limit',
    'RateLimit-Remaining',
    'RateLimit-Reset'
  ],
  credentials: true, // Allow cookies and authentication headers
  maxAge: 86400, // Cache preflight requests for 24 hours (in seconds)
  optionsSuccessStatus: 204 // Some legacy browsers choke on 204
};

/**
 * Pre-configured CORS middleware
 */
export const corsMiddleware = cors(corsOptions);

/**
 * Strict CORS for production (no wildcard origins)
 */
export const strictCorsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(new Error('Origin header required'));
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS - origin not whitelisted'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 204
};

/**
 * Permissive CORS for development/testing
 */
export const devCorsOptions: CorsOptions = {
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: '*',
  exposedHeaders: '*',
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 204
};

/**
 * Public endpoint CORS (no authentication)
 */
export const publicCorsOptions: CorsOptions = {
  origin: '*', // Allow all origins for public endpoints
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: false,
  maxAge: 86400,
  optionsSuccessStatus: 204
};

/**
 * CORS configuration factory for custom requirements
 */
export const createCorsOptions = (
  customOrigins?: string[],
  customMethods?: string[],
  allowCredentials: boolean = true
): CorsOptions => {
  return {
    origin: customOrigins 
      ? (origin, callback) => {
          if (!origin || customOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        }
      : corsOriginValidator,
    methods: customMethods || ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    credentials: allowCredentials,
    maxAge: 86400,
    optionsSuccessStatus: 204
  };
};

/**
 * Security headers middleware (complements CORS)
 */
export const securityHeadersMiddleware = (req: Request, res: any, next: any): void => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  if (isProduction) {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'"
    );
  }
  
  next();
};

/**
 * CORS configuration documentation
 */
export const getCorsConfigInfo = () => {
  return {
    environment: process.env.NODE_ENV || 'development',
    allowedOrigins: allowedOrigins.length > 0 ? allowedOrigins : ['*'],
    allowedMethods: corsOptions.methods,
    allowedHeaders: corsOptions.allowedHeaders,
    supportsCredentials: corsOptions.credentials,
    preflightMaxAge: corsOptions.maxAge
  };
};
