import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Environment configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Extended Request interface
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Generate JWT token
 */
export const generateToken = (userId: string, email: string, role: string = 'user'): string => {
  return jwt.sign(
    { id: userId, email, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Authentication middleware
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'No token provided. Please include Authorization header with Bearer token.'
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Token has expired. Please login again.'
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Invalid token. Authentication failed.'
      });
    } else {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication failed.'
      });
    }
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'User not authenticated.'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Insufficient permissions to access this resource.'
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication
 */
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
    }
    
    next();
  } catch (error) {
    next();
  }
};

/**
 * Refresh token
 */
export const refreshToken = (req: AuthRequest, res: Response): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'No token provided.'
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    const newToken = generateToken(decoded.id, decoded.email, decoded.role);
    
    res.json({
      token: newToken,
      expiresIn: JWT_EXPIRES_IN
    });
  } catch (error) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Token refresh failed.'
    });
  }
};