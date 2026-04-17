import hindsight from "../config/hindsight.js";

const buildAvatarMemoryNamespace = (userId, avatarId) =>
  `user:${userId}:avatar:${avatarId}`;

const buildCollectiveMemoryNamespace = (userId) => `user:${userId}:collective`;

export const recallMemory = async (userId, avatarId, message, options = {}) => {
  try {
    const namespace = options.collective
      ? buildCollectiveMemoryNamespace(userId)
      : buildAvatarMemoryNamespace(userId, avatarId);

    const memories = await hindsight.recall(namespace, message);

    return memories || [];
  } catch (error) {
    console.error("Memory recall error:", error);
    return [];
  }
};

export const storeMemory = async (userId, avatarId, message, response) => {
  const avatarNamespace = buildAvatarMemoryNamespace(userId, avatarId);
  const collectiveNamespace = buildCollectiveMemoryNamespace(userId);
  const memoryPayload = `User: ${message}\nAI: ${response}`;

  try {
    await Promise.all([
      hindsight.retain(avatarNamespace, memoryPayload),
      hindsight.retain(collectiveNamespace, memoryPayload)
    ]);
  } catch (error) {
    console.error("Memory store error:", error);
  }
};
