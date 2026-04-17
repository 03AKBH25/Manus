import hindsight from "../config/hindsight.js";

export const recallMemory = async (userId, message) => {
  try {
    const memories = await hindsight.recall(userId, message);

    return memories || [];
  } catch (error) {
    console.error("Memory recall error:", error);
    return [];
  }
};

export const storeMemory = async (userId, message, response) => {
  try {
    await hindsight.retain(userId, `User: ${message}\nAI: ${response}`);
  } catch (error) {
    console.error("Memory store error:", error);
  }
};