import { prisma } from "@/lib/prisma";

export async function listPoolsWithAvailability() {
  const pools = await prisma.accountPool.findMany({
    where: { isActive: true },
    include: { slots: true },
    orderBy: { createdAt: "asc" },
  });

  return pools.map((p) => {
    const available = p.slots.filter((s) => s.isAvailable).length;
    const usedSlots = p.slots.filter((s) => !s.isAvailable).length;

    return {
      id: p.id,
      name: p.name,
      totalSlots: p.totalSlots,
      usedSlots,
      available,
    };
  });
}

export async function assignSlotToUser(userId: string, poolId: string) {
  const existing = await prisma.poolSlot.findUnique({ where: { userId } });
  if (existing) return existing;

  const pool = await prisma.accountPool.findUnique({ where: { id: poolId } });
  if (!pool || !pool.isActive) throw new Error("Pool not available");

  const free = await prisma.poolSlot.findFirst({
    where: { poolId, isAvailable: true },
    orderBy: { createdAt: "asc" },
  });

  if (!free) throw new Error("Pool is full");

  return prisma.poolSlot.update({
    where: { id: free.id },
    data: { userId, isAvailable: false },
  });
}

export async function releaseSlotIfAny(userId: string) {
  const existing = await prisma.poolSlot.findUnique({ where: { userId } });
  if (!existing) return;

  await prisma.poolSlot.update({
    where: { id: existing.id },
    data: { userId: null, isAvailable: true },
  });
}
