import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/guards";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, totalSlots } = await req.json();
  const pool = await prisma.accountPool.create({ data: { name: String(name), totalSlots: Number(totalSlots || 10) } });
  return NextResponse.json({ ok: true, pool });
}
