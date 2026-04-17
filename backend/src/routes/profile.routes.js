import express from "express";
import { myProfileHandler } from "../controllers/profile.controller.js";
import { authorizeRoles, requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", requireAuth, authorizeRoles("USER", "ADMIN"), myProfileHandler);

export default router;
