import "dotenv/config";
import prisma from "./src/db/prisma.js";

async function seed() {
  const user = await prisma.user.upsert({
    where: { id: "40f09f7d-8ac4-4e8a-a790-fedf89407223" },
    update: {},
    create: { id: "40f09f7d-8ac4-4e8a-a790-fedf89407223" }
  });

  const avatars = [
    {
      id: "wife-avatar-id",
      name: "Angry Wife",
      personality: "sarcastic, emotional, expressive, easily annoyed but secretly caring"
    },
    {
      id: "friend-avatar-id",
      name: "Calm Friend",
      personality: "supportive, calm, wise, good listener, peaceful"
    },
    {
      id: "stranger-avatar-id",
      name: "Stranger on Train",
      personality: "curious, mysterious, polite, observant, philosophical"
    }
  ];

  for (const a of avatars) {
    await prisma.avatar.upsert({
      where: { id: a.id },
      update: { name: a.name, personality: a.personality },
      create: a
    });
  }

  console.log("Seeded successfully:");
  console.log("User ID:", user.id);
  avatars.forEach(a => console.log(`${a.name} ID: ${a.id}`));
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
