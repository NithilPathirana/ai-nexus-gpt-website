import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/guards";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = await req.json();

  // There should be only ONE settings row.
  const existing = await prisma.adminSetting.findFirst();

  const updated = existing
    ? await prisma.adminSetting.update({
        where: { id: existing.id },
        data,
      })
    : await prisma.adminSetting.create({ data });

  return NextResponse.json({ ok: true, settings: updated });
}
