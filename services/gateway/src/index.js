const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  }),
);

// Logging
app.use(morgan("combined"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api/", limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 requests per 15 minutes for auth
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
});

// Service URLs
const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
  products: process.env.PRODUCTS_SERVICE_URL || "http://localhost:3002",
  orders: process.env.ORDERS_SERVICE_URL || "http://localhost:3003",
};

// Proxy options factory
const createProxyOptions = (target, pathRewrite = {}) => ({
  target,
  changeOrigin: true,
  pathRewrite,
  onProxyReq: (proxyReq, req) => {
    // Forward original IP for logging
    proxyReq.setHeader("X-Forwarded-For", req.ip);
    proxyReq.setHeader("X-Real-IP", req.ip);
  },
  onError: (err, req, res) => {
    console.error(`Proxy error: ${err.message}`);
    res.status(503).json({
      success: false,
      message: "Service temporarily unavailable",
    });
  },
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "api-gateway",
    timestamp: new Date().toISOString(),
  });
});

// Service health checks
app.get("/health/services", async (req, res) => {
  const checks = await Promise.all(
    Object.entries(SERVICES).map(async ([name, url]) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${url}/health`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        return { name, status: response.ok ? "healthy" : "unhealthy", url };
      } catch (error) {
        return { name, status: "unreachable", url, error: error.message };
      }
    }),
  );

  const allHealthy = checks.every((c) => c.status === "healthy");

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "ok" : "degraded",
    services: checks,
    timestamp: new Date().toISOString(),
  });
});

// Auth Service Routes
app.use(
  "/api/auth",
  authLimiter,
  createProxyMiddleware(
    createProxyOptions(SERVICES.auth, {
      "^/api/auth": "/api/auth",
    }),
  ),
);

// Products Service Routes
app.use(
  "/api/products",
  createProxyMiddleware(
    createProxyOptions(SERVICES.products, {
      "^/api/products": "/api/products",
    }),
  ),
);

// Orders Service Routes (includes cart)
app.use(
  "/api/orders",
  createProxyMiddleware(
    createProxyOptions(SERVICES.orders, {
      "^/api/orders": "/api/orders",
    }),
  ),
);

app.use(
  "/api/cart",
  createProxyMiddleware(
    createProxyOptions(SERVICES.orders, {
      "^/api/cart": "/api/cart",
    }),
  ),
);

// Payments Routes (part of orders service)
app.use(
  "/api/payments",
  createProxyMiddleware(
    createProxyOptions(SERVICES.orders, {
      "^/api/payments": "/api/payments",
    }),
  ),
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Gateway error:", err);
  res.status(500).json({
    success: false,
    message: "Internal gateway error",
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log("Proxying to services:");
  Object.entries(SERVICES).forEach(([name, url]) => {
    console.log(`  - ${name}: ${url}`);
  });
});

module.exports = app;
