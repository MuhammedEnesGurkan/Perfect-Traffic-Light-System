import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { corsMiddleware, securityHeadersMiddleware } from './middleware/cors.config';
import { 
  generalRateLimiter, 
  authRateLimiter, 
  strictRateLimiter,
  emergencyRateLimiter 
} from './middleware/rate-limit.middleware';
import { 
  authenticate, 
  generateToken, 
  authorize, 
  AuthRequest 
} from './middleware/auth.middleware';

dotenv.config();

const app = express();

// Global Middleware
app.use(express.json());
app.use(corsMiddleware);
app.use(securityHeadersMiddleware);

// ==================== PUBLIC ENDPOINTS ====================

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Perfect Traffic Lights API is running!'
  });
});

// Login
app.post('/api/auth/login', authRateLimiter, (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // Demo users
  if (email === 'admin@traffic.com' && password === 'admin123') {
    const token = generateToken('admin-001', email, 'admin');
    return res.json({
      token,
      expiresIn: '24h',
      user: { id: 'admin-001', email, role: 'admin' }
    });
  }
  
  if (email === 'user@traffic.com' && password === 'user123') {
    const token = generateToken('user-001', email, 'user');
    return res.json({
      token,
      expiresIn: '24h',
      user: { id: 'user-001', email, role: 'user' }
    });
  }
  
  res.status(401).json({
    error: 'UNAUTHORIZED',
    message: 'Invalid email or password'
  });
});

// ==================== PROTECTED ENDPOINTS ====================

// List All Intersections
app.get('/api/intersections', authenticate, generalRateLimiter, (req: AuthRequest, res: Response) => {
  res.json([
    {
      id: 'INT-001',
      name: 'Main Street & 1st Avenue',
      location: { lat: 40.7128, lng: -74.0060 },
      status: 'active',
      currentPhase: 'north-south-green',
      operationalMode: 'adaptive'
    },
    {
      id: 'INT-002',
      name: 'Oak Boulevard & 2nd Street',
      location: { lat: 40.7580, lng: -73.9855 },
      status: 'active',
      currentPhase: 'east-west-green',
      operationalMode: 'fixed-time'
    },
    {
      id: 'INT-003',
      name: 'Park Avenue & Center Road',
      location: { lat: 40.7489, lng: -73.9680 },
      status: 'maintenance',
      currentPhase: 'all-red',
      operationalMode: 'maintenance'
    }
  ]);
});

// Get Specific Intersection
app.get('/api/intersections/:id', authenticate, generalRateLimiter, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const intersections: any = {
    'INT-001': {
      intersectionId: 'INT-001',
      name: 'Main Street & 1st Avenue',
      currentPhase: 'north-south-green',
      operationalMode: 'adaptive',
      approaches: [
        { direction: 'north', queueLength: 5, greenTime: 30 },
        { direction: 'south', queueLength: 8, greenTime: 30 },
        { direction: 'east', queueLength: 3, greenTime: 20 },
        { direction: 'west', queueLength: 4, greenTime: 20 }
      ],
      cycleLength: 90,
      timestamp: new Date().toISOString()
    }
  };
  
  if (intersections[id]) {
    res.json(intersections[id]);
  } else {
    res.status(404).json({
      error: 'NOT_FOUND',
      message: `Intersection ${id} not found`
    });
  }
});

// Get Intersection Metrics
app.get('/api/intersections/:id/metrics', authenticate, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { period } = req.query;
  
  res.json({
    intersectionId: id,
    period: period || '24h',
    averageDelay: 32.5,
    throughput: 1850,
    queueLength: 6.3,
    cycleFailures: 3,
    timestamp: new Date().toISOString()
  });
});

// Submit Sensor Data
app.post('/api/intersections/:id/sensors/data', authenticate, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { detectorId, vehicleCount } = req.body;
  
  if (!detectorId || vehicleCount === undefined) {
    return res.status(400).json({
      error: 'BAD_REQUEST',
      message: 'Missing required fields: detectorId, vehicleCount'
    });
  }
  
  res.json({
    received: true,
    intersectionId: id,
    detectorId,
    timestamp: new Date().toISOString()
  });
});

// Emergency Preemption
app.post('/api/intersections/:id/emergency', authenticate, emergencyRateLimiter, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { vehicleId, vehicleType, approach } = req.body;
  
  res.json({
    preemptionActive: true,
    intersectionId: id,
    vehicleId,
    vehicleType,
    approach,
    estimatedClearance: 15
  });
});

// System Health
app.get('/api/system/health', authenticate, (req: AuthRequest, res: Response) => {
  res.json({
    status: 'operational',
    uptime: process.uptime(),
    activeIntersections: 3,
    timestamp: new Date().toISOString()
  });
});

// ==================== ADMIN ENDPOINTS ====================

// Change Intersection Mode
app.post('/api/intersections/:id/mode', authenticate, authorize('admin'), strictRateLimiter, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { mode } = req.body;
  
  const validModes = ['fixed-time', 'actuated', 'adaptive', 'maintenance'];
  
  if (!validModes.includes(mode)) {
    return res.status(400).json({
      error: 'BAD_REQUEST',
      message: `Invalid mode. Must be one of: ${validModes.join(', ')}`
    });
  }
  
  res.json({
    intersectionId: id,
    operationalMode: mode,
    changedBy: req.user?.email,
    timestamp: new Date().toISOString()
  });
});

// Update Config
app.put('/api/intersections/:id/config', authenticate, authorize('admin'), strictRateLimiter, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { cycleLength, minGreenTime, maxGreenTime } = req.body;
  
  if (minGreenTime && maxGreenTime && minGreenTime > maxGreenTime) {
    return res.status(400).json({
      error: 'BAD_REQUEST',
      message: 'minGreenTime cannot be greater than maxGreenTime'
    });
  }
  
  res.json({
    intersectionId: id,
    cycleLength: cycleLength || 90,
    minGreenTime: minGreenTime || 10,
    maxGreenTime: maxGreenTime || 60,
    updatedBy: req.user?.email
  });
});

// ==================== ERROR HANDLERS ====================

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Endpoint ${req.method} ${req.path} not found`
  });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Something went wrong'
  });
});

export default app;