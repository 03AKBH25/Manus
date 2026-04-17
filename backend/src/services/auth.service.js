import prisma from "../db/prisma.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signAccessToken } from "../utils/jwt.js";
import { HttpError } from "../utils/http-error.js";

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const normalizeEmail = (email) => email.trim().toLowerCase();

const resolveRoleForRegistration = async () => {
  const registeredUsers = await prisma.user.count({
    where: {
      email: {
        not: null
      }
    }
  });

  return registeredUsers === 0 ? "ADMIN" : "USER";
};

export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (existingUser) {
    throw new HttpError(409, "An account with that email already exists");
  }

  const passwordHash = await hashPassword(password);
  const role = await resolveRoleForRegistration();
  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      role
    }
  });

  return {
    token: signAccessToken(user),
    user: sanitizeUser(user)
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (!user?.passwordHash) {
    throw new HttpError(401, "Invalid email or password");
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    throw new HttpError(401, "Invalid email or password");
  }

  return {
    token: signAccessToken(user),
    user: sanitizeUser(user)
  };
};

export const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return sanitizeUser(user);
};

export const updateCurrentUser = async (userId, { name }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name
    }
  });

  return sanitizeUser(user);
};
