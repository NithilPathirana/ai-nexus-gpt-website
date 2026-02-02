import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = String(url.searchParams.get("id") || "").trim();

    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        slot: { select: { startsAt: true, endsAt: true } },
        lead: { select: { email: true, phone: true, country: true, timezone: true } },
      },
    });

    if (!booking) return NextResponse.json({ error: "Not found." }, { status: 404 });

    return NextResponse.json({
      ok: true,
      booking: {
        id: booking.id,
        slotId: booking.slotId,
        startsAt: booking.slot.startsAt,
        endsAt: booking.slot.endsAt,
        timezone: booking.timezone || booking.lead.timezone || null,
        lead: booking.lead,
      },
    });
  } catch (e) {
    console.error("BOOKING GET ERROR:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
