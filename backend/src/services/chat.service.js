import prisma from "../db/prisma.js";
import { generateResponse } from "./llm.service.js";

export const handleChat = async ({ userId, avatarId, message }) => {
  
  // Step 1: Generate AI response
  const aiResponse = await generateResponse(message);

  // Step 2: Store in DB
  await prisma.chat.create({
    data: {
      userId,
      avatarId,
      message,
      response: aiResponse
    }
  });

  return {
    message,
    response: aiResponse
  };
};