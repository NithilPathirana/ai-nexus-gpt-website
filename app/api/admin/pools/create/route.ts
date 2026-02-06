import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/guards";

export async function POST(req: Request) {
  await requireAdmin();

  const { name, totalSlots } = await req.json();
  const pool = await prisma.accountPool.create({ data: { name: String(name), totalSlots: Number(totalSlots || 10) } });
  return NextResponse.json({ ok: true, pool });
}
