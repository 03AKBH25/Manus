import express from "express";
import {
  loginHandler,
  meHandler,
  registerHandler,
  updateMeHandler
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rate-limit.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  validateRequest([
    {
      field: "name",
      required: true,
      type: "string",
      minLength: 2,
      maxLength: 60
    },
    {
      field: "email",
      required: true,
      type: "string",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      transform: "lowercase",
      message: "email must be a valid email address"
    },
    {
      field: "password",
      required: true,
      type: "string",
      minLength: 8,
      maxLength: 128
    }
  ]),
  registerHandler
);

router.post(
  "/login",
  authLimiter,
  validateRequest([
    {
      field: "email",
      required: true,
      type: "string",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      transform: "lowercase",
      message: "email must be a valid email address"
    },
    {
      field: "password",
      required: true,
      type: "string",
      minLength: 8,
      maxLength: 128
    }
  ]),
  loginHandler
);

router.get("/me", requireAuth, meHandler);

router.patch(
  "/me",
  requireAuth,
  validateRequest([
    {
      field: "name",
      required: true,
      type: "string",
      minLength: 2,
      maxLength: 60
    }
  ]),
  updateMeHandler
);

export default router;
