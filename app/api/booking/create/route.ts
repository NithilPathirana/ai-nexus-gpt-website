import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSettings } from "@/lib/availability";
import { sendEmail } from "@/lib/mail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, time } = await req.json(); // date: YYYY-MM-DD, time: HH:mm

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const pol = await prisma.policyAcceptance.findUnique({
    where: { userId: user.id },
  });
  if (!pol)
    return NextResponse.json(
      { error: "Policies not accepted" },
      { status: 428 },
    );

  const kyc = await prisma.kycRecord.findUnique({ where: { userId: user.id } });
  if (!kyc)
    return NextResponse.json({ error: "KYC not submitted" }, { status: 428 });

  // User must have selected a pool first
  const userWithPool = await prisma.user.findUnique({
    where: { id: user.id },
    select: { selectedPoolId: true },
  });

  if (!userWithPool?.selectedPoolId) {
    return NextResponse.json(
      { error: "Select an account pool first" },
      { status: 428 },
    );
  }

  // Pick an available slot from that pool
  const slot = await prisma.poolSlot.findFirst({
    where: { poolId: userWithPool.selectedPoolId, isAvailable: true },
    orderBy: { createdAt: "asc" },
    include: { pool: true },
  });

  if (!slot) {
    return NextResponse.json(
      { error: "No available slots in this pool" },
      { status: 409 },
    );
  }

  const settings = await getAdminSettings();
  const zoom =
    settings.zoomRecurringLink ||
    process.env.ZOOM_RECURRING_LINK ||
    "https://us05web.zoom.us/j/84080899947?pwd=L2aAYxznDlmuZbpwbaITGCn4O1w2To.1";

  // Store booking time as Sri Lanka time offset (+05:30). DB stores UTC.
  const dt = new Date(`${date}T${time}:00.000+05:30`);

  const booking = await prisma.booking.create({
    data: { userId: user.id, date: dt, durationM: settings.bookingDurationM },
  });

  await sendEmail(
    user.email,
    "Your Nexus GPT onboarding call (Zoom link inside)",
    `
      <div style="font-family:Arial;line-height:1.6;padding:16px">
        <h2>Nexus GPT – Onboarding Call</h2>
        <p>Your Zoom call is booked.</p>
        <p><b>Date & time:</b> ${date} at ${time} (Sri Lanka Time)</p>
        <p><b>Zoom link:</b> <a href="${zoom}">${zoom}</a></p>
        <p><b>Your selected pool:</b> ${slot.pool.name}</p>
        <hr/>
        <p style="color:#667;font-size:13px">
          Trial starts <b>after the call</b> is marked completed by admin. Support: AI.Nexus.store@gmail.com | 0766398548
        </p>
      </div>
    `,
  );

  return NextResponse.json({ ok: true, booking });
}
