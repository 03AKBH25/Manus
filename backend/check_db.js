import prisma from "./src/db/prisma.js";

async function main() {
  const users = await prisma.user.findMany();
  const avatars = await prisma.avatar.findMany();
  console.log("Users:", users);
  console.log("Avatars:", avatars);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
