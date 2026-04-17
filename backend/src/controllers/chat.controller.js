import { handleChat } from "../services/chat.service.js";

export const chatHandler = async (req, res) => {
  try {
    const { userId, avatarId, message } = req.body;

    if (!userId || !avatarId || !message) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    const response = await handleChat({ userId, avatarId, message });

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
};