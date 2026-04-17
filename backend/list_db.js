import "dotenv/config";
import prisma from "./src/db/prisma.js";

async function main() {
  const users = await prisma.user.findMany();
  const avatars = await prisma.avatar.findMany();
  console.log("Current Users in DB:", users.map(u => u.id));
  console.log("Current Avatars in DB:", avatars.map(a => a.id));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
