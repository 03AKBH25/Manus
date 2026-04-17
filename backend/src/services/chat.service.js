import prisma from "../db/prisma.js";
import { generateResponse } from "./llm.service.js";
import { recallMemory } from "./memory.service.js";
import { memoryQueue } from "../queue/queue.js";
import {
  getConversationHistory,
  getExperienceBootstrap,
  getStructuredMemoryContext,
  getUserInsights,
  resolveAvatarForChat,
  syncAvatarMemoryProfile,
  syncCuratedAvatar,
  syncUserMemoryProfile,
  syncPersonaSummary
} from "./avatar.service.js";

export const handleChat = async ({ userId, avatarId, message }) => {
  // Step 2: Get avatar
  const avatar = await resolveAvatarForChat(userId, avatarId);

  if (!avatar) {
    throw new Error("Avatar not found");
  }

  // Step 1: Recall memory
  const memories = await recallMemory(userId, avatarId, message, {
    collective: avatar.type === "curated"
  });
  const memoryContext = await getStructuredMemoryContext(userId, avatarId);

  // Step 3: Fetch recent conversation history
  const recentChats = await prisma.chat.findMany({
    where: {
      userId,
      avatarId
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 6
  });

  // Convert DB chats → LLM format
  const history = recentChats.reverse().flatMap((chat) => [
    {
      role: "user",
      content: chat.message
    },
    {
      role: "assistant",
      content: chat.response
    }
  ]);

  // Step 4: Generate response
  const aiResponse = await generateResponse(
    message,
    memories,
    avatar,
    history,
    memoryContext
  );
  // Step 3: Store chat in DB
  await prisma.chat.create({
    data: {
      userId,
      avatarId,
      model: aiResponse.model,
      message,
      response: aiResponse.content
    }
  });

  // Add job instead of direct call
  await memoryQueue.add("storeMemory", {
    userId,
    avatarId,
    message,
    response: aiResponse.content
  });

  await Promise.all([
    syncAvatarMemoryProfile(userId, avatarId),
    syncUserMemoryProfile(userId)
  ]);

  const insights = await getUserInsights(userId);
  await syncPersonaSummary(userId, insights);

  const curatedProfileReady = insights.stats.totalChats
    ? await prisma.userMemoryProfile.findUnique({
        where: { userId },
        select: { curatedAvatarReady: true }
      })
    : null;

  const curatedAvatar =
    curatedProfileReady?.curatedAvatarReady
      ? await syncCuratedAvatar(userId, { activateCurated: false })
      : null;

  return {
    message,
    response: aiResponse.content,
    memoriesUsed: memories,
    avatar,
    curatedAvatar: curatedAvatar
      ? {
          ...curatedAvatar,
          insights: undefined
        }
      : null,
    insights
  };
};

export { getConversationHistory, getExperienceBootstrap, syncCuratedAvatar };
