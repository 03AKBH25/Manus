import { rateLimit } from "express-rate-limit";

const createLimiter = ({ windowMs, limit, message, skipSuccessfulRequests = false }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipSuccessfulRequests,
    message: {
      error: message
    }
  });

export const globalApiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: "Too many API requests from this IP. Please try again later."
});

export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  skipSuccessfulRequests: true,
  message: "Too many authentication attempts. Please wait a few minutes."
});

export const chatLimiter = createLimiter({
  windowMs: 5 * 60 * 1000,
  limit: 40,
  message: "Chat rate limit reached. Please slow down and try again shortly."
});
