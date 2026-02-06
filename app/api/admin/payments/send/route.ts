import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/guards";

export async function POST(req: Request) {
  await requireAdmin();

  const { userId, payherePaymentLink } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const now = new Date();
  const graceEnds = new Date(now.getTime() + 24*60*60*1000);

  const sub = await prisma.subscription.upsert({
    where: { userId },
    update: { status: "GRACE", paymentDemandedAt: now, graceEndsAt: graceEnds, payherePaymentLink: payherePaymentLink || undefined },
    create: { userId, status: "GRACE", paymentDemandedAt: now, graceEndsAt: graceEnds, payherePaymentLink: payherePaymentLink || null },
  });

  const link = (payherePaymentLink || sub.payherePaymentLink || "").trim();

  await sendEmail(
    user.email,
    "Continue Nexus GPT – payment link (Rs. 1,199/month)",
    `
      <div style="font-family:Arial;line-height:1.6;padding:16px">
        <h2>Nexus GPT</h2>
        <p>Your trial has ended. To continue, please complete payment.</p>
        <p><b>Payment link:</b> ${link ? `<a href="${link}">${link}</a>` : "Payment link not provided yet. Please reply to this email for support."}</p>
        <p>You have <b>24 hours</b> (grace period) before access is paused.</p>
        <hr/>
        <p style="color:#667;font-size:13px">Support: AI.Nexus.store@gmail.com | 0766398548</p>
      </div>
    `
  );

  return NextResponse.json({ ok: true, subscription: sub });
}
