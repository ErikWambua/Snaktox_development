const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');

const app = express();

// Connect to database
connectDB();

// Initialize default admin user
const initializeAdmin = require('./scripts/startup');
mongoose.connection.once('open', async () => {
  console.log('📊 MongoDB connected successfully');
  await initializeAdmin();
});

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/snakes', require('./routes/snakeRoutes'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/emergencies', require('./routes/emergencyRoutes'));
app.use('/api/education', require('./routes/educationRoutes'));
app.use('/api/sms', require('./routes/smsRoutes'));

// Health Check with DB status
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    success: true,
    message: 'SnaKTox API is running',
    data: {
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: process.env.NODE_ENV,
      version: '1.0.0'
    }
  });
});

// 404 Handler - must be before error handling middleware
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error Handling Middleware - must be last
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

// Only start the server when run directly. This allows tests to import the app without
// creating a listening server.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 SnaKTox server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;