import prisma from "../db/prisma.js";
import { generateResponse } from "./llm.service.js";
import { recallMemory, storeMemory } from "./memory.service.js";
import { memoryQueue } from "../queue/queue.js";

export const handleChat = async ({ userId, avatarId, message }) => {

  // Step 1: Recall memory
const memories = await recallMemory(userId, message);

// Step 2: Get avatar
const avatar = await prisma.avatar.findUnique({
  where: { id: avatarId }
});

if (!avatar) {
  throw new Error("Avatar not found");
}

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
const history = recentChats
  .reverse()
  .flatMap(chat => [
    {
      role: "user",
      content: chat.message
    },
    {
      role: "assistant",
      content: chat.response
    }
  ]);

// Step 4: Generate response (FIXED)
const aiResponse = await generateResponse(
  message,
  memories,
  avatar,
  history
);
  // Step 3: Store chat in DB
  await prisma.chat.create({
    data: {
      userId,
      avatarId,
      message,
      response: aiResponse
    }
  });

  // Add job instead of direct call
  await memoryQueue.add("storeMemory", {
    userId,
    message,
    response: aiResponse
  });

  return {
    message,
    response: aiResponse,
    memoriesUsed: memories
  };
};