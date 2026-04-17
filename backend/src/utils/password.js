import crypto from "crypto";

const SCRYPT_KEY_LENGTH = 64;

const scryptAsync = (password, salt) =>
  new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, SCRYPT_KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });

export const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt);

  return `${salt}:${derivedKey.toString("hex")}`;
};

export const verifyPassword = async (password, storedHash) => {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }

  const [salt, hashedValue] = storedHash.split(":");
  const derivedKey = await scryptAsync(password, salt);
  const hashedBuffer = Buffer.from(hashedValue, "hex");

  if (hashedBuffer.length !== derivedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(hashedBuffer, derivedKey);
};
