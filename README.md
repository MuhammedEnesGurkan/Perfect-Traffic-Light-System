# 🚦 Perfect Traffic Light System

A comprehensive traffic management platform with JWT Authentication, Emergency Vehicle Priority System, Rule-Based Optimization, Sensor Integration, and Statistical Reporting.

## 👥 Team Members
- **Mustafa Akyüz**
- **Ali Özen**
- **Muhammed Enes Gürkan**
- **Ali İsakoca**
- **Bedirhan Yiğit**

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Frontend Development](#frontend-development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Perfect Traffic Light System is a full-stack application designed to optimize traffic flow through intelligent intersection management. The system supports emergency vehicle prioritization, dynamic traffic rule applications based on real-time sensor data, and comprehensive statistical analysis.

### Key Capabilities
- **JWT-based Authentication** with role-based access control
- **Emergency Vehicle Detection** with automatic green light prioritization
- **Intelligent Traffic Optimization** using rule engine
- **Real-time Sensor Integration** for traffic monitoring
- **Comprehensive Dashboard** with statistics and reporting

---

## ✨ Features

### 🔐 Authentication System
- Secure JWT token-based authentication
- BCrypt password encryption
- Role-based access (USER, ADMIN)
- 24-hour token validity

**Default Users:**
```
Username: admin    | Password: admin123  | Role: ADMIN
Username: user     | Password: user123   | Role: USER
```

### 🚨 Emergency Vehicle Priority
- Automatic detection and prioritization
- Supported vehicles: 🚑 Ambulance, 🚒 Fire Truck, 🚓 Police
- Instant green light activation (60 seconds)
- Safety protocol for surrounding intersections
- Complete event logging and history

### 🎯 Traffic Optimization
- Dynamic green light duration adjustment
- Time-based and density-based rules
- Real-time sensor data processing
- Performance metrics calculation
- Automated rule application history

**Default Rules:**
1. **PEAK_HOUR_EXTENSION** - Extended duration during rush hours (07:00-09:00)
2. **HIGH_DENSITY_BOOST** - Extra time for high traffic (40+ vehicles)
3. **NIGHT_MODE_QUICK** - Faster cycles at night (00:00-06:00)

### 📡 Sensor Integration
- Real-time traffic data collection
- Vehicle count and speed monitoring
- Density level classification:
  - 🟢 LOW: 0-9 vehicles
  - 🟡 MEDIUM: 10-29 vehicles
  - 🟠 HIGH: 30-49 vehicles
  - 🔴 CRITICAL: 50+ vehicles

### 📊 Statistics & Reporting
- Real-time system status monitoring
- Daily and weekly performance summaries
- Interactive dashboard with charts
- Intersection comparison analytics
- Emergency vehicle statistics

---

## 🛠 Technology Stack

### Backend
- **Framework:** Spring Boot 3.2.0
- **Database:** PostgreSQL 15
- **Authentication:** JWT (JSON Web Token)
- **Migration:** Flyway
- **API Docs:** Swagger/OpenAPI 3.0
- **Container:** Docker + Docker Compose

### Frontend
- **Framework:** React 18
- **Build Tool:** Create React App
- **HTTP Client:** Axios
- **Charts:** Chart.js / Recharts
- **UI Components:** Custom + shadcn/ui (optional)

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (latest version)
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Git**
- **Web Browser** (Chrome, Firefox, or Edge)

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd perfect-traffic-light-system
```

### Step 2: Backend Setup

Navigate to the backend directory:
```bash
cd Backend
```

#### Clean Installation (First Time)
```bash
# Remove any existing containers and volumes
docker-compose down -v

# Build and start the containers
docker-compose up --build -d

# Monitor the logs
docker-compose logs -f app
```

#### Verify Backend Installation
Watch the logs for successful migration messages:
```
Flyway: Migrating schema "public" to version "4 - create emergency system tables"
Flyway: Migrating schema "public" to version "5 - create optimization system tables"
Flyway: Successfully applied migrations
```

#### Initialize Default Rules
```bash
# Access Swagger UI
http://localhost:8080/swagger-ui.html

# Execute this endpoint once:
POST /api/optimization/rules/create-defaults
```

### Step 3: Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd Frontend
```

#### Install Dependencies
```bash
npm install
```

#### Configure API Endpoint
Ensure your API base URL is set correctly in your frontend configuration:
```javascript
// src/config/api.js or similar
export const API_BASE_URL = 'http://localhost:8080/api';
```

---

## 🎬 Running the Application

### Backend
```bash
cd Backend

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Stop and remove all data
docker-compose down -v
```

The backend will be available at:
- **API:** http://localhost:8080/api
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **Health Check:** http://localhost:8080/api/health

### Frontend
```bash
cd Frontend

# Development mode
npm start
```

The application will open automatically at http://localhost:3000

#### Other Frontend Commands
```bash
# Run tests
npm test

# Production build
npm run build

# Analyze bundle size
npm run build
# Then check the build folder
```

---

## 📚 API Documentation

### Swagger UI
Access the interactive API documentation at:
**http://localhost:8080/swagger-ui.html**

### Authentication Flow

#### 1. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "username": "admin",
  "isAdmin": true
}
```

#### 2. Use Token in Requests
```bash
GET /api/statistics/dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Main Endpoints

#### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/validate` - Validate token

#### Emergency System (Protected)
- `POST /api/emergency/trigger` - Detect emergency vehicle
- `POST /api/emergency/clear/{id}` - Clear emergency
- `GET /api/emergency/active` - List active emergencies
- `GET /api/emergency/history/{id}` - Get vehicle history
- `POST /api/emergency/test/ambulance` - Test ambulance scenario
- `POST /api/emergency/test/firetruck` - Test fire truck scenario
- `POST /api/emergency/test/police` - Test police scenario

#### Traffic Optimization (Protected)
- `POST /api/optimization/apply` - Apply optimization
- `GET /api/optimization/rules` - List all rules
- `GET /api/optimization/rules/active` - Get active rules
- `POST /api/optimization/rules/create-defaults` - Create default rules
- `POST /api/optimization/sensor/data` - Send sensor data
- `GET /api/optimization/sensor/intersection/{id}` - Get sensor data

#### Statistics (Protected)
- `GET /api/statistics/daily-summary` - Daily report
- `GET /api/statistics/weekly-performance` - Weekly stats
- `GET /api/statistics/system-status` - Real-time status
- `GET /api/statistics/dashboard` - Complete dashboard
- `GET /api/statistics/chart-data` - Chart data
- `GET /api/statistics/emergency-stats` - Emergency statistics

---

## 🎨 Frontend Development

### Project Structure
```
Frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── emergency/
│   │   └── optimization/
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   ├── App.js
│   └── index.js
└── package.json
```

### API Service Configuration
```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Add token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Example Component
```javascript
// src/components/emergency/EmergencyTrigger.jsx
import React, { useState } from 'react';
import api from '../../services/api';

const EmergencyTrigger = () => {
  const [loading, setLoading] = useState(false);

  const triggerEmergency = async (vehicleType) => {
    setLoading(true);
    try {
      const response = await api.post('/emergency/trigger', {
        vehicleId: `${vehicleType}-${Date.now()}`,
        type: vehicleType,
        intersectionId: 1,
        direction: 'NORTH'
      });
      alert(response.data.message);
    } catch (error) {
      alert('Error triggering emergency');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emergency-panel">
      <h3>🚨 Emergency Vehicle Detection</h3>
      <button onClick={() => triggerEmergency('AMBULANCE')} disabled={loading}>
        🚑 Ambulance
      </button>
      <button onClick={() => triggerEmergency('FIRE_TRUCK')} disabled={loading}>
        🚒 Fire Truck
      </button>
      <button onClick={() => triggerEmergency('POLICE')} disabled={loading}>
        🚓 Police
      </button>
    </div>
  );
};

export default EmergencyTrigger;
```

---

## 🧪 Testing

### Backend Testing

#### Health Check
```bash
curl http://localhost:8080/api/health
```

#### Complete Test Flow
```bash
# 1. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. Trigger Emergency (use token from step 1)
curl -X POST http://localhost:8080/api/emergency/test/ambulance \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 3. Check Active Emergencies
curl -X GET http://localhost:8080/api/emergency/active \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. Get Dashboard Stats
curl -X GET http://localhost:8080/api/statistics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Frontend Testing
```bash
cd Frontend

# Run test suite
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

---

## 🔧 Troubleshooting

### Backend Issues

#### Docker Container Won't Start
```bash
# Check logs
docker-compose logs app
docker-compose logs postgres

# Restart everything
docker-compose down -v
docker-compose up --build -d
```

#### Database Connection Error
```bash
# Verify PostgreSQL is running
docker-compose ps

# Check database logs
docker-compose logs postgres

# Recreate database
docker-compose down -v
docker-compose up -d postgres
docker-compose up -d app
```

#### Migration Errors
```bash
# View migration status
docker-compose exec postgres psql -U trafficlight -d trafficlight_db

# In psql:
SELECT * FROM flyway_schema_history;
\q

# Reset database (WARNING: deletes all data)
docker-compose exec postgres psql -U trafficlight -d trafficlight_db
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
\q

# Restart application
docker-compose restart app
```

### Frontend Issues

#### Port 3000 Already in Use
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

#### API Connection Issues
- Verify backend is running: http://localhost:8080/api/health
- Check CORS configuration in backend
- Verify API_BASE_URL in frontend configuration
- Check browser console for errors

#### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
npm install
```

### JWT Token Issues

#### Token Expired
- Tokens are valid for 24 hours
- Login again to get a new token
- Implement automatic token refresh in frontend

#### Invalid Token Format
- Ensure "Bearer " prefix is included
- Check token is not truncated
- Verify token is stored correctly in localStorage

---

## 📝 Additional Notes

### Important Reminders
1. **First Setup:** Run `POST /api/optimization/rules/create-defaults` to create default traffic rules
2. **JWT Token:** Valid for 24 hours, requires re-login after expiration
3. **Database:** Using `docker-compose down -v` will delete all data
4. **Swagger:** Always available at http://localhost:8080/swagger-ui.html for API reference

### Performance Tips
- Adjust frontend polling intervals based on needs (recommended: 5-10 seconds)
- Cache chart data to avoid unnecessary API calls
- Use pagination for large lists
- Monitor Docker resource usage

### Security Considerations
- Change JWT secret in production (use environment variables)
- Always use HTTPS in production
- Consider implementing rate limiting
- Secure admin endpoints appropriately
- Never commit credentials to version control

### Production Deployment
- Set `NODE_ENV=production` for React build
- Configure proper CORS origins
- Use environment-specific configuration files
- Set up proper logging and monitoring
- Configure automated backups for PostgreSQL

---

## 📄 License

This project is part of an academic assignment.

## 🤝 Contributing

This is an academic project. For any questions or suggestions, please contact the team members.

---

**Last Updated:** January 2026  
**Status:** ✅ Production Ready
