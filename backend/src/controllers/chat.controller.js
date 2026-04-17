import {
  getConversationHistory,
  getExperienceBootstrap,
  handleChat,
  syncCuratedAvatar
} from "../services/chat.service.js";

const getRequiredValue = (value) =>
  typeof value === "string" ? value.trim() : "";

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

export const bootstrapHandler = async (req, res) => {
  try {
    const userId = getRequiredValue(req.query.userId);

    if (!userId) {
      return res.status(400).json({
        error: "Missing required userId"
      });
    }

    const payload = await getExperienceBootstrap(userId);

    res.json({
      success: true,
      data: payload
    });
  } catch (error) {
    console.error("Bootstrap Error:", error);
    res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
};

export const historyHandler = async (req, res) => {
  try {
    const userId = getRequiredValue(req.query.userId);
    const avatarId = getRequiredValue(req.query.avatarId);
    const limit = Number.parseInt(req.query.limit, 10) || 16;

    if (!userId || !avatarId) {
      return res.status(400).json({
        error: "Missing required userId or avatarId"
      });
    }

    const messages = await getConversationHistory(userId, avatarId, limit);

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error("History Error:", error);
    res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
};

export const curatedAvatarHandler = async (req, res) => {
  try {
    const userId = getRequiredValue(req.body.userId);

    if (!userId) {
      return res.status(400).json({
        error: "Missing required userId"
      });
    }

    const curatedAvatar = await syncCuratedAvatar(userId);

    res.json({
      success: true,
      data: {
        avatar: {
          ...curatedAvatar,
          insights: undefined
        },
        insights: curatedAvatar.insights
      }
    });
  } catch (error) {
    console.error("Curated Avatar Error:", error);
    res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
};
