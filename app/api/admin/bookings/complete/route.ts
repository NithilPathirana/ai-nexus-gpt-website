import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const upcoming = url.searchParams.get("upcoming") === "1";
    const now = new Date();

    const rows = await prisma.booking.findMany({
      where: upcoming
        ? { slot: { startsAt: { gte: now } } }
        : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        lead: { select: { email: true, phone: true, country: true, timezone: true } },
        slot: { select: { startsAt: true, endsAt: true } },
      },
    });

    return NextResponse.json({ ok: true, bookings: rows });
  } catch (e: any) {
    if (String(e?.message).includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("ADMIN BOOKINGS API ERROR:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
