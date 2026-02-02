import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

async function requireAdmin() {
  const cookieStore = await cookies();
  const ok = cookieStore.get("nexus_admin")?.value === "1";
  return ok;
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  // Safer than hard delete: disable it
  const updated = await prisma.slot.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ ok: true, slot: updated });
}
