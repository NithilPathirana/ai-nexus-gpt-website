import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DateTime } from "luxon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const admin = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!session?.user?.email || session.user.email.toLowerCase() !== admin) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const form = await req.formData();
  const date = String(form.get("date") || "");
  const time = String(form.get("time") || "");
  const capacity = Number(form.get("capacity") || 1);

  const dt = DateTime.fromISO(`${date}T${time}`, {
    zone: "Asia/Colombo",
  }).toUTC();
  await prisma.slot.create({
    data: {
      startsAt: dt.toJSDate(),
      endsAt: dt.plus({ minutes: 15 }).toJSDate(), // or your intended duration
      isActive: true,
    },
  });

  return NextResponse.redirect(new URL("/admin/slots", req.url));
}
