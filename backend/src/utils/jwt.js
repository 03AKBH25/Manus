import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "development-only-jwt-secret-change-me-immediately";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_ISSUER = process.env.JWT_ISSUER || "manus-ai-memory-agent";

export const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: JWT_EXPIRES_IN,
      issuer: JWT_ISSUER
    }
  );

export const verifyAccessToken = (token) =>
  jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: JWT_ISSUER
  });
