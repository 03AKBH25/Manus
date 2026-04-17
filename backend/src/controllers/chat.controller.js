import {
  getConversationHistory,
  getExperienceBootstrap,
  handleChat,
  syncCuratedAvatar
} from "../services/chat.service.js";

const getRequiredValue = (value) =>
  typeof value === "string" ? value.trim() : "";

export const chatHandler = async (req, res, next) => {
  try {
    const { avatarId, message } = req.validated.body;
    const response = await handleChat({
      userId: req.user.id,
      avatarId,
      message
    });

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error("Chat Error:", error);
    next(error);
  }
};

export const bootstrapHandler = async (req, res, next) => {
  try {
    const payload = await getExperienceBootstrap(req.user.id);

    res.json({
      success: true,
      data: payload
    });
  } catch (error) {
    console.error("Bootstrap Error:", error);
    next(error);
  }
};

export const historyHandler = async (req, res, next) => {
  try {
    const avatarId = req.validated.query.avatarId;
    const limit = Number.parseInt(getRequiredValue(req.query.limit), 10) || 16;
    const messages = await getConversationHistory(req.user.id, avatarId, limit);

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error("History Error:", error);
    next(error);
  }
};

export const curatedAvatarHandler = async (req, res, next) => {
  try {
    const curatedAvatar = await syncCuratedAvatar(req.user.id, {
      activateCurated: true
    });

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
    next(error);
  }
};
