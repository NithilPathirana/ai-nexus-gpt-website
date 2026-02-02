import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const email = String(body?.email || "").trim().toLowerCase();
    const phone = String(body?.phone || "").trim();
    const country = String(body?.country || "").trim().toUpperCase();
    const timezone = String(body?.timezone || "").trim();

    if (!email) return NextResponse.json({ error: "Missing email." }, { status: 400 });
    if (!phone) return NextResponse.json({ error: "Missing phone." }, { status: 400 });
    if (!country) return NextResponse.json({ error: "Missing country." }, { status: 400 });
    if (!timezone) return NextResponse.json({ error: "Missing timezone." }, { status: 400 });

    // IMPORTANT: do NOT use policiesAccepted unless it exists in your Prisma schema
    const lead = await prisma.onboardingLead.upsert({
      where: { email },
      update: { phone, country, timezone },
      create: { email, phone, country, timezone },
    });

    const res = NextResponse.json({ ok: true, leadId: lead.id });

    // This is what creates nexus_lead cookie
    res.cookies.set("nexus_lead", lead.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return res;
  } catch (e) {
    console.error("LEAD API ERROR:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}