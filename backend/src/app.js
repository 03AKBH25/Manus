import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import {
  errorHandler,
  notFoundHandler
} from "./middleware/error.middleware.js";
import { globalApiLimiter } from "./middleware/rate-limit.middleware.js";

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// CORS used for cross origin connection
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed"));
    }
  })
);

// Logging errors and requests for better debugging
app.use(morgan("dev"));

// Body parser
app.use(express.json({ limit: "1mb" }));
app.use(globalApiLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server running is running don't you dare meddle with it!"
  });
});

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/chat", chatRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
