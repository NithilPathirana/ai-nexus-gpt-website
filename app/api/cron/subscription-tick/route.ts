import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { releaseSlotIfAny } from "@/lib/slots";

export async function GET() {
  const now = new Date();

  // Trial expired -> Grace + email
  const trials = await prisma.subscription.findMany({
    where: { status: "TRIAL_ACTIVE", trialEndsAt: { not: null, lt: now } },
    include: { user: true },
  });

  for (const sub of trials) {
    const graceEnds = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const updated = await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: "GRACE", paymentDemandedAt: now, graceEndsAt: graceEnds },
    });

    const link = (updated.payherePaymentLink || "").trim();

    await sendEmail(
      sub.user.email,
      "Your Nexus GPT trial ended – payment required",
      `
        <div style="font-family:Arial;line-height:1.6;padding:16px">
          <h2>Nexus GPT</h2>
          <p>Your <b>24-hour trial</b> has ended. To continue, complete payment.</p>
          <p><b>Payment link:</b> ${link ? `<a href="${link}">${link}</a>` : "Admin will send shortly. Reply to this email if you need it now."}</p>
          <p>Grace period: <b>24 hours</b>. After that, access will be paused.</p>
          <hr/>
          <p style="color:#667;font-size:13px">Support: AI.Nexus.store@gmail.com | 0766398548</p>
        </div>
      `
    );
  }

  // Grace expired -> Paused + release slot
  const graces = await prisma.subscription.findMany({
    where: { status: "GRACE", graceEndsAt: { not: null, lt: now } },
  });

  for (const sub of graces) {
    await prisma.subscription.update({ where: { id: sub.id }, data: { status: "PAUSED" } });
    await releaseSlotIfAny(sub.userId);
  }

  return NextResponse.json({ ok: true, trialsProcessed: trials.length, gracesProcessed: graces.length });
}
