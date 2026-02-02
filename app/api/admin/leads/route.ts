import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const leads = await prisma.onboardingLead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        bookings: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            slot: {
              select: { startsAt: true, endsAt: true },
            },
          },
        },
      },
    });

    // flatten "latest booking"
    const rows = leads.map((l) => {
      const b = l.bookings?.[0] ?? null;
      return {
        id: l.id,
        email: l.email,
        phone: l.phone,
        country: l.country,
        timezone: l.timezone,
        createdAt: l.createdAt,
        latestBooking: b
          ? {
              id: b.id,
              timezone: b.timezone ?? null,
              zoomJoinUrl: b.zoomJoinUrl ?? null,
              startsAt: b.slot?.startsAt ?? null,
              endsAt: b.slot?.endsAt ?? null,
            }
          : null,
      };
    });

    return NextResponse.json({ ok: true, leads: rows });
  } catch (e) {
    console.error("ADMIN LEADS GET ERROR:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
