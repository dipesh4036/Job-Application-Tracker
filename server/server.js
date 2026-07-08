import express from "express";
import cors from "cors";
import config from "./config/index.js";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import pool from "./db/pool.js";
import { schema } from "./db/schema.js";
import { globalLimiter } from "./middleware/rateLimiter.js";

const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(globalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    environment: config.nodeEnv,
  });
});

// Error handler
app.use(errorHandler);

// Initialize database and start server
const initializeDatabase = async () => {
  try {
    await pool.query(schema);
    console.log("📦 Connected to PostgreSQL");
    console.log("✅ Database tables initialized");
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    process.exit(1);
  }
};

const startServer = async () => {
  await initializeDatabase();

  app.listen(config.port, () => {
    console.log(
      `🚀 Server running on http://localhost:${config.port} [${config.nodeEnv}]`,
    );
  });
};

startServer();
