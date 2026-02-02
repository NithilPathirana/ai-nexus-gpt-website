import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function last4(nic: string) {
  const cleaned = nic.replace(/\s+/g, "");
  if (cleaned.length < 4) throw new Error("NIC too short");
  return cleaned.slice(-4);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { fullName, nicNumber, consent } = await req.json();
  if (!consent) return NextResponse.json({ error: "Consent required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const nicLast4 = last4(String(nicNumber || ""));
  await prisma.kycRecord.upsert({
    where: { userId: user.id },
    update: { fullName: String(fullName || ""), nicLast4 },
    create: { userId: user.id, fullName: String(fullName || ""), nicLast4, verified: false },
  });

  return NextResponse.json({ ok: true });
}
