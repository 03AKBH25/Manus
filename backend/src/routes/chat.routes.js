import express from "express";
import {
  bootstrapHandler,
  chatHandler,
  curatedAvatarHandler,
  historyHandler
} from "../controllers/chat.controller.js";
import { authorizeRoles, requireAuth } from "../middleware/auth.middleware.js";
import { chatLimiter } from "../middleware/rate-limit.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router = express.Router();

router.use(requireAuth);
router.use(authorizeRoles("USER", "ADMIN"));
router.use(chatLimiter);

router.get("/bootstrap", bootstrapHandler);
router.get(
  "/history",
  validateRequest([
    {
      source: "query",
      field: "avatarId",
      required: true,
      type: "string",
      minLength: 3,
      maxLength: 120
    }
  ]),
  historyHandler
);
router.post("/curated-avatar", curatedAvatarHandler);
router.post(
  "/",
  validateRequest([
    {
      field: "avatarId",
      required: true,
      type: "string",
      minLength: 3,
      maxLength: 120
    },
    {
      field: "message",
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 2000
    }
  ]),
  chatHandler
);

export default router;
