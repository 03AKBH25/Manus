import prisma from "../db/prisma.js";
import { generateResponse } from "./llm.service.js";
import { recallMemory, storeMemory } from "./memory.service.js";

export const handleChat = async ({ userId, avatarId, message }) => {

  // Step 1: Recall memory
  const memories = await recallMemory(userId, message);

  // Step 2: Generate response with memory
  const aiResponse = await generateResponse(message, memories);

  // Step 3: Store chat in DB
  await prisma.chat.create({
    data: {
      userId,
      avatarId,
      message,
      response: aiResponse
    }
  });

  // Step 4: Store memory (temporary sync, later async via queue)
  await storeMemory(userId, message, aiResponse);

  return {
    message,
    response: aiResponse,
    memoriesUsed: memories
  };
};