/*
  Optional seed script.

  Usage:
    1) Set DATABASE_URL
    2) npm run seed

  This will create:
    - a sample onboarding slot (tomorrow 10:00 UTC) if none exist
*/

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.onboardingSlot.count();
  if (existing === 0) {
    const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    startsAt.setUTCHours(10, 0, 0, 0);
    await prisma.onboardingSlot.create({
      data: { startsAt, capacity: 10, isActive: true },
    });
    console.log("Seeded: 1 onboarding slot");
  } else {
    console.log("Seed skipped: slots already exist");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
