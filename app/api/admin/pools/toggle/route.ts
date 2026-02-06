import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/guards";

export async function POST(req: Request) {
  await requireAdmin();

  const { poolId } = await req.json();
  const pool = await prisma.accountPool.findUnique({ where: { id: poolId } });
  if (!pool) return NextResponse.json({ error: "Pool not found" }, { status: 404 });

  const updated = await prisma.accountPool.update({ where: { id: poolId }, data: { isActive: !pool.isActive } });
  return NextResponse.json({ ok: true, pool: updated });
}
