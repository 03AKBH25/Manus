import "dotenv/config";
import prisma from "./src/db/prisma.js";

async function seed() {
  const user = await prisma.user.create({
    data: {}
  });

  const avatar = await prisma.avatar.create({
    data: {
      name: "Manus AI",
      personality: "Helpful coding assistant"
    }
  });

  console.log("Seeded successfully:");
  console.log("User ID:", user.id);
  console.log("Avatar ID:", avatar.id);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
