import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const admin = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!session?.user?.email || session.user.email.toLowerCase() !== admin) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const form = await req.formData();
  const id = String(form.get("id") || "");
  const slot = await prisma.slot.findUnique({ where: { id } });
  if (slot) {
    await prisma.slot.update({
      where: { id },
      data: { isActive: !slot.isActive },
    });
  }
  return NextResponse.redirect(new URL("/admin/slots", req.url));
}
