import prisma from "../db/prisma.js";
import { getUserInsights, syncPersonaSummary } from "./avatar.service.js";
import { HttpError } from "../utils/http-error.js";

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const getProfileSnapshot = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const insights = await getUserInsights(userId);
  await syncPersonaSummary(userId, insights);

  return {
    user: sanitizeUser(user),
    insights
  };
};
