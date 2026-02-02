import { prisma } from "@/lib/prisma";

export async function listPoolsWithAvailability() {
  const pools = await prisma.accountPool.findMany({
    where: { isActive: true },
    include: { slots: true },
    orderBy: { createdAt: "asc" },
  });

  return pools.map((p) => ({
    id: p.id,
    name: p.name,
    totalSlots: p.totalSlots,
    usedSlots: p.slots.length,
    available: Math.max(0, p.totalSlots - p.slots.length),
  }));
}

export async function assignSlotToUser(userId: string, poolId: string) {
  const existing = await prisma.poolSlot.findUnique({ where: { userId } });
  if (existing) return existing;

  const pool = await prisma.accountPool.findUnique({
    where: { id: poolId },
    include: { slots: true },
  });
  if (!pool || !pool.isActive) throw new Error("Pool not available");

  const available = pool.totalSlots - pool.slots.length;
  if (available <= 0) throw new Error("Pool is full");

  return prisma.poolSlot.create({ data: { userId, poolId } });
}

export async function releaseSlotIfAny(userId: string) {
  const existing = await prisma.poolSlot.findUnique({ where: { userId } });
  if (!existing) return;
  await prisma.poolSlot.delete({ where: { userId } });
}
