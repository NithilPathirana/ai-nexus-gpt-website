import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Creates 6 slots starting tomorrow, 30 min each
    const now = new Date();
    const base = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    base.setMinutes(0, 0, 0);

    const slotsToCreate: { startsAt: Date; endsAt: Date; isActive: boolean }[] = [];

    for (let i = 0; i < 6; i++) {
      const startsAt = new Date(base.getTime() + i * 60 * 60 * 1000);
      const endsAt = new Date(startsAt.getTime() + 30 * 60 * 1000);
      slotsToCreate.push({ startsAt, endsAt, isActive: true });
    }

    await prisma.slot.createMany({ data: slotsToCreate });

    return NextResponse.json({ ok: true, created: slotsToCreate.length });
  } catch (e) {
    console.error("SEED SLOTS ERROR:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
