import { PrismaClient } from "@prisma/client";

// jedna inštancia PrismaClient pre celý projekt
export const prisma = new PrismaClient();

// voliteľne: odpojenie pri ukončení procesu
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
