import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import chatRoutes from "./routes/chat.routes.js"

const app = express();

// Security middleware
app.use(helmet());

// CORS used for cross origin connection
app.use(cors());

// Logging errors and requests for better debugging
app.use(morgan("dev"));

// Body parser
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server running is running don't you dare meddle with it!"
  });
});

app.use("/chat", chatRoutes)

export default app;