import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const id = url.searchParams.get("id") || "";

    if (!id) {
      return NextResponse.json({ error: "Missing booking id" }, { status: 400 });
    }

    // Update whatever "complete" means in your schema.
    // In your schema you have Booking.status, so we mark it completed.
    const updated = await prisma.booking.update({
      where: { id },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({ ok: true, booking: updated });
  } catch (e: any) {
    if (String(e?.message || "").toLowerCase().includes("unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("ADMIN BOOKINGS COMPLETE ERROR:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
