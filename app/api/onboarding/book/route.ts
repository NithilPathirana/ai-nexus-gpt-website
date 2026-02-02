import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const runtime = "nodejs"; // required for Resend

function fmt(iso: Date | string) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const slotId = String(body?.slotId || "").trim();
    const leadIdFromBody = String(body?.leadId || "").trim(); // fallback only
    const timezone = String(body?.timezone || "").trim() || null;

    if (!slotId) {
      return NextResponse.json({ error: "Missing slotId." }, { status: 400 });
    }

    // cookies() is async in your Next version
    const cookieStore = await cookies();

    // Must accept terms
    const terms = cookieStore.get("nexus_terms")?.value;
    if (!terms) {
      return NextResponse.json(
        { error: "You must accept terms first." },
        { status: 401 }
      );
    }

    // Prefer cookie leadId (safer), fallback to body
    const leadIdCookie = cookieStore.get("nexus_lead")?.value;
    const leadId = leadIdCookie || leadIdFromBody;
    if (!leadId) {
      return NextResponse.json({ error: "Missing leadId." }, { status: 400 });
    }

    // ---- Create booking safely (transaction prevents double booking) ----
    const booking = await prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUnique({ where: { id: slotId } });
      if (!slot || !slot.isActive) {
        throw new Error("This slot is no longer available.");
      }

      const alreadyBooked = await tx.booking.findUnique({ where: { slotId } });
      if (alreadyBooked) {
        throw new Error("This slot was just booked by someone else.");
      }

      const created = await tx.booking.create({
        data: { slotId, leadId, timezone },
        include: {
          slot: { select: { startsAt: true, endsAt: true } },
          lead: { select: { email: true, phone: true, country: true, timezone: true } },
        },
      });

      // Simple: hide slot after booking
      await tx.slot.update({
        where: { id: slotId },
        data: { isActive: false },
      });

      return created;
    });

    // ---- Send email (user + admin) ----
    let emailSent = false;
    let emailError: string | null = null;

    try {
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      const EMAIL_FROM = process.env.EMAIL_FROM;
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

      if (!RESEND_API_KEY || !EMAIL_FROM || !ADMIN_EMAIL) {
        throw new Error(
          "Missing env vars: RESEND_API_KEY, EMAIL_FROM, ADMIN_EMAIL"
        );
      }

      const resend = new Resend(RESEND_API_KEY);

      const userEmail = booking.lead.email;
      const adminEmail = ADMIN_EMAIL;

      const starts = fmt(booking.slot.startsAt);
      const ends = fmt(booking.slot.endsAt);

      const subject = `✅ Onboarding call booked: ${starts}`;

      const html = `
        <div style="font-family:Arial,sans-serif;line-height:1.5">
          <h2 style="margin:0 0 10px 0;">You're booked ✅</h2>
          <p style="margin:0 0 12px 0;">Your onboarding call has been booked successfully.</p>

          <div style="padding:12px;border:1px solid #e5e7eb;border-radius:10px;background:#f9fafb;">
            <p style="margin:0;"><b>Start:</b> ${starts}</p>
            <p style="margin:6px 0 0 0;"><b>End:</b> ${ends}</p>
            <p style="margin:6px 0 0 0;"><b>Timezone (device):</b> ${booking.timezone || "N/A"}</p>
            <p style="margin:6px 0 0 0;"><b>WhatsApp:</b> ${booking.lead.phone}</p>
            <p style="margin:6px 0 0 0;"><b>Booking ID:</b> ${booking.id}</p>
          </div>

          <p style="margin:14px 0 0 0;">
            We'll message you on WhatsApp with the Zoom link.
          </p>
        </div>
      `;

      // Optional: while testing, override to only send to your own email
      const testTo = process.env.EMAIL_TEST_TO?.trim();
      const recipients = testTo ? [testTo] : [userEmail, adminEmail];

      await resend.emails.send({
        from: EMAIL_FROM,
        to: recipients,
        subject,
        html,
      });

      emailSent = true;
    } catch (err: any) {
      emailError = err?.message || "Email failed";
      console.warn("EMAIL ERROR:", emailError);
      // IMPORTANT: do not throw. Booking already done.
    }

    const res = NextResponse.json({
      ok: true,
      emailSent,
      emailError,
      booking: {
        id: booking.id,
        startsAt: booking.slot.startsAt,
        endsAt: booking.slot.endsAt,
        email: booking.lead.email,
        phone: booking.lead.phone,
      },
    });

    // Save booking id for confirmation screen
    res.cookies.set("nexus_booking", booking.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return res;
  } catch (e: any) {
    console.error("BOOK API ERROR:", e);
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

