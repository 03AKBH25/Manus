import express from "express";
import {
  bootstrapHandler,
  chatHandler,
  curatedAvatarHandler,
  historyHandler
} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/bootstrap", bootstrapHandler);
router.get("/history", historyHandler);
router.post("/curated-avatar", curatedAvatarHandler);
router.post("/", chatHandler);

export default router;
