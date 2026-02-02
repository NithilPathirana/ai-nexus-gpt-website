import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = String(params?.id || "").trim();
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

    // This will also delete related bookings because you used onDelete: Cascade
    await prisma.onboardingLead.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("ADMIN LEAD DELETE ERROR:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
