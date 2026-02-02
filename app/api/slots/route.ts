import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    const slots = await prisma.slot.findMany({
      where: {
        isActive: true,
        startsAt: { gt: now },
        bookings: { none: {} }, // only slots not booked yet
      },
      orderBy: { startsAt: "asc" },
      take: 60,
    });

    return NextResponse.json({
      ok: true,
      slots: slots.map((s) => ({
        id: s.id,
        startsAt: s.startsAt.toISOString(),
        endsAt: s.endsAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("SLOTS API ERROR:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

