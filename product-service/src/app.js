const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");

require("dotenv").config();

const app = express();

// Security & Logging Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true
    },
    customSiteTitle: "Product Service API Docs"
  })
);

// Swagger JSON
app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: process.env.SERVICE_NAME,
    uptime: process.uptime()
  });
});

// Product routes
app.use("/api/products", productRoutes);

// Global Error Handler
// Phải đặt cuối cùng
app.use(errorHandler);

module.exports = app;