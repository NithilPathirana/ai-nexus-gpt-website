import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// If you already use NextAuth, we can protect properly.
// If you DON’T have NextAuth set up, scroll down for a quick fallback.
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // <-- IMPORTANT: adjust if your authOptions live elsewhere

function getAdminEmails() {
  // supports either ADMIN_EMAILS="a@x.com,b@y.com" or ADMIN_EMAIL="a@x.com"
  const list =
    process.env.ADMIN_EMAILS ||
    process.env.ADMIN_EMAIL ||
    "";

  return list
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function GET(req: Request) {
  try {
    // ---- Protect this endpoint ----
    const session = await getServerSession(authOptions);
    const adminEmails = getAdminEmails();

    const userEmail = String(session?.user?.email || "").toLowerCase();
    const isAdmin = !!userEmail && adminEmails.includes(userEmail);

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Optional filters
    const url = new URL(req.url);
    const upcoming = url.searchParams.get("upcoming") === "1";

    const now = new Date();

    const rows = await prisma.booking.findMany({
      where: upcoming
        ? {
            slot: {
              startsAt: { gte: now },
            },
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        lead: { select: { email: true, phone: true, country: true, timezone: true } },
        slot: { select: { startsAt: true, endsAt: true } },
      },
    });

    const bookings = rows.map((b) => ({
      id: b.id,
      createdAt: b.createdAt,
      timezone: b.timezone,
      lead: b.lead,
      slot: b.slot,
    }));

    return NextResponse.json({ ok: true, bookings });
  } catch (e) {
    console.error("ADMIN BOOKINGS API ERROR:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}