import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Backwards compatible alias for /api/onboarding/lead
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body?.email || "").trim().toLowerCase();
  const phone = String(body?.phone || "").trim();
  const country = String(body?.country || body?.countryIso2 || "").trim().toUpperCase();
  const timezone = String(body?.timezone || "").trim();

  if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });
  if (!phone) return NextResponse.json({ error: "WhatsApp number is required." }, { status: 400 });

  const lead = await prisma.onboardingLead.upsert({
    where: { email },
    update: { phone, country: country || null, timezone: timezone || null },
    create: { email, phone, country: country || null, timezone: timezone || null },
  });

  return NextResponse.json({ ok: true, leadId: lead.id });
}
