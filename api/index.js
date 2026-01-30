import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import serverless from 'serverless-http';

import connectDB from '../server/config/db.js';
import authRoutes from '../server/routes/authRoutes.js';
import productRoutes from '../server/routes/productRoutes.js';
import orderRoutes from '../server/routes/orderRoutes.js';
import paymentRoutes from '../server/routes/paymentRoutes.js';
import wishlistRoutes from '../server/routes/wishlistRoutes.js';
import { notFound, errorHandler } from '../server/middleware/errorMiddleware.js';

// Load env vars
dotenv.config();

// Connect to database (only connect once per cold start)
let isConnected = false;
if (!isConnected) {
  connectDB();
  isConnected = true;
}

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Handle preflight requests
app.options('*', cors());

// Routes - Remove /api prefix since Vercel adds it
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use('/wishlist', wishlistRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Curate API is running...',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      wishlist: '/api/wishlist',
      health: '/api/health',
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Export the Express app for local development
export default app;

// Export serverless handler for Vercel
export const handler = serverless(app);
