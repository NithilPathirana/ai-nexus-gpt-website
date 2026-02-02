import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const slots = await prisma.slot.findMany({
      where: {
        isActive: true,
        // only show slots that are not already booked
        bookings: { none: {} },
        startsAt: { gt: new Date() }, // future only
      },
      orderBy: { startsAt: "asc" },
      take: 50,
      select: {
        id: true,
        startsAt: true,
        endsAt: true,
      },
    });

    return NextResponse.json({ ok: true, slots });
  } catch (e) {
    console.error("SLOTS API ERROR:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}